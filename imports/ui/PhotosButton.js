import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class PhotosButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfSelectedPhotos: 0
    }
  }
	
  componentDidMount() {
    $(document).on("mediaTypeSelected", this.handleMediaTypeSelected.bind(this));
    $(document).on("mediaTypeDeselected", this.handleMediaTypeDeselected.bind(this));
  }

  handleMediaTypeSelected(e) {
    this.setState({"mediaTypes": this.state.mediaTypes.push(e.data.mediaType)});
  }
	
  handleMediaTypeDeselected(e) {
    this.setState({"mediaTypes": _.difference(this.state.mediaTypes, [e.data.mediaType])});
  }

  label() {
    return "See all " + this.props.photos + " photos";
  }

  handleClick(e) {
    $(e.currentTarget).trigger("showPhotos");
  }
	
	render() {
    let selected = this.state.selected ? "selected" : "";
	  classNames = `imageThumbnail mediaTypeThumbnail ${selected}`;

    return(
      <button className="primaryButton" onMouseUp={(e) => this.handleClick(e)}>
        {this.label()}
      </button>
    )
  }
}

