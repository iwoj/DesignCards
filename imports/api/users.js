import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('allusers', function () {
    return Meteor.users.find({},{fields:{_id: 1, username:1}});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('allusers');
}


