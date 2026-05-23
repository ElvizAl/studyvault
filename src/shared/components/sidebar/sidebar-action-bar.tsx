import { useState } from "react";
import {
	Search,
	Plus,
	BookPlus,
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	Clock,
	Layers,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortOption } from "./sidebar";

interface SidebarActionBarProps {
	onCreateNote: () => void;
	onCreateNotebook?: () => void;
	onSearch?: (query: string) => void;
	onCollapseAll: () => void;
	sortBy: SortOption;
	onSortChange: (sort: SortOption) => void;
	searchResults?: Array<{
		id: string;
		title: string;
		notebookId: string | null;
		updatedAt: Date;
	}>;
}

export function SidebarActionBar({
	onCreateNote,
	onCreateNotebook,
	onSearch,
	onCollapseAll,
	sortBy,
	onSortChange,
	searchResults,
}: SidebarActionBarProps) {
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleSearch = () => {
		setSearchOpen((prev) => {
			if (!prev) {
				setSearchQuery("");
			}
			return !prev;
		});
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		onSearch?.(value);
	};

	return (
		<div className="p-3 border-b border-border space-y-2">
			<div className="flex gap-1.5">
				{/* Search */}
				<button
					type="button"
					onClick={toggleSearch}
					title="Search notes"
					className="flex-1 h-7 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground cursor-pointer"
				>
					<Search className="w-3.5 h-3.5" />
				</button>

				{/* New File */}
				<button
					type="button"
					onClick={onCreateNote}
					title="New file"
					className="flex-1 h-7 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground cursor-pointer"
				>
					<Plus className="w-3.5 h-3.5" />
				</button>

				{/* New Folder */}
				<button
					type="button"
					onClick={onCreateNotebook}
					title="New notebook"
					className="flex-1 h-7 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground cursor-pointer"
				>
					<BookPlus className="w-3.5 h-3.5" />
				</button>

				{/* Sort Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							title="Sort"
							className="flex-1 h-7 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground cursor-pointer"
						>
							{sortBy === "a-z" || sortBy === "z-a" ? (
								sortBy === "a-z" ? (
									<ArrowDownNarrowWide className="w-3.5 h-3.5" />
								) : (
									<ArrowUpNarrowWide className="w-3.5 h-3.5" />
								)
							) : (
								<Clock className="w-3.5 h-3.5" />
							)}
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-36">
						<DropdownMenuItem
							onClick={() => onSortChange("newest")}
							className={sortBy === "newest" ? "font-semibold" : ""}
						>
							<Clock className="w-3.5 h-3.5" />
							Newest
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onSortChange("oldest")}
							className={sortBy === "oldest" ? "font-semibold" : ""}
						>
							<Clock className="w-3.5 h-3.5" />
							Oldest
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onSortChange("a-z")}
							className={sortBy === "a-z" ? "font-semibold" : ""}
						>
							<ArrowDownNarrowWide className="w-3.5 h-3.5" />
							A-Z
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onSortChange("z-a")}
							className={sortBy === "z-a" ? "font-semibold" : ""}
						>
							<ArrowUpNarrowWide className="w-3.5 h-3.5" />
							Z-A
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Collapse All */}
				<button
					type="button"
					onClick={onCollapseAll}
					title="Collapse all"
					className="flex-1 h-7 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground cursor-pointer"
				>
					<Layers className="w-3.5 h-3.5" />
				</button>
			</div>

			{/* Search Panel */}
			{searchOpen && (
				<div className="space-y-2">
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search notes..."
							className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
						/>
					</div>

					{/* Search Results */}
					{searchResults && searchResults.length > 0 && (
						<div className="max-h-60 overflow-y-auto -mx-1">
							<nav className="space-y-0.5">
								{searchResults.map((result) => (
									<div
										key={result.id}
										className="block px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
									>
										<p className="text-xs font-medium text-foreground truncate group-hover:text-foreground">
											{result.title || "Untitled"}
										</p>
									</div>
								))}
							</nav>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
