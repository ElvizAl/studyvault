import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NotFoundComponent } from '../notFoundComponent'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>Sidebar</div>
      <Outlet />
      <div>AI Sidebar</div>
    </div>
  )
}
