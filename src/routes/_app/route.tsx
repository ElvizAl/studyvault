import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { requireSessionFn } from "@/modules/auth/auth.api";

export const Route = createFileRoute("/_app")({
	beforeLoad: async () => {
		const session = await requireSessionFn();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
	},
	component: RouteComponent,
});
function RouteComponent() {
	return (
		<div>
			<div>Sidebar</div>
			<Outlet />
			<div>AI Sidebar</div>
		</div>
	);
}
