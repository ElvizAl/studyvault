import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { requireSessionFn } from "@/modules/auth/auth.api";
import { Settings, LogOut, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/shared/lib/auth-client";

export const Route = createFileRoute("/_app/settings")({
	beforeLoad: async () => {
		const session = await requireSessionFn();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
		return { session };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const router = useRouter();

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
		<div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
			{/* Top Bar */}
			<header className="h-14 border-b border-border px-6 flex items-center bg-card">
				<div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
					<Settings className="w-3.5 h-3.5 text-zinc-500" />
					<span>Settings</span>
				</div>
			</header>

			{/* Content Area */}
			<div className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-2xl w-full mx-auto space-y-6">
				<div className="border border-border rounded-xl bg-card p-6 space-y-6 shadow-xs">
					<div>
						<h3 className="font-semibold text-base text-foreground">
							General Profile
						</h3>
						<p className="text-muted-foreground text-xs mt-0.5">
							Manage your personal user preferences and active session state.
						</p>
					</div>

					<div className="flex items-center gap-3.5 p-4 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20 border border-border">
						<div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center shrink-0">
							<User className="w-5 h-5 text-muted-foreground" />
						</div>
						<div className="space-y-0.5 min-w-0">
							<p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
								Active Email Account
							</p>
							<p className="text-foreground font-medium text-xs truncate">
								{session.user.email}
							</p>
						</div>
					</div>

					<div className="pt-4 border-t border-border flex justify-end">
						<Button
							onClick={handleSignOut}
							variant="destructive"
							className="flex items-center gap-2 h-8 px-4 text-xs font-medium rounded-lg cursor-pointer"
						>
							<LogOut className="w-3.5 h-3.5" />
							Sign Out of Session
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
