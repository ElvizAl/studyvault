import { Link, useNavigate } from "@tanstack/react-router";
import { Settings, Trash2, LogOut } from "lucide-react";

interface SidebarFooterProps {
	user?: {
		name?: string | null;
		email?: string | null;
	} | null;
}

export function SidebarFooter({ user }: SidebarFooterProps) {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			// Call sign out API
			const response = await fetch("/api/auth/signout", { method: "POST" });
			if (response.ok) {
				navigate({ to: "/login" });
			}
		} catch (error) {
			console.error("Sign out failed:", error);
		}
	};

	return (
		<div className="p-2.5 border-t border-border bg-zinc-100/40 dark:bg-zinc-900/10 space-y-2">
			{/* User Account Section */}
			{user && (
				<div className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
					<p className="text-xs font-semibold text-foreground truncate">
						{user.name || "User"}
					</p>
					<p className="text-[11px] text-muted-foreground truncate">
						{user.email || ""}
					</p>
				</div>
			)}

			{/* Navigation Links */}
			<div className="space-y-0.5">
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
				<button
					type="button"
					onClick={handleSignOut}
					className="w-full flex items-center gap-2.5 px-3 cursor-pointer py-2 rounded-lg text-xs font-medium transition-colors text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground"
				>
					<LogOut className="w-3.5 h-3.5" />
					<span>Sign Out</span>
				</button>
			</div>
		</div>
	);
}
