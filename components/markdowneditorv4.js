import React, {Component} from 'react';
//import MDEditor from "rich-markdown-editor";
import { useState }     from 'react'
import dynamic from 'next/dynamic'
import { create } from 'apisauce'
import { AuthToken } from '../services/auth_token'
import BlogApi from '../modules/blog/lib/api'

//const Editor = dynamic(() => import("./editorwrapper"), { ssr: false });
//const EditorWithForwardedRef = React.forwardRef((props, ref) => (
//  <Editor {...props} forwardedRef={ref} />
//));
const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
  });
  import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

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

export default class EditorV4 extends Component {
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
//            this.editorRef.current.editorInst.setMarkdown(value);
            this.editorRef.current.setContents(value);
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
            //this.editorRef.current.editorInst.setMarkdown(this.editorText);
            this.editorRef.current.setContents(this.editorText);
            this.editorText = null;
            clearInterval(this.componentLoadCheckTimer);
        }
    }

    componentDidMount = async () => {
        if (this.editorRef.current && this.editorText){
            //this.editorRef.current.editorInst.setMarkdown(this.editorText);
            this.editorRef.current.setContents(this.editorText);
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
    getSunEditorInstance = (sunEditor) => {
        this.editorRef.current = sunEditor

    }
    UploadToServer = (filename) => {

    }
    imageUploadHandler = (xmlHttpRequest, info,core ) => {
        console.log("imageUploadHandler");
        console.log(xmlHttpRequest, info,core )
    }
    handleImageUploadBefore = (files, info, uploadHandler) => {
           // Upload image to Server
           var token = AuthToken.fromNext();
                    //var headers = { Accept: 'application/vnd.github.v3+json'};
            var headers = {
                'Content-Type': 'multipart/form-data'
            }
            if (token) {
                headers.Authorization = token.authorizationString();
            }
            const api = create({
                baseURL: process.env.REACT_APP_MSAPI_ENDPOINT,
                headers: headers,
                });

           //const src = UploadToServer(files[0]);
           console.log("handleImageUploadBefore");
           console.log(files[0]);
           var form = new FormData();
            form.append(files[0].name, files[0], files[0].name);
            //form.append('image[image]', {
            //    name: 'omgitsme.jpg',
            //    blob: blob,
            //    type: 'image/jpg'
            //  })
            api.post('/api/cdn/suneditor/upload',form).then((response) => {
                console.log(response);
                const response2 = {
                    // The response must have a "result" array.
                    "result": [
                        {
                            "url": response.data.thumbnail,
                            "link": response.data.path,
                            "name": "name",
                            "size": 0
                        },
                ]}
                var contextAnchor = { 
                    linkValue: response.data.path, 
                    urlInput: {
                        value: response.data.path
                    },
                    anchorText: {
                        value: ""
                    },
                    downloadCheck: {
                        checked: false
                    },
                    newWindowCheck: {
                        checked: true
                    },
                    currentRel: [],
                    preview: {
                        "textContent":""
                    }
                }
/*                {
                    modal: forms,
                    urlInput: null,
                    linkDefaultRel: this.options.linkRelDefault,
                    defaultRel: this.options.linkRelDefault.default || '',
                    currentRel: [],
                    linkAnchor: null,
                    linkValue: '',
                    _change: false,
                    callerName: pluginName
                };*/
                console.log(info);
                const anchor = this.editorRef.current.core.plugins.anchor.createAnchor.call(this.editorRef.current.core, contextAnchor, true);
                info.anchor = anchor;
                this.editorRef.current.core.plugins.image.register.call(this.editorRef.current.core,info,response2);
                uploadHandler();
                //uploadHandler(files);
                //uploadHandler(response2);
    
            });

            return undefined;
       
    }
    render = () => {
        //disable={this.props.disable}
                    {/*<SunEditor readonly setOptions={{
                mode: "inline",
                defaultStyle: "className:'sun-editor-editable';",
                buttonList: []
            }}
            getSunEditorInstance={this.getSunEditorInstance} disable={false} setContents={this.props.content} onChange={this.props.onChange}/>
        */}

        return (
        <SunEditor setOptions={{
            plugins: [
                "blockquote",
                "align",
                "font",
                "fontColor",
                "fontSize",
                "formatBlock",
                "hiliteColor",
                "horizontalRule",
                "lineHeight",
                "list",
                "paragraphStyle",
                "table",
                "template",
                "textStyle",
                "image",
                "link",
                "video",
                "audio",
                "math",
                "imageGallery"
            ],
            buttonList: 
                [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link', 'image', 'video'], // You must add the 'katex' library at options to use the 'math' plugin.
                    ['imageGallery'], // You must add the "imageGalleryUrl".
                    ['fullScreen', 'showBlocks', 'codeView'],
                    ['preview', 'print'],
                    // ['save', 'template'],
                    // '/', Line break
                  ]
        }} getSunEditorInstance={this.getSunEditorInstance} onChange={this.props.onChange} setContents={this.props.content}
        onImageUploadBefore={this.handleImageUploadBefore} imageUploadHandler={this.imageUploadHandler} />
        );
    }
}
