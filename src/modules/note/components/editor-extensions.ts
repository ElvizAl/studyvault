import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "tiptap-markdown";

// Load lowlight languages
import { all, createLowlight } from "lowlight";
const lowlight = createLowlight(all);

export const editorExtensions = [
	StarterKit.configure({
		codeBlock: false, // We use the lowlight code block instead
	}),
	CodeBlockLowlight.configure({
		lowlight,
	}),
	Markdown,
];
