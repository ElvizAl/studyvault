import { Link } from "@tanstack/react-router";
import { ChevronsLeft } from "lucide-react";

interface SidebarHeaderProps {
	onToggleCollapse: () => void;
}

export function SidebarHeader({ onToggleCollapse }: SidebarHeaderProps) {
	return (
		<div className="h-14 px-4 border-b border-border flex items-center justify-between">
			<Link
				to="/app"
				className="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground group"
			>
				<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500 text-white border border-purple-600 shadow-sm">
					<span className="text-xs font-bold">V</span>
				</div>
				<span className="font-semibold text-zinc-900 dark:text-zinc-100">
					vault
				</span>
			</Link>

			<button
				type="button"
				onClick={onToggleCollapse}
				title="Collapse sidebar"
				className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground cursor-pointer"
			>
				<ChevronsLeft className="w-3.5 h-3.5" />
			</button>
		</div>
	);
}
