'use client'

/**
 * CHAIYA Tea — cinematic scroll-driven landing page.
 *
 * ┌─ SCROLL TIMELINE MAP (pinned = 500vh of travel) ─────────────────────────┐
 * │                                                                            │
 * │  tl pos  0.0 → 1.8  PHASE 1 – Canister scales up + title fades out       │
 * │  tl pos  1.6 → 2.1  Canvas fades in                                       │
 * │  tl pos  1.8 → 4.2  Particle proxy 0→1 (explosion 0→0.5, converge 0.5→1) │
 * │  tl pos  2.0 → 2.6  Side-texts slide in                                   │
 * │  tl pos  3.6 → 4.0  Product grid fades in                                 │
 * │  tl pos  3.8 → 4.2  Canvas + side-texts fade out                          │
 * │  tl pos  4.2 → 5.2  Empty hold (grid stays)                               │
 * │                                                                            │
 * │  CTA  (separate ScrollTrigger, pinned = 120vh)                            │
 * │    0→0.5  Background glow blooms                                           │
 * │    0.2→1  Title, sub, button stagger in                                    │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * Canvas particles palette: aged gold · sage green · cream · bark brown
 *   state 0   →  canister silhouette ring
 *   state 0.5 →  tea-leaf burst (radial explosion)
 *   state 1   →  three column clusters (card zones)
 *
 * Lenis + GSAP ticker — buttery scroll.
 * prefers-reduced-motion → all JS animations disabled gracefully.
 */

import { useEffect, useRef } from 'react'
import gsap                   from 'gsap'
import { ScrollTrigger }      from 'gsap/ScrollTrigger'
import ProductCard, { PRODUCTS } from './ProductCard'

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// § Particle System
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 420

interface Particle {
  sx: number; sy: number   // silhouette anchor
  ex: number; ey: number   // explosion burst
  gx: number; gy: number   // grid cluster target
  size: number
  alpha: number
  color: string
}

