import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import { Images } from '../api/images.js';
import { Documents } from '../api/documents.js';
import ImageThumbnail from './ImageThumbnail.js';

class Gallery extends Component {

	static defaultProps = { 
		showDropzone: true, 
		reportImages: true,
		selectedMedia: [],
		showLoader: false
	};

	randomSeed = new Date().getTime();

	constructor(props) {
    super(props);

    this.state = {
      uploading: [],
      progress: 0,
      inProgress: false,
      focusedImage: null
    };
  }

  

  componentWillUnmount() {
    // Destroy fancybox
    $(document).unbind('click.fb-start');
  }
  
  

  componentDidUpdate() {
    $("[data-fancybox]").fancybox({
      keyboard: false,
      infobar : false,
      buttons : [
        'download',
        'close'
      ],
      beforeShow: (instance, slide) => {
        $(".imageThumbnail").trigger("closeAllCaptions");
      },
      afterShow: (instance, slide) => {
        $(".imageThumbnail").trigger("openTheseCaptions", {
          id: $(slide.opts.$orig).data("id")
        });
      },
      baseTpl	:
      '<div class="fancybox-container" role="dialog">' +
          '<div class="fancybox-bg"></div>' +
          '<div class="fancybox-inner">' +
              '<div class="fancybox-infobar">' +
                  '<span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span>' +
              '</div>' +
              '<div class="fancybox-toolbar">{{buttons}}</div>' +
              '<div class="fancybox-navigation">{{arrows}}</div>' +
              '<div class="fancybox-stage"></div>' +
              '<div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div>' +
          '</div>' +
      '</div>',
    }); 
  }

  

  componentDidMount() {
  	const element = this.refs.gallery;
    
  	$(this.refs.gallery).on("imageFieldChange", this.fieldChange);
    
    $(document).on("keydown", (e) => this.keyPressed(e));
    $(document).on("keyup", (e) => this.keyUp(e));
    
		// If fancybox closes
		$(document).on("DOMNodeRemoved", function(e) {
    	if (e.target.className == "fancybox-container fancybox-is-closing") {
				$(".imageCaptions").css("display","none");
			}
		});
	
		$(element).on("imageThumbnailFocused", (e,data) => this.setFocusedImage(e, data));
		
		$(element).on("imageThumbnailLostFocus", (e, data) => this.setFocusedImage(e, data));
  }
  
  
  
  fieldChange = (e, data) => {
    let payload = {};
    payload["meta."+data.fieldName] = e.target.value;
		Images.update({_id:data.imageID}, {$set:payload});
		Meteor.call("images.touch", data.imageID);
  }
  
  
  
	_handleUpload(files, imageSet, gallery) { //this function is called whenever a file was dropped in your dropzone
			let self = this;
      _.each(files, function(file) {
          file.owner = Meteor.userId(); //before upload also save the owner of that file
					let fileNameInvalid = file.name.indexOf(",") >= 0;
					
					if (fileNameInvalid) {
						alert("Filenames cannot have commas.");
						// Throw error.
						return;
					}
				
          let mediaTypes = self.props.selectedMedia ? self.props.selectedMedia : [];

					let uploadInstance = Images.insert({
          	file: file,
          	meta: {
            	locator: self.props.fileLocator,
            	createdTimestamp: new Date(),
            	modifiedTimestamp: new Date(),
            	addedBy: Meteor.user().username,
            	modifiedBy: Meteor.user().username,
							title: "",
							description: "",
							imageSet: imageSet,
            	mediaTypes: mediaTypes,
            	priceRange: [0,0],
            	attractionPower: 0.5,
            	holdPower: 0.5,
              contentRichness: 0.5,
              buildTimeRangeDays: [0,0],
              simulataneousUserCapacity: 0,
              usersPerHour: 0,
              requiresAVHardwareDesign: false,
              requiresLightControl: false,
              spaceRequirementsSqFtRange: [0,0],
              easeOfMaintenece: 0.5,
              eastOfVisitorUse: 0.5,
							url: ""
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

  
  
  setFocusedImage(event, data) {
    this.state.focusedImage = Images.findOne({_id:data._id});
  }
  
  
  
  keyPressed(e) {
    if ($(this.refs.gallery).css("display") == "none") return;

		if (e.shiftKey) {
		  this.setState({shiftKey : true});
		}

		if (e.metaKey) {
	    // Delete by mousing over and pressing command-backspace
      if (e.key == "Backspace" && this.state.focusedImage && Roles.userIsInRole(Meteor.user(), ["admin"])) {
        let deleteImage = confirm("Are you sure you want to delete this image?");
        if (deleteImage) Images.remove({_id:this.state.focusedImage._id});
      }
    }
  }
	
  keyUp(e) {
		if (!e.shiftKey) {
		  this.setState({shiftKey : false});
	  }
  }
  
  shuffle(myArray, seed) {
    var newArray = myArray.slice();
    var i = newArray.length, j, tempi, tempj;
    if ( i == 0 ) return false;
    while ( --i ) {
  	  var randNum = seed ? this.seededRandom(seed) : Math.random();
      j = Math.floor( Math.random() * ( i + 1 ) );
      tempi = newArray[i];
      tempj = newArray[j];
      newArray[i] = tempj;
      newArray[j] = tempi;
    }
    return newArray;
  }

  seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  
  renderImageThumbnails(images) {
    if (!images) return;
    let filteredImages = images;
    return filteredImages.map((image) => {
      return (
        <ImageThumbnail
          key={image._id}
          image={image}
          handleImageFocus={this}
          alt={Roles.userIsInRole(Meteor.user(), ["admin"]) ? "Command-Backspace to Delete" : ""}
        />
      );
    });
  }
	
	render() {
    if (this.props.reportImages) {
      $(this.refs.gallery).trigger("photosAvailable", {
        numberOfPhotos: this.props.images.length,
        imageSet: this.props.imageSet
      });
    }
 	  
 	  let images = this.props.images;
 	  if (this.props.sortOrder == "random") {
 		  images = this.shuffle(this.props.images, this.randomSeed);
 	  }

    return(
      <div className={"gallery " + this.props.className} ref="gallery">
      	{Meteor.user() && (this.props.showDropzone || (this.state.shiftKey && Roles.userIsInRole(Meteor.user(), ["admin"]))) &&
          <div className="imageThumbnail">
            <Dropzone onDrop={(files) => this._handleUpload(files, this.props.imageSet, this)} className="dropzoneCell" activeClassName="hover" activeStyle={{display:"inline-block"}} style={{display:"inline-block"}}>
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
          </div>
          }
          {this.props.renderImageThumbnails ? this.props.renderImageThumbnails.bind(this)(images) : this.renderImageThumbnails(images)}
      </div>
    )
  }
}

export default withTracker((props) => {
  Meteor.subscribe("currentuser");
  Meteor.subscribe("allusers");
  
  var query = {$and: [{},{}]};
  if (props.imageSet) query["$and"][0]["meta.imageSet"] = props.imageSet;
  if (props.selectedMedia && props.selectedMedia.length) {
    query["$and"][1]["meta.mediaTypes"] = {};
    query["$and"][1]["meta.mediaTypes"]["$all"] = props.selectedMedia;
  }

 	let images = Images.find(query,{sort:{"meta.createdTimestamp": -1}}).fetch();
  
  return {
    currentUser: Meteor.user(),
    images: images
  };
})(Gallery);



