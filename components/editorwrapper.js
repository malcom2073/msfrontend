import React from "react";
import { Editor, EditorProps } from "@toast-ui/react-editor";

/**
 * Wrapper class for toast-ui react=editor.
 * This is required for forwardRef's to work correctly, since toast-ui isn't SSR compatible.
 */

export default (props) => (
  <Editor {...props} ref={props.forwardedRef} />
);