import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.js';
import Gallery from './Gallery.js';
import MediaType from './MediaType.js';
import MediaTypeGallery from './MediaTypeGallery.js';
import PhotosButton from './PhotosButton.js';
import { Images } from '../api/images.js';
import { AppInfo } from '../api/appinfo.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhotos: false,
      selectedMedia: [],
      percentConnectedMediaTypes: 0,
      mediaTypesLoaded: false
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
  	  if (data.imageSet == "mediaTypes") this.setState({mediaTypesLoaded:true});
  	  if (data.imageSet == "photos") this.setState({numSelectedPhotos:data.numberOfPhotos});
  	});
  	
  	$(this.refs.app).on("mediaTypeSelectionRequest", (e, data) => {
  	  $(this.refs.app).trigger("mediaTypeSelection", {
  	    selected: data.selected,
  	    mediaIDs: data.mediaIDs,
  	    callback: () => {
  	      // Limit selection to two cards.
  	      if (this.state.selectedMedia.length > 2 && data.selected) {
  	        $(this.refs.app).trigger("mediaTypeSelection", {
  	          selected: false,
  	          mediaIDs: [this.state.selectedMedia[1]]
  	        });
  	      }
  	    }
  	  });
  	});
  	
  	$(this.refs.app).on("mediaTypeSelection", (e, data) => {
  	  let newState = this.state.selectedMedia;
  	  if (data.selected) {
  	    newState = _.union(newState,data.mediaIDs);
  	  } else {
  	    newState = _.difference(this.state.selectedMedia, data.mediaIDs);
  	  }
  	  this.setState({
  	    selectedMedia: newState
  	  }, function() {
  	    if (data.callback) data.callback();
  	  });
  	});
  	
  	$(this.refs.app).on("mediaTypeRemoveRequest", (e, data) => {
  	  let newState = _.difference(this.state.selectedMedia, [data.mediaID]);
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

  hidePhotos = (e, callback) => {
		this.setState({
		  showPhotos:false,
		  selectedMedia: []
		}, callback);
    $(document).trigger("mediaTypeRemoveAllRequest");
		$(".photoGallery").css("display", "none");
		$(".mediaTypeGallery").css("display", "inline-block");
		$(document).scrollTop(0);
  }
  
  selectRandomPairOfMediaTypes() {
    var self = this;
    this.hidePhotos(null, function() {
      var mediaTypes = Images.find({"meta.imageSet": "mediaTypes"}).fetch();
      var r1 = self.randomInRange(0, mediaTypes.length-1);
      var r2;
      
      do {
        r2 = self.randomInRange(0, mediaTypes.length-1);
      } while (r2 == r1)
      
      $(self.refs.app).trigger("mediaTypeSelection", {
        selected: true,
        mediaIDs: [
          mediaTypes[r1]._id,
          mediaTypes[r2]._id
        ]
      });
    });
  }

  randomInRange(min, max) {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
  }

  renderMediaTypes() {
    return this.state.selectedMedia.map((mediaTypeID) => {
      let mediaType = Images.findOne({_id:mediaTypeID});
      return (
        <MediaType
          key={mediaType._id}
          mediaTypeID={mediaType._id}
          src={mediaType.link()}
          showCloseButton={!this.state.showPhotos}
        />
      );
    });
  }


  render() {
    return (
      <div className={"app " + (this.state.numSelectedPhotos > 0 ? "photosAvailable" : "photosNotAvailable")} ref="app">
        <header className={this.state.showPhotos ? "referenceImages" : ""}>
          <table className="headerTable">
            <tbody>
              <tr>
                <td className="accountsCell">
                  {this.state.showPhotos &&
                  <div>
                    <a className="closeGalleryButton" onMouseUp={this.hidePhotos}><i className="fa fa-caret-left"></i></a>
                    {this.state.selectedMedia.length > 0 &&
                      this.renderMediaTypes()
                    }
                  </div>
                  }
                  {!this.state.showPhotos && 
                  <div>
                    <h1>
                      Experience<br/>
                      Design<br/>
                      Cards
                    </h1>
                  </div>
                  }
                </td>
                <td className="controlsCell">
                  {Meteor.user() && !this.state.showPhotos && this.state.selectedMedia.length > 0 &&
                    this.renderMediaTypes()
                  }
                  {Meteor.user() && this.state.showPhotos &&
                  <div>
                    <h1>Reference<br/>Images</h1>
                  </div>
                  }
                  {Meteor.user() && !this.state.showPhotos && (this.state.selectedMedia.length > 0 || Roles.userIsInRole(Meteor.user(), ["admin"])) &&
                  <PhotosButton 
                    className={"photosButton " + (this.state.numSelectedPhotos > 0 ? "primaryButton" : "secondaryButton")}
                    photos={this.state.numSelectedPhotos}/>
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </header>

        {Meteor.user() &&
        <Gallery 
          imageSet="photos" 
          selectedMedia={this.state.selectedMedia}
          className="photoGallery"/>
        }

        {Meteor.user() &&
        <MediaTypeGallery 
          imageSet="mediaTypes" 
          className="mediaTypeGallery"
          showLoader={true}/>
        }

        {!Meteor.user() &&
          <table className="loggedOut">
            <tr>
              <td>
                <AccountsUIWrapper />
              </td>
            </tr>
          </table>
        }
        
        <footer>
          {Meteor.user() &&
          <AccountsUIWrapper />
          }
          {Meteor.user() && !this.state.showPhotos &&
            <div className="stats">
              <span>{this.props.photos.length} Reference Images</span>
              <span>{(this.props.mediaTypeArray.length * this.props.mediaTypeArray.length - this.props.mediaTypeArray.length)/2} Card Combinations</span>
              {this.props.appInfo && this.props.appInfo.percentConnectedMediaTypes > 0 &&
              <span>{Math.floor(this.props.appInfo.percentConnectedMediaTypes*100) + "% Connected"}</span>
              }
            </div>
          }
          {Meteor.user() && !this.state.showPhotos &&
            <a className="randomizeLink" onMouseUp={(e) => this.selectRandomPairOfMediaTypes(e)}>Draw Two Cards</a>
          }
        </footer>
      </div>
    );
  }
}

App.childContextTypes = {
  mediaTypes: PropTypes.object
}

export default withTracker((props) => {
  Meteor.subscribe("currentuser");

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
    mediaTypes: indexedMediaTypes,
    mediaTypeArray: Images.find({"meta.imageSet":"mediaTypes"}).fetch(),
    photos: Images.find({"meta.imageSet":"photos"}).fetch(),
    appInfo: AppInfo.find({}).fetch()[0]
  };
})(App);
