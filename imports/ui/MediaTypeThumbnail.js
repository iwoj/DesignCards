import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ImageThumbnail from './ImageThumbnail.js';
import { Images } from '../api/images.js';

export default class MediaTypeThumbnail extends ImageThumbnail {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    }
  }
	
  toggle(e) {
    this.setState({selected:!this.state.selected});
    $(e.currentTarget).trigger("mediaTypeSelection", {
      selected: !this.state.selected,
      mediaID: this.props.image._id
    });
  }

  updateName(e) {
    Meteor.call("image.update", this.props.image._id, {$set:{"meta.title": $(e.currentTarget).val()}});
  }
	
	render() {
    let selected = this.state.selected ? "selected" : "";
	  classNames = `imageThumbnail mediaTypeThumbnail ${selected}`;
    
    let nameField = "";
    if (false && Meteor.user().username == "iwoj")
      nameField = <input type="text" onChange={(e) => this.updateName(e)} defaultValue={this.props.image.meta.title}/>;

    return(
      <div
        className={classNames}
        id={"imageThumbnail-"+this.props.image._id}
        data-id={this.props.image._id}
        onMouseOver={(e) => this.mouseOver(e)}
        onMouseOut={(e) => this.mouseOut(e)}
        onMouseUp={(e) => this.toggle(e)}
      >
        <a>
          <img
            src={Images.findOne({_id:this.props.image._id}).link()}
          />
        </a>
        {nameField}
      </div>
    )
  }
}

