'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATEMENT =
  'An infinite canvas for your apps and memories. A display so expansive and so detailed — it will feel like you are standing right there.'

export default function VisionStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordsRef.current,
        { opacity: 0.08 },
        {
          opacity: 1,
          stagger: 0.055,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: 1.2,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const words = STATEMENT.split(' ')

  return (
    <section ref={sectionRef} className="bg-black py-36 lg:py-56 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-[clamp(22px,3.2vw,44px)] font-medium leading-[1.35] text-center">
          {words.map((word, i) => (
            <span
              key={i}
              ref={el => { if (el) wordsRef.current[i] = el }}
              className="inline-block mr-[0.26em] text-white"
              style={{ opacity: 0.08 }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
