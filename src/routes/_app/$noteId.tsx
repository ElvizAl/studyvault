import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { getNoteByIdFn, updateNoteFn, deleteNoteFn } from "@/modules/note/note.api";
import { FileText, Trash2, CheckCircle2, CloudLightning, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export const Route = createFileRoute("/_app/$noteId")({
	loader: async ({ params }) => {
		const note = await getNoteByIdFn({ data: { id: params.noteId } });
		if (!note) {
			throw redirect({ to: "/" });
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
	const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
	const saveTimeout = useRef<NodeJS.Timeout | null>(null);

	// Sync local state with loaded note if noteId changes
	useEffect(() => {
		setTitle(note.title);
		setContent(note.content);
		setSaveStatus("saved");
	}, [note.id, note.title, note.content]);

	// Auto-save function
	const performSave = async (updatedTitle: string, updatedContent: string) => {
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
			// Invalidate router to update note title in sidebar
			await router.invalidate();
		} catch (error) {
			console.error("Auto-save failed", error);
			setSaveStatus("error");
		}
	};

	// Handle input changes with debouncing
	const handleChange = (newTitle: string, newContent: string) => {
		setTitle(newTitle);
		setContent(newContent);
		setSaveStatus("saving");

		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current);
		}

		saveTimeout.current = setTimeout(() => {
			performSave(newTitle, newContent);
		}, 800); // 800ms debounce
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (saveTimeout.current) {
				clearTimeout(saveTimeout.current);
			}
		};
	}, []);

	// Handle Soft Delete
	const handleSoftDelete = async () => {
		try {
			await deleteNoteFn({ data: { id: note.id } });
			await router.invalidate();
			navigate({ to: "/" });
		} catch (error) {
			console.error("Failed to delete note", error);
		}
	};

	return (
		<div className="flex-1 flex h-full overflow-hidden">
			{/* Main Editor Panel - 65% width */}
			<div className="flex-1 flex flex-col h-full border-r border-white/5 bg-[#0c1418]/40">
				{/* Top Bar */}
				<header className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-white/[0.01]">
					<div className="flex items-center gap-2 text-white/40 text-sm font-medium">
						<FileText className="w-4 h-4 text-[#4fb8b2]" />
						<span className="truncate max-w-[200px]">{title || "Untitled"}</span>
					</div>

					<div className="flex items-center gap-4">
						{/* Save Status Indicator */}
						<div className="text-xs">
							{saveStatus === "saved" && (
								<span className="flex items-center gap-1.5 text-emerald-400/80 font-medium">
									<CheckCircle2 className="w-3.5 h-3.5" />
									Saved
								</span>
							)}
							{saveStatus === "saving" && (
								<span className="flex items-center gap-1.5 text-[#60d7cf] font-medium">
									<CloudLightning className="w-3.5 h-3.5 animate-pulse" />
									Saving...
								</span>
							)}
							{saveStatus === "error" && (
								<span className="flex items-center gap-1.5 text-rose-400 font-medium">
									Failed to save
								</span>
							)}
						</div>

						{/* Trash Action */}
						<Button
							variant="ghost"
							size="icon"
							onClick={handleSoftDelete}
							className="text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg w-8 h-8 flex items-center justify-center transition-colors"
							title="Move to Trash"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</header>

				{/* Scrollable Editor Body */}
				<div className="flex-1 overflow-y-auto p-8 lg:p-12 xl:p-16 max-w-3xl w-full mx-auto flex flex-col space-y-6">
					<input
						type="text"
						value={title}
						onChange={(e) => handleChange(e.target.value, content)}
						placeholder="Untitled"
						className="w-full bg-transparent border-0 outline-none text-4xl lg:text-5xl font-bold text-white placeholder-white/20 select-none tracking-tight display-title"
					/>
					<textarea
						value={content}
						onChange={(e) => handleChange(title, e.target.value)}
						placeholder="Start writing..."
						className="w-full flex-1 bg-transparent border-0 outline-none resize-none text-white/80 placeholder-white/10 text-lg leading-relaxed font-sans min-h-[450px]"
					/>
				</div>
			</div>

			{/* AI Summarization Panel - 35% width */}
			<aside className="w-[380px] hidden xl:flex flex-col border-l border-white/5 bg-white/[0.01] backdrop-blur-sm p-6 overflow-y-auto space-y-6">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-[#4fb8b2]/10 border border-[#4fb8b2]/20 flex items-center justify-center shadow">
						<Sparkles className="w-4.5 h-4.5 text-[#4fb8b2]" />
					</div>
					<h3 className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
						AI Spark Summary
					</h3>
				</div>

				<div className="border border-white/5 rounded-2xl bg-white/[0.02] p-5 space-y-4 shadow-xl">
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/30">
						<span>Status</span>
						<span className="px-2 py-0.5 rounded-full bg-[#4fb8b2]/15 text-[#60d7cf] border border-[#4fb8b2]/25 font-bold">
							Fresh
						</span>
					</div>

					<p className="text-white/60 text-sm leading-relaxed font-sans">
						Start typing in the editor. As your note grows, Nozen's AI model will automatically analyze and generate high-yield summaries, flashcards, and conceptual breakdowns to boost your learning retention.
					</p>
				</div>
			</aside>
		</div>
	);
}
