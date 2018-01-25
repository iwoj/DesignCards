import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.js';
import Gallery from './Gallery.js';
import MediaTypeGallery from './MediaTypeGallery.js';
import PhotosButton from './PhotosButton.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhotos: false
    }
  }

  componentDidMount() {
  	$(this.refs.app).on("showPhotos", this.showPhotos);
  	$(this.refs.app).on("photosAvailable", (e, data) => {
  	  this.setState({numSelectedPhotos:data.numberOfPhotos});
  	});
  }

  showPhotos = (e) => {
		this.setState({showPhotos:true});
		$(".photoGallery").css("display", "inline-block");
		$(".mediaTypeGallery").css("display", "none");
		$(document).scrollTop(0);
  }

  hidePhotos = (e) => {
		this.setState({showPhotos:false});
		$(".photoGallery").css("display", "none");
		$(".mediaTypeGallery").css("display", "inline-block");
		$(document).scrollTop(0);
  }

  render() {
    let controlButton = this.state.showPhotos ? (
        <button className="button" onMouseUp={this.hidePhotos}>Close</button>
      ) : (
        <PhotosButton photos={this.state.numSelectedPhotos}/>
      );

    return (
      <div className="app" ref="app">
        <header>
          <table className="headerTable">
            <tbody>
              <tr>
                <td className="accountsCell">
                  <h1>Exhibit Design Cards</h1>
                
                  <AccountsUIWrapper />
                </td>
                <td className="controlsCell">
                  {Meteor.user() &&
                    controlButton
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </header>

        <Gallery imageSet="photos" className="photoGallery"/>
        <MediaTypeGallery imageSet="mediaTypes" className="mediaTypeGallery"/>
        )}
      </div>
    );
  }
}

export default withTracker((props) => {
  let hasProfile = false;
  if (Meteor.user() && Meteor.user().profile) hasProfile = true;
  let profileImage = hasProfile && Images && Images.findOne && Images.findOne({_id:Meteor.user().profile.image}) ? Images.findOne({_id:Meteor.user().profile.image}).link() : null;

  return {
    currentUser: Meteor.user(),
  };
})(App);
