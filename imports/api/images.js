import { FilesCollection } from 'meteor/ostrio:files';

export const Images = new FilesCollection({
  storagePath: Meteor.settings.public.storagePath,
  collectionName: 'Images',
  allowClientCode: true, // Allow/disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
	Meteor.methods({
  	'images.update'(id, query) {
    	Images.update({_id:id},query);
    	Images.update({_id:id},{$set: {
				"meta.modifiedTimestamp":new Date(),
				"meta.modifiedBy": Meteor.user().username
			}});
		}
  });
}

Images.collection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },
  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },
  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
  fetch: ['owner']
});
