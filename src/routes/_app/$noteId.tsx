import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$noteId")({
	loader: async ({ params }) => {
		// TODO: Replace with actual database/API check
		// This simulates throwing a 404 if the note doesn't exist.
		// For now, if the user types something like /non-existent, we throw 404.
		// If you have a specific ID format (like UUID), you can validate it here.
		if (params.noteId === "non-existent" || params.noteId === "test-404") {
			throw notFound();
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Specific Note</div>;
}
