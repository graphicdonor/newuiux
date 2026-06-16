import type { Metadata } from 'next'
import NexusProPage from '@/components/nexus-pro/NexusProPage'

export const metadata: Metadata = {
  title: 'CHAIYA — Ancient Wisdom. Modern Ritual.',
  description:
    'Introducing CHAIYA. Three exceptional teas sourced from ancient gardens. Jade White, Amber Oolong, Midnight Pu-erh. Every steep, perfected.',
}

export default function NexusProRoute() {
  return <NexusProPage />
}
