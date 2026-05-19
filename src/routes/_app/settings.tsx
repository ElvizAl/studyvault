import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/shared/lib/auth-client";

export const Route = createFileRoute("/_app/settings")({
	component: RouteComponent,
});

function RouteComponent() {
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
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Settings</h1>
			<div className="bg-white/5 border border-white/10 rounded-xl p-6">
				<h2 className="text-xl font-semibold mb-2">Account</h2>
				<p className="text-white/60 mb-6">
					Manage your account settings and preferences.
				</p>
				<Button variant="destructive" onClick={handleSignOut}>
					Sign Out
				</Button>
			</div>
		</div>
	);
}
