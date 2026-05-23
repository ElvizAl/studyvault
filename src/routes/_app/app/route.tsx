import {
	createFileRoute,
	Outlet,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { requireSessionFn } from "@/modules/auth/auth.api";
import { getNotesFn, searchNotesFn } from "@/modules/note/note.api";
import {
	getNotebooksFn,
	createNotebookFn,
} from "@/modules/notebook/notebook.api";
import { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "@/shared/components/sidebar/sidebar";
import { PanelLeftOpen } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/app")({
	beforeLoad: async () => {
		const session = await requireSessionFn();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
	},
	loader: async () => {
		const [notes, notebooks] = await Promise.all([
			getNotesFn(),
			getNotebooksFn(),
		]);
		return { notes, notebooks };
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
	const { notes, notebooks: initialNotebooks } = Route.useLoaderData();
	const navigate = useNavigate();

	// Sidebar collapse state (lifted up so editor can expand)
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	// Notebook management state
	const [notebooks, setNotebooks] = useState(initialNotebooks);
	const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false);
	const [notebookName, setNotebookName] = useState("");
	const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);

	// Search state
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [_searching, setSearching] = useState(false);
	const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

	const handleCreateNote = (notebookId?: string | null) => {
		navigate({
			to: "/app/new",
			search: { notebookId: notebookId ?? undefined },
		});
	};

	const handleCreateNotebook = () => {
		setIsCreateNotebookOpen(true);
		setNotebookName("");
	};

	const handleSubmitCreateNotebook = async () => {
		if (!notebookName.trim()) return;

		setIsCreatingNotebook(true);
		try {
			const newNotebook = await createNotebookFn({
				data: { name: notebookName.trim() },
			});
			setNotebooks([...notebooks, { ...newNotebook, notes: [] }]);
			setIsCreateNotebookOpen(false);
			setNotebookName("");
		} catch (error) {
			console.error("Failed to create notebook:", error);
		} finally {
			setIsCreatingNotebook(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmitCreateNotebook();
		} else if (e.key === "Escape") {
			setIsCreateNotebookOpen(false);
		}
	};

	const handleSearch = useCallback(async (query: string) => {
		if (query.trim().length === 0) {
			setSearchResults([]);
			return;
		}
		setSearching(true);
		try {
			const results = await searchNotesFn({ data: { query: query.trim() } });
			setSearchResults(results as SearchResult[]);
		} catch {
			setSearchResults([]);
		} finally {
			setSearching(false);
		}
	}, []);

	const handleSearchChange = useCallback(
		(query: string) => {
			if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

			if (query.trim().length === 0) {
				setSearchResults([]);
				return;
			}

			searchDebounceRef.current = setTimeout(() => {
				handleSearch(query);
			}, 500);
		},
		[handleSearch],
	);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
		};
	}, []);

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
			<Sidebar
				notebooks={notebooks}
				notes={notes}
				onCreateNote={handleCreateNote}
				onCreateNotebook={handleCreateNotebook}
				onSearch={handleSearchChange}
				searchResults={searchResults}
				isCollapsed={isSidebarCollapsed}
				onToggleCollapse={() => setIsSidebarCollapsed(true)}
			/>

			{/* Main Content Pane */}
			<main className="flex-1 flex flex-col overflow-hidden bg-background relative">
				{/* Expand sidebar button — shown only when sidebar is collapsed */}
				{isSidebarCollapsed && (
					<button
						type="button"
						onClick={() => setIsSidebarCollapsed(false)}
						title="Expand sidebar"
						className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground transition-colors cursor-pointer shadow-sm"
					>
						<PanelLeftOpen className="w-4 h-4" />
					</button>
				)}
				<Outlet />
			</main>

			{/* Create Notebook Dialog */}
			<Dialog
				open={isCreateNotebookOpen}
				onOpenChange={setIsCreateNotebookOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Notebook</DialogTitle>
						<DialogDescription>
							Enter a name for your new notebook
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							placeholder="Notebook name..."
							value={notebookName}
							onChange={(e) => setNotebookName(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={isCreatingNotebook}
							autoFocus
						/>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setIsCreateNotebookOpen(false)}
								disabled={isCreatingNotebook}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSubmitCreateNotebook}
								disabled={isCreatingNotebook || !notebookName.trim()}
							>
								{isCreatingNotebook ? "Creating..." : "Create"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
