import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/profile')({
  component: () => <div>Hello /app/profile!</div>
})