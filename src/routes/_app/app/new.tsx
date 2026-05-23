import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { createNoteFn } from "@/modules/note/note.api";
import { getNotebooksFn } from "@/modules/notebook/notebook.api";
import { FileText, Loader2, Folder } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/app/new")({
	validateSearch: (search: Record<string, unknown>) => ({
		notebookId: search.notebookId ? (search.notebookId as string) : undefined,
	}),
	loader: async () => {
		const notebooks = await getNotebooksFn();
		return { notebooks };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const router = useRouter();
	const { notebooks } = Route.useLoaderData();
	const search = Route.useSearch();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(
		search.notebookId || null,
	);
	const [isSaving, setIsSaving] = useState(false);
	const saveTimeout = useRef<NodeJS.Timeout | null>(null);
	const hasCreatedRef = useRef(false);

	// Attempt to save note when meaningful content is typed
	const handleSave = async (currentTitle: string, currentContent: string) => {
		// Prevent double creation
		if (hasCreatedRef.current) {
			return;
		}

		const cleanTitle = currentTitle.trim();
		const cleanContent = currentContent.trim();

		// meaningful content: title is not empty or content is not empty
		if (cleanTitle !== "" || cleanContent !== "") {
			hasCreatedRef.current = true;
			setIsSaving(true);
			try {
				const note = await createNoteFn({
					data: {
						title: cleanTitle || "Untitled Note",
						content: cleanContent,
						notebookId: selectedNotebookId || undefined,
					},
				});

				// Invalidate router so sidebar updates
				await router.invalidate();

				// Redirect to the real note ID
				navigate({
					to: "/app/$noteId",
					params: { noteId: note.id },
					replace: true, // Replace /new in history so back button works correctly
				});
			} catch (error) {
				console.error("Failed to create note", error);
				hasCreatedRef.current = false;
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
		<div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
			{/* Top Bar */}
			<header className="h-14 border-b border-border px-6 flex items-center justify-between bg-card">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
						<FileText className="w-3.5 h-3.5" />
						<span>Draft Note</span>
					</div>

					{/* Notebook Selector */}
					<Select
						value={selectedNotebookId || "none"}
						onValueChange={(value) =>
							setSelectedNotebookId(value === "none" ? null : value)
						}
					>
						<SelectTrigger className="w-40 h-8 text-xs">
							<SelectValue placeholder="No notebook" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">No notebook</SelectItem>
							{notebooks.map((notebook) => (
								<SelectItem key={notebook.id} value={notebook.id}>
									<div className="flex items-center gap-2">
										<Folder className="w-3 h-3" />
										{notebook.name}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-3 text-[11px] text-muted-foreground">
					{isSaving ? (
						<span className="flex items-center gap-1.5 font-medium text-foreground">
							<Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
							Saving draft...
						</span>
					) : (
						<span className="flex items-center gap-1.5">
							<span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
							Not saved yet
						</span>
					)}
				</div>
			</header>

			{/* Editor Body */}
			<div className="flex-1 overflow-y-auto p-8 lg:p-12 xl:p-16 max-w-2xl w-full mx-auto flex flex-col space-y-6">
				{/* Title Input */}
				<input
					type="text"
					value={title}
					onChange={(e) => handleType(e.target.value, content)}
					placeholder="Untitled"
					className="w-full bg-transparent border-0 outline-none text-3xl font-bold text-foreground placeholder:text-muted-foreground/30 select-none tracking-tight font-sans"
				/>

				{/* Content Textarea */}
				<textarea
					value={content}
					onChange={(e) => handleType(title, e.target.value)}
					placeholder="Start writing..."
					className="w-full flex-1 bg-transparent border-0 outline-none resize-none text-foreground/85 placeholder:text-muted-foreground/20 text-sm leading-relaxed font-sans min-h-100"
				/>
			</div>
		</div>
	);
}
