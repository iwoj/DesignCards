import { FilesCollection } from 'meteor/ostrio:files';

export const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
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
}


// var createThumb = function(fileObj, readStream, writeStream) {
//   gm(readStream, fileObj.name()).resize('256', '256').stream().pipe(writeStream);
// };

// var createMedium = function(fileObj, readStream, writeStream) {
//   gm(readStream, fileObj.name()).resize('800', '800').stream().pipe(writeStream);
// };

// export const Images = new FS.Collection("images", {
//   stores: [
//     new FS.Store.GridFS("thumbs", { transformWrite: createThumb }),
//     new FS.Store.GridFS("medium", { transformWrite: createMedium })
//   ]
// });

// Images.allow({
//     'insert': function() {
//         add custom authentication code here
//         return true;
//     },
//     'update': function() {
//         add custom authentication code here
//         return true;
//     },
//     'remove': function() {
//         add custom authentication code here
//         return true;
//     },
//     download: function(userId, fileObj) {
//         return true
//     }
// });
