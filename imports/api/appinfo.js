import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AppInfo = new Mongo.Collection('appinfo');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('appinfo', function () {
    return AppInfo.find({});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("appinfo");
}
