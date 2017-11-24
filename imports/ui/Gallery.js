import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';

import { Images } from '../api/images.js';
import ImageThumbnail from './ImageThumbnail.js';


class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: [],
      progress: 0,
      inProgress: false
    };
  }

	_handleUpload(files) { //this function is called whenever a file was dropped in your dropzone
			let self = this;
      _.each(files, function(file) {
          file.owner = Meteor.userId(); //before upload also save the owner of that file
        	let uploadInstance = Images.insert({
          	file: file,
          	meta: {
            	locator: self.props.fileLocator,
            	userId: Meteor.userId() // Optional, used to check on server for file tampering
          	},
          	streams: 'dynamic',
          	chunkSize: 'dynamic',
          	allowWebWorkers: true // If you see issues with uploads, change this to false
        	}, false);

          self.setState({
            uploading: uploadInstance, // Keep track of this instance to use below
            inProgress: true // Show the progress bar now
          });

          // These are the event functions, don't need most of them, it shows where we are in the process
          uploadInstance.on('start', function () {
            console.log('Starting');
          });

          uploadInstance.on('end', function (error, fileObj) {
            console.log('On end File Object: ', fileObj);
          });

          uploadInstance.on('uploaded', function (error, fileObj) {
            console.log('uploaded: ', fileObj);

            // Remove the filename from the upload box
            // self.refs['fileinput'].value = '';

            // Reset our state for the next file
            self.setState({
              uploading: [],
              progress: 0,
              inProgress: false
            });

            let userId = Meteor.userId();
            console.log(fileObj);
            let imagesURL = {
              "profile.image": fileObj._id
            };
            Meteor.users.update(userId, {$set: imagesURL});
          });

          uploadInstance.on('error', function (error, fileObj) {
            console.log('Error during upload: ' + error);
          });

          uploadInstance.on('progress', function (progress, fileObj) {
            console.log('Upload Percentage: ' + progress);
            // Update our progress bar
            self.setState({
              progress: progress
            })
          });

          uploadInstance.start(); // Must manually start the upload
      });
  }

  renderImageThumbnails() {
    let filteredImages = this.props.images;
    return filteredImages.map((image) => {
      return (
        <ImageThumbnail
          key={image._id}
          image={image}
        />
      );
    });
  }

  render() {
      return(
        <div className="gallery">
          <ul>
            {this.renderImageThumbnails()}
          </ul>

          <div>
            <Dropzone onDrop={this._handleUpload}>
              <div>Drop files to upload.</div>
            </Dropzone>
          </div>
        </div>
      )
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
})(Gallery);

