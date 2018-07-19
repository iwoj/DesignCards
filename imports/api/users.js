import { Meteor } from 'meteor/meteor';


if (Meteor.isServer) {

  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('currentuser', function () {
    return Meteor.users.find({_id:Meteor.userId()});
  });
  
  Meteor.publish('allusers', function () {
    return Meteor.users.find({},{fields:{_id: 1, username: 1, profile: 1}});
  });
  
  // Clear all roles
  Meteor.users.update({}, {$set:{"roles":[]}});

  // Import roles
  let userEmails = _.keys(Meteor.settings.userRoles);
  _.each(userEmails, function (userEmail) {
    let user = Meteor.users.findOne({"services.google.email":userEmail});
    if (!user) return;
    Meteor.users.update({_id: user._id}, {$set:{"roles":Meteor.settings.userRoles[userEmail]}});
  });
}


// I don't think this ever executes.
if (Meteor.isClient) {
  Meteor.subscribe('currentuser');
  Meteor.subscribe('allusers');
}


