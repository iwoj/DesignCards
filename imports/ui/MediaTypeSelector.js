import React, { Component } from 'react';
import { Images } from '../api/images.js';
import MediaType from './MediaType.js';
import PropTypes from 'prop-types';

export default class MediaTypeSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    }
  }

  componentDidMount() {
	$(this.refs.mediaTypeSelector).on("mediaTypeClicked", (e, data) => this.triggerMediaSelection(data.mediaID));
  }

  triggerMediaSelection(mediaTypeID) {
    $(this.refs.mediaTypeSelector).trigger("mediaSelection", {
      mediaID: mediaTypeID
    });
  }
	
  renderMediaTypes() {
    mediaTypes = _.values(this.context.mediaTypes);
    return mediaTypes.map((mediaType) => {
      return (
        <MediaType
          key={mediaType._id}
          mediaTypeID={mediaType._id}
          src={mediaType.link}
        />
      );
    });
  }

  toggleList(e) {
    $(this.refs.mediaTypes).toggle();
  }
	
	render() {
    return(
      <div 
        className="mediaTypeSelector"
        ref="mediaTypeSelector"
      >
        <div 
          className="label"
          onMouseUp={(e) => this.toggleList(e)}
        >
          <div className="plus">+</div>
          Add Media Type
        </div>
        <div 
          ref="mediaTypes"
          className="mediaTypes">
          {this.renderMediaTypes()}
        </div>
      </div>
    )
  }
}

MediaTypeSelector.contextTypes = {
  mediaTypes: PropTypes.object
}

