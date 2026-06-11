import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Showcase from '@/components/Showcase'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <main className="relative bg-[#020008]">
      <Navigation />
      <Hero />
      <div className="divider-glow" />
      <Features />
      <div className="divider-glow" />
      <Showcase />
      <div className="divider-glow" />
      <Testimonials />
      <div className="divider-glow" />
      <CTA />
    </main>
  )
}
