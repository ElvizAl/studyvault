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
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Editor } from "@/modules/note/components/editor";
import { AISummarySidebar } from "@/modules/ai/components/ai-summary-sidebar";
import { getSummaryFn, generateSummaryFn } from "@/modules/ai/ai.api";

// Lightweight djb2 content hash (must match server-side)
function hashContent(content: string): string {
	let hash = 5381;
	for (let i = 0; i < content.length; i++) {
		hash = ((hash << 5) + hash) ^ content.charCodeAt(i);
		hash = hash >>> 0;
	}
	return hash.toString(16);
}

function getWordCount(text: string): number {
	return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

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

	// Track typing state for sidebar flicker prevention
	const [isTyping, setIsTyping] = useState(false);
	const typingTimeout = useRef<NodeJS.Timeout | null>(null);

	// Track live word count
	const [wordCount, setWordCount] = useState(getWordCount(note.content));

	// Track last regen hash to detect staleness
	const lastRegenHashRef = useRef<string | null>(null);
	const lastRegenWordCountRef = useRef<number>(getWordCount(note.content));

	// Sync local state with loaded note if noteId changes
	useEffect(() => {
		setTitle(note.title);
		setContent(note.content);
		setSaveStatus("idle");
		setWordCount(getWordCount(note.content));
		pendingSaveData.current = null;
		lastRegenHashRef.current = null;
		lastRegenWordCountRef.current = getWordCount(note.content);
	}, [note.content, note.title]);

	// Trigger staleness check + regen after a successful save
	const checkAndRegenIfStale = useCallback(
		async (savedContent: string) => {
			const currentWordCount = getWordCount(savedContent);
			if (currentWordCount < 150) return;

			try {
				// Fetch current summary to get basedOnHash
				const existingSummary = await getSummaryFn({
					data: { noteId: note.id },
				});

				if (!existingSummary) {
					// No summary yet — trigger initial generation
					if (lastRegenHashRef.current === null) {
						lastRegenHashRef.current = hashContent(savedContent);
						lastRegenWordCountRef.current = currentWordCount;
						await generateSummaryFn({
							data: { noteId: note.id, content: savedContent },
						});
					}
					return;
				}

				if (
					existingSummary.status === "GENERATING" ||
					existingSummary.status === "STALE"
				) {
					return; // Already in progress
				}

				const newHash = hashContent(savedContent);
				const oldHash = existingSummary.basedOnHash;
				const oldWordCount = lastRegenWordCountRef.current;

				// Minor change: skip regen
				if (
					newHash === oldHash ||
					Math.abs(currentWordCount - oldWordCount) < 5
				) {
					return;
				}

				// Significant change — regenerate
				lastRegenHashRef.current = newHash;
				lastRegenWordCountRef.current = currentWordCount;
				await generateSummaryFn({
					data: { noteId: note.id, content: savedContent },
				});
			} catch {
				// Staleness check failure is non-critical — silent
			}
		},
		[note.id],
	);

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

				// After save, check staleness and potentially regenerate
				void checkAndRegenIfStale(updatedContent);
			} catch (error) {
				console.error("Auto-save failed", error);
				setSaveStatus("error");
			}
		},
		[note.id, router, checkAndRegenIfStale],
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
		setWordCount(getWordCount(newContent));
		pendingSaveData.current = { title: effectiveTitle, content: newContent };

		// Mark as typing to freeze sidebar updates
		setIsTyping(true);
		if (typingTimeout.current) clearTimeout(typingTimeout.current);
		typingTimeout.current = setTimeout(() => {
			setIsTyping(false);
		}, 600);

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
			if (typingTimeout.current) clearTimeout(typingTimeout.current);
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

	return (
		<div className="flex-1 flex h-full overflow-hidden bg-background">
			{/* Main Editor Panel */}
			<div className="flex-1 flex flex-col h-full border-r border-border">
				{/* Top Bar */}
				<header className="h-14 border-b border-border px-6 flex items-center justify-between bg-card">
					<div className="flex items-center gap-2 text-muted-foreground text-xs font-medium min-w-0">
						<FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
						<span className="truncate max-w-45 font-semibold text-foreground">
							{title || "Untitled"}
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

						{/* Trash Action */}
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
			</div>

			{/* AI Summary Sidebar */}
			<div className="hidden xl:flex">
				<AISummarySidebar
					noteId={note.id}
					wordCount={wordCount}
					isTyping={isTyping}
					contentForRegen={content}
					onRegenRequested={() => {
						lastRegenHashRef.current = hashContent(content);
						lastRegenWordCountRef.current = wordCount;
					}}
				/>
			</div>
		</div>
	);
}
