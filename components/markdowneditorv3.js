//import MDEditor from "rich-markdown-editor";
import dynamic from 'next/dynamic'
import { create } from 'apisauce'
import { AuthToken } from '../services/auth_token'

// Import React dependencies.
import React, { Component, useEffect, useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, Node, Text } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
//const Editor = dynamic(() => import("./editorwrapper"), { ssr: false });
//const EditorWithForwardedRef = React.forwardRef((props, ref) => (
//  <Editor {...props} forwardedRef={ref} />
//));
import Prism from 'prismjs'
import { css } from '@emotion/css'
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
// eslint-disable-next-line
;Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore

export default class EditorV3 extends Component {
    constructor(props) {
        super(props);
        //this.editorRef = React.createRef();
        //this.editorText = null;
        this.editor = withReact(createEditor())
        //[this.value, this.setValue] = useState([])
        //this.state={value: 'This is editable plain text!'};
        this.state={value:[{ children: [
            { text: 'This is editable plain text, some **bold** textjust like a <textarea>!' },
          ]}]};
    }
    decorate = ([node, path]) => {
        const ranges = []
    
        if (!Text.isText(node)) {
          return ranges
        }
    
        const getLength = token => {
          if (typeof token === 'string') {
            return token.length
          } else if (typeof token.content === 'string') {
            return token.content.length
          } else {
            return token.content.reduce((l, t) => l + getLength(t), 0)
          }
        }
    
        const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
        let start = 0
    
        for (const token of tokens) {
          const length = getLength(token)
          const end = start + length
    
          if (typeof token !== 'string') {
            ranges.push({
              [token.type]: true,
              anchor: { path, offset: start },
              focus: { path, offset: end },
            })
          }
    
          start = end
        }
    
        return ranges
      }

      Leaf = ({ attributes, children, leaf }) => {
        return (
          <span
            {...attributes}
            className={css`
              font-weight: ${leaf.bold && 'bold'};
              font-style: ${leaf.italic && 'italic'};
              text-decoration: ${leaf.underlined && 'underline'};
              ${leaf.title &&
                css`
                  display: inline-block;
                  font-weight: bold;
                  font-size: 20px;
                  margin: 20px 0 10px 0;
                `}
              ${leaf.list &&
                css`
                  padding-left: 10px;
                  font-size: 20px;
                  line-height: 10px;
                `}
              ${leaf.hr &&
                css`
                  display: block;
                  text-align: center;
                  border-bottom: 2px solid #ddd;
                `}
              ${leaf.blockquote &&
                css`
                  display: inline-block;
                  border-left: 2px solid #ddd;
                  padding-left: 10px;
                  color: #aaa;
                  font-style: italic;
                `}
              ${leaf.code &&
                css`
                  font-family: monospace;
                  background-color: #eee;
                  padding: 3px;
                `}
            `}
          >
            {children}
          </span>
        )
      }

      
    onChange = (value) => {
//        console.log("value:");
//        console.log(val);
//        if (value.length > 0) {
        this.setState({value});
//        }
//        this.setState({value});
      }
    
    render = () => {
      // Add the editable component inside the context.
      return (
      <Slate
        editor={this.editor}
        value={this.state.value}
        onChange={this.onChange.bind(this)}
      >
        <Editable 
         decorate={this.decorate}
         renderLeaf={this.Leaf}
        />
      </Slate>
      )
    }

}
