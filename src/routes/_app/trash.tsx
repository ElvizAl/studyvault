import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	getTrashNotesFn,
	restoreNoteFn,
	permanentDeleteNoteFn,
} from "@/modules/note/note.api";
import { Trash2, RotateCcw, Info, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export const Route = createFileRoute("/_app/trash")({
	loader: async () => {
		const trashNotes = await getTrashNotesFn();
		return { trashNotes };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { trashNotes } = Route.useLoaderData();
	const router = useRouter();

	const handleRestore = async (id: string) => {
		try {
			await restoreNoteFn({ data: { id } });
			await router.invalidate();
		} catch (error) {
			console.error("Failed to restore note", error);
		}
	};

	const handlePermanentDelete = async (id: string) => {
		if (
			window.confirm(
				"Are you absolutely sure you want to permanently delete this note? This action is irreversible.",
			)
		) {
			try {
				await permanentDeleteNoteFn({ data: { id } });
				await router.invalidate();
			} catch (error) {
				console.error("Failed to permanently delete note", error);
			}
		}
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-[#0c1418]/60 backdrop-blur-sm overflow-hidden">
			{/* Top Bar */}
			<header className="h-14 border-b border-white/5 px-6 flex items-center bg-white/[0.01]">
				<div className="flex items-center gap-2 text-white/40 text-sm font-medium">
					<Trash2 className="w-4 h-4 text-rose-400" />
					<span>Trash / Deleted Notes</span>
				</div>
			</header>

			{/* Content Body */}
			<div className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-4xl w-full mx-auto space-y-6">
				<div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-200/90 text-sm">
					<Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
					<p className="leading-relaxed">
						Notes in the trash have been soft-deleted. You can restore them to
						recover your work, or permanently delete them. Permanent deletion
						will remove all contents and associated AI summaries forever.
					</p>
				</div>

				{trashNotes.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
						<div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner">
							<Trash2 className="w-8 h-8 text-white/20" />
						</div>
						<div>
							<h3 className="font-bold text-lg text-white">Trash is Empty</h3>
							<p className="text-white/40 text-sm">
								No soft-deleted notes found.
							</p>
						</div>
					</div>
				) : (
					<div className="grid gap-4">
						{trashNotes.map((note) => (
							<div
								key={note.id}
								className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 shadow-md group"
							>
								{/* Info */}
								<div className="flex items-center gap-4 min-w-0">
									<div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
										<FileText className="w-5 h-5 text-white/40" />
									</div>
									<div className="min-w-0">
										<h4 className="font-semibold text-white truncate">
											{note.title || "Untitled Note"}
										</h4>
										<p className="text-xs text-white/30 truncate">
											Deleted at{" "}
											{note.deletedAt
												? new Date(note.deletedAt).toLocaleDateString()
												: "-"}{" "}
											at{" "}
											{note.deletedAt
												? new Date(note.deletedAt).toLocaleTimeString()
												: "-"}
										</p>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleRestore(note.id)}
										className="w-9 h-9 text-[#4fb8b2] hover:bg-[#4fb8b2]/10 rounded-xl transition-all"
										title="Restore Note"
									>
										<RotateCcw className="w-4 h-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handlePermanentDelete(note.id)}
										className="w-9 h-9 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
										title="Delete Permanently"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
