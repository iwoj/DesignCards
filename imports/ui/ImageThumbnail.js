import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Images } from '../api/images.js';

export default class ImageThumbnail extends Component {
  render() {
      return(
        <li className="imageThumbnail">
          <a data-fancybox="gallery" href={Images.findOne({_id:this.props.image._id}).link()}>
            <img
              src={Images.findOne({_id:this.props.image._id}).link()}
            />
          </a>
        </li>
      )
  }
}

