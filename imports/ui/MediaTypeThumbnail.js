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
	
  componentDidMount() {
    $(document).on("mediaTypeRemoveAllRequest", (e, data) => {
      this.setState({
        selected: false
      });
    });
    $(document).on("mediaTypeRemoveRequest", (e, data) => {
      if (data.mediaID == this.props.image._id) {
        this.setState({
          selected: false
        });
      }
    });
    $(document).on("mediaTypeSelection", (e, data) => {
      if (data.mediaIDs.indexOf(this.props.image._id) != -1) {
        this.setState({
          selected: data.selected
        });
      }
    });
  }

  toggle(e) {
    $(e.currentTarget).trigger("mediaTypeSelection", {
      selected: !this.state.selected,
      mediaIDs: [this.props.image._id]
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

