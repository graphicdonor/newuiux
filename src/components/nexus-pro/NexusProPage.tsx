'use client'

/**
 * CHAIYA Tea — scroll-driven video background.
 *
 * WHY play-rate chasing instead of seeking
 * ─────────────────────────────────────────
 * Sparse keyframes in the second half of the video cause seek stalls:
 * the browser must find the last keyframe and decode every frame forward
 * to the target — getting progressively slower as the video progresses.
 *
 * Solution: never seek forward.  Instead, a 60 fps RAF loop compares
 * video.currentTime to the scroll-derived targetTime and adjusts
 * video.playbackRate so the video "chases" the target under natural
 * sequential decode (no keyframe penalty).  Only scroll-up triggers a
 * backward seek, which is much rarer in normal use.
 *
 *   targetTime set by GSAP ScrollTrigger (scrub:true)
 *          │
 *          ▼
 *   RAF loop every frame:
 *     diff = targetTime − currentTime
 *     diff > 0  → play at rate = clamp(diff × 14, 0.5, 8)
 *     diff ≈ 0  → pause
 *     diff < 0  → pause + fastSeek (going backward)
 */

import { useEffect, useRef } from 'react'
import gsap                   from 'gsap'
import { ScrollTrigger }      from 'gsap/ScrollTrigger'
import ProductCard, { PRODUCTS } from './ProductCard'

gsap.registerPlugin(ScrollTrigger)

type VideoEl = HTMLVideoElement & { fastSeek?: (t: number) => void }

