import LiveCamPage from '@/pages/app/LiveCamPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: () => <LiveCamPage/>
})