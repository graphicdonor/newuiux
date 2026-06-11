'use client'
import dynamic from 'next/dynamic'
import CursorGlow       from '@/components/fantasy/CursorGlow'
import RitualsSection   from '@/components/fantasy/RitualsSection'

const HeroSection = dynamic(
  () => import('@/components/fantasy/HeroSection'),
  { ssr: false, loading: () => <div className="min-h-screen" style={{ background: '#030610' }} /> }
)

export default function FantasyPage() {
  return (
    <>
      <CursorGlow />

      {/* ── Minimal nav ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-7 py-5">
        <a
          href="/"
          className="text-[10px] tracking-[0.4em] uppercase transition-colors duration-300"
          style={{ color: 'rgba(212,160,23,0.50)' }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(212,160,23,0.85)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(212,160,23,0.50)')}
        >
          ← Return
        </a>

        <span
          className="font-cinzel text-[11px] tracking-[0.5em] uppercase pointer-events-none"
          style={{ color: 'rgba(212,160,23,0.40)' }}
        >
          Arcane Codex
        </span>

        <a
          href="#rituals"
          className="text-[10px] tracking-[0.4em] uppercase transition-colors duration-300"
          style={{ color: 'rgba(255,255,255,0.30)' }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.30)')}
        >
          Rituals
        </a>
      </nav>

      <main style={{ background: '#030610', overflowX: 'hidden' }}>
        <HeroSection />
        <div id="rituals">
          <RitualsSection />
        </div>

        {/* Footer */}
        <footer
          className="text-center py-12 px-6"
          style={{ borderTop: '1px solid rgba(212,160,23,0.08)' }}
        >
          <p
            className="text-[9px] tracking-[0.55em] uppercase"
            style={{ color: 'rgba(212,160,23,0.25)' }}
          >
            ✦ &nbsp; The Book of Ancient Rites &nbsp; ✦
          </p>
        </footer>
      </main>
    </>
  )
}
