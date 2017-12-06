import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.js';
import Gallery from './Gallery.js';
import { Images } from '../api/images.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <header>
          <table className="headerTable">
            <tbody>
              <tr>
                <td className="accountsCell">
                  <h1>Exhibit Design Cards</h1>
                
                  <AccountsUIWrapper />
                </td>
                <td className="filters">
                  <img src="/types/ar-app.png"/>
                  <img src="/types/diorama.png"/>
                  <img src="/types/eye-tracking.png"/>
                </td>
              </tr>
            </tbody>
          </table>
        </header>

        <Gallery imageSet="photos" className="photoGallery"/>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('files.images.all');
  
  let hasProfile = false;
  if (Meteor.user() && Meteor.user().profile) hasProfile = true;
  let profileImage = hasProfile && Images && Images.findOne && Images.findOne({_id:Meteor.user().profile.image}) ? Images.findOne({_id:Meteor.user().profile.image}).link() : null;

  return {
    currentUser: Meteor.user(),
    images: Images.find({}).fetch()
  };
})(App);
