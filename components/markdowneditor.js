import React, {Component} from 'react';
import MDEditor from "rich-markdown-editor";

export default class Editor extends Component {
  constructor(...args) {
    super(...args);
    this.codeMirrorRef = React.createRef();
  }
  onEditorChange = (value) => {
    const text = value();
    console.log("MDEditor default")
    console.log(text);
  }
  render() {
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
<MDEditor
 onChange={this.props.onEditorChange}
 defaultValue="Hello world!"
 />
);
  }
}
