import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { Plus, BookOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const handleCreateNote = () => {
		navigate({ to: "/new" });
	};

	return (
		<div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-6">
			{/* Minimal Visual Container */}
			<div className="relative">
				<div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border shadow-xs">
					<BookOpen className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
				</div>
				<div className="absolute -top-1 -right-1 w-5 h-5 rounded-md bg-zinc-900 dark:bg-zinc-100 border border-background flex items-center justify-center shadow-xs">
					<Sparkles className="w-3 h-3 text-zinc-100 dark:text-zinc-900" />
				</div>
			</div>

			{/* Typographic Block */}
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					Welcome to StudyVault AI
				</h1>
				<p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
					Your modern personal digital notebook. Jot down your learning
					materials, organize your thoughts, and receive intelligent summaries.
				</p>
			</div>

			{/* Clean CTA Button */}
			<Button
				onClick={handleCreateNote}
				className="flex items-center gap-2 px-5 py-2 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors border border-transparent shadow-xs cursor-pointer"
			>
				<Plus className="w-4 h-4" />
				Create first note
			</Button>
		</div>
	);
}
