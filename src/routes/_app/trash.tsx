import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/trash')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Trash</div>
}
