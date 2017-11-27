import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config.js';
import Gallery from '../imports/ui/Gallery.js';

Dropzone = require("react-dropzone");

Meteor.startup(() => {
  render(<Gallery />, document.getElementById('render-target'));
});
