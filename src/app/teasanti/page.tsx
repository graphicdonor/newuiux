'use client'
import dynamic from 'next/dynamic'
import NavBar               from '@/components/teasanti/NavBar'
import CollectionSection    from '@/components/teasanti/CollectionSection'
import RitualSection        from '@/components/teasanti/RitualSection'
import SubscriptionSection  from '@/components/teasanti/SubscriptionSection'

const HeroSection = dynamic(
  () => import('@/components/teasanti/HeroSection'),
  { ssr: false, loading: () => <div className="min-h-screen" style={{ background: '#0D1F1A' }} /> }
)

export default function TeaSantiPage() {
  return (
    <div style={{ background: '#0D1F1A', overflowX: 'hidden' }}>
      <NavBar />

      <HeroSection />
      <CollectionSection />
      <RitualSection />
      <SubscriptionSection />

      {/* Footer */}
      <footer
        className="py-14 px-6 text-center"
        style={{ borderTop: '1px solid rgba(212,180,131,0.08)', background: '#070e0b' }}
      >
        <p className="font-cinzel text-sm tracking-[0.28em] mb-3" style={{ color: 'rgba(212,180,131,0.45)' }}>
          TeaSanti
        </p>
        <p className="text-[9px] tracking-[0.45em] uppercase" style={{ color: 'rgba(248,244,237,0.20)' }}>
          Single Origin · Sustainably Sourced · Hand-Picked at Sunrise
        </p>
        <div className="flex justify-center gap-8 mt-6">
          {['Privacy', 'Terms', 'Shipping', 'Contact'].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[9px] tracking-[0.35em] uppercase transition-colors duration-300"
              style={{ color: 'rgba(248,244,237,0.22)' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(212,180,131,0.60)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(248,244,237,0.22)')}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
