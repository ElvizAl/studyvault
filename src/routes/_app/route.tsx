import {
	createFileRoute,
	Outlet,
	redirect,
	Link,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { requireSessionFn } from "@/modules/auth/auth.api";
import { getNotesFn, searchNotesFn } from "@/modules/note/note.api";
import {
	Plus,
	Trash2,
	Settings,
	FileText,
	LogOut,
	Search,
	X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/shared/lib/auth-client";
import { useState, useRef, useEffect, useCallback } from "react";

export const Route = createFileRoute("/_app")({
	beforeLoad: async () => {
		const session = await requireSessionFn();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
	},
	loader: async () => {
		const notes = await getNotesFn();
		return { notes };
	},
	component: RouteComponent,
});

type SearchResult = {
	id: string;
	title: string;
	notebookId: string | null;
	snippet: string;
	updatedAt: Date;
};

function RouteComponent() {
	const { notes } = Route.useLoaderData();
	const router = useRouter();
	const navigate = useNavigate();

	// Search state
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [searching, setSearching] = useState(false);
	const [searched, setSearched] = useState(false);
	const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const handleCreateDraft = () => {
		navigate({ to: "/new" });
	};

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.navigate({ to: "/login" });
				},
			},
		});
	};

	const toggleSearch = () => {
		setSearchOpen((prev) => {
			if (!prev) {
				// Opening: reset state
				setSearchQuery("");
				setSearchResults([]);
				setSearched(false);
			}
			return !prev;
		});
	};

	// Focus input when search opens
	useEffect(() => {
		if (searchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [searchOpen]);

	const runSearch = useCallback(async (query: string) => {
		if (query.trim().length === 0) {
			setSearchResults([]);
			setSearched(false);
			return;
		}
		setSearching(true);
		try {
			const results = await searchNotesFn({ data: { query: query.trim() } });
			setSearchResults(results as SearchResult[]);
			setSearched(true);
		} catch {
			setSearchResults([]);
			setSearched(true);
		} finally {
			setSearching(false);
		}
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);

		if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

		if (value.trim().length === 0) {
			setSearchResults([]);
			setSearched(false);
			return;
		}

		searchDebounceRef.current = setTimeout(() => {
			runSearch(value);
		}, 500);
	};

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
		};
	}, []);

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
			{/* Left Sidebar - Notion/Linear style */}
			<aside className="w-[260px] flex flex-col border-r border-border bg-zinc-50 dark:bg-zinc-950 shrink-0">
				{/* Sidebar Header */}
				<div className="h-14 px-4 border-b border-border flex items-center justify-between">
					<Link
						to="/"
						className="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground group"
					>
						<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
							<FileText className="w-3.5 h-3.5" />
						</div>
						<span className="font-semibold text-zinc-900 dark:text-zinc-100">
							StudyVault AI
						</span>
					</Link>

					{/* Search Toggle Button */}
					<button
						type="button"
						onClick={toggleSearch}
						title={searchOpen ? "Close search" : "Search notes"}
						className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
							searchOpen
								? "bg-zinc-200 dark:bg-zinc-800 text-foreground"
								: "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground"
						}`}
					>
						{searchOpen ? (
							<X className="w-3.5 h-3.5" />
						) : (
							<Search className="w-3.5 h-3.5" />
						)}
					</button>
				</div>

				{/* Search Panel */}
				{searchOpen && (
					<div className="px-3 pt-3 pb-2 border-b border-border space-y-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
							<input
								ref={searchInputRef}
								type="text"
								value={searchQuery}
								onChange={handleSearchChange}
								placeholder="Search notes..."
								className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
							/>
						</div>

						{/* Search Results */}
						<div className="max-h-[240px] overflow-y-auto -mx-1">
							{searching && (
								<p className="px-2 py-2 text-[11px] text-muted-foreground italic">
									Searching...
								</p>
							)}
							{!searching && searched && searchResults.length === 0 && (
								<p className="px-2 py-3 text-[11px] text-muted-foreground italic text-center">
									Tidak ada catatan ditemukan
								</p>
							)}
							{!searching && searchResults.length > 0 && (
								<nav className="space-y-0.5">
									{searchResults.map((result) => (
										<Link
											key={result.id}
											to="/$noteId"
											params={{ noteId: result.id }}
											onClick={() => {
												setSearchOpen(false);
												setSearchQuery("");
												setSearchResults([]);
												setSearched(false);
											}}
											className="block px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
										>
											<p className="text-xs font-medium text-foreground truncate group-hover:text-foreground">
												{result.title || "Untitled"}
											</p>
											{result.snippet && (
												<p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
													{result.snippet}
												</p>
											)}
										</Link>
									))}
								</nav>
							)}
						</div>
					</div>
				)}

				{/* Create Button Container */}
				<div className="p-3">
					<Button
						onClick={handleCreateDraft}
						className="w-full h-8.5 flex items-center justify-center gap-2 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all border border-transparent shadow-xs cursor-pointer"
					>
						<Plus className="w-3.5 h-3.5" />
						New Note
					</Button>
				</div>

				{/* Notes List Container */}
				<div className="flex-1 overflow-y-auto px-2 py-2 space-y-6">
					<div>
						<div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
							Notes
						</div>
						{notes.length === 0 ? (
							<div className="px-3 py-3 text-xs text-muted-foreground/75 italic">
								No notes yet
							</div>
						) : (
							<nav className="space-y-0.5">
								{notes.map((note) => (
									<Link
										key={note.id}
										to="/$noteId"
										params={{ noteId: note.id }}
										activeProps={{
											className:
												"bg-zinc-200/60 dark:bg-zinc-800/60 text-foreground font-semibold border-l-2 border-primary",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground",
										}}
										className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100 group border-l-2 border-transparent"
									>
										<FileText className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
										<span className="truncate flex-1">
											{note.title || "Untitled"}
										</span>
									</Link>
								))}
							</nav>
						)}
					</div>
				</div>

				{/* Footer Options (Settings, Trash, Logout) */}
				<div className="p-2.5 border-t border-border bg-zinc-100/40 dark:bg-zinc-900/10 space-y-0.5">
					<Link
						to="/trash"
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
						to="/settings"
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
					<button
						type="button"
						onClick={handleSignOut}
						className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-all duration-100 text-left cursor-pointer"
					>
						<LogOut className="w-3.5 h-3.5" />
						<span>Sign Out</span>
					</button>
				</div>
			</aside>

			{/* Main Content Pane */}
			<main className="flex-1 flex flex-col overflow-hidden bg-background">
				<Outlet />
			</main>
		</div>
	);
}
