import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';

import { Images } from '../api/images.js';
import '../api/users.js';

class ImageThumbnail extends Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
  }
	
	componentDidMount() {
	  var addImageOrientationClass = function(img) {
    	if(img.naturalHeight > img.naturalWidth) {
      	img.classList.add("portrait");
    	}
  	}

  	// Add "portrait" class to thumbnail images that are portrait orientation
  	var images = document.querySelectorAll(".imageThumbnail img");
  	for(var i=0; i<images.length; i++) {
    	if(images[i].complete) {
      	addImageOrientationClass(images[i]);
    	} else {
      	images[i].addEventListener("load", function(evt) {
        	addImageOrientationClass(evt.target);
      	});
    	}
  	}
	}

	mouseOver(e) {
	  this.props.gallery.setFocusedImage(e.currentTarget.dataset.id);
	}
	
	mouseOut(e) {
	  this.props.gallery.setFocusedImage(null);
	}
	
	render() {
	  let captions = [];
	  this.props.image.meta.createdAt ? captions.push("<b>Created on</b> " + this.props.image.meta.createdAt.toString()) : false;
	  this.props.image.meta.addedBy ? captions.push("<b>Added by</b> " + this.props.image.meta.addedBy) : false;
	  let caption = captions.join("<br/>");

    return(
      <li className="imageThumbnail" data-id={this.props.image._id} onMouseOver={(e) => this.mouseOver(e)} onMouseOut={(e) => this.mouseOut(e)}>
        <a data-fancybox="gallery" data-caption={caption} href={Images.findOne({_id:this.props.image._id}).link()}>
          <img
            src={Images.findOne({_id:this.props.image._id}).link()}
          />
        </a>
      </li>
    )
  }
}

export default withTracker(() => {
  let subscription = Meteor.subscribe("allusers");
  return {
    subscription: subscription.ready(),
    users: Meteor.users,
  };
})(ImageThumbnail);


