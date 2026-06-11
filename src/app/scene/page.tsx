'use client'
import dynamic from 'next/dynamic'

const CinematicScene = dynamic(
  () => import('@/components/canvas/cinematic/CinematicScene'),
  { ssr: false }
)

export default function ScenePage() {
  return (
    <main className="fixed inset-0 bg-[#020008] overflow-hidden">
      {/* Full-screen 3D canvas */}
      <CinematicScene />

      {/* ── HUD overlay ────────────────────────────────────────────────── */}

      {/* Back link */}
      <a
        href="/"
        className="absolute top-7 left-7 z-10 flex items-center gap-2.5 group"
      >
        <span className="text-white/18 group-hover:text-white/55 transition-colors duration-300 text-xs tracking-[0.4em] uppercase">
          ← Return
        </span>
      </a>

      {/* Title */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="font-cinzel text-[10px] tracking-[0.55em] uppercase text-white/20">
          Cinematic Scene
        </p>
      </div>

      {/* Feature labels — bottom-left */}
      <div className="absolute bottom-8 left-7 z-10 pointer-events-none space-y-1.5">
        {[
          '10 000 animated particles',
          '240 instanced flowers',
          'Firefly system · Volumetric fog',
          'Bloom · Depth of field · Vignette',
        ].map((label) => (
          <p key={label} className="text-[9px] tracking-[0.3em] uppercase text-white/18">
            {label}
          </p>
        ))}
      </div>

      {/* Move cursor hint */}
      <div className="absolute bottom-8 right-7 z-10 pointer-events-none">
        <p className="text-[9px] tracking-[0.35em] uppercase text-white/18">
          Move cursor to parallax
        </p>
      </div>
    </main>
  )
}
