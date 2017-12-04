import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Images } from '../api/images.js';
import { Documents } from '../api/documents.js';

export default class ShareJSText extends Component {

    constructor(props){
		super(props);
    this.state = {
            doc: null,
            editor: null
        }
    }

    componentDidMount(){
        // // Get Ace Editor from DOM
        // this.state.editor = ace.edit("editor");

        // // Set Ace Editor behaviour
        // this.setTheme('ace/theme/chrome');
        // this.state.editor.getSession().setMode("ace/mode/python");
        // this.state.editor.setFontSize(14);
        // this.state.editor.setShowPrintMargin(false);
        // this.state.editor.getSession().setUseWrapMode(true);
        // this.state.editor.$blockScrolling = Infinity;
        // this.state.editor.resize();

				this.onChange();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.docid !== this.props.docid;
    }

    componentDidUpdate(){
        this.onChange();
    }

    componentWillUnmount(){

        // Disconnect from ShareJS
        this.disconnect();

        // Clean up Ace memory to avoid memory leaks
        // this.state.editor.destroy();

    }

    // ------- ShareJS

    onChange(){

        // Doesn't have a document opened but wants to connect
        if(!this.isConnected() && this.props.docid){
            this.connect(this.props.docid);
        }

        // Has a document opened but wants to open a new document
        if(this.isConnected() && this.props.docid){
            this.disconnect();
            this.connect(this.props.docid);
        }

        // Has a document opened but wants to close it
        if(this.isConnected() && !this.props.docid){
            this.disconnect();
        }

    }

		handleTyping(e) {
			var image = Images.findOne({"meta.descriptionID":this.props.docid});
	  	Meteor.call("images.touch", image._id);
		}

    connect(documentId){
        let self = this;

        if(this.isConnected()){
            throw new Error('Already connected to ShareJS');
        }

        // Open the document
        sharejs.open(documentId, 'text', function(error, doc){
            if(error) {
                console.error("Connection error:", error);
            }else{
                // Update state
                self.setState({ doc: doc });

                // Check we are connected
                if(self.isConnected()){
										// Attach ace editor to document
                    // doc.attach_ace(self.state.editor);
										doc.attach_textarea(document.getElementById("editor-"+self.props.docid));
                    console.log('Opened document [',documentId,']');
                }else{
                    console.error("Document was opened but closed right away");
                }
            }
        });
    }

    disconnect(){
        if(this.isConnected()){
            let name = this.state.doc.name;
            this.state.doc.close();
            if(this.state.doc.state === 'closed'){
                console.log('Closed document [',name,']');
            }else{
                console.error('Failed to close document [',name,']');
            }
            // this.state.doc.detach_ace();
        }
    }

    isConnected(){
        return this.state.doc != null && this.state.doc.state === 'open';
    }

    // ------- End of ShareJS


    // ------- Editor State

    // setTheme(theme){
    //     this.state.editor.setTheme(theme);
    // },
    // getAceInstance(){
    //     return this.state.editor;
    // },
    // getText(){
    //     return this.state.editor ? this.state.editor.getValue() : null;
    // },

    // ------- End of Editor State

    render() {
        return (
            <textarea id={"editor-"+this.props.docid} ref={"editor-"+this.props.docid} data-doc={this.props.docid} onChange={(e) => this.handleTyping(e)} className="shareJSText" placeholder={this.props.placeholder}></textarea>
        )
    }
}

