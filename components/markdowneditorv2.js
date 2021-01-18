import React, {Component} from 'react';
//import MDEditor from "rich-markdown-editor";
import { useState } from 'react'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import("./editorwrapper"), { ssr: false });
const EditorWithForwardedRef = React.forwardRef((props, ref) => (
  <Editor {...props} forwardedRef={ref} />
));


/**
 * EditorV2, a toast-ui based Markdown WYSIWYG Editor 
 * 
 * This classhas an onChange callback passed in as a property, that is 
 * called every time the text is changed. This editor does zero debounce,
 * so that should be done in the parent container.
 * 
 * Usage:
 * import EditorV2 from './markdowneditorv2'
 * 
 * constructor = () => {
 *   this.myRef = React.createRef();
 * }
 * 
 * onEditorChange = (text) => {
 *   //We handle text changes here
 * }
 * render = () => {
 *   <EditorV2 ref={this.myRef} onChange={this.onEditorChange}/>
 * }
 */

export default class EditorV2 extends Component {
    constructor(props) {
        super(props);
        this.editorRef = React.createRef();
        this.editorText = null;
        this.componentLoadCheckTimer = null;
        this.componentLoadCheckTimerCount = 0;
    }
    
    onEditorLoaded = () => {
        if (this.editorRef.current && this.editorText){
            this.editorRef.current.editorInst.setMarkdown(this.editorText);
            this.editorText = null;
        }
    }

    onEditorChange = () => {
        if (!this.editorRef.current) {
            return;
        }
        this.props.onChange(this.editorRef.current.editorInst.getMarkdown());
    }

    setValue = (value) => {
        if (this.editorRef.current){
            this.editorRef.current.editorInst.setMarkdown(value);
        }
        else {
            this.editorText = value
        }
    }

    checkForComponentLoad = () => {
        this.componentLoadCheckTimerCount++;
        if (this.componentLoadCheckTimerCount > 5) {
            //It's been more than 2.5 seconds, don't keep trying.
            clearInterval(this.componentLoadCheckTimer);
        }
        if (this.editorRef.current && this.editorText){
            this.editorRef.current.editorInst.setMarkdown(this.editorText);
            this.editorText = null;
            clearInterval(this.componentLoadCheckTimer);
        }
    }

    componentDidMount = async () => {
        if (this.editorRef.current && this.editorText){
            this.editorRef.current.editorInst.setMarkdown(this.editorText);
            this.editorText = null;
        }
        else{
            this.componentLoadCheckTimer = setInterval(function() { this.checkForComponentLoad(); }.bind(this),500); //Check every 30 seconds
        }
    }
    
    componentWillUnmount = () => {
        if (this.componentLoadCheckTimer) {
            clearInterval(this.componentLoadCheckTimer);
        }
    }

    render = () => {
        return (
            <EditorWithForwardedRef usageStatistics={false} ref={this.editorRef} onLoad={this.onEditorLoaded} onChange={this.onEditorChange} />
        );
    }
}
