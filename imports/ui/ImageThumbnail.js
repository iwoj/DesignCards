import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Images } from '../api/images.js';
import ImageCaptions from './ImageCaptions.js';

export default class ImageThumbnail extends Component {
  constructor(props) {
    super(props);
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
    
    $("[data-fancybox]").fancybox({
        keyboard: false,
        infobar : false,
		    buttons : [
		      'slideShow',
		      'download',
		      'close'
		    ],
		    beforeShow: this.closeAllCaptions,
		    afterShow: this.openTheseCaptions,
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

  closeAllCaptions(instance, slide) { 
    if (instance.currIndex != instance.prevPos) {
	    $(".imageCaptions").css("display","none");
	  }
	}

	openTheseCaptions(instance, slide) {
		$("#imageCaptions-"+$(slide.opts.$orig).data("id")).css("display","inline-block");
	}

	mouseOver(e) {
	  this.props.gallery.setFocusedImage(e.currentTarget.dataset.id);
	}
	
	mouseOut(e) {
	  this.props.gallery.setFocusedImage(null);
	}

	showCaption(e) {
	  $("#"+"imageThumbnail-"+this.props.image._id+" .imageCaptions").css("display","inline-block");
	}

	render() {
    return(
      <li 
        className="imageThumbnail" 
        id={"imageThumbnail-"+this.props.image._id}
        data-id={this.props.image._id} 
        onMouseOver={(e) => this.mouseOver(e)} 
        onMouseOut={(e) => this.mouseOut(e)}
	      onMouseUp={(e) => this.showCaption(e)}
      >
        <a 
          data-fancybox="gallery" 
          data-id={this.props.image._id} 
          href={Images.findOne({_id:this.props.image._id}).link()}
        >
          <img
            src={Images.findOne({_id:this.props.image._id}).link()}
          />
        </a>
        <ImageCaptions
          key={this.props.image._id}
          image={this.props.image}
        />
      </li>
    )
  }
}

