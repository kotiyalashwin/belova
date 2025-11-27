"use client"

import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import React from "react";

interface CodeEditorProps {
	code: string;
	onChange?: (newCode: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
    const customTheme = EditorView.theme({
    "&": {
      backgroundColor: "#0a0a0a !important",
      color: "#e5e5e5",
    },
    ".cm-content": {
      caretColor: "#ffffff",
      padding: "16px",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
    ".cm-gutters": {
      backgroundColor: "#0a0a0a !important",
      border: "none",
    },
    ".cm-lineNumbers": {
      color: "#525252",
    },
    ".cm-line": {
      paddingLeft: "8px",
    },
  });
	return (
		<div className="h-full w-full bg-[#0a0a0a]">
			<CodeMirror
				value={code}
				height="100%"
				theme={[oneDark, customTheme]}
				width="100%"
				extensions={[javascript({ jsx: true, typescript: true })]}
				readOnly={true}
				basicSetup={{
					lineNumbers: true,
					highlightActiveLine: false,
					highlightActiveLineGutter: false,
				}}
				onChange={(value) => onChange?.(value)}
				className="h-full w-full"
			/>
		</div>
	);
};
