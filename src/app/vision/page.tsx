import type { Metadata } from 'next'
import VisionNav from '@/components/vision/VisionNav'
import VisionHero from '@/components/vision/VisionHero'
import VisionStatement from '@/components/vision/VisionStatement'
import VisionFeatures from '@/components/vision/VisionFeatures'
import VisionGrid from '@/components/vision/VisionGrid'
import VisionSpecs from '@/components/vision/VisionSpecs'
import VisionCTA from '@/components/vision/VisionCTA'

export const metadata: Metadata = {
  title: 'NEXUS ONE — Spatial Computing, Redefined',
  description:
    'Introducing NEXUS ONE. An infinite canvas. A display so expansive and so detailed, it will feel like you are standing right there. From $3,499.',
}

export default function VisionPage() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      <VisionNav />
      <VisionHero />
      <VisionStatement />
      <VisionFeatures />
      <VisionGrid />
      <VisionSpecs />
      <VisionCTA />
    </main>
  )
}
