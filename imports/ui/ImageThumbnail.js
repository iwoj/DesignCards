import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Images } from '../api/images.js';

export default class ImageThumbnail extends Component {
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
	
	render() {
      return(
        <li className="imageThumbnail">
          <a data-fancybox="gallery" href={Images.findOne({_id:this.props.image._id}).link()}>
            <img
              src={Images.findOne({_id:this.props.image._id}).link()}
            />
          </a>
        </li>
      )
  }
}

