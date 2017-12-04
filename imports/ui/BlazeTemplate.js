import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import PropTypes from 'prop-types';

export default class BlazeTemplate extends Component {
    static propTypes = {
      template: PropTypes.string.isRequired
    }

    constructor(props) {
			super(props);
		}
		
		componentDidMount() {
        var componentRoot = ReactDOM.findDOMNode(this);
        var parentNode = componentRoot.parentNode;
        // Render the Blaze template on this node
        this.view = Blaze.renderWithData(Template[this.props.template], this.props.data, parentNode, componentRoot);
        parentNode.removeChild(componentRoot);
    }

		componentWillUnmount() {
        // Clean up Blaze view
        Blaze.remove(this.view);
    }

    render(template) {
        return (<div />)
    }
}
