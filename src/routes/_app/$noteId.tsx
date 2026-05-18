import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$noteId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Specific Note</div>;
}
