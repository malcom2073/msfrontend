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
    constructor(...args) {
        super(...args);
        this.editorRef = React.createRef();
    }
    
    onEditorChange = () => {
        if (!this.editorRef.current) {
            return;
        }
        this.props.onChange(this.editorRef.current.editorInst.getMarkdown());
    }

    setValue = (value) => {
        this.editorRef.current.editorInst.setMarkdown(value);
    }

    render = () => {
        return (
            <EditorWithForwardedRef usageStatistics={false} ref={this.editorRef} onChange={this.onEditorChange} />
        );
    }
}
