import React, { Component } from 'react';
import Gallery from './Gallery.js';
import MediaTypeThumbnail from './MediaTypeThumbnail.js';

export default class MediaTypeGallery extends Component {
  renderImageThumbnails(images) {
    if (!images) return;
    let filteredImages = images;
    return filteredImages.map((image) => {
      if (image.meta.imageSet != this.props.imageSet) return;
      return (
        <MediaTypeThumbnail
          key={image._id}
          image={image}
          handleImageFocus={this}
        />
      );
    });
  }
  
  render() {
		if (!Meteor.user()) return null;

    return(
      <Gallery 
        imageSet={this.props.imageSet} 
        className={this.props.className} 
        showDropzone={false} 
        reportImages={true}
        showLoader={this.props.showLoader}
        renderImageThumbnails={this.renderImageThumbnails}/>
    )
  }
}


