import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { requireSessionFn } from "@/modules/auth/auth.api";
import { getNotesFn } from "@/modules/note/note.api";
import { Plus, Trash2, Settings, FileText, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/shared/lib/auth-client";

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

function RouteComponent() {
	const { notes } = Route.useLoaderData();
	const router = useRouter();
	const navigate = useNavigate();

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

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0c1418] via-[#0f1d22] to-[#0a1418] text-white">
			{/* Left Sidebar - 280px */}
			<aside className="w-[280px] flex flex-col border-r border-white/5 bg-white/[0.02] backdrop-blur-md">
				{/* Header / Brand */}
				<div className="p-5 border-b border-white/5 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#4fb8b2]/20 to-[#2f6a4a]/20 border border-[#4fb8b2]/30">
							<FileText className="w-4 h-4 text-[#4fb8b2]" />
						</div>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#d7ece8] to-[#60d7cf]">
							StudyVault AI
						</span>
					</Link>
				</div>

				{/* Create Button */}
				<div className="p-4">
					<Button
						onClick={handleCreateDraft}
						className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4fb8b2] to-[#2f6a4a] hover:from-[#60d7cf] hover:to-[#6ec89a] text-white font-semibold shadow-lg shadow-[#4fb8b2]/10 border border-white/10 rounded-xl transition-all duration-200"
					>
						<Plus className="w-4 h-4" />
						New Note
					</Button>
				</div>

				{/* Navigation Lists */}
				<div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
					<div>
						<div className="px-3 mb-2 text-xs font-semibold tracking-wider text-white/30 uppercase">
							Notes
						</div>
						{notes.length === 0 ? (
							<div className="px-3 py-4 text-sm text-white/40 italic">
								No notes yet. Create one!
							</div>
						) : (
							<nav className="space-y-1">
								{notes.map((note) => (
									<Link
										key={note.id}
										to="/$noteId"
										params={{ noteId: note.id }}
										activeProps={{ className: "bg-white/10 text-white border-l-2 border-[#4fb8b2]" }}
										inactiveProps={{ className: "text-white/60 hover:bg-white/[0.04] hover:text-white" }}
										className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group border-l-2 border-transparent"
									>
										<FileText className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
										<span className="truncate flex-1">{note.title || "Untitled"}</span>
									</Link>
								))}
							</nav>
						)}
					</div>
				</div>

				{/* Footer Links (Settings, Trash) */}
				<div className="p-3 border-t border-white/5 bg-white/[0.01] space-y-1">
					<Link
						to="/trash"
						activeProps={{ className: "bg-white/10 text-white" }}
						inactiveProps={{ className: "text-white/60 hover:bg-white/[0.04]" }}
						className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150"
					>
						<Trash2 className="w-4 h-4" />
						<span>Trash</span>
					</Link>
					<Link
						to="/settings"
						activeProps={{ className: "bg-white/10 text-white" }}
						inactiveProps={{ className: "text-white/60 hover:bg-white/[0.04]" }}
						className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150"
					>
						<Settings className="w-4 h-4" />
						<span>Settings</span>
					</Link>
					<button
						onClick={handleSignOut}
						className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-150 text-left"
					>
						<LogOut className="w-4 h-4" />
						<span>Sign Out</span>
					</button>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#0c1418] to-[#0f1d22]">
				<Outlet />
			</main>
		</div>
	);
}
