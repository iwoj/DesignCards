var createThumb = function(fileObj, readStream, writeStream) {
  gm(readStream, fileObj.name()).resize('256', '256').stream().pipe(writeStream);
};

var createMedium = function(fileObj, readStream, writeStream) {
  gm(readStream, fileObj.name()).resize('800', '800').stream().pipe(writeStream);
};

export const Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("thumbs", { transformWrite: createThumb }),
    new FS.Store.GridFS("medium", { transformWrite: createMedium })
  ]
});

Images.allow({
    'insert': function() {
        // add custom authentication code here
        return true;
    },
    'update': function() {
        // add custom authentication code here
        return true;
    },
    'remove': function() {
        // add custom authentication code here
        return true;
    },
    download: function(userId, fileObj) {
        return true
    }
});