export default function NexusProPage() {
  const wrapRef      = useRef<HTMLDivElement>(null)
  const pinRef       = useRef<HTMLElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const eyebrowRef   = useRef<HTMLParagraphElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const leftTextRef  = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)
  const gridRef      = useRef<HTMLDivElement>(null)
  const ctaRef       = useRef<HTMLElement>(null)
  const ctaGlowRef   = useRef<HTMLDivElement>(null)
  const ctaTitleRef  = useRef<HTMLHeadingElement>(null)
  const ctaSubRef    = useRef<HTMLParagraphElement>(null)
  const ctaBtnRef    = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const video = videoRef.current as VideoEl
    video.pause()

    // ── Play-rate chasing ────────────────────────────────────────────
    let targetTime = 0
    let driveRAF   = 0
    const ONE_FRAME = 1 / 30

    const driveVideo = () => {
      driveRAF = requestAnimationFrame(driveVideo)
      if (!video.duration || video.readyState < 2) return

      const diff = targetTime - video.currentTime

      if (Math.abs(diff) < ONE_FRAME) {
        // At target — stop
        if (!video.paused) video.pause()
        return
      }

      if (diff > 0) {
        // Behind target — play forward at proportional speed
        const rate = Math.min(Math.max(diff * 14, 0.5), 8)
        if (Math.abs(video.playbackRate - rate) > 0.05) video.playbackRate = rate
        if (video.paused) video.play().catch(() => {})
      } else {
        // Ahead of target (user scrolled up) — seek backward
        if (!video.paused) video.pause()
        const t = Math.max(0, targetTime)
        if (video.fastSeek) video.fastSeek(t)
        else video.currentTime = t
      }
    }

    driveRAF = requestAnimationFrame(driveVideo)

    // ── Lenis ────────────────────────────────────────────────────────
    let lenis: import('lenis').default | null = null
    ;(async () => {
      try {
        const { default: Lenis } = await import('lenis')
        lenis = new Lenis({
          duration      : 1.0,
          easing        : (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 2,
        })
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time) => lenis!.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)
      } catch { /* native fallback */ }
    })()

    const gsapCtx = gsap.context(() => {

      /* ═══════════════════════════════════════════════════════════
       * ST-1 — pin + set targetTime (scrub:true = zero smoothing lag)
       * ═══════════════════════════════════════════════════════════ */
      ScrollTrigger.create({
        trigger : pinRef.current,
        pin     : true,
        scrub   : true,
        start   : 'top top',
        end     : '+=500%',
        onUpdate: (self) => {
          if (video.duration) targetTime = self.progress * video.duration
        },
      })

      if (prefersReduced) return

      /* ═══════════════════════════════════════════════════════════
       * ST-2 — overlay animations, smooth scrub, no re-pin
       * ═══════════════════════════════════════════════════════════ */
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger : pinRef.current,
          scrub   : 1.0,
          start   : 'top top',
          end     : '+=500%',
        },
      })

      mainTl
        // Hero in
        .fromTo(eyebrowRef.current,
          { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.02)
        .fromTo(titleRef.current,
          { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power3.out' }, 0.04)
        .fromTo(subRef.current,
          { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.08)
        // Hero out
        .to(eyebrowRef.current, { opacity: 0, y: -18, duration: 0.14, ease: 'power2.in' }, 0.26)
        .to(titleRef.current,   { opacity: 0, y: -44, duration: 0.18, ease: 'power2.in' }, 0.28)
        .to(subRef.current,     { opacity: 0, y: -12, duration: 0.14, ease: 'power2.in' }, 0.30)
        // Side texts in
        .fromTo(leftTextRef.current,
          { opacity: 0, x: -55 }, { opacity: 1, x: 0, duration: 0.20, ease: 'power3.out' }, 0.36)
        .fromTo(rightTextRef.current,
          { opacity: 0, x: 55  }, { opacity: 1, x: 0, duration: 0.20, ease: 'power3.out' }, 0.40)
        // Side texts out, grid in
        .to(leftTextRef.current,  { opacity: 0, x: -28, duration: 0.14, ease: 'power1.in' }, 0.62)
        .to(rightTextRef.current, { opacity: 0, x: 28,  duration: 0.14, ease: 'power1.in' }, 0.62)
        .fromTo(gridRef.current,
          { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }, 0.65)
        .to({}, { duration: 0.15 }, 0.86)

      /* ═══════════════════════════════════════════════════════════
       * CTA SECTION
       * ═══════════════════════════════════════════════════════════ */
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger : ctaRef.current,
          pin     : true,
          scrub   : 1.0,
          start   : 'top top',
          end     : '+=120%',
        },
      })

      ctaTl
        .fromTo(ctaGlowRef.current,
          { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo(ctaTitleRef.current,
          { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, 0.22)
        .fromTo(ctaSubRef.current,
          { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }, 0.36)
        .fromTo(ctaBtnRef.current,
          { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(1.4)' }, 0.48)

    }, wrapRef)

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(driveRAF)
      gsapCtx.revert()
      lenis?.destroy()
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // ─── JSX ───────────────────────────────────────────────────────────
  return (
    <div ref={wrapRef} className="bg-black text-white antialiased overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════
          PINNED
      ════════════════════════════════════════════════════════ */}
      <section
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-black"
        aria-label="CHAIYA Tea — scroll to explore"
      >
        <video
          ref={videoRef}
          src="/tea-video.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 1 }}
        />

        {/* Legibility overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.60) 100%)',
            zIndex: 2,
          }}
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.025]" style={{ zIndex: 3 }} />

        {/* Hero */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 20 }}>
          <p ref={eyebrowRef} className="mb-6 text-[13px] font-medium uppercase tracking-[0.32em] opacity-0" style={{ color: '#c8a96e' }}>
            Introducing
          </p>
          <h1
            ref={titleRef}
            className="mb-4 text-center font-cinzel text-[clamp(60px,11vw,124px)] font-bold leading-none tracking-[-0.01em] text-white opacity-0"
            style={{ willChange: 'transform, opacity', textShadow: '0 4px 40px rgba(0,0,0,0.7)' }}
          >
            CHAIYA
          </h1>
          <p ref={subRef} className="text-center text-[clamp(16px,2vw,24px)] font-light tracking-wide text-white/60 opacity-0" style={{ willChange: 'transform, opacity' }}>
            Ancient wisdom. Modern ritual.
          </p>
        </div>

        {/* Left side text */}
        <div ref={leftTextRef} className="pointer-events-none absolute left-[5vw] top-1/2 max-w-[220px] -translate-y-1/2 opacity-0" style={{ zIndex: 20, willChange: 'transform, opacity' }} aria-hidden>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: '#c8a96e' }}>Origin</p>
          <p className="text-[clamp(17px,2.2vw,28px)] font-semibold leading-tight text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            Sourced from<br />ancient gardens.
          </p>
        </div>

        {/* Right side text */}
        <div ref={rightTextRef} className="pointer-events-none absolute right-[5vw] top-1/2 max-w-[220px] -translate-y-1/2 text-right opacity-0" style={{ zIndex: 20, willChange: 'transform, opacity' }} aria-hidden>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: '#8aaa78' }}>Craft</p>
          <p className="text-[clamp(17px,2.2vw,28px)] font-semibold leading-tight text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            Every steep,<br />perfected.
          </p>
        </div>

        {/* Product grid */}
        <div ref={gridRef} className="pointer-events-auto absolute inset-0 flex items-center justify-center px-6 opacity-0" style={{ zIndex: 30, willChange: 'transform, opacity' }}>
          <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
          <div className="relative flex w-full max-w-5xl flex-col items-center gap-8 sm:flex-row sm:justify-center">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="w-full sm:w-auto"><ProductCard product={p} /></div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div aria-hidden className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2" style={{ zIndex: 40 }}>
          <div className="h-[36px] w-[22px] rounded-full border border-white/20 p-[5px]">
            <div className="h-[7px] w-[3px] rounded-full bg-white/50" style={{ animation: 'scrollDot 2s ease-in-out infinite' }} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/25">Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-6" aria-label="Begin your ritual">
        <div ref={ctaGlowRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(80,55,10,0.35) 0%, rgba(40,100,20,0.12) 40%, transparent 70%)', willChange: 'transform, opacity' }} />

        {[...Array(22)].map((_, i) => (
          <div key={i} aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 1 + (i % 3) * 0.6, height: 1 + (i % 3) * 0.6, left: `${5 + (i * 4.4) % 90}%`, top: `${5 + (i * 7.1) % 88}%`, opacity: 0.06 + (i % 5) * 0.035, background: i % 2 === 0 ? 'rgba(200,168,100,1)' : 'rgba(110,160,90,1)' }} />
        ))}

        <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
          <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.3em]" style={{ color: '#c8a96e' }}>Available Now</p>

          <h2 ref={ctaTitleRef} className="mb-4 font-cinzel text-[clamp(44px,8vw,92px)] font-bold leading-none tracking-[-0.01em] text-white opacity-0" style={{ willChange: 'transform, opacity' }}>
            CHAIYA
          </h2>

          <div className="mb-8 h-px w-32 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,168,100,0.5), transparent)' }} />

          <p ref={ctaSubRef} className="mb-12 text-[clamp(16px,1.8vw,21px)] font-light leading-relaxed text-white/45 opacity-0" style={{ willChange: 'transform, opacity' }}>
            Three exceptional teas. One ancient tradition.<br />
            From&nbsp;<span className="font-medium text-white/75">$48.</span>
          </p>

          <button
            ref={ctaBtnRef}
            className="group relative min-h-[56px] overflow-hidden rounded-full px-10 text-[15px] font-semibold text-white opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400/60"
            style={{ background: 'linear-gradient(135deg, rgba(100,70,10,0.85) 0%, rgba(50,80,20,0.80) 100%)', border: '1px solid rgba(200,168,100,0.40)', boxShadow: '0 0 0 1px rgba(200,168,100,0.15), 0 8px 32px rgba(80,50,5,0.40)', willChange: 'transform, opacity' }}
            aria-label="Begin your CHAIYA tea ritual"
          >
            <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: '0 0 36px rgba(200,168,100,0.40)', animation: 'ctaGlowPulse 3s ease-in-out infinite' }} />
            <span className="relative z-10">Begin Your Ritual</span>
          </button>

          <p className="mt-8 text-[12px] text-white/20">Free worldwide delivery · Satisfaction guaranteed</p>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.05] px-8 py-5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <span className="font-cinzel text-[12px] font-bold uppercase tracking-[0.3em] text-white/22">CHAIYA</span>
            <div className="flex gap-6">
              {['Story', 'Sourcing', 'Ritual Guide', 'Contact'].map(l => (
                <a key={l} href="#" className="text-[12px] text-white/22 transition-colors duration-200 hover:text-white/50">{l}</a>
              ))}
            </div>
            <span className="text-[11px] text-white/16">© 2026 Chaiya Tea Co.</span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0);    opacity: 0.5; }
          50%       { transform: translateY(12px); opacity: 1;   }
        }
        @keyframes ctaGlowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1.0; }
        }
      `}</style>
    </div>
  )
}
