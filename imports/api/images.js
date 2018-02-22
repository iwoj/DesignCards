import { FilesCollection } from 'meteor/ostrio:files';
import { Documents } from './documents.js';

export const Images = new FilesCollection({
  storagePath: Meteor.settings.public.storagePath,
  collectionName: 'Images',
  allowClientCode: true, // Allow/disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Files must be PNG or JPG and less than 10MB.';
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
  	'images.touch'(id) {
    	Images.update({_id:id},{$set: {
				"meta.modifiedTimestamp":new Date(),
				"meta.modifiedBy": Meteor.user().username
			}});
		},
  	'images.update'(selector, query) {
    	Images.update(selector,query,{multi: true}, function(err) {
    		if (!err) Images.update(selector,{$set: {
					"meta.modifiedTimestamp":new Date(),
					"meta.modifiedBy": Meteor.user().username
				}},{multi: true});
    	});
		},
  	'image.update'(id, query) {
    	Images.update({_id:id},query,{},function(err) {
    		if (!err) Images.update({_id:id},{$set: {
					"meta.modifiedTimestamp":new Date(),
					"meta.modifiedBy": Meteor.user().username
				}});
    	});
		},
		'images.giveCreationDate'() {
			Images.find({}).forEach((image, i) => {
				Meteor.setTimeout(() => {
					Images.update({_id:image._id},{$set:{"meta.createdTimestamp":new Date()}});
				}, i*100);
			});
		},
		'images.initShareJSDocuments'() {
			Documents.remove({});
			Images.find({}).forEach((image, i) => {
				let docID = Documents.insert({
          title:"Image Description",
          imageID: image._id
        });
				Images.update({_id:image._id},{$set:{"meta.descriptionID":docID}});
			});
		},
		'images.replaceMediaType'(oldMediaTypeID, newMediaTypeID) {
		  Images.find({"meta.mediaTypes": oldMediaTypeID}).forEach((image) => {
		    Images.update({_id:image._id},{$pull:{"meta.mediaTypes":oldMediaTypeID}});
		    Images.update({_id:image._id},{$push:{"meta.mediaTypes":newMediaTypeID}});
		  });
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
