import { useState, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
	Search,
	Plus,
	BookPlus,
	ChevronDown,
	ChevronRight,
	Settings,
	Trash2,
	ChevronsLeft,
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	Clock,
	Layers,
	Folder,
	MoreVertical,
	FileText,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
	id: string;
	title: string;
	notebookId: string | null;
	updatedAt: Date;
}

interface NotebookType {
	id: string;
	name: string;
	notes: Note[];
	updatedAt: Date;
}

export type SortOption = "newest" | "oldest" | "a-z" | "z-a";

interface SidebarProps {
	notebooks: (NotebookType & { notes: Note[] })[];
	notes: Note[];
	onCreateNote: (notebookId?: string | null) => void;
	onCreateNotebook?: () => void;
	onSearch?: (query: string) => void;
	searchResults?: Note[];
	isCollapsed: boolean;
	onToggleCollapse: () => void;
}

export function Sidebar({
	notebooks,
	notes,
	onCreateNote,
	onCreateNotebook,
	onSearch,
	searchResults,
	isCollapsed,
	onToggleCollapse,
}: SidebarProps) {
	const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(
		new Set(),
	);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("newest");

	const toggleNotebook = useCallback((notebookId: string) => {
		setExpandedNotebooks((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(notebookId)) {
				newSet.delete(notebookId);
			} else {
				newSet.add(notebookId);
			}
			return newSet;
		});
	}, []);

	const collapseAll = useCallback(() => {
		setExpandedNotebooks(new Set());
	}, []);

	// Sort function for notes
	const sortNoteItems = useCallback(
		(items: Note[]) => {
			const sorted = [...items];
			switch (sortBy) {
				case "a-z":
					return sorted.sort((a, b) => a.title.localeCompare(b.title));
				case "z-a":
					return sorted.sort((a, b) => b.title.localeCompare(a.title));
				case "oldest":
					return sorted.sort(
						(a, b) =>
							new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
					);
				default:
					return sorted.sort(
						(a, b) =>
							new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
					);
			}
		},
		[sortBy],
	);

	// Sort function for notebooks
	const sortNotebookItems = useCallback(
		(items: NotebookType[]) => {
			const sorted = [...items];
			switch (sortBy) {
				case "a-z":
					return sorted.sort((a, b) => a.name.localeCompare(b.name));
				case "z-a":
					return sorted.sort((a, b) => b.name.localeCompare(a.name));
				case "oldest":
					return sorted.sort(
						(a, b) =>
							new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
					);
				default:
					return sorted.sort(
						(a, b) =>
							new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
					);
			}
		},
		[sortBy],
	);

	const sortedNotebooks = useMemo(
		() => sortNotebookItems(notebooks),
		[notebooks, sortNotebookItems],
	);
	const sortedRootNotes = useMemo(
		() => sortNoteItems(notes.filter((note) => !note.notebookId)),
		[notes, sortNoteItems],
	);

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

	if (isCollapsed) {
		return null;
	}

	return (
		<aside className="w-[260px] flex flex-col border-r border-border bg-zinc-50 dark:bg-zinc-950 shrink-0">
			{/* Top Bar (US-SB-01): Logo + "vault" text (left), Collapse toggle (right) */}
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

			{/* Action Bar (US-SB-02): Search, New File, New Folder, Sort, Collapse All */}
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
						onClick={() => onCreateNote()}
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
								onClick={() => setSortBy("newest")}
								className={sortBy === "newest" ? "font-semibold" : ""}
							>
								<Clock className="w-3.5 h-3.5" />
								Newest
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortBy("oldest")}
								className={sortBy === "oldest" ? "font-semibold" : ""}
							>
								<Clock className="w-3.5 h-3.5" />
								Oldest
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortBy("a-z")}
								className={sortBy === "a-z" ? "font-semibold" : ""}
							>
								<ArrowDownNarrowWide className="w-3.5 h-3.5" />
								A-Z
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortBy("z-a")}
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
						onClick={collapseAll}
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
							<div className="max-h-[240px] overflow-y-auto -mx-1">
								<nav className="space-y-0.5">
									{searchResults.map((result) => (
										<Link
											key={result.id}
											to="/app/$noteId"
											params={{ noteId: result.id }}
											onClick={() => {
												setSearchOpen(false);
												setSearchQuery("");
											}}
											className="block px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
										>
											<p className="text-xs font-medium text-foreground truncate group-hover:text-foreground">
												{result.title || "Untitled"}
											</p>
										</Link>
									))}
								</nav>
							</div>
						)}
					</div>
				)}
			</div>

			{/* File Tree: Inbox + Notebooks + Root Notes */}
			<div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
				{/* Inbox Section */}
				<div>
					{/* Inbox Notes */}
					{sortedRootNotes.length > 0 && (
						<nav className="ml-2 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800 mt-0.5">
							{sortedRootNotes.map((note) => (
								<Link
									key={note.id}
									to="/app/$noteId"
									params={{ noteId: note.id }}
									activeProps={{
										className:
											"bg-zinc-200/60 dark:bg-zinc-800/60 text-foreground font-semibold border-l-2 border-primary",
									}}
									inactiveProps={{
										className:
											"text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground",
									}}
									className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100 group border-l-2 border-transparent ml-1"
								>
									<FileText className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
									<span className="truncate flex-1">
										{note.title || "Untitled"}
									</span>
								</Link>
							))}
						</nav>
					)}
				</div>

				{/* Notebooks without section headers */}
				{sortedNotebooks.length > 0 && (
					<nav className="space-y-1">
						{sortedNotebooks.map((notebook) => (
							<div key={notebook.id}>
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group">
									<button
										type="button"
										onClick={() => toggleNotebook(notebook.id)}
										className="flex items-center justify-center w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer -ml-1"
									>
										{expandedNotebooks.has(notebook.id) ? (
											<ChevronDown className="w-3.5 h-3.5" />
										) : (
											<ChevronRight className="w-3.5 h-3.5" />
										)}
									</button>
									<Folder className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
									<span className="flex-1 text-xs font-medium text-foreground truncate text-left">
										{notebook.name}
									</span>
									<span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-200 dark:bg-zinc-800 text-muted-foreground group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 transition-colors">
										{notebook.notes.length}
									</span>
									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											onCreateNote(notebook.id);
										}}
										title="Add note to notebook"
										className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground transition-colors rounded opacity-0 group-hover:opacity-100 cursor-pointer"
									>
										<Plus className="w-3.5 h-3.5" />
									</button>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button
												type="button"
												className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground transition-colors rounded opacity-0 group-hover:opacity-100 cursor-pointer"
											>
												<MoreVertical className="w-3.5 h-3.5" />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-40">
											<DropdownMenuItem
												onClick={() => {
													// TODO: Implement rename notebook
													console.log("Rename notebook:", notebook.id);
												}}
											>
												Rename
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													// TODO: Implement edit notebook
													console.log("Edit notebook:", notebook.id);
												}}
											>
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													// TODO: Implement delete notebook
													console.log("Delete notebook:", notebook.id);
												}}
												className="text-red-600 dark:text-red-400"
											>
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								{/* Nested Notes */}
								{expandedNotebooks.has(notebook.id) &&
									notebook.notes.length > 0 && (
										<nav className="ml-2 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800 mt-0.5">
											{sortNoteItems(notebook.notes).map((note) => (
												<Link
													key={note.id}
													to="/app/$noteId"
													params={{ noteId: note.id }}
													activeProps={{
														className:
															"bg-zinc-200/60 dark:bg-zinc-800/60 text-foreground font-semibold border-l-2 border-primary",
													}}
													inactiveProps={{
														className:
															"text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground",
													}}
													className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100 group border-l-2 border-transparent ml-1"
												>
													<FileText className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
													<span className="truncate flex-1">
														{note.title || "Untitled"}
													</span>
												</Link>
											))}
										</nav>
									)}
							</div>
						))}
					</nav>
				)}

				{/* Empty State */}
				{sortedNotebooks.length === 0 && sortedRootNotes.length === 0 && (
					<div className="px-3 py-8 text-center text-xs text-muted-foreground/75 italic">
						No notebooks or notes yet
					</div>
				)}
			</div>

			{/* Bottom Bar: Settings + Trash */}
			<div className="p-2.5 border-t border-border bg-zinc-100/40 dark:bg-zinc-900/10 space-y-0.5">
				<Link
					to="/app/trash"
					activeProps={{
						className:
							"bg-zinc-200/60 dark:bg-zinc-800/60 text-foreground font-semibold",
					}}
					inactiveProps={{
						className:
							"text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground",
					}}
					className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100"
				>
					<Trash2 className="w-3.5 h-3.5" />
					<span>Trash</span>
				</Link>
				<Link
					to="/app/settings"
					activeProps={{
						className:
							"bg-zinc-200/60 dark:bg-zinc-800/60 text-foreground font-semibold",
					}}
					inactiveProps={{
						className:
							"text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground",
					}}
					className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100"
				>
					<Settings className="w-3.5 h-3.5" />
					<span>Settings</span>
				</Link>
			</div>
		</aside>
	);
}
