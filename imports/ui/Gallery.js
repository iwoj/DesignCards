import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Images } from '../api/images.js';

export default class Gallery extends Component {
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

          // Images.insert(file, function(err, fileObj) {
          //     if (err) {
          //         console.log(err); //in case there is an error, log it to the console
          //     } else {
          //         //the image upload is done successfully.
          //         //you can use this callback to add the id of your file into another collection
          //         //for this you can use fileObj._id to get the id of the file
          //     }
          // });

      });
  }

  render() {
      return(
          <div>
            <Dropzone onDrop={this._handleUpload}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      )
  }
}

