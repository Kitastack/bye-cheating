import UsersPage from '@/pages/app/UsersPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/users')({
  component: () => <UsersPage/>
})