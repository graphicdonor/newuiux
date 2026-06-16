'use client'

import { useRef, type MouseEvent } from 'react'

export interface ProductData {
  id          : string
  edition     : string
  tagline     : string
  description : string
  price       : string
  accentHex   : string
  glowRgba    : string
  canisterMid : string
  canisterBase: string
  category    : string
}

export const PRODUCTS: ProductData[] = [
  {
    id          : 'jade',
    edition     : 'Jade White',
    tagline     : 'Dawn Blend',
    category    : 'White Tea',
    description : 'First-harvest Darjeeling white tips, kissed with fresh jasmine at dawn. Luminous, floral, weightless.',
    price       : '$48',
    accentHex   : '#b8d4a0',
    glowRgba    : 'rgba(150,200,110,0.20)',
    canisterMid : 'rgba(38,58,24,0.95)',
    canisterBase: 'rgba(20,32,14,0.96)',
  },
  {
    id          : 'amber',
    edition     : 'Amber Oolong',
    tagline     : 'Liquid Gold',
    category    : 'Oolong',
    description : 'High-mountain Wuyi rock oolong, roasted over Fujian charcoal for 18 hours. Honeyed, mineral, bold.',
    price       : '$68',
    accentHex   : '#c8a96e',
    glowRgba    : 'rgba(200,168,100,0.22)',
    canisterMid : 'rgba(55,40,16,0.95)',
    canisterBase: 'rgba(28,20,8,0.96)',
  },
  {
    id          : 'puerh',
    edition     : 'Midnight Pu-erh',
    tagline     : 'Dark Forest',
    category    : 'Pu-erh',
    description : 'Aged 12 years in Yunnan caves. Carries the memory of ancient mountains. Deep, earthy, timeless.',
    price       : '$55',
    accentHex   : '#8aaa78',
    glowRgba    : 'rgba(90,130,80,0.20)',
    canisterMid : 'rgba(28,44,22,0.96)',
    canisterBase: 'rgba(14,22,12,0.97)',
  },
  {
    id          : 'silver',
    edition     : 'Silver Needle',
    tagline     : 'Pearl White',
    category    : 'White Tea',
    description : 'The rarest Chinese white tea — only unopened buds, hand-plucked during a 48-hour spring window. Silky, sweet, ethereal.',
    price       : '$85',
    accentHex   : '#d4d8cc',
    glowRgba    : 'rgba(210,215,200,0.18)',
    canisterMid : 'rgba(48,52,42,0.95)',
    canisterBase: 'rgba(24,26,20,0.97)',
  },
  {
    id          : 'dragon',
    edition     : 'Dragon Well',
    tagline     : 'Spring Harvest',
    category    : 'Green Tea',
    description : 'Hangzhou Longjing pressed flat by iron woks and weathered palms. Grassy, nutty, perfectly vegetal.',
    price       : '$52',
    accentHex   : '#7dbb7d',
    glowRgba    : 'rgba(100,180,100,0.20)',
    canisterMid : 'rgba(22,50,22,0.95)',
    canisterBase: 'rgba(10,26,10,0.97)',
  },
  {
    id          : 'rose',
    edition     : 'Rose Oolong',
    tagline     : 'Bloom Edition',
    category    : 'Oolong',
    description : 'High-mountain Taiwanese oolong scented with Damask rose petals over three nights. Floral, creamy, unforgettable.',
    price       : '$72',
    accentHex   : '#c8969b',
    glowRgba    : 'rgba(200,140,150,0.20)',
    canisterMid : 'rgba(52,22,28,0.95)',
    canisterBase: 'rgba(26,10,14,0.97)',
  },
]

