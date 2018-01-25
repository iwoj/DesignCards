import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import TimeAgo from 'react-timeago';
import { Images } from '../api/images.js';
import ShareJSText from './ShareJSText.js';

export default class ImageCaptions extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

	formatDateString(value, unit, suffix) {
	  if (unit == 'second' && value < 60) {
	    return "just now";
	  } else {
	    return value + " " + this.pluralize(unit, value) + " " + suffix;
	  }
	}

  handleFieldChange(e, fieldName) {
    $(e.currentTarget).trigger("imageFieldChange", {
      imageID: this.props.image._id,
      fieldName: fieldName,
      value: e.currentTarget.value
    });
  }

	pluralize(str, num) {
	  return num == 1 ? str : str + "s";
	}

	render() {
	  let modifications = this.props.image.meta.modifiedTimestamp && this.props.image.meta.modifiedBy ? <div><b>Last modified </b> <TimeAgo date={this.props.image.meta.modifiedTimestamp} formatter={(value, unit, suffix) => this.formatDateString(value, unit, suffix)}/> by {this.props.image.meta.modifiedBy}</div> : "";

		return(
			<div id={"imageCaptions-"+this.props.image._id} className="imageCaptions">
				<ShareJSText docid={this.props.image.meta.descriptionID} placeholder="Enter a description."/><br/>
			  $ <input type="text" placeholder="Low cost" onChange={(e) => this.handleFieldChange(e, "lowCost")} defaultValue={this.props.image.meta.lowCost}/>&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;$ <input type="text" placeholder="High cost" onChange={(e) => this.handleFieldChange(e, "highCost")} defaultValue={this.props.image.meta.highCost}/><br/>
				{modifications}
			</div>
		)
  }
}

