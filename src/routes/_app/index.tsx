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
		<div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto space-y-6">
			<div className="relative">
				<div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4fb8b2]/10 to-[#2f6a4a]/10 border border-[#4fb8b2]/20 shadow-xl shadow-[#4fb8b2]/5">
					<BookOpen className="w-10 h-10 text-[#4fb8b2]" />
				</div>
				<div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br from-[#60d7cf] to-[#6ec89a] border border-[#0f1d22] flex items-center justify-center animate-bounce shadow">
					<Sparkles className="w-3.5 h-3.5 text-white" />
				</div>
			</div>

			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight display-title">
					Welcome to StudyVault AI
				</h1>
				<p className="text-white/60 text-sm leading-relaxed">
					Your personal digital notebook powered by smart AI capabilities. Jot
					down notes, organize them into notebooks, and let the AI summarize
					your learning.
				</p>
			</div>

			<Button
				onClick={handleCreateNote}
				className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4fb8b2] to-[#2f6a4a] hover:from-[#60d7cf] hover:to-[#6ec89a] text-white font-semibold shadow-lg shadow-[#4fb8b2]/15 border border-white/10 rounded-xl transition-all duration-200"
			>
				<Plus className="w-4 h-4" />
				Create your first note
			</Button>
		</div>
	);
}
