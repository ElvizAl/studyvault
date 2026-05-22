import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "./editor-extensions";
import { useEffect } from "react";

interface EditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export function Editor({ content, onChange, placeholder }: EditorProps) {
	const editor = useEditor({
		extensions: editorExtensions,
		content,
		editorProps: {
			attributes: {
				class:
					"prose prose-zinc dark:prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:text-zinc-100 max-w-none focus:outline-none min-h-[450px]",
			},
		},
		onUpdate: ({ editor }) => {
			// Extract markdown using tiptap-markdown extension
			const markdown = editor.storage.markdown.getMarkdown();
			onChange(markdown);
		},
	});

	// Handle external content changes (e.g. loading a different note)
	useEffect(() => {
		if (editor && content !== editor.storage.markdown.getMarkdown()) {
			// preserve cursor position if possible or just replace content
			editor.commands.setContent(content, false);
		}
	}, [content, editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="w-full flex-1 relative">
			{/* Optional: we could add a floating toolbar here in the future */}
			<EditorContent editor={editor} className="w-full h-full" />
		</div>
	);
}