const lerp      = (a: number, b: number, t: number) => a + (b - a) * t
const clamp     = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const easeOut3  = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut3 = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function buildParticles(w: number, h: number): Particle[] {
  const cx = w * 0.5
  const cy = h * 0.5

  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2

    // ── Silhouette: canister outline (tall ellipses) ───────────────────────
    const ring = i % 3
    // Tall ring ratios to evoke a cylindrical canister
    const rx = ring === 0 ? 32 : ring === 1 ? 56 : 18
    const ry = ring === 0 ? 68 : ring === 1 ? 110 : 44
    const jx = (Math.random() - 0.5) * 14
    const jy = (Math.random() - 0.5) * 10
    const sx = cx + Math.cos(angle) * rx + jx
    const sy = cy + Math.sin(angle) * ry + jy

    // ── Explosion: tea-leaf burst ──────────────────────────────────────────
    const burstAngle = angle + (Math.random() - 0.5) * 0.7
    const minR       = Math.min(cx, cy) * 0.22
    const maxR       = Math.min(cx, cy) * 0.94
    const burstR     = minR + Math.random() * (maxR - minR)
    const ex = cx + Math.cos(burstAngle) * burstR
    const ey = cy + Math.sin(burstAngle) * burstR

    // ── Grid cluster: three card zones ────────────────────────────────────
    const zone  = i % 3
    const zoneCx = [cx - w * 0.28, cx, cx + w * 0.28][zone]
    const gx = zoneCx + (Math.random() - 0.5) * 130
    const gy = cy     + (Math.random() - 0.5) * 190

    // ── Tea palette: gold · green · cream · brown ─────────────────────────
    const r = Math.random()
    const a = 0.4 + Math.random() * 0.6
    const color =
      r < 0.46 ? `rgba(200,168,100,${a})`   // aged gold
      : r < 0.70 ? `rgba(110,160,90,${a})`   // sage green
      : r < 0.86 ? `rgba(255,245,210,${a})`  // cream / steam
      :             `rgba(139,94,60,${a})`    // bark brown

    return {
      sx, sy, ex, ey, gx, gy,
      size : Math.random() * 2.0 + 0.5,
      alpha: 0.45 + Math.random() * 0.55,
      color,
    }
  })
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  t: number,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (const p of particles) {
    let x: number, y: number, alpha: number, size: number

    if (t <= 0.5) {
      const p1 = easeOut3(clamp(t / 0.5, 0, 1))
      x     = lerp(p.sx, p.ex, p1)
      y     = lerp(p.sy, p.ey, p1)
      alpha = p.alpha * (0.12 + p1 * 0.88)
      size  = p.size  * (0.35 + p1 * 0.65)
    } else {
      const p2 = easeInOut3(clamp((t - 0.5) / 0.5, 0, 1))
      x     = lerp(p.ex, p.gx, p2)
      y     = lerp(p.ey, p.gy, p2)
      alpha = p.alpha * (1 - p2 * 0.28)
      size  = p.size
    }

    if (size > 1.4) {
      const halo = ctx.createRadialGradient(x, y, 0, x, y, size * 3.5)
      halo.addColorStop(0, p.color)
      halo.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.save()
      ctx.globalAlpha = alpha * 0.35
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(x, y, size * 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// § Component
// ─────────────────────────────────────────────────────────────────────────────

export default function NexusProPage() {
  const wrapRef      = useRef<HTMLDivElement>(null)
  const pinRef       = useRef<HTMLElement>(null)
  const productRef   = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const eyebrowRef   = useRef<HTMLParagraphElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const leftTextRef  = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)
  const gridRef      = useRef<HTMLDivElement>(null)
  const ctaRef       = useRef<HTMLElement>(null)
  const ctaGlowRef   = useRef<HTMLDivElement>(null)
  const ctaTitleRef  = useRef<HTMLHeadingElement>(null)
  const ctaSubRef    = useRef<HTMLParagraphElement>(null)
  const ctaBtnRef    = useRef<HTMLButtonElement>(null)

  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const canvas = canvasRef.current!
    const dpr    = Math.min(window.devicePixelRatio, 2)

    const resizeCanvas = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = `${W}px`
      canvas.style.height = `${H}px`
      canvasCtxRef.current = canvas.getContext('2d')
      canvasCtxRef.current!.scale(dpr, dpr)
      particlesRef.current = buildParticles(W, H)
      if (particlesProxy.t > 0 && canvasCtxRef.current) {
        drawParticles(canvasCtxRef.current, particlesRef.current, particlesProxy.t)
      }
    }

    const particlesProxy = { t: 0 }
    resizeCanvas()

    // ── Lenis smooth scroll ────────────────────────────────────────────────
    let lenis: import('lenis').default | null = null
    ;(async () => {
      try {
        const { default: Lenis } = await import('lenis')
        lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 2,
        })
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time) => lenis!.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)
      } catch { /* native scroll fallback */ }
    })()

    const gsapCtx = gsap.context(() => {

      /* ══════════════════════════════════════════════════════════
       * MAIN PIN TIMELINE — 500vh scroll travel
       * ══════════════════════════════════════════════════════════ */
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger : pinRef.current,
          pin     : true,
          scrub   : 1.8,
          start   : 'top top',
          end     : '+=500%',
          onUpdate: (self) => {
            const raw = self.progress
            const ct  = clamp((raw - 0.32) / (0.80 - 0.32), 0, 1)
            if (ct > 0 && canvasCtxRef.current && particlesRef.current.length) {
              drawParticles(canvasCtxRef.current, particlesRef.current, ct)
            }
          },
        },
      })

      // Phase 1 — canister scales up, hero fades
      mainTl
        .to(eyebrowRef.current,  { opacity: 0, y: -20,  duration: 0.8, ease: 'power2.in' }, 0)
        .to(titleRef.current,    { opacity: 0, y: -60, scale: 0.95, duration: 1.2, ease: 'power2.in' }, 0.1)
        .to(subRef.current,      { opacity: 0, y: -30,  duration: 1.0, ease: 'power2.in' }, 0.15)
        .to(productRef.current,  { scale: 3.8, opacity: 0, duration: 1.8, ease: 'power2.inOut' }, 0)

      // Phase 2 — canvas + side texts
        .to(canvasRef.current,   { opacity: 1, duration: 0.3, ease: 'power1.out' }, 1.6)
        .to(leftTextRef.current, { opacity: 1, x: 0,  duration: 0.55, ease: 'power3.out' }, 2.0)
        .to(rightTextRef.current,{ opacity: 1, x: 0,  duration: 0.55, ease: 'power3.out' }, 2.15)

      // Phase 3 — grid in, canvas + texts out
        .to(gridRef.current,     { opacity: 1, y: 0,  duration: 0.55, ease: 'power2.out' }, 3.6)
        .to(canvasRef.current,   { opacity: 0, duration: 0.35, ease: 'power1.in' }, 3.85)
        .to([leftTextRef.current, rightTextRef.current], { opacity: 0, duration: 0.3, ease: 'power1.in' }, 3.85)

      // Phase 4 — scroll buffer hold
        .to({}, { duration: 0.6 }, 4.8)


      /* ══════════════════════════════════════════════════════════
       * CTA PIN TIMELINE — 120vh scroll travel
       * ══════════════════════════════════════════════════════════ */
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger : ctaRef.current,
          pin     : true,
          scrub   : 1.4,
          start   : 'top top',
          end     : '+=120%',
        },
      })

      ctaTl
        .fromTo(ctaGlowRef.current,
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .fromTo(ctaTitleRef.current,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.25)
        .fromTo(ctaSubRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, 0.42)
        .fromTo(ctaBtnRef.current,
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }, 0.56)

    }, wrapRef)

    // ── Debounced resize ──────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeCanvas()
        ScrollTrigger.refresh()
      }, 120)
    }
    window.addEventListener('resize', debouncedResize)

    return () => {
      gsapCtx.revert()
      lenis?.destroy()
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(resizeTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={wrapRef} className="bg-black text-white antialiased overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          PINNED SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={pinRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
        aria-label="CHAIYA Tea cinematic reveal"
      >
        {/* Warm earth atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(40,28,8,0.55) 0%, rgba(10,6,2,0.80) 55%, #000 100%)',
          }}
        />

        {/* Film grain */}
        <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.03]" />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ zIndex: 10 }}
        />

        {/* ── PHASE 1: Hero ── */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 20 }}
        >
          <p
            ref={eyebrowRef}
            className="mb-7 text-[13px] font-medium uppercase tracking-[0.32em]"
            style={{ color: '#c8a96e' }}
          >
            Introducing
          </p>

          {/* Tea Canister (hero asset — GSAP scales this up) */}
          <div ref={productRef} className="relative mb-10" style={{ willChange: 'transform, opacity' }}>
            <div
              className="relative"
              style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))' }}
            >
              <div className="relative h-[180px] w-[110px]">

                {/* Cap */}
                <div
                  className="absolute inset-x-0 top-0 z-10 h-[28px] rounded-full"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(200,168,100,0.65) 0%, rgba(38,28,10,0.97) 100%)',
                    border: '1px solid rgba(200,168,100,0.65)',
                    boxShadow: '0 -4px 18px rgba(200,168,100,0.30)',
                  }}
                />

                {/* Body */}
                <div
                  className="absolute inset-x-0 top-[14px] bottom-0 overflow-hidden rounded-[4px]"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(8,6,2,0.99) 0%, rgba(55,42,16,0.97) 35%, rgba(48,36,13,0.97) 65%, rgba(6,4,1,0.99) 100%)',
                    border: '1px solid rgba(200,168,100,0.30)',
                    boxShadow: 'inset 2px 0 10px rgba(255,255,255,0.04), inset -2px 0 6px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Vertical highlight */}
                  <div
                    aria-hidden
                    className="absolute left-[20%] top-0 bottom-0 w-[16px] opacity-[0.07]"
                    style={{ background: 'linear-gradient(90deg, transparent, white, transparent)' }}
                  />
                  {/* Horizontal bands */}
                  <div className="absolute inset-x-0 top-[28%] h-px bg-amber-400/[0.15]" />
                  <div className="absolute inset-x-0 bottom-[30%] h-px bg-amber-400/[0.15]" />
                  {/* Embossed label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                    <div className="h-px w-10 rounded-full bg-amber-400/40" />
                    <p className="font-cinzel text-[9px] font-bold uppercase tracking-[0.38em] text-amber-400/60">
                      Chaiya
                    </p>
                    <p className="text-[7px] uppercase tracking-[0.2em] text-amber-400/30">
                      tea co.
                    </p>
                    <div className="h-px w-10 rounded-full bg-amber-400/40" />
                  </div>
                </div>
              </div>

              {/* Glow puddle */}
              <div
                aria-hidden
                className="absolute -bottom-5 left-1/2 h-10 w-36 -translate-x-1/2 rounded-full blur-2xl"
                style={{ background: 'rgba(200,168,100,0.32)' }}
              />
            </div>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="mb-4 text-center font-cinzel text-[clamp(56px,10vw,116px)] font-bold leading-none tracking-[-0.01em] text-white"
            style={{ willChange: 'transform, opacity' }}
          >
            CHAIYA
          </h1>

          {/* Subtitle */}
          <p
            ref={subRef}
            className="text-center text-[clamp(16px,2vw,24px)] font-light tracking-wide text-white/50"
            style={{ willChange: 'transform, opacity' }}
          >
            Ancient wisdom. Modern ritual.
          </p>
        </div>

        {/* ── PHASE 2: Side texts ── */}
        <div
          ref={leftTextRef}
          className="pointer-events-none absolute left-[5vw] top-1/2 max-w-[220px] -translate-y-1/2 opacity-0"
          style={{ transform: 'translateX(-80px) translateY(-50%)', zIndex: 25, willChange: 'transform, opacity' }}
          aria-hidden
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: '#c8a96e' }}>
            Origin
          </p>
          <p className="text-[clamp(17px,2.2vw,28px)] font-semibold leading-tight text-white">
            Sourced from<br />ancient gardens.
          </p>
        </div>

        <div
          ref={rightTextRef}
          className="pointer-events-none absolute right-[5vw] top-1/2 max-w-[220px] -translate-y-1/2 text-right opacity-0"
          style={{ transform: 'translateX(80px) translateY(-50%)', zIndex: 25, willChange: 'transform, opacity' }}
          aria-hidden
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: '#8aaa78' }}>
            Craft
          </p>
          <p className="text-[clamp(17px,2.2vw,28px)] font-semibold leading-tight text-white">
            Every steep,<br />perfected.
          </p>
        </div>

        {/* ── PHASE 3: Product grid ── */}
        <div
          ref={gridRef}
          className="pointer-events-auto absolute inset-0 flex items-center justify-center px-6 opacity-0"
          style={{ transform: 'translateY(40px)', zIndex: 30, willChange: 'transform, opacity' }}
        >
          <div className="flex w-full max-w-5xl flex-col items-center gap-8 sm:flex-row sm:justify-center">
            {PRODUCTS.map((p, i) => (
              <div key={p.id} className="w-full sm:w-auto" style={{ transitionDelay: `${i * 60}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <div className="h-[36px] w-[22px] rounded-full border border-white/18 p-[5px]">
            <div
              className="h-[7px] w-[3px] rounded-full bg-white/45"
              style={{ animation: 'scrollDot 2s ease-in-out infinite' }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/22">Scroll</span>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-6"
        aria-label="Begin your ritual"
      >
        {/* Warm glow bloom */}
        <div
          ref={ctaGlowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(80,55,10,0.30) 0%, rgba(40,100,20,0.10) 35%, transparent 65%)',
            willChange: 'transform, opacity',
          }}
        />

        {/* Ambient micro-particles (static, deterministic) */}
        {[...Array(22)].map((_, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              width  : 1 + (i % 3) * 0.6,
              height : 1 + (i % 3) * 0.6,
              left   : `${5 + (i * 4.4) % 90}%`,
              top    : `${5 + (i * 7.1) % 88}%`,
              opacity: 0.06 + (i % 5) * 0.035,
              // alternate gold / green tones
              background: i % 2 === 0 ? 'rgba(200,168,100,1)' : 'rgba(110,160,90,1)',
            }}
          />
        ))}

        {/* Copy */}
        <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
          <p
            className="mb-5 text-[13px] font-medium uppercase tracking-[0.3em]"
            style={{ color: '#c8a96e' }}
          >
            Available Now
          </p>

          <h2
            ref={ctaTitleRef}
            className="mb-4 font-cinzel text-[clamp(44px,8vw,92px)] font-bold leading-none tracking-[-0.01em] text-white opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            CHAIYA
          </h2>

          {/* Decorative line */}
          <div
            className="mb-8 h-px w-32 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(200,168,100,0.5), transparent)' }}
          />

          <p
            ref={ctaSubRef}
            className="mb-12 text-[clamp(16px,1.8vw,21px)] font-light leading-relaxed text-white/45 opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            Three exceptional teas. One ancient tradition.<br />
            From&nbsp;<span className="font-medium text-white/75">$48.</span>
          </p>

          {/* CTA Button */}
          <button
            ref={ctaBtnRef}
            className="group relative min-h-[56px] overflow-hidden rounded-full px-10 text-[15px] font-semibold text-white opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400/60"
            style={{
              background:
                'linear-gradient(135deg, rgba(100,70,10,0.85) 0%, rgba(50,80,20,0.80) 100%)',
              border: '1px solid rgba(200,168,100,0.40)',
              boxShadow:
                '0 0 0 1px rgba(200,168,100,0.15), 0 8px 32px rgba(80,50,5,0.40)',
              willChange: 'transform, opacity',
            }}
            aria-label="Begin your CHAIYA tea ritual"
          >
            {/* Hover shimmer */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)',
              }}
            />
            {/* Glow pulse ring */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                boxShadow: '0 0 36px rgba(200,168,100,0.40)',
                animation : 'ctaGlowPulse 3s ease-in-out infinite',
              }}
            />
            <span className="relative z-10">Begin Your Ritual</span>
          </button>

          <p className="mt-8 text-[12px] text-white/20">
            Free worldwide delivery · Satisfaction guaranteed
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/[0.05] px-8 py-5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <span className="font-cinzel text-[12px] font-bold uppercase tracking-[0.3em] text-white/22">
              CHAIYA
            </span>
            <div className="flex gap-6">
              {['Story', 'Sourcing', 'Ritual Guide', 'Contact'].map(l => (
                <a key={l} href="#" className="text-[12px] text-white/22 transition-colors duration-200 hover:text-white/50">
                  {l}
                </a>
              ))}
            </div>
            <span className="text-[11px] text-white/16">© 2026 Chaiya Tea Co.</span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0);    opacity: 0.45; }
          50%       { transform: translateY(12px); opacity: 1; }
        }
        @keyframes ctaGlowPulse {
          0%, 100% { opacity: 0.50; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
