import React from "react";
import { Editor, EditorProps } from "@toast-ui/react-editor";

//export interface TuiEditorWithForwardedProps extends EditorProps {
//  forwardedRef
//}

export default (props) => (
  <Editor {...props} ref={props.forwardedRef} />
);