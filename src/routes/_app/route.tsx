import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
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
