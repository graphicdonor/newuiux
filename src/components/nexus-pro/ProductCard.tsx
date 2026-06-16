'use client'

/**
 * ProductCard — 3D perspective tilt card for CHAIYA tea editions.
 * Uses only transform + opacity for all state transitions (no layout thrashing).
 * Touch targets ≥44px. Focus-visible ring for keyboard nav.
 */

import { useRef, type MouseEvent } from 'react'

export interface ProductData {
  id: string
  edition: string        // e.g. "Jade White"
  tagline: string        // e.g. "Dawn Blend"
  description: string
  price: string
  accentHex: string      // main accent colour
  glowRgba: string       // ambient glow colour
  canisterMid: string    // canister body mid-tone (CSS rgba)
  canisterBase: string   // canister body shadow tone (CSS rgba)
}

export const PRODUCTS: ProductData[] = [
  {
    id: 'jade',
    edition: 'Jade White',
    tagline: 'Dawn Blend',
    description:
      'First-harvest Darjeeling white tips, kissed with fresh jasmine blossoms at dawn. Luminous, floral, weightless.',
    price: '$48',
    accentHex: '#b8d4a0',
    glowRgba: 'rgba(150,200,110,0.20)',
    canisterMid: 'rgba(38,58,24,0.95)',
    canisterBase: 'rgba(20,32,14,0.96)',
  },
  {
    id: 'amber',
    edition: 'Amber Oolong',
    tagline: 'Liquid Gold',
    description:
      'High-mountain Wuyi rock oolong, roasted over Fujian charcoal for 18 hours. Honeyed, mineral, bold.',
    price: '$68',
    accentHex: '#c8a96e',
    glowRgba: 'rgba(200,168,100,0.22)',
    canisterMid: 'rgba(55,40,16,0.95)',
    canisterBase: 'rgba(28,20,8,0.96)',
  },
  {
    id: 'puerh',
    edition: 'Midnight Pu-erh',
    tagline: 'Dark Forest',
    description:
      'Aged 12 years in Yunnan caves. This pu-erh carries the memory of ancient mountains. Deep, earthy, timeless.',
    price: '$55',
    accentHex: '#8aaa78',
    glowRgba: 'rgba(90,130,80,0.20)',
    canisterMid: 'rgba(28,44,22,0.96)',
    canisterBase: 'rgba(14,22,12,0.97)',
  },
]

// ─── 3D tilt constants ──────────────────────────────────────────────────────
const MAX_TILT = 15
const SCALE_UP = 1.04

export default function ProductCard({ product }: { product: ProductData }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const px = (e.clientX - left) / width
    const py = (e.clientY - top)  / height
    const rotX = -(py - 0.5) * MAX_TILT
    const rotY =  (px - 0.5) * MAX_TILT
    el.style.transform =
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${SCALE_UP},${SCALE_UP},${SCALE_UP})`
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${px * 100}% ${py * 100}%, ${product.glowRgba} 0%, transparent 65%)`
    }
  }

  const onMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (glowRef.current) glowRef.current.style.background = 'none'
  }

  return (
    <div
      ref={cardRef}
      role="article"
      aria-label={`${product.edition} — ${product.tagline}`}
      className="relative w-full max-w-[300px] cursor-pointer select-none"
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.38s cubic-bezier(0.17,0.67,0.5,1.1)',
        willChange: 'transform',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Card surface ── */}
      <div
        className="relative overflow-hidden rounded-[22px] border border-white/[0.08]"
        style={{
          background:
            'linear-gradient(150deg, rgba(16,14,8,0.94) 0%, rgba(8,7,3,0.97) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow:
            '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Follow-glow */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[22px] transition-all duration-200"
        />
        {/* Top accent line */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${product.accentHex}66, transparent)`,
          }}
        />

        {/* ── Tea Canister Visual ── */}
        <div className="relative flex h-52 items-center justify-center overflow-hidden px-8 pt-6">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 65%, ${product.glowRgba.replace('0.20', '0.10').replace('0.22', '0.10')} 0%, transparent 70%)`,
            }}
          />

          {/* Canister */}
          <div
            className="relative"
            style={{ filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.55))' }}
          >
            <div className="relative h-[128px] w-[82px]">

              {/* ── Cap ellipse ── */}
              <div
                className="absolute inset-x-0 top-0 z-10 h-[22px] rounded-full"
                style={{
                  background: `linear-gradient(180deg, ${product.accentHex}88 0%, ${product.canisterBase} 100%)`,
                  border: `1px solid ${product.accentHex}99`,
                  boxShadow: `0 -3px 12px ${product.accentHex}44`,
                }}
              />

              {/* ── Body ── */}
              <div
                className="absolute inset-x-0 top-[11px] bottom-0 overflow-hidden rounded-[3px]"
                style={{
                  background: `linear-gradient(90deg, rgba(6,5,2,0.99) 0%, ${product.canisterMid} 38%, ${product.canisterMid} 62%, rgba(5,4,1,0.99) 100%)`,
                  border: `1px solid ${product.accentHex}44`,
                }}
              >
                {/* Highlight */}
                <div
                  aria-hidden
                  className="absolute left-[18%] top-0 bottom-0 w-3 opacity-[0.07]"
                  style={{ background: 'linear-gradient(90deg, transparent, white, transparent)' }}
                />
                {/* Band lines */}
                <div
                  className="absolute inset-x-0 top-[29%] h-px"
                  style={{ background: `${product.accentHex}30` }}
                />
                <div
                  className="absolute inset-x-0 bottom-[27%] h-px"
                  style={{ background: `${product.accentHex}30` }}
                />
                {/* Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="h-px w-7 rounded-full" style={{ background: `${product.accentHex}55` }} />
                  <p
                    className="font-cinzel text-[7px] font-semibold uppercase tracking-[0.36em]"
                    style={{ color: `${product.accentHex}88` }}
                  >
                    Chaiya
                  </p>
                  <div className="h-px w-7 rounded-full" style={{ background: `${product.accentHex}55` }} />
                </div>
              </div>
            </div>

            {/* Glow puddle */}
            <div
              aria-hidden
              className="absolute -bottom-3 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full blur-xl"
              style={{ background: product.glowRgba }}
            />
          </div>
        </div>

        {/* ── Copy ── */}
        <div className="px-6 pb-6 pt-4">
          <p
            className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: product.accentHex }}
          >
            {product.tagline}
          </p>
          <h3 className="mb-3 text-[18px] font-semibold leading-snug text-white">
            {product.edition}
          </h3>
          <p className="mb-5 text-[14px] leading-relaxed text-white/45">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[17px] font-medium text-white">{product.price}</span>
            <button
              className="min-h-[44px] rounded-full border border-white/[0.14] px-4 text-[13px] font-medium text-white/60 transition-all duration-200 hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:scale-95"
              aria-label={`Order ${product.edition} tea`}
            >
              Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