const MAX_TILT = 14
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
    const rx = -(py - 0.5) * MAX_TILT
    const ry =  (px - 0.5) * MAX_TILT
    el.style.transform =
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${SCALE_UP},${SCALE_UP},${SCALE_UP})`
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${px * 100}% ${py * 100}%, ${product.glowRgba} 0%, transparent 65%)`
    }
  }

  const onMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (glowRef.current) glowRef.current.style.background = 'none'
  }

  return (
    <div
      ref={cardRef}
      role="article"
      aria-label={`${product.edition} — ${product.tagline}`}
      className="relative w-full cursor-pointer select-none"
      style={{
        transformStyle: 'preserve-3d',
        transition    : 'transform 0.36s cubic-bezier(0.17,0.67,0.5,1.1)',
        willChange    : 'transform',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-[20px] border border-white/[0.07]"
        style={{
          background  : 'linear-gradient(150deg, rgba(16,14,8,0.94) 0%, rgba(8,7,3,0.97) 100%)',
          backdropFilter        : 'blur(24px)',
          WebkitBackdropFilter  : 'blur(24px)',
          boxShadow   : '0 20px 52px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div ref={glowRef} aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] transition-all duration-200" />

        {/* Top accent line */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${product.accentHex}55, transparent)` }} />

        {/* Category badge */}
        <div className="absolute right-4 top-4 z-10">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]"
            style={{ background: `${product.accentHex}18`, color: product.accentHex, border: `1px solid ${product.accentHex}33` }}
          >
            {product.category}
          </span>
        </div>

        {/* Canister visual */}
        <div className="relative flex h-44 items-center justify-center overflow-hidden px-6 pt-5 sm:h-48 sm:pt-6">
          <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 65%, ${product.glowRgba.replace(/[\d.]+\)$/, '0.08)')} 0%, transparent 70%)` }} />
          <div className="relative" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))' }}>
            <div className="relative h-[120px] w-[76px]">
              {/* Cap */}
              <div
                className="absolute inset-x-0 top-0 z-10 h-[20px] rounded-full"
                style={{
                  background: `linear-gradient(180deg, ${product.accentHex}77 0%, ${product.canisterBase} 100%)`,
                  border    : `1px solid ${product.accentHex}88`,
                  boxShadow : `0 -2px 10px ${product.accentHex}33`,
                }}
              />
              {/* Body */}
              <div
                className="absolute inset-x-0 top-[10px] bottom-0 overflow-hidden rounded-[3px]"
                style={{
                  background: `linear-gradient(90deg, rgba(6,5,2,0.99) 0%, ${product.canisterMid} 38%, ${product.canisterMid} 62%, rgba(5,4,1,0.99) 100%)`,
                  border    : `1px solid ${product.accentHex}33`,
                }}
              >
                <div aria-hidden className="absolute left-[18%] top-0 bottom-0 w-3 opacity-[0.06]" style={{ background: 'linear-gradient(90deg, transparent, white, transparent)' }} />
                <div className="absolute inset-x-0 top-[28%] h-px" style={{ background: `${product.accentHex}28` }} />
                <div className="absolute inset-x-0 bottom-[26%] h-px" style={{ background: `${product.accentHex}28` }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="h-px w-6 rounded-full" style={{ background: `${product.accentHex}44` }} />
                  <p className="font-cinzel text-[7px] font-semibold uppercase tracking-[0.3em]" style={{ color: `${product.accentHex}77` }}>
                    Teasanti
                  </p>
                  <div className="h-px w-6 rounded-full" style={{ background: `${product.accentHex}44` }} />
                </div>
              </div>
            </div>
            <div aria-hidden className="absolute -bottom-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full blur-xl" style={{ background: product.glowRgba }} />
          </div>
        </div>

        {/* Copy */}
        <div className="px-5 pb-5 pt-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: product.accentHex }}>
            {product.tagline}
          </p>
          <h3 className="mb-2.5 text-[17px] font-semibold leading-snug text-white">{product.edition}</h3>
          <p className="mb-4 text-[13px] leading-relaxed text-white/40">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-[16px] font-medium text-white">{product.price}</span>
            <button
              className="min-h-[44px] rounded-full border border-white/[0.13] px-4 text-[13px] font-medium text-white/55 transition-all duration-200 hover:border-white/28 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 active:scale-95"
              aria-label={`Add ${product.edition} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
