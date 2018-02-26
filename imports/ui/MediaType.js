import React, { Component } from 'react';
import { Images } from '../api/images.js';

export default class MediaType extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  
  triggerMediaClick(e) {
    $(e.currentTarget).trigger("mediaTypeClicked", {
      mediaID: this.props.mediaTypeID
    });
  }

  triggerClose(e) {
    $(e.currentTarget).trigger("mediaTypeRemoveRequest", {
      mediaID: this.props.mediaTypeID
    });
  }

  showCloseButton(e) {
    $(e.currentTarget).find(".closeButton").css("display","inline-block");
  }
	
  hideCloseButton(e) {
    $(e.currentTarget).find(".closeButton").css("display","none");
  }
	
	render() {
    return(
      <div
        ref="mediaType"
        className="mediaType imageThumbnail"
        onMouseOver={(e) => this.showCloseButton(e)}
        onMouseOut={(e) => this.hideCloseButton(e)}
      >
        <a
          onMouseUp={(e) => this.triggerMediaClick(e)}
        >
          <img
            src={this.props.src}
          />
        </a>
        {this.props.showCloseButton && 
          <a 
            className="closeButton"
            onMouseUp={(e) => this.triggerClose(e)}
          >
            <i className="fa fa-times"></i>
          </a>
        }
      </div>
    )
  }
}


