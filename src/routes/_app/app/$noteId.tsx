import {
	createFileRoute,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
	getNoteByIdFn,
	updateNoteFn,
	deleteNoteFn,
} from "@/modules/note/note.api";
import {
	FileText,
	Trash2,
	CheckCircle2,
	Loader2,
	AlertCircle,
	Sparkles,
	Layers,
	CircleHelp,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

import { Editor } from "@/modules/note/components/editor";

export const Route = createFileRoute("/_app/app/$noteId")({
	loader: async ({ params }) => {
		const note = await getNoteByIdFn({ data: { id: params.noteId } });
		if (!note) {
			throw redirect({ to: "/app" });
		}
		return { note };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { note } = Route.useLoaderData();
	const navigate = useNavigate();
	const router = useRouter();

	const [title, setTitle] = useState(note.title);
	const [content, setContent] = useState(note.content);
	const [saveStatus, setSaveStatus] = useState<
		"saved" | "saving" | "error" | "idle"
	>("idle");
	const saveTimeout = useRef<NodeJS.Timeout | null>(null);
	const savedIndicatorTimeout = useRef<NodeJS.Timeout | null>(null);
	const pendingSaveData = useRef<{ title: string; content: string } | null>(
		null,
	);
	const displayTitle = title.trim() || "Untitled";
	const notebook = note.notebook ?? null;
	const wordCount =
		content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
	const charCount = content.length;
	const readTime = Math.ceil(wordCount / 200);
	const isAiDisabled = wordCount < 150;

	// Sync local state with loaded note if noteId changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: Reset state when switching between notes that have identical title and content.
	useEffect(() => {
		setTitle(note.title);
		setContent(note.content);
		setSaveStatus("idle");
		pendingSaveData.current = null;
	}, [note.content, note.id, note.title]); // trigger when note ID changes

	// Auto-save function
	const performSave = useCallback(
		async (updatedTitle: string, updatedContent: string) => {
			setSaveStatus("saving");
			try {
				await updateNoteFn({
					data: {
						id: note.id,
						title: updatedTitle,
						content: updatedContent,
					},
				});
				setSaveStatus("saved");
				pendingSaveData.current = null;

				if (savedIndicatorTimeout.current)
					clearTimeout(savedIndicatorTimeout.current);
				savedIndicatorTimeout.current = setTimeout(() => {
					setSaveStatus((prev) => (prev === "saved" ? "idle" : prev));
				}, 2000);

				// Invalidate router to update note title in sidebar
				await router.invalidate();
			} catch (error) {
				console.error("Auto-save failed", error);
				setSaveStatus("error");
			}
		},
		[note.id, router],
	);

	// Derive a title from markdown content (first H1 or first non-empty line)
	function deriveTitle(markdownContent: string): string {
		const lines = markdownContent.split("\n");
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			// Match H1: "# Heading"
			const h1Match = trimmed.match(/^#\s+(.+)/);
			if (h1Match) return h1Match[1].trim();
			// Strip other markdown heading markers and return first text
			const stripped = trimmed.replace(/^#{1,6}\s+/, "").trim();
			if (stripped) return stripped;
		}
		return "";
	}

	// Handle input changes with debouncing
	const handleChange = (newTitle: string, newContent: string) => {
		// When the user hasn't typed a manual title, auto-derive from content
		const effectiveTitle =
			newTitle.trim() !== "" ? newTitle : deriveTitle(newContent);

		setTitle(newTitle); // keep input field value as-is
		setContent(newContent);
		pendingSaveData.current = { title: effectiveTitle, content: newContent };

		if (saveStatus !== "error") {
			setSaveStatus("saving");
		}

		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current);
		}

		saveTimeout.current = setTimeout(() => {
			if (pendingSaveData.current) {
				performSave(
					pendingSaveData.current.title,
					pendingSaveData.current.content,
				);
			}
		}, 1500); // 1.5s debounce
	};

	// Warning before unload if unsaved changes exist
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (
				pendingSaveData.current ||
				saveStatus === "saving" ||
				saveStatus === "error"
			) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [saveStatus]);

	// Auto-retry on network reconnect
	useEffect(() => {
		const handleOnline = () => {
			if (saveStatus === "error" && pendingSaveData.current) {
				performSave(
					pendingSaveData.current.title,
					pendingSaveData.current.content,
				);
			}
		};
		window.addEventListener("online", handleOnline);
		return () => window.removeEventListener("online", handleOnline);
	}, [saveStatus, performSave]);

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (saveTimeout.current) clearTimeout(saveTimeout.current);
			if (savedIndicatorTimeout.current)
				clearTimeout(savedIndicatorTimeout.current);
		};
	}, []);

	// Retry failed save manually
	const handleRetry = () => {
		if (pendingSaveData.current) {
			performSave(
				pendingSaveData.current.title,
				pendingSaveData.current.content,
			);
		} else {
			performSave(title, content);
		}
	};

	// Handle Soft Delete
	const handleSoftDelete = async () => {
		try {
			await deleteNoteFn({ data: { id: note.id } });
			await router.invalidate();
			navigate({ to: "/app" });
		} catch (error) {
			console.error("Failed to delete note", error);
		}
	};

	const handleNotebookBreadcrumbClick = () => {
		if (!notebook?.id) return;

		window.dispatchEvent(
			new CustomEvent("studyvault:highlight-notebook", {
				detail: { notebookId: notebook.id },
			}),
		);
	};

	return (
		<div className="flex-1 flex h-full overflow-hidden bg-background">
			{/* Main Editor Panel */}
			<div className="flex-1 flex flex-col h-full border-r border-border">
				{/* Top Bar */}
				<header className="h-14 border-b border-border px-6 flex items-center justify-between bg-card">
					<div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium min-w-0">
						<FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
						{notebook ? (
							<>
								<button
									type="button"
									onClick={handleNotebookBreadcrumbClick}
									className="truncate max-w-44 text-left font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
									title="Highlight notebook in sidebar"
								>
									{notebook.name}
								</button>
								<ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
							</>
						) : null}
						<span className="truncate max-w-56 font-semibold text-foreground">
							{displayTitle}
						</span>
					</div>

					<div className="flex items-center gap-3">
						{/* Save Status Indicator */}
						<div className="text-[11px] flex items-center h-8">
							{saveStatus === "saved" && (
								<span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-medium animate-in fade-in duration-300">
									<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
									Saved
								</span>
							)}
							{saveStatus === "saving" && (
								<span className="flex items-center gap-1.5 text-muted-foreground font-medium animate-in fade-in duration-300">
									<Loader2 className="w-3 h-3 animate-spin shrink-0" />
									Saving...
								</span>
							)}
							{saveStatus === "error" && (
								<button
									type="button"
									onClick={handleRetry}
									className="flex items-center gap-1.5 text-rose-500 font-medium hover:bg-rose-500/10 px-2 py-1 rounded-md transition-colors cursor-pointer animate-in fade-in duration-300"
									title="Click to retry saving"
								>
									<AlertCircle className="w-3.5 h-3.5 shrink-0" />
									Save failed - Retry
								</button>
							)}
						</div>

						{/* Editor Actions */}
						<span
							title={
								isAiDisabled
									? "Minimal 150 kata untuk menggunakan fitur AI"
									: "Generate Flashcard"
							}
							className={isAiDisabled ? "cursor-not-allowed" : undefined}
						>
							<Button
								variant="ghost"
								size="sm"
								disabled={isAiDisabled}
								className="h-8 text-xs text-muted-foreground hover:text-foreground"
							>
								<Layers className="w-3.5 h-3.5" />
								Flashcard
							</Button>
						</span>
						<span
							title={
								isAiDisabled
									? "Minimal 150 kata untuk menggunakan fitur AI"
									: "Generate Review Question"
							}
							className={isAiDisabled ? "cursor-not-allowed" : undefined}
						>
							<Button
								variant="ghost"
								size="sm"
								disabled={isAiDisabled}
								className="h-8 text-xs text-muted-foreground hover:text-foreground"
							>
								<CircleHelp className="w-3.5 h-3.5" />
								Review
							</Button>
						</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleSoftDelete}
							className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
							title="Move to Trash"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</Button>
					</div>
				</header>

				{/* Scrollable Editor Body */}
				<div className="flex-1 overflow-y-auto p-8 lg:p-12 xl:p-16 max-w-2xl w-full mx-auto flex flex-col space-y-6">
					<input
						type="text"
						value={title}
						onChange={(e) => handleChange(e.target.value, content)}
						placeholder="Untitled"
						className="w-full bg-transparent border-0 outline-none text-3xl font-bold text-foreground placeholder:text-muted-foreground/30 select-none tracking-tight font-sans"
					/>
					<Editor
						content={content || ""}
						onChange={(newContent) => handleChange(title, newContent)}
						placeholder="Start writing..."
					/>
				</div>

				<footer className="h-9 border-t border-border bg-card/70 px-6 flex items-center justify-end text-[11px] text-muted-foreground">
					<span>
						0 backlinks · {wordCount} words · {charCount} chars · {readTime} min
						read
					</span>
				</footer>
			</div>

			{/* AI Summarization Panel - Notion/Linear Inspector style */}
			<aside className="w-75 hidden xl:flex flex-col border-l border-border bg-zinc-50/50 dark:bg-zinc-950/20 p-5 overflow-y-auto space-y-5 shrink-0">
				<div className="flex items-center gap-2 font-semibold text-xs text-foreground tracking-tight">
					<div className="w-6.5 h-6.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center shadow-xs">
						<Sparkles className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
					</div>
					<span>AI Spark Summary</span>
				</div>

				<div className="border border-border rounded-xl bg-card p-4 space-y-3.5 shadow-xs">
					<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
						<span>Status</span>
						<span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-foreground border border-border text-[9px]">
							Fresh
						</span>
					</div>

					<p className="text-muted-foreground text-xs leading-relaxed font-sans">
						Start typing in the editor. As your note grows, StudyVault's AI
						model will automatically analyze and generate high-yield summaries,
						flashcards, and conceptual breakdowns to boost your learning
						retention.
					</p>
				</div>
			</aside>
		</div>
	);
}
