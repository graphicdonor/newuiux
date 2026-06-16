import type { Metadata } from 'next'
import NexusProPage from '@/components/nexus-pro/NexusProPage'

export const metadata: Metadata = {
  title: 'Teasanti — Ancient Wisdom. Modern Ritual.',
  description:
    'Six exceptional teas sourced from the world\'s finest gardens. Jade White, Amber Oolong, Midnight Pu-erh, Silver Needle, Dragon Well, Rose Oolong. From $48.',
}

export default function NexusProRoute() {
  return <NexusProPage />
}
