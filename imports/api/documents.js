import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Documents = new Mongo.Collection('documents');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('documents.all', function documentsPublication() {
    return Documents.find({});
  });
}


