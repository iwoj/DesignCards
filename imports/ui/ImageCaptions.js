import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import TimeAgo from 'react-timeago';
import { Images } from '../api/images.js';
import MediaType from './MediaType.js';
import MediaTypeSelector from './MediaTypeSelector.js';
import ShareJSText from './ShareJSText.js';

export default class ImageCaptions extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
		$(this.refs.imageCaptions).on("mediaSelection", (e, data) => this.addMediaType(data.mediaID));
	  $(this.refs.imageCaptions).on("mediaTypeRemoveRequest", (e, data) => this.removeMediaType(data.mediaID));
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

	removeMediaType(mediaID) {
	  if (this.props.image.meta.mediaTypes) {
	    Images.update({_id: this.props.image._id}, {$pull: {"meta.mediaTypes":mediaID}});
	  }
		Meteor.call("images.touch", this.props.image._id);
	}

	addMediaType(mediaID) {
	  if (this.props.image.meta.mediaTypes && this.props.image.meta.mediaTypes.indexOf(mediaID) == -1) {
	    Images.update({_id: this.props.image._id}, {$push: {"meta.mediaTypes":mediaID}});
	  } else {
	    Images.update({_id: this.props.image._id}, {$set: {"meta.mediaTypes": [mediaID]}});
	  }
		Meteor.call("images.touch", this.props.image._id);
		$(".mediaTypeSelector .mediaTypes").css("display","none");
	}

  renderMediaTypes() {
    let mediaTypes = this.props.image.meta.mediaTypes;
    if (!mediaTypes) return "";
    return mediaTypes.map((mediaTypeID) => {
      let mediaType = Images.findOne({_id:mediaTypeID});
      if (mediaType)
      return (
        <MediaType
          key={mediaType._id}
          mediaTypeID={mediaType._id}
          src={mediaType.link()}
          showCloseButton={true}
        />
      );
      else
      return (
        <div>{mediaTypeID}</div>
      );
    });
  }

	render() {
	  let modifications = this.props.image.meta.modifiedTimestamp && this.props.image.meta.modifiedBy ? <div><b>Last modified </b> <TimeAgo date={this.props.image.meta.modifiedTimestamp} formatter={(value, unit, suffix) => this.formatDateString(value, unit, suffix)}/> by {this.props.image.meta.modifiedBy}</div> : "";

		// <ShareJSText docid={this.props.image.meta.descriptionID} placeholder="Enter a description."/><br/>
		return(
			<div 
			  ref="imageCaptions"
			  id={"imageCaptions-"+this.props.image._id} 
			  className="imageCaptions">
			  <div className="mediaTypeCaptions">
			    <MediaTypeSelector 
			      mediaTypes={this.props.mediaTypes}
			    />
			    {this.renderMediaTypes()}
			  </div>
        <textarea defaultValue={this.props.image.meta.description} onChange={(e) => this.handleFieldChange(e, "description")} placeholder="Enter a description."></textarea><br/>
			  $ <input type="text" placeholder="Low cost" onChange={(e) => this.handleFieldChange(e, "lowCost")} defaultValue={this.props.image.meta.lowCost}/>&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;$ <input type="text" placeholder="High cost" onChange={(e) => this.handleFieldChange(e, "highCost")} defaultValue={this.props.image.meta.highCost}/><br/>
				{modifications}
			</div>
		)
  }
}

