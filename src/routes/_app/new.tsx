import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { createNoteFn } from "@/modules/note/note.api";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_app/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const saveTimeout = useRef<NodeJS.Timeout | null>(null);

	// Attempt to save note when meaningful content is typed
	const handleSave = async (currentTitle: string, currentContent: string) => {
		const cleanTitle = currentTitle.trim();
		const cleanContent = currentContent.trim();

		// meaningful content: title is not empty or content is not empty
		if (cleanTitle !== "" || cleanContent !== "") {
			setIsSaving(true);
			try {
				const note = await createNoteFn({
					data: {
						title: cleanTitle || "Untitled Note",
						content: cleanContent,
					},
				});

				// Invalidate router so sidebar updates
				await router.invalidate();

				// Redirect to the real note ID
				navigate({
					to: "/$noteId",
					params: { noteId: note.id },
					replace: true, // Replace /new in history so back button works correctly
				});
			} catch (error) {
				console.error("Failed to create note", error);
			} finally {
				setIsSaving(false);
			}
		}
	};

	// Debounce typing to trigger first save
	const handleType = (newTitle: string, newContent: string) => {
		setTitle(newTitle);
		setContent(newContent);

		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current);
		}

		saveTimeout.current = setTimeout(() => {
			handleSave(newTitle, newContent);
		}, 1000); // Wait 1s after typing stops to auto-save
	};

	// Clean up timeouts on unmount
	useEffect(() => {
		return () => {
			if (saveTimeout.current) {
				clearTimeout(saveTimeout.current);
			}
		};
	}, []);

	return (
		<div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c1418]/60 backdrop-blur-sm">
			{/* Top Bar */}
			<header className="h-14 border-b border-white/5 px-6 flex items-center justify-between">
				<div className="flex items-center gap-2 text-white/40 text-sm font-medium">
					<FileText className="w-4 h-4" />
					<span>Draft</span>
				</div>
				<div className="flex items-center gap-3 text-xs text-white/40">
					{isSaving ? (
						<span className="flex items-center gap-1.5 font-medium text-[#60d7cf]">
							<span className="w-1.5 h-1.5 rounded-full bg-[#60d7cf] animate-pulse" />
							Saving draft...
						</span>
					) : (
						<span className="flex items-center gap-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-white/20" />
							Drafting (Not saved yet)
						</span>
					)}
				</div>
			</header>

			{/* Editor Body */}
			<div className="flex-1 overflow-y-auto p-8 lg:p-12 xl:p-16 max-w-4xl w-full mx-auto flex flex-col space-y-6">
				{/* Title Input */}
				<input
					type="text"
					value={title}
					onChange={(e) => handleType(e.target.value, content)}
					placeholder="Untitled"
					className="w-full bg-transparent border-0 outline-none text-4xl lg:text-5xl font-bold text-white placeholder-white/20 select-none tracking-tight display-title"
				/>

				{/* Content Textarea */}
				<textarea
					value={content}
					onChange={(e) => handleType(title, e.target.value)}
					placeholder="Start writing..."
					className="w-full flex-1 bg-transparent border-0 outline-none resize-none text-white/80 placeholder-white/10 text-lg leading-relaxed font-sans min-h-[400px]"
				/>
			</div>
		</div>
	);
}
