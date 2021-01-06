import React, {Component} from 'react';
//import MDEditor from "rich-markdown-editor";
import { useState } from 'react'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import("./editorwrapper"), { ssr: false });
const EditorWithForwardedRef = React.forwardRef((props, ref) => (
  <Editor {...props} forwardedRef={ref} />
));


export default class EditorV2 extends Component {
    constructor(...args) {
        super(...args);
        this.editorRef = React.createRef();
        this.state = {value:""}
    }
    
    onEditorChange = () => {
        if (!this.editorRef.current)
        {
            return;
        }
        const text = this.editorRef.current.editorInst.getMarkdown();
        console.log("MDEditor default")
        console.log(text);
        this.props.onChange(text);
    }

    setValue = (value) => {
        this.setState({value:value});
        console.log("SETVALUE***********************");
        console.log(this.editorRef);
        console.log(this.editorRef.current);
        this.editorRef.current.editorInst.setMarkdown(value);
    }
    render = () => {
        const options = {
            mode: 'hypermd',
            // mode: 'gfm',
            theme: 'hypermd-light',

            hmdFold: {
            image: true,
            link: true,
            math: true,
            },
            hmdHideToken: true,
            hmdCursorDebounce: true,
            hmdPaste: true,
            hmdClick: true,
            hmdHover: true,
            hmdTableAlign: true,
        };

        const defaultText = "# Heading\n\nSome **bold** and _italic_ text\nBy [Jed Watson](https://github.com/JedWatson)\n";

        //return <ReactCodeMirror value={defaultText} ref={this.codeMirrorRef} className="code-mirror_editor" options={options} />;

        return (
            <EditorWithForwardedRef usageStatistics={false} ref={this.editorRef} onChange={this.onEditorChange} />
        );
    }
}
