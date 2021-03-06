import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Images } from '../api/images.js';
import ImageCaptions from './ImageCaptions.js';

export default class ImageThumbnail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCaptions: false
    };
  }
	
	componentDidMount() {
	  let self = this;

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

    $(this.refs.imageThumbnail).on("closeAllCaptions", (e) => {
      self.setState({showCaptions:false});
    });
    
    $(this.refs.imageThumbnail).on("openTheseCaptions", (e, data) => {
      if (data.id == self.props.image._id) {
        self.setState({showCaptions:true});
      }
    });
	}



	componentWillUnmount() {
    $(this.refs.imageThumbnail).off("closeAllCaptions");
    $(this.refs.imageThumbnail).off("openTheseCaptions");
	}

	mouseOver(e) {
		$(e.currentTarget).trigger("imageThumbnailFocused", {_id:e.currentTarget.dataset.id});
	}
	
	mouseOut(e) {
		$(e.currentTarget).trigger("imageThumbnailLostFocus", {_id:e.currentTarget.dataset.id});
	}

	showCaption(e) {
		this.setState({showCaptions: true});
	}

	render() {
    return(
      <div
        ref="imageThumbnail"
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
            title={this.props.alt}
          />
        </a>
        {this.state.showCaptions &&
        <ImageCaptions
          key={this.props.image._id}
          image={this.props.image}
        />
        }
      </div>
    )
  }
}

