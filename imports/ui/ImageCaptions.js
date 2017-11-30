import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Images } from '../api/images.js';

export default class ImageCaptions extends Component {
  constructor(props) {
    super(props);
  }
	

	textChange(e) {
	  Meteor.call("images.update", this.props.image._id,{$set:{"meta.description":e.target.value}});
	}
	
	render() {
	  let modifications = this.props.image.meta.modifiedTimestamp && this.props.image.meta.modifiedBy ? <div><b>Last modified </b> {this.props.image.meta.modifiedTimestamp.toString()} by {this.props.image.meta.modifiedBy}</div> : "";

    return(
      <div id={"imageCaptions-"+this.props.image._id} className="imageCaptions">
        <textarea onChange={(e) => this.textChange(e)} value={Images.findOne({_id:this.props.image._id}).meta.description}></textarea><br/>
        {modifications}
      </div>
    )
  }
}

