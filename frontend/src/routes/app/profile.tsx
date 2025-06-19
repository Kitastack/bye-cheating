import { ProfilePage } from '@/pages/app/ProfilePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/profile')({
  component: () => <ProfilePage/>
})