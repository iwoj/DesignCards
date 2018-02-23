import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.js';
import Gallery from './Gallery.js';
import MediaTypeGallery from './MediaTypeGallery.js';
import PhotosButton from './PhotosButton.js';
import { Images } from '../api/images.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhotos: false,
      selectedMedia: []
    }
  }

  getChildContext() {
    return {
      mediaTypes: this.props.mediaTypes
    };
  }

  componentDidMount() {
  	$(this.refs.app).on("showPhotos", this.showPhotos);
  	$(this.refs.app).on("photosAvailable", (e, data) => {
  	  this.setState({numSelectedPhotos:data.numberOfPhotos});
  	});
  	$(this.refs.app).on("mediaTypeSelection", (e, data) => {
  	  let newState = this.state.selectedMedia;
  	  if (data.selected) {
  	    newState = _.union(newState,[data.mediaID]);
  	  } else {
  	    newState = _.difference(this.state.selectedMedia, [data.mediaID]);
  	  }
  	  this.setState({
  	    selectedMedia: newState
  	  });
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
    return (
      <div className="app" ref="app">
        <header>
          <table className="headerTable">
            <tbody>
              <tr>
                <td className="accountsCell">
                  {this.state.showPhotos &&
                  <a className="closeGalleryButton" onMouseUp={this.hidePhotos}><i className="fa fa-caret-left"></i></a>
                  }
                  {!this.state.showPhotos && 
                  <div>
                    <h1>Exhibit Design Cards</h1>
                    <AccountsUIWrapper />
                  </div>
                  }
                </td>
                <td className="controlsCell">
                  {Meteor.user() && !this.state.showPhotos &&
                  <PhotosButton photos={this.state.numSelectedPhotos}/>
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </header>

        <Gallery 
          imageSet="photos" 
          selectedMedia={this.state.selectedMedia}
          className="photoGallery"/>
        <MediaTypeGallery 
          imageSet="mediaTypes" 
          className="mediaTypeGallery"/>
        )}
      </div>
    );
  }
}

App.childContextTypes = {
  mediaTypes: PropTypes.object
}

export default withTracker((props) => {
  let hasProfile = false;
  if (Meteor.user() && Meteor.user().profile) hasProfile = true;

  let mediaTypes = Images.find({"meta.imageSet":"mediaTypes"}).fetch();
  let indexedMediaTypes = {};
  // Build object with links field
  mediaTypes.forEach(function(mediaType) {
    let temp = Images.findOne({_id: mediaType._id});
    mediaType.link = temp.link();
    indexedMediaTypes[mediaType._id] = mediaType;
  });

  return {
    currentUser: Meteor.user(),
    mediaTypes: indexedMediaTypes
  };
})(App);
