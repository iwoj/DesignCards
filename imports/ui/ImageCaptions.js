import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import TimeAgo from 'react-timeago';
import { Images } from '../api/images.js';
import MediaType from './MediaType.js';
import MediaTypeSelector from './MediaTypeSelector.js';
import ShareJSText from './ShareJSText.js';
import ReactBootstrapSlider from 'react-bootstrap-slider';

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
    if (!e.currentTarget) {
      $(this.refs.imageCaptions).trigger("imageFieldChange", {
        imageID: this.props.image._id,
        fieldName: fieldName,
        value: e.target.value
      });
    } else if (e.currentTarget.type == "checkbox") {
      $(e.currentTarget).trigger("imageFieldChange", {
        imageID: this.props.image._id,
        fieldName: fieldName,
        value: e.currentTarget.checked
      });
    }
    else {
      $(e.currentTarget).trigger("imageFieldChange", {
        imageID: this.props.image._id,
        fieldName: fieldName,
        value: e.currentTarget.value
      });
    }
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
	  let modifications = this.props.image.meta.modifiedTimestamp && this.props.image.meta.modifiedBy ? <div className="modificationTimestamp"><TimeAgo date={this.props.image.meta.modifiedTimestamp} formatter={(value, unit, suffix) => this.formatDateString(value, unit, suffix)}/> by {this.props.image.meta.modifiedBy}</div> : "";

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
			  <div>
          <textarea defaultValue={this.props.image.meta.description} onChange={(e) => this.handleFieldChange(e, "description")} placeholder="Enter a description."></textarea>
        </div>
        <div>
			    $ <input type="text" placeholder="Low cost" onChange={(e) => this.handleFieldChange(e, "lowCost")} defaultValue={this.props.image.meta.lowCost}/>&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;$ <input type="text" placeholder="High cost" onChange={(e) => this.handleFieldChange(e, "highCost")} defaultValue={this.props.image.meta.highCost}/>
			  </div>
        <div className="controlRow">
          <div className="label">
            Attraction Power
          </div>
          <div className="control">
            <ReactBootstrapSlider
              value={this.props.image.meta.attractionPower ? this.props.image.meta.attractionPower : 0.5}
              step={0.01} 
              max={1}
              min={0}
              orientation="horizontal"
              change={(e) => this.handleFieldChange(e, "attractionPower")}
            />
          </div>
        </div>
        <div className="controlRow">
          <div className="label">
            Hold Power
          </div>
          <div className="control">
            <ReactBootstrapSlider
              value={this.props.image.meta.holdPower? this.props.image.meta.holdPower : 0.5}
              step={0.01} 
              max={1}
              min={0}
              orientation="horizontal"
              change={(e) => this.handleFieldChange(e, "holdPower")}
            />
          </div>
        </div>
        <div className="controlRow">
          <div className="label">
            Carrying Power
          </div>
          <div className="control">
            <ReactBootstrapSlider
              value={this.props.image.meta.carryingPower? this.props.image.meta.carryingPower : 0.5}
              step={0.01} 
              max={1}
              min={0}
              orientation="horizontal"
              change={(e) => this.handleFieldChange(e, "carryingPower")}
            />
          </div>
        </div>
        <div className="controlRow">
          <div className="label">
            Design Complexity
          </div>
          <div className="control">
            <ReactBootstrapSlider
              value={this.props.image.meta.designComplexity? this.props.image.meta.designComplexity : 0.5}
              step={0.01} 
              max={1}
              min={0}
              orientation="horizontal"
              change={(e) => this.handleFieldChange(e, "designComplexity")}
            />
          </div>
        </div>
        <div className="controlRow">
          <div className="label">
            Fabrication Complexity
          </div>
          <div className="control">
            <ReactBootstrapSlider
              value={this.props.image.meta.fabricationComplexity? this.props.image.meta.fabricationComplexity : 0.5}
              step={0.01} 
              max={1}
              min={0}
              orientation="horizontal"
              change={(e) => this.handleFieldChange(e, "fabricationComplexity")}
            />
          </div>
        </div>
        <div className="controlRow">
          <div className="label">
            Throughput
          </div>
          <div className="control">
            <ReactBootstrapSlider
              value={this.props.image.meta.throughput? this.props.image.meta.throughput : 0.5}
              step={0.01} 
              max={1}
              min={0}
              orientation="horizontal"
              change={(e) => this.handleFieldChange(e, "throughput")}
            />
          </div>
        </div>
        <div className="controlRow">
          <div className="label">
            Operational Ease-of-Use
          </div>
          <div className="control">
            <ReactBootstrapSlider
              value={this.props.image.meta.operationalEaseOfUse ? this.props.image.meta.operationalEaseOfUse : 0.5}
              step={0.01} 
              max={1}
              min={0}
              orientation="horizontal"
              change={(e) => this.handleFieldChange(e, "operationalEaseOfUse")}
            />
          </div>
        </div>
        <div className="controlRow">
          <div className="label">
            <label htmlFor="apaWork">APA Work</label>
          </div>
          <div className="control">
			      <input type="checkbox" onChange={(e) => this.handleFieldChange(e, "apaWork")} defaultChecked={this.props.image.meta.apaWork ? "checked" : ""} id="apaWork"/>
          </div>
			  </div>
        <div className="controlRow">
          <div className="label">
            <label htmlFor="copyrightCleared">Copyright Cleared</label>
          </div>
          <div className="control">
			      <input type="checkbox" onChange={(e) => this.handleFieldChange(e, "copyrightCleared")} defaultChecked={this.props.image.meta.copyrightCleared ? "checked" : ""} id="copyrightCleared"/>
          </div>
			  </div>
			  {modifications != "" &&
        <div className="controlRow">
          <div className="label">
            <label>Modified</label>
          </div>
          <div className="control">
				    {modifications}
          </div>
			  </div>
			  }
			</div>
		)
  }
}

