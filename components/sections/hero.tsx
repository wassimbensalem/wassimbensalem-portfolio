'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { buttonVariants } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
const TARGET = 'WASSIM BEN SALEM'
const SCRAMBLE_DURATION = 1200 // ms

function useTextScramble(target: string, duration: number) {
  const [display, setDisplay] = useState(
    Array.from({ length: target.length }, () =>
      target[Math.floor(Math.random() * target.length)]
    ).join('')
  )
  const frameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)

  useEffect(() => {
    const startTime = performance.now()
    const spaces = new Set(
      target.split('').reduce<number[]>((acc, char, i) => {
        if (char === ' ') acc.push(i)
        return acc
      }, [])
    )

    function frame(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      const resolvedCount = Math.floor(progress * target.length)

      const result = target.split('').map((char, i) => {
        if (spaces.has(i)) return ' '
        if (i < resolvedCount) return char
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      })

      setDisplay(result.join(''))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(frame)
      }
    }

    frameRef.current = requestAnimationFrame(frame)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return display
}

export function Hero() {
  const name = useTextScramble(TARGET, SCRAMBLE_DURATION)
  const [chevronVisible, setChevronVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) setChevronVisible(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center dot-grid"
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, var(--color-background) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-sans font-bold tracking-[-0.03em] text-[--color-foreground]"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {name}
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="font-mono text-base text-[--color-muted-light]"
        >
          AI Systems Engineer
        </motion.p>

        {/* Tags */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="font-mono text-[13px] text-[--color-muted] tracking-wider"
        >
          Production MLOps&nbsp;&nbsp;·&nbsp;&nbsp;Agentic AI&nbsp;&nbsp;·&nbsp;&nbsp;Munich
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex items-center gap-4 mt-2"
        >
          <a
            href="#projects"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'bg-[--color-accent] hover:bg-[--color-accent]/90 text-white font-mono text-sm px-6'
            )}
          >
            View Projects
          </a>
          <a
            href="#contact"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'border-[--color-border] text-[--color-muted-light] hover:text-[--color-foreground] hover:border-[--color-muted] font-mono text-sm px-6 bg-transparent'
            )}
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ opacity: chevronVisible ? 1 : 0, y: chevronVisible ? 0 : 10 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-[--color-muted]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
