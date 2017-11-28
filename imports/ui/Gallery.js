import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';

import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Images } from '../api/images.js';
import ImageThumbnail from './ImageThumbnail.js';


class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: [],
      progress: 0,
      inProgress: false,
      focusedImage: null
    };
  }
  
  componentWillMount() {
    document.addEventListener("keydown", (e) => this.keyPressed(e), false);
  }
	
	_handleUpload(files) { //this function is called whenever a file was dropped in your dropzone
			let self = this;
      _.each(files, function(file) {
          file.owner = Meteor.userId(); //before upload also save the owner of that file
					let fileNameInvalid = file.name.indexOf(",") >= 0;
					
					if (fileNameInvalid) {
						// Throw error.
						return;
					}
        	
					let uploadInstance = Images.insert({
          	file: file,
          	meta: {
            	locator: self.props.fileLocator,
            	createdAt: new Date(),
            	addedBy: Meteor.user().username
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

            // Reset our state for the next file
            self.setState({
              uploading: [],
              progress: 0,
              inProgress: false
            });
          });

          uploadInstance.on('error', function (error, fileObj) {
            console.log('Error during upload: ' + error);
            alert(error);
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

  setFocusedImage(id) {
    this.state.focusedImage = Images.findOne({_id:id});
  }
  
  keyPressed(e) {
    if (e.key == "Backspace" && this.state.focusedImage) {
      let deleteImage = confirm("Are you sure you want to delete this image?");
      if (deleteImage) Images.remove({_id:this.state.focusedImage._id});
    }
  }

  renderImageThumbnails() {
    let filteredImages = this.props.images;
    return filteredImages.map((image) => {
      return (
        <ImageThumbnail
          key={image._id}
          image={image}
          gallery={this}
        />
      );
    });
  }

  render() {
    return(
      <div className="container">
        <header>
          <table className="headerTable">
            <tbody>
              <tr>
                <td className="accountsCell">
                  <h1>Exhibit Design Cards</h1>
                
                  <AccountsUIWrapper />
                </td>
                <td className="dropzoneCell">

                </td>
              </tr>
            </tbody>
          </table>
        </header>

        {Meteor.user() &&
        <div className="gallery">
          <ul>
            <li className="imageThumbnail dropzoneCell">
                  <Dropzone onDrop={this._handleUpload}>
                    <table className="dropzonePrompt">
                      <tbody>
                        <tr>
                          <td>
                            Drag new images here.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Dropzone>
                </li>
            {this.renderImageThumbnails()}
          </ul>
        </div>
        }
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
    profileImage: profileImage,
    images: Images.find({},{sort:{"meta.createdAt": -1}}).fetch()
  };
})(Gallery);

