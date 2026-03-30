# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy wassimbensalem.com — a dark-precision personal portfolio for AI Systems Engineer Wassim Ben Salem, featuring 5 project cards, experience timeline, MDX blog, and contact section.

**Architecture:** Next.js 16 App Router single-scroll landing page with separate `/blog` and `/blog/[slug]` routes. All sections are React Server Components except interactive elements (nav scroll behavior, hero text scramble, Framer Motion wrappers) which are Client Components. MDX blog posts live in `/content/blog/` and are rendered with `next-mdx-remote/rsc`.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Framer Motion 11 (`motion/react`), next-mdx-remote, shadcn/ui, Geist Sans + Geist Mono (next/font), gray-matter, Shiki (syntax highlighting), Vercel

---

## File Map

```
PersonalPortfolio/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, dark body bg
│   ├── page.tsx                # Landing page — assembles all sections
│   ├── globals.css             # Tailwind v4 @theme, CSS variables, dot grid
│   ├── blog/
│   │   ├── page.tsx            # Blog index — lists all posts
│   │   └── [slug]/
│   │       └── page.tsx        # Individual MDX post
│   └── og/
│       └── route.tsx           # OG image generation (next/og ImageResponse)
├── components/
│   ├── layout/
│   │   ├── nav.tsx             # Sticky nav — scroll blur, mobile Sheet (client)
│   │   └── footer.tsx          # Footer — copyright line
│   ├── sections/
│   │   ├── hero.tsx            # Hero — text scramble, dot grid, CTAs (client)
│   │   ├── projects.tsx        # Bento grid of 5 project cards (server)
│   │   ├── experience.tsx      # Timeline — 3 entries + CV download (server)
│   │   ├── writing.tsx         # 3 latest blog post previews (server)
│   │   └── contact.tsx         # Two-col contact — copy email (client)
│   ├── blog/
│   │   ├── post-card.tsx       # Blog preview card (server)
│   │   └── mdx-components.tsx  # Callout, CodeBlock (Shiki) custom MDX elements
│   ├── ui/                     # shadcn/ui auto-generated components
│   └── motion-wrapper.tsx      # Generic 'use client' fade-up wrapper
├── content/
│   └── blog/
│       ├── self-healing-ml-pipelines.mdx
│       ├── agentic-ai-engineer.mdx
│       └── neural-compression-edge.mdx
├── lib/
│   ├── mdx.ts                  # getAllPosts(), getPostBySlug() — filesystem MDX parsing
│   └── metadata.ts             # buildMetadata() — shared SEO helper
├── public/
│   ├── wassim-ben-salem-cv.pdf # Copied from ../BENSALEM_CV.pdf
│   └── images/
│       └── wassim.jpg          # Copied from ../cv/wassim-ben-salem.1024x1024.jpg
└── next.config.ts              # MDX support, image domains
```

---

## Task 1: Bootstrap Next.js 16 Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json` (via create-next-app)
- Create: `app/globals.css`
- Create: `app/layout.tsx`

- [ ] **Step 1: Scaffold the project**

Run inside `/Users/wassimbensalem/Desktop/Projects-Extra/PersonalPortfolio/`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-import-alias --turbopack
```
When prompted: accept all defaults. This creates the Next.js 16 scaffold.

- [ ] **Step 2: Install all dependencies at once**

```bash
npm install motion gray-matter next-mdx-remote shiki @shikijs/rehype remark-gfm
npm install -D @types/node
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init
```
When prompted: choose **Default** style, **Zinc** base color, **CSS variables: yes**.

Then add the components we need:
```bash
npx shadcn@latest add button badge sheet skeleton separator
```

- [ ] **Step 4: Replace globals.css with design system**

Replace the full contents of `app/globals.css`:
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: #0A0A0A;
  --color-foreground: #FAFAFA;
  --color-muted: #71717A;
  --color-muted-light: #A1A1AA;
  --color-border: #1A1A1A;
  --color-card: #111111;
  --color-accent: oklch(0.65 0.2 220);
  --color-accent-glow: oklch(0.65 0.2 220 / 0.15);

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "Cascadia Code", monospace;

  --radius: 0.5rem;
}

* {
  box-sizing: border-box;
  border-color: var(--color-border);
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dot grid utility — used on hero section */
.dot-grid {
  background-image: radial-gradient(circle, #1A1A1A 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Grain overlay on cards */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  border-radius: inherit;
}

/* Prose styles for MDX blog posts */
.prose {
  color: var(--color-muted-light);
  max-width: 65ch;
  line-height: 1.75;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  color: var(--color-foreground);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-top: 2em;
  margin-bottom: 0.75em;
}

.prose h1 { font-size: 2rem; }
.prose h2 { font-size: 1.5rem; }
.prose h3 { font-size: 1.25rem; }

.prose p { margin-bottom: 1.5em; }

.prose a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  color: var(--color-foreground);
}

.prose pre {
  background: var(--color-card) !important;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose blockquote {
  border-left: 3px solid var(--color-accent);
  padding-left: 1.25em;
  margin-left: 0;
  color: var(--color-muted);
  font-style: italic;
}

.prose ul, .prose ol {
  padding-left: 1.5em;
  margin-bottom: 1.5em;
}

.prose li { margin-bottom: 0.5em; }

.prose hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2em 0;
}

/* prefers-reduced-motion: disable all transitions and animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Create root layout with Geist fonts**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wassim Ben Salem — AI Systems Engineer',
  description: 'MLOps engineer and Agentic AI builder based in Munich. Production ML pipelines, autonomous agents, automotive AI.',
  openGraph: {
    title: 'Wassim Ben Salem — AI Systems Engineer',
    description: 'MLOps engineer and Agentic AI builder based in Munich.',
    url: 'https://wassimbensalem.com',
    siteName: 'Wassim Ben Salem',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@wassimbs2',
  },
  metadataBase: new URL('https://wassimbensalem.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-[--color-background] text-[--color-foreground] antialiased">
        {children}
      </body>
    </html>
  )
}
```

Note: Install geist font package if not already installed:
```bash
npm install geist
```

- [ ] **Step 6: Copy public assets**

```bash
cp /Users/wassimbensalem/Desktop/Projects-Extra/BENSALEM_CV.pdf /Users/wassimbensalem/Desktop/Projects-Extra/PersonalPortfolio/public/wassim-ben-salem-cv.pdf
mkdir -p /Users/wassimbensalem/Desktop/Projects-Extra/PersonalPortfolio/public/images
cp "/Users/wassimbensalem/Desktop/Projects-Extra/cv/wassim-ben-salem.1024x1024.jpg" /Users/wassimbensalem/Desktop/Projects-Extra/PersonalPortfolio/public/images/wassim.jpg
```

- [ ] **Step 7: Verify build compiles**

```bash
npm run build
```
Expected: Build succeeds with no TypeScript errors. (The default Next.js page is fine at this point.)

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: bootstrap Next.js 16 portfolio with design system and assets"
```

---

## Task 2: MDX Utilities & Blog Infrastructure

**Files:**
- Create: `lib/mdx.ts`
- Create: `lib/metadata.ts`
- Create: `next.config.ts` (update)
- Create: `content/blog/` directory with placeholder

- [ ] **Step 1: Create MDX utility**

Create `lib/mdx.ts`:
```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  readingTime: string
  excerpt: string
  tags: string[]
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const fullPath = path.join(BLOG_DIR, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        readingTime: data.readingTime as string,
        excerpt: data.excerpt as string,
        tags: (data.tags as string[]) ?? [],
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    readingTime: data.readingTime as string,
    excerpt: data.excerpt as string,
    tags: (data.tags as string[]) ?? [],
    content,
  }
}
```

- [ ] **Step 2: Create metadata helper**

Create `lib/metadata.ts`:
```ts
import type { Metadata } from 'next'

interface PageMetaInput {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  publishedAt?: string
}

export function buildMetadata({
  title,
  description,
  path = '',
  type = 'website',
  publishedAt,
}: PageMetaInput): Metadata {
  const url = `https://wassimbensalem.com${path}`

  return {
    title: `${title} — Wassim Ben Salem`,
    description,
    openGraph: {
      title: `${title} — Wassim Ben Salem`,
      description,
      url,
      type,
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
    },
    alternates: {
      canonical: url,
    },
  }
}
```

- [ ] **Step 3: Create the content directory and placeholder**

```bash
mkdir -p /Users/wassimbensalem/Desktop/Projects-Extra/PersonalPortfolio/content/blog
```

Create `content/blog/.gitkeep`:
```bash
touch /Users/wassimbensalem/Desktop/Projects-Extra/PersonalPortfolio/content/blog/.gitkeep
```

- [ ] **Step 4: Update next.config.ts to support MDX file extension awareness**

Replace `next.config.ts`:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Allow importing .mdx files as pages if needed later
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

export default nextConfig
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add lib/ content/ next.config.ts
git commit -m "feat: add MDX parsing utilities and metadata helper"
```

---

## Task 3: Motion Wrapper & Shared Primitives

**Files:**
- Create: `components/motion-wrapper.tsx`

These are used by all sections — define them before building sections.

- [ ] **Step 1: Create fade-up motion wrapper**

Create `components/motion-wrapper.tsx`:
```tsx
'use client'

import { motion } from 'motion/react'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  delayStart?: number
}

export function StaggerContainer({
  children,
  className,
  delayStart = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: delayStart,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion-wrapper.tsx
git commit -m "feat: add Framer Motion fade-up and stagger primitives"
```

---

## Task 4: Navigation Component

**Files:**
- Create: `components/layout/nav.tsx`
- Create: `components/layout/footer.tsx`

- [ ] **Step 1: Create sticky navigation**

Create `components/layout/nav.tsx`:
```tsx
'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md border-b border-[--color-border] bg-[--color-background]/80'
          : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Monogram */}
        <a
          href="#hero"
          className="font-mono text-sm font-medium tracking-widest text-[--color-foreground] hover:text-[--color-accent] transition-colors duration-200"
        >
          WBS
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-[--color-muted] hover:text-[--color-foreground] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="text-[--color-muted] hover:text-[--color-foreground] transition-colors"
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[--color-background] border-[--color-border] w-72"
            >
              <div className="flex flex-col gap-8 mt-12 px-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="font-mono text-lg text-[--color-muted] hover:text-[--color-foreground] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create footer**

Create `components/layout/footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer className="border-t border-[--color-border] py-8">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs text-[--color-muted] text-center tracking-wide">
          © 2026 Wassim Ben Salem · Built with Next.js · Deployed on Vercel
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/
git commit -m "feat: add sticky navigation with mobile sheet and footer"
```

---

## Task 5: Hero Section

**Files:**
- Create: `components/sections/hero.tsx`

- [ ] **Step 1: Create the hero with text scramble**

Create `components/sections/hero.tsx`:
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

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
          <Button
            asChild
            className="bg-[--color-accent] hover:bg-[--color-accent]/90 text-white font-mono text-sm px-6"
          >
            <a href="#projects">View Projects</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[--color-border] text-[--color-muted-light] hover:text-[--color-foreground] hover:border-[--color-muted] font-mono text-sm px-6 bg-transparent"
          >
            <a href="#contact">Get in Touch</a>
          </Button>
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Wire into landing page temporarily and verify dev server**

Replace `app/page.tsx` with minimal test:
```tsx
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  )
}
```

```bash
npm run dev
```

Open http://localhost:3000 — verify: dark background, text scramble runs on name, dot grid visible, CTAs render, chevron bounces.

- [ ] **Step 4: Commit**

```bash
git add components/sections/hero.tsx app/page.tsx
git commit -m "feat: add hero section with text scramble and dot grid"
```

---

## Task 6: Projects Section (Bento Grid)

**Files:**
- Create: `components/sections/projects.tsx`

- [ ] **Step 1: Create projects section**

Create `components/sections/projects.tsx`:
```tsx
import { StaggerContainer, StaggerItem } from '@/components/motion-wrapper'
import { Badge } from '@/components/ui/badge'

interface Project {
  name: string
  description: string
  tags: string[]
  year: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    name: 'ReviveAI',
    description:
      'Autonomous agent that industrializes ML research reproducibility with self-healing workflows powered by LLMs.',
    tags: ['Python', 'Agentic AI', 'LLMs', 'MLOps'],
    year: '2024',
    featured: true,
  },
  {
    name: 'TessynAI',
    description:
      'Clean messy sensor time-series data 10× faster. Natural language → AI-generated cleaning recipes with instant preview.',
    tags: ['LangGraph', 'FastAPI', 'React', 'PostgreSQL'],
    year: '2024',
  },
  {
    name: 'Diwan',
    description:
      'AI financial copilot for German freelancers — tax, invoicing, and compliance via Telegram bot and web app.',
    tags: ['Claude API', 'FastAPI', 'pgvector', 'Next.js'],
    year: '2024',
  },
  {
    name: 'Menalena',
    description:
      'Co-founded logistics platform connecting Tunisian clients with European transporters. Secured early partnerships.',
    tags: ['Angular', 'Spring Boot', 'Entrepreneurship'],
    year: '2022',
  },
  {
    name: 'Hidaya',
    description:
      'Chrome extension for daily Islamic practice — prayer times, nearest mosque finder, and Quran ayahs.',
    tags: ['Chrome Extension', 'Vanilla JS'],
    year: '2023',
  },
]

function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <div
      className={`relative grain group rounded-xl border border-[--color-border] bg-[--color-card] p-6 flex flex-col gap-4 transition-all duration-200 hover:border-[--color-accent-glow] hover:scale-[1.01] overflow-hidden ${className}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-sans font-semibold text-lg text-[--color-foreground] leading-tight">
          {project.name}
        </h3>
        <span className="font-mono text-xs text-[--color-muted] shrink-0 mt-0.5">
          {project.year}
        </span>
      </div>

      {/* Description */}
      <p className="font-sans text-sm text-[--color-muted-light] leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="font-mono text-[10px] bg-[--color-background] text-[--color-muted] border-[--color-border] hover:bg-[--color-background]"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function Projects() {
  const [featured, ...rest] = PROJECTS
  const [tessyn, diwan, menalena, hidaya] = rest

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <StaggerContainer className="mb-12">
          <StaggerItem>
            <p className="font-mono text-xs text-[--color-accent] tracking-widest uppercase mb-3">
              Work
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-sans font-semibold text-3xl text-[--color-foreground] tracking-[-0.02em]">
              Selected Projects
            </h2>
          </StaggerItem>
        </StaggerContainer>

        {/* Bento grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Row 1: featured (2/3) + TessynAI (1/3) */}
          <StaggerItem className="md:col-span-2">
            <ProjectCard project={featured} className="h-full min-h-[200px]" />
          </StaggerItem>
          <StaggerItem>
            <ProjectCard project={tessyn} className="h-full min-h-[200px]" />
          </StaggerItem>

          {/* Row 2: 3 equal cards */}
          <StaggerItem>
            <ProjectCard project={diwan} className="h-full" />
          </StaggerItem>
          <StaggerItem>
            <ProjectCard project={menalena} className="h-full" />
          </StaggerItem>
          <StaggerItem>
            <ProjectCard project={hidaya} className="h-full" />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to landing page**

Update `app/page.tsx`:
```tsx
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Open http://localhost:3000 — scroll to projects, verify bento layout on desktop (2+1, then 3), cards animate in on scroll.

- [ ] **Step 4: Commit**

```bash
git add components/sections/projects.tsx app/page.tsx
git commit -m "feat: add projects bento grid with 5 project cards"
```

---

## Task 7: Experience Section

**Files:**
- Create: `components/sections/experience.tsx`

- [ ] **Step 1: Create experience timeline**

Create `components/sections/experience.tsx`:
```tsx
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/motion-wrapper'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExperienceEntry {
  title: string
  org: string
  period: string
  location: string
  highlight: string
  metric?: string
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    title: 'MLOps Engineer',
    org: 'Compredict GmbH',
    period: 'Oct 2024 – Present',
    location: 'Darmstadt, Germany',
    highlight:
      'End-to-end automotive AI pipelines across multi-OEM datasets. Automated training, preprocessing, and fine-tuning via Kubeflow, Ray, and AWS.',
    metric: '70% faster dev cycles · 63% cloud cost reduction',
  },
  {
    title: 'MSc Computer Science, Honors',
    org: 'Technical University of Darmstadt',
    period: 'GPA 1.2 · Thesis 1.0',
    location: 'Darmstadt, Germany',
    highlight:
      'Thesis: Generative compression of time-series models using WGANs, Knowledge Distillation, and Neural Architecture Search for automotive edge deployment.',
    metric: '91% model size reduction · state-of-the-art benchmarks',
  },
  {
    title: 'Earlier experience',
    org: 'Capgemini · Merck KGaA',
    period: '2020 – 2022',
    location: 'Frankfurt & Darmstadt',
    highlight: 'Software engineering and data analytics. Full details in CV.',
  },
]

export function Experience() {
  return (
    <section id="experience" className="py-32 px-6 border-t border-[--color-border]">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="mb-12">
          <StaggerItem>
            <p className="font-mono text-xs text-[--color-accent] tracking-widest uppercase mb-3">
              Background
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-sans font-semibold text-3xl text-[--color-foreground] tracking-[-0.02em]">
              Experience
            </h2>
          </StaggerItem>
        </StaggerContainer>

        {/* Timeline */}
        <div className="max-w-2xl relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-[--color-border]" />

          <div className="flex flex-col gap-10">
            {EXPERIENCE.map((entry, i) => (
              <FadeUp key={i} delay={i * 0.1} className="pl-8 relative">
                {/* Timeline dot */}
                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[--color-border] border border-[--color-background]" />

                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-sans font-semibold text-[--color-foreground]">
                      {entry.title}
                    </h3>
                    <span className="font-sans text-sm text-[--color-muted]">
                      {entry.org}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-[--color-muted] tracking-wide">
                    {entry.period} · {entry.location}
                  </p>

                  <p className="font-sans text-sm text-[--color-muted-light] leading-relaxed mt-1">
                    {entry.highlight}
                  </p>

                  {entry.metric && (
                    <p className="font-mono text-xs text-[--color-accent] mt-1">
                      {entry.metric}
                    </p>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* CV download */}
        <FadeUp delay={0.4} className="mt-12">
          <Button
            asChild
            variant="outline"
            className="font-mono text-xs border-[--color-border] text-[--color-muted] hover:text-[--color-foreground] hover:border-[--color-muted] bg-transparent gap-2"
          >
            <a href="/wassim-ben-salem-cv.pdf" download>
              <Download size={14} />
              Download CV (PDF)
            </a>
          </Button>
        </FadeUp>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to landing page**

Update `app/page.tsx` to add `<Experience />` after `<Projects />`:
```tsx
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Experience } from '@/components/sections/experience'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add components/sections/experience.tsx app/page.tsx
git commit -m "feat: add experience timeline with metrics and CV download"
```

---

## Task 8: Writing Section

**Files:**
- Create: `components/blog/post-card.tsx`
- Create: `components/sections/writing.tsx`

- [ ] **Step 1: Create post preview card**

Create `components/blog/post-card.tsx`:
```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PostMeta } from '@/lib/mdx'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-b border-[--color-border] py-6 first:border-t"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[--color-muted]">{post.date}</span>
          <span className="font-mono text-xs text-[--color-muted]">·</span>
          <span className="font-mono text-xs text-[--color-muted]">{post.readingTime}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="font-sans font-semibold text-[--color-foreground] group-hover:text-[--color-accent] transition-colors duration-200 leading-snug">
            {post.title}
          </h3>
          <ArrowRight
            size={16}
            className="text-[--color-muted] group-hover:text-[--color-accent] group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1"
          />
        </div>

        <p className="font-sans text-sm text-[--color-muted-light] leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create writing section**

Create `components/sections/writing.tsx`:
```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllPosts } from '@/lib/mdx'
import { PostCard } from '@/components/blog/post-card'
import { StaggerContainer, StaggerItem } from '@/components/motion-wrapper'

export function Writing() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) {
    return null
  }

  return (
    <section id="writing" className="py-32 px-6 border-t border-[--color-border]">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="mb-4">
          <StaggerItem>
            <p className="font-mono text-xs text-[--color-accent] tracking-widest uppercase mb-3">
              Writing
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-sans font-semibold text-3xl text-[--color-foreground] tracking-[-0.02em]">
              Writing
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="font-mono text-sm text-[--color-muted] mt-2">
              On AI systems, production ML, and autonomous machines
            </p>
          </StaggerItem>
        </StaggerContainer>

        <div className="max-w-2xl mt-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-[--color-muted] hover:text-[--color-accent] transition-colors duration-200 group"
          >
            View all posts
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to landing page**

Update `app/page.tsx`:
```tsx
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Experience } from '@/components/sections/experience'
import { Writing } from '@/components/sections/writing'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Writing />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run build
git add components/blog/post-card.tsx components/sections/writing.tsx app/page.tsx
git commit -m "feat: add writing section and post preview cards"
```

---

## Task 9: Contact Section

**Files:**
- Create: `components/sections/contact.tsx`

- [ ] **Step 1: Create contact section**

Create `components/sections/contact.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Linkedin, Twitter, Check, Copy } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/motion-wrapper'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/wassimbensalem',
    Icon: Linkedin,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/wassimbs2',
    Icon: Twitter,
  },
]

const OPEN_TO = [
  'Senior ML/AI engineering roles',
  'MLOps architecture consulting',
  'Agentic AI system design',
  'Co-founder conversations — building an Agentic AI platform',
]

export function Contact() {
  const [copied, setCopied] = useState(false)

  function copyEmail() {
    navigator.clipboard.writeText('bswassim@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="py-32 px-6 border-t border-[--color-border]">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="mb-12">
          <StaggerItem>
            <p className="font-mono text-xs text-[--color-accent] tracking-widest uppercase mb-3">
              Contact
            </p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-sans font-semibold text-3xl text-[--color-foreground] tracking-[-0.02em]">
              Let&apos;s work together
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: availability */}
          <FadeUp>
            <p className="font-sans text-sm text-[--color-muted] mb-6 leading-relaxed">
              Open to:
            </p>
            <ul className="flex flex-col gap-3">
              {OPEN_TO.map((item) => (
                <li
                  key={item}
                  className="font-sans text-sm text-[--color-muted-light] flex items-start gap-3"
                >
                  <span className="font-mono text-[--color-accent] mt-0.5 shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-mono text-xs text-[--color-muted] mt-8">
              Available in Munich and remotely · Responds within 24 hours
            </p>
          </FadeUp>

          {/* Right: contact details */}
          <FadeUp delay={0.15}>
            <div className="flex flex-col gap-6">
              {/* Email with copy button */}
              <div>
                <p className="font-mono text-xs text-[--color-muted] uppercase tracking-widest mb-2">
                  Email
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-sm text-[--color-foreground]">
                    bswassim@gmail.com
                  </span>
                  <button
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="text-[--color-muted] hover:text-[--color-accent] transition-colors duration-200"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="font-mono text-xs text-[--color-muted] uppercase tracking-widest mb-3">
                  Social
                </p>
                <div className="flex items-center gap-4">
                  {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-[--color-muted] hover:text-[--color-accent] transition-colors duration-200"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Complete the landing page**

Replace `app/page.tsx` with the final version:
```tsx
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Experience } from '@/components/sections/experience'
import { Writing } from '@/components/sections/writing'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Verify full landing page builds**

```bash
npm run build
```
Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/contact.tsx app/page.tsx
git commit -m "feat: add contact section with email copy and social links — landing page complete"
```

---

## Task 10: Blog Index & Post Pages

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `components/blog/mdx-components.tsx`

- [ ] **Step 1: Create MDX custom components**

Create `components/blog/mdx-components.tsx`:
```tsx
import { AlertCircle } from 'lucide-react'
import { codeToHtml } from 'shiki'

// Callout component
interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'tip'
}

export function Callout({ children, type = 'info' }: CalloutProps) {
  const styles = {
    info: 'border-[--color-accent] bg-[--color-accent]/5',
    warning: 'border-yellow-500/50 bg-yellow-500/5',
    tip: 'border-green-500/50 bg-green-500/5',
  }

  return (
    <div
      className={`flex gap-3 rounded-lg border p-4 my-6 ${styles[type]}`}
    >
      <AlertCircle size={16} className="text-[--color-accent] shrink-0 mt-0.5" />
      <div className="font-sans text-sm text-[--color-muted-light] leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  )
}

// Code block with Shiki syntax highlighting
interface CodeBlockProps {
  children: string
  lang?: string
  filename?: string
}

export async function CodeBlock({ children, lang = 'text', filename }: CodeBlockProps) {
  const html = await codeToHtml(children.trim(), {
    lang,
    theme: 'github-dark-dimmed',
  })

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-[--color-border]">
      {filename && (
        <div className="bg-[--color-card] border-b border-[--color-border] px-4 py-2">
          <span className="font-mono text-xs text-[--color-muted]">{filename}</span>
        </div>
      )}
      <div
        className="[&>pre]:p-5 [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// Chart — lazy-loaded wrapper (install recharts when first blog post needs it)
// Usage in MDX: <Chart data={[...]} type="line" />
export function Chart({ children }: { children?: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-[--color-border] bg-[--color-card] p-6 text-center">
      <p className="font-mono text-xs text-[--color-muted]">
        Chart placeholder — add Recharts data props when needed
      </p>
      {children}
    </div>
  )
}

// MDX components map — passed to MDXRemote
export const mdxComponents = {
  Callout,
  CodeBlock,
  Chart,
}
```

- [ ] **Step 2: Create blog index page**

Create `app/blog/page.tsx`:
```tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllPosts } from '@/lib/mdx'
import { PostCard } from '@/components/blog/post-card'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'Writing',
  description: 'Essays on AI systems, production ML, and autonomous machines by Wassim Ben Salem.',
  path: '/blog',
})

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-[--color-background]">
      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-[--color-muted] hover:text-[--color-foreground] transition-colors mb-12 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>

        {/* Header */}
        <h1 className="font-sans font-semibold text-3xl text-[--color-foreground] tracking-[-0.02em] mb-2">
          Writing
        </h1>
        <p className="font-mono text-sm text-[--color-muted] mb-12">
          On AI systems, production ML, and autonomous machines
        </p>

        {/* Post list */}
        {posts.length === 0 ? (
          <p className="font-mono text-sm text-[--color-muted]">Posts coming soon.</p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create individual post page**

Create `app/blog/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { mdxComponents } from '@/components/blog/mdx-components'
import { buildMetadata } from '@/lib/metadata'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: 'article',
    publishedAt: post.date,
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-[--color-background]">
      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-[--color-muted] hover:text-[--color-foreground] transition-colors mb-12 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          All posts
        </Link>

        {/* Post header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[--color-muted]">{post.date}</span>
            <span className="font-mono text-xs text-[--color-muted]">·</span>
            <span className="font-mono text-xs text-[--color-muted]">{post.readingTime}</span>
          </div>
          <h1 className="font-sans font-bold text-[--color-foreground] leading-tight tracking-[-0.02em] mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
            {post.title}
          </h1>
          <p className="font-sans text-[--color-muted-light] leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* MDX content */}
        <article className="prose">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </article>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-[--color-border]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-[--color-muted] hover:text-[--color-accent] transition-colors group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to all posts
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: Builds successfully. (Writing section on home page renders nothing since no posts exist yet — that's correct behavior.)

- [ ] **Step 5: Commit**

```bash
git add app/blog/ components/blog/mdx-components.tsx
git commit -m "feat: add blog index and post pages with MDX + Shiki rendering"
```

---

## Task 11: Blog Content — 3 Initial Posts

**Files:**
- Create: `content/blog/self-healing-ml-pipelines.mdx`
- Create: `content/blog/agentic-ai-engineer.mdx`
- Create: `content/blog/neural-compression-edge.mdx`

- [ ] **Step 1: Write post 1 — Self-Healing ML Pipelines**

Create `content/blog/self-healing-ml-pipelines.mdx`:
```mdx
---
title: "Building Self-Healing ML Pipelines: Lessons from Automotive AI at Scale"
date: "2026-03-15"
readingTime: "9 min read"
excerpt: "Production ML pipelines fail in ways your test suite will never catch. Here's what I learned building automotive AI systems that recover themselves."
tags: ["MLOps", "Kubeflow", "Agentic AI", "Production"]
---

Production ML is not a solved problem. You can have unit tests, integration tests, and a staging environment that matches production exactly — and your pipeline will still fail in ways you never anticipated. I know this firsthand from building and operating ML pipelines for automotive OEM customers at Compredict, where a failure doesn't just mean a slow API response. It means a Virtual Sensor that was guiding real-time vehicle health decisions has gone silent.

This post is about what I learned building pipelines that don't just fail gracefully — they heal themselves.

## Why ML Pipelines Fail Differently

Traditional software fails at defined boundaries: a network timeout, a null pointer, an unhandled exception. The fix is usually deterministic — you catch the error, log it, retry or fall back.

ML pipelines fail at the intersection of code, data, and model state. The same `train.py` that ran perfectly last Tuesday can fail today because:

- A new OEM dataset has a different sensor sampling rate
- A model checkpoint was corrupted mid-write during a pod restart
- A hyperparameter search explored a region that causes gradient explosion
- GPU memory fragmented after 72 hours of continuous operation

None of these are bugs in the traditional sense. They're emergent failures at the boundary between your system and the real world.

## The Architecture of a Self-Healing Pipeline

At Compredict, our pipelines run on Kubeflow with Ray for distributed training. The self-healing capability emerged from three architectural decisions:

### 1. Deterministic Checkpointing

Every training step writes a checkpoint with enough context to resume from that exact state. Not just model weights — but the data shard it was processing, the RNG seeds, the optimizer state, and the step's input hash.

```python
@dataclass
class CheckpointContext:
    step: int
    model_state: dict
    optimizer_state: dict
    data_shard_id: str
    data_shard_hash: str
    rng_state: dict
    metadata: dict[str, Any]
```

When a step fails, the pipeline doesn't restart from epoch 0. It loads the last valid checkpoint and picks up exactly where it left off.

### 2. Anomaly Detection as a First-Class Pipeline Stage

Before we had self-healing, we had dashboards. Engineers would watch Grafana panels for loss spikes, gradient norms going to infinity, or validation metrics diverging from training metrics. The dashboards were accurate. The humans watching them were not always available.

We moved anomaly detection into the pipeline itself — a lightweight detector that runs after every N steps:

```python
class TrainingHealthMonitor:
    def __init__(self, window_size: int = 50):
        self.loss_history: deque[float] = deque(maxlen=window_size)
        self.grad_norm_history: deque[float] = deque(maxlen=window_size)

    def check(self, loss: float, grad_norm: float) -> HealthStatus:
        self.loss_history.append(loss)
        self.grad_norm_history.append(grad_norm)

        if len(self.loss_history) < 10:
            return HealthStatus.OK

        # Detect loss explosion
        if loss > 10 * np.mean(list(self.loss_history)[:-1]):
            return HealthStatus.LOSS_EXPLOSION

        # Detect gradient vanishing
        if grad_norm < 1e-7:
            return HealthStatus.GRADIENT_VANISHING

        return HealthStatus.OK
```

When the monitor returns anything other than `OK`, the pipeline pauses, logs a structured event, and triggers a recovery strategy.

### 3. Agentic Recovery Loops

The final piece — and the most recent addition — is an LLM-powered recovery agent. When automated recovery strategies are exhausted (rollback to checkpoint, adjust learning rate, restart with fresh data shard), the agent is invoked.

The agent receives a structured context: the failure type, the last 100 training steps' metrics, the current hyperparameters, and a description of the dataset. It proposes a recovery action — which the pipeline can execute autonomously for low-risk actions (learning rate adjustment, data re-sampling) or escalate to a human via webhook for high-risk actions (architecture changes, dataset exclusion).

This is Agentic AI in production — not a chatbot, not a demo. An agent embedded in an industrial ML system, making decisions with real consequences.

## What Actually Reduced Dev Cycles by 70%

The metric I quote on my CV — 70% reduction in development cycle time — doesn't come primarily from self-healing. It comes from the upstream investment in deterministic pipelines.

When your pipeline is deterministic and checkpointed, you can:
- Reproduce any failure exactly, every time
- Test recovery strategies against recorded failure states
- Parallelize hyperparameter search without shared state conflicts
- Audit exactly which data contributed to a model version

The self-healing is downstream of that. You can only heal reliably what you can reason about precisely.

## The Limits

Self-healing works for operational failures — corrupted checkpoints, OOM errors, temporary data unavailability. It does not work for fundamental failures: a model architecture that's wrong for the task, training data with systematic label errors, a feature distribution shift that invalidates your entire validation set.

For those, you need humans. The pipeline should make it easy for humans to diagnose and intervene — not pretend the problem doesn't exist.

The best production ML system is one that handles the boring failures automatically and surfaces the interesting failures clearly.

---

*Wassim Ben Salem is an MLOps Engineer at Compredict GmbH and builds autonomous AI systems. Follow him on [X](https://x.com/wassimbs2) or [LinkedIn](https://linkedin.com/in/wassimbensalem).*
```

- [ ] **Step 2: Write post 2 — The Agentic AI Engineer**

Create `content/blog/agentic-ai-engineer.mdx`:
```mdx
---
title: "The Agentic AI Engineer: Why Production Experience Changes Everything"
date: "2026-02-28"
readingTime: "7 min read"
excerpt: "Everyone is building AI agents. Very few are building AI agents that work in production. The difference isn't the model — it's the engineer."
tags: ["Agentic AI", "LangGraph", "Production", "Engineering"]
---

There is a generation of engineers who learned about Agentic AI from tutorials. They built agents that could search the web, summarize PDFs, and call APIs in a Jupyter notebook. The demos were impressive. The GitHub stars accumulated.

Then they tried to deploy them.

I came to Agentic AI from the opposite direction — from production MLOps, from Kubernetes clusters that had to stay up, from automotive AI systems where a failure has real-world consequences. That background changed how I think about agents entirely.

## What "Production" Actually Means

Production isn't a technical property — it's a contract. When a system is in production, it has made promises to other systems and to humans about its behavior. It will respond within N milliseconds. It will produce outputs in a defined schema. It will fail in ways that allow downstream systems to recover.

An LLM agent, by default, makes none of these promises. It will take as long as the model takes. It will produce whatever the model produces. It will fail with a traceback that tells you nothing about what the agent was trying to do when it failed.

Bridging that gap — from "it works in a demo" to "it works under load, at 3am, when the model API is rate-limiting and the input is malformed" — is the actual engineering problem.

## The Three Production Gaps

### Gap 1: State Management

Tutorial agents are stateless. Each invocation starts fresh. This is fine for a demo where you control the inputs. It's a disaster for production where:

- A user starts a task and comes back 20 minutes later
- A multi-step workflow gets interrupted by a network failure
- You need to audit what an agent did and why

Production agents need durable state — checkpointed between steps, recoverable after failure, observable from outside. LangGraph handles this better than raw LangChain precisely because it models the agent as a graph with explicit state transitions, not as a chain of calls.

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    messages: list[dict]
    current_step: str
    context: dict
    error: str | None

# Every node receives and returns full state
def planning_node(state: AgentState) -> AgentState:
    # ...
    return {**state, "current_step": "execution", "context": plan}
```

The state is the contract. When something goes wrong, you have the full state at the point of failure.

### Gap 2: Reliability Engineering

A production agent needs the same reliability engineering as any other production service:

**Timeouts everywhere.** LLM calls can hang. Your agent framework probably doesn't timeout by default. Set timeouts at the HTTP level, at the step level, and at the overall workflow level.

**Retry with exponential backoff.** Model APIs rate-limit. Tools fail. Your agent should retry transient failures automatically and distinguish them from permanent failures.

**Circuit breakers.** If an external tool fails 5 times in a row, stop calling it and surface a clear error. Don't let your agent loop infinitely trying to call a broken API.

**Dead letter queues.** When an agent workflow fails permanently, the task needs to go somewhere — a queue, a database, a human review system. It should not disappear silently.

### Gap 3: Observability

This is the gap I see most often, and it's the one that makes debugging production agents most painful.

Logging `print(f"Agent step: {step}")` is not observability. Observability means being able to answer, after the fact:

- What was the agent's intent at each step?
- What tool calls did it make, with what inputs and outputs?
- Where in the decision tree did it go wrong?
- What was the latency of each component?

For my current project, ReviveAI, I structured every agent action as a structured log event:

```python
@dataclass
class AgentAction:
    step_id: str
    step_type: str  # "planning" | "tool_call" | "reflection" | "output"
    timestamp: datetime
    input_summary: str
    output_summary: str
    tool_name: str | None
    latency_ms: int
    error: str | None
    parent_step_id: str | None
```

Every action gets persisted. When something goes wrong in production, I have a complete execution trace.

## The Model Is Not the Hard Part

This sounds heretical to people who've been following the LLM benchmarks. But in my experience, the model is almost never the limiting factor in production agentic systems.

The hard parts are:
- Defining the right task scope (what should the agent do vs. what should a human do)
- Building reliable tool interfaces (garbage in, garbage out — always)
- Handling the long tail of failure modes (what happens when the input is weird)
- Making the system debuggable when it inevitably does something unexpected

GPT-4o and Claude are both more than capable enough for most production agentic tasks. What they can't do is make up for a poorly designed tool interface or recover from a task scope that's too broad.

## What This Means for How You Build

If you're building agentic systems for production:

1. **Design the state schema first.** Before writing any agent logic, define exactly what state your agent needs and what shape failures take. This is your API contract.

2. **Make each step idempotent.** An agent step that can be safely retried is vastly easier to operate than one that can't.

3. **Build observability from day one.** It's much harder to add structured logging to an existing agent than to design for it from the start.

4. **Start with narrow scope.** A production agent that reliably does one thing is worth more than an impressive demo that does ten things unreliably.

5. **Plan for human escalation.** Every agent system should have a defined path for escalating to a human when confidence is low or the task is outside known patterns.

The agents that survive contact with production are built by engineers who've operated production systems. That experience — knowing what can go wrong and how to reason about it — transfers directly.

---

*Wassim Ben Salem is building autonomous AI systems at Compredict GmbH and through his side projects. Follow on [X](https://x.com/wassimbs2) or connect on [LinkedIn](https://linkedin.com/in/wassimbensalem).*
```

- [ ] **Step 3: Write post 3 — Neural Compression**

Create `content/blog/neural-compression-edge.mdx`:
```mdx
---
title: "91% Smaller, Just as Smart: Compressing Neural Networks for Edge Deployment"
date: "2026-01-20"
readingTime: "10 min read"
excerpt: "My master's thesis achieved 91% model size reduction while outperforming state-of-the-art benchmarks. Here's the approach that made it work."
tags: ["ML Research", "Model Compression", "Automotive AI", "Neural Architecture Search"]
---

The constraint that drives the most interesting engineering is resource scarcity. When you have unlimited compute, you can throw a bigger model at the problem. When you're deploying to an automotive ECU with 512MB of RAM and a hard real-time constraint of 5ms per inference, you have to be clever.

My master's thesis at TU Darmstadt was about making time-series neural networks small enough to run on automotive edge hardware without sacrificing accuracy. We achieved a 91% reduction in model size while outperforming state-of-the-art baselines. This is the story of how.

## The Problem: Time-Series at the Edge

Modern vehicles generate enormous amounts of sensor data — acceleration, wheel speed, torque, temperature, pressure — at high frequency, continuously. The use case I was working on was Virtual Sensors: ML models that infer values that aren't directly measured (like tire wear or brake pad condition) from values that are.

These models need to:
- Run in real-time on embedded hardware
- Maintain accuracy over the model's lifetime as the vehicle ages
- Be updatable over-the-air without requiring a hardware replacement

The last constraint is the interesting one. An OTA update that ships a 200MB model is impractical. An update that ships a 15MB model with equivalent accuracy is deployable.

## The Three-Stage Compression Pipeline

The approach combined three techniques that I found worked synergistically:

### Stage 1: Wasserstein GAN Knowledge Distillation

Knowledge distillation is the classic compression approach: you train a small "student" network to mimic a large "teacher" network. The standard approach trains the student to match the teacher's output probabilities.

For time-series regression tasks, output matching alone loses too much information. The student needs to learn the teacher's internal representations — how the teacher models temporal dependencies, not just what it predicts.

I used a Wasserstein GAN formulation for the distillation loss. The student generates feature distributions; a discriminator tries to distinguish student features from teacher features. The adversarial training forces the student to learn distributions that are indistinguishable from the teacher's, not just outputs that are numerically close.

```python
def wgan_distillation_loss(
    teacher_features: torch.Tensor,
    student_features: torch.Tensor,
    discriminator: nn.Module,
    lambda_gp: float = 10.0,
) -> tuple[torch.Tensor, torch.Tensor]:
    # Wasserstein distance between feature distributions
    real_score = discriminator(teacher_features).mean()
    fake_score = discriminator(student_features.detach()).mean()
    w_distance = real_score - fake_score

    # Gradient penalty for Lipschitz constraint
    alpha = torch.rand(teacher_features.size(0), 1, 1, device=teacher_features.device)
    interpolated = alpha * teacher_features + (1 - alpha) * student_features.detach()
    interpolated.requires_grad_(True)
    interp_score = discriminator(interpolated).mean()
    gradients = torch.autograd.grad(
        outputs=interp_score,
        inputs=interpolated,
        create_graph=True,
    )[0]
    gp = lambda_gp * ((gradients.norm(2, dim=-1) - 1) ** 2).mean()

    d_loss = -w_distance + gp
    g_loss = -discriminator(student_features).mean()

    return d_loss, g_loss
```

### Stage 2: Neural Architecture Search for the Student

The student architecture isn't hand-designed — it's searched. I used Katib (Kubernetes-native NAS) to explore the architecture space: number of layers, hidden dimensions, attention heads, convolutional kernel sizes.

The key insight was constraining the search to architectures that fit within the target memory budget first, then optimizing for accuracy within that constraint. Searching for "accurate first, small second" reliably produces models that are accurate at teacher-scale but only marginally smaller.

The Pareto frontier of accuracy vs. model size was the actual objective:

```python
@dataclass
class ArchitectureSearchConfig:
    max_params: int = 500_000        # Hard constraint: 500K parameters max
    min_accuracy_threshold: float = 0.92  # Must beat baseline
    search_iterations: int = 200

    # Architecture search space
    num_layers: tuple[int, int] = (2, 6)
    hidden_dim: tuple[int, int] = (32, 256)
    kernel_sizes: list[int] = field(default_factory=lambda: [3, 5, 7, 11])
    use_attention: list[bool] = field(default_factory=lambda: [True, False])
```

### Stage 3: Iterative Magnitude Pruning

After distillation, the student network still had weights that contributed little to output accuracy. Post-training pruning removed these, with an iterative approach: prune 20% of the smallest-magnitude weights, fine-tune for 5 epochs, repeat.

The critical insight here is the fine-tuning between pruning rounds. Pruning all at once (structured or unstructured) loses too much information. The gradual approach allows the remaining weights to compensate for what was removed.

## The Results

The final model was 91% smaller than the teacher and achieved better accuracy on the test set — not just comparable. This is the counterintuitive result that motivated the thesis.

The explanation: the teacher model was over-parameterized for the task. Its large parameter count allowed it to learn representations that were accurate but redundant. The compression process forced the student to learn more efficient representations that generalized better.

This pattern — that constrained models sometimes outperform unconstrained ones on specific tasks — is well-documented in the literature but often underappreciated in practice. The constraint is the feature, not the bug.

## What This Taught Me About ML Engineering

Three things I carried from this work into production ML:

**1. Start with the deployment constraint.** The target hardware and its constraints should define the model architecture search space, not the other way around. "We'll optimize for deployment later" is how you end up with a great research model that can't be shipped.

**2. Adversarial training for representation matching is underused.** The WGAN distillation approach worked better than cross-entropy or MSE matching for distributional alignment. This generalizes: when you need two networks to produce similar internal representations, adversarial training is worth trying.

**3. Iterative compression beats aggressive one-shot compression.** Whether you're pruning, quantizing, or distilling, doing it gradually with fine-tuning between rounds consistently outperforms doing it all at once. The extra compute cost is worth it.

The automotive edge deployment constraint was the forcing function for all three of these insights. I've found that real constraints — not hypothetical ones, but actual hardware you have to run on — are the best teacher in ML engineering.

---

*Wassim Ben Salem is an MLOps Engineer specializing in production AI systems. His thesis work on neural compression for automotive edge deployment was graded 1.0 at TU Darmstadt. [LinkedIn](https://linkedin.com/in/wassimbensalem) · [X](https://x.com/wassimbs2)*
```

- [ ] **Step 4: Verify the blog renders**

```bash
npm run dev
```

Open http://localhost:3000 — Writing section should now show 3 post previews.
Open http://localhost:3000/blog — should list all 3 posts.
Open http://localhost:3000/blog/self-healing-ml-pipelines — should render the full post with correct MDX styling.

- [ ] **Step 5: Build check**

```bash
npm run build
```
Expected: Static generation of `/blog`, `/blog/self-healing-ml-pipelines`, `/blog/agentic-ai-engineer`, `/blog/neural-compression-edge` all succeed.

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "content: add 3 initial blog posts on MLOps, Agentic AI, and neural compression"
```

---

## Task 12: SEO — Sitemap, OG Image, robots.txt

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/og/route.tsx`

- [ ] **Step 1: Create sitemap**

Create `app/sitemap.ts`:
```ts
import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const baseUrl = 'https://wassimbensalem.com'

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...postEntries,
  ]
}
```

- [ ] **Step 2: Create robots.txt**

Create `app/robots.ts`:
```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://wassimbensalem.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Create OG image route**

Create `app/og/route.tsx`:
```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Wassim Ben Salem'
  const subtitle = searchParams.get('subtitle') ?? 'AI Systems Engineer'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Dot grid background simulation */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, #1A1A1A 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, transparent 40%, #0A0A0A 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: '#71717A',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            wassimbensalem.com
          </p>
          <h1
            style={{
              fontSize: title.length > 40 ? '42px' : '56px',
              fontWeight: 700,
              color: '#FAFAFA',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#A1A1AA',
              margin: 0,
              marginTop: '8px',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 4: Add RSS feed route**

Create `app/rss.xml/route.ts`:
```ts
import { getAllPosts } from '@/lib/mdx'

export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()
  const baseUrl = 'https://wassimbensalem.com'

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`
    )
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wassim Ben Salem — Writing</title>
    <link>${baseUrl}/blog</link>
    <description>On AI systems, production ML, and autonomous machines</description>
    <language>en</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
```

Add RSS link to `app/layout.tsx` metadata (inside the existing metadata export):
```tsx
// Add to the metadata object in layout.tsx:
alternates: {
  types: {
    'application/rss+xml': '/rss.xml',
  },
},
```

- [ ] **Step 6: Wire OG image into metadata**

Update `app/layout.tsx` to include the OG image URL:
```tsx
// Add to the metadata export (inside the openGraph object):
openGraph: {
  title: 'Wassim Ben Salem — AI Systems Engineer',
  description: 'MLOps engineer and Agentic AI builder based in Munich.',
  url: 'https://wassimbensalem.com',
  siteName: 'Wassim Ben Salem',
  type: 'website',
  images: [
    {
      url: '/og?title=Wassim%20Ben%20Salem&subtitle=AI%20Systems%20Engineer',
      width: 1200,
      height: 630,
    },
  ],
},
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```
Expected: `/sitemap.xml`, `/robots.txt`, and `/rss.xml` route generated. No errors.

- [ ] **Step 8: Commit**

```bash
git add app/sitemap.ts app/robots.ts app/og/ app/rss.xml/
git commit -m "feat: add sitemap, robots.txt, RSS feed, and dynamic OG image generation"
```

---

## Task 13: Performance & Final Polish

**Files:**
- Modify: `app/globals.css` (minor tweaks)
- Modify: `app/layout.tsx` (font preload)

- [ ] **Step 1: Add scroll padding for anchor links**

The sticky nav is 64px tall. Without `scroll-padding-top`, clicking nav links lands with content hidden under the nav. Add to `globals.css`:
```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;  /* nav height + buffer */
}
```

- [ ] **Step 2: Run Lighthouse locally and verify score**

```bash
npm run build && npm run start
```

In Chrome: open http://localhost:3000, open DevTools → Lighthouse → run for Desktop.

Target: Performance 90+. If below 90, the most common culprits are:
- Large images: verify `next/image` is used everywhere (it handles WebP conversion automatically)
- Render-blocking fonts: `next/font` handles this — verify Geist is loaded via `next/font`, not a CDN link
- Large JS bundles: run `npm run build` and check the bundle analysis output for anything over 100KB

- [ ] **Step 3: Add `loading="lazy"` note**

The `next/image` component handles lazy loading automatically for below-fold images. No manual action needed — but verify that the hero section does NOT use `loading="lazy"` (it should use `priority` if it has an image).

The hero in our implementation has no `<Image>` component — just CSS. This is correct for performance.

- [ ] **Step 4: Final build verification**

```bash
npm run build
```
Expected output should include:
```
Route (app)                          Size     First Load JS
┌ ○ /                                ...      ...
├ ○ /blog                            ...      ...
├ ● /blog/[slug]                     ...      ...
│   ├ /blog/self-healing-ml-pipelines
│   ├ /blog/agentic-ai-engineer
│   └ /blog/neural-compression-edge
└ ○ /og                              ...      ...
```

All routes should be static (○) except `/blog/[slug]` which is statically generated at build time (●).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: performance polish — scroll padding and final build verification"
```

---

## Task 14: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
gh repo create wassimbensalem-portfolio --private --source=. --remote=origin --push
```
Or if `gh` CLI isn't available:
```bash
# Create repo manually at github.com, then:
git remote add origin https://github.com/wassimbensalem/wassimbensalem-portfolio.git
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

Option A (CLI):
```bash
npx vercel --prod
```
Follow the prompts: link to Vercel account, create new project, accept all defaults for Next.js auto-detection.

Option B (Dashboard): Go to vercel.com/new, import the GitHub repo, deploy.

- [ ] **Step 3: Verify deployment**

After deploy completes, open the Vercel-provided URL (e.g., `wassimbensalem-portfolio.vercel.app`).

Check:
- [ ] Landing page loads with text scramble
- [ ] All 5 project cards visible in bento grid
- [ ] Experience timeline with metrics
- [ ] Writing section shows 3 posts
- [ ] Contact section with working copy-email button
- [ ] `/blog` shows all 3 posts
- [ ] `/blog/self-healing-ml-pipelines` renders with MDX prose styles
- [ ] Mobile nav (hamburger → Sheet) works

- [ ] **Step 4: Set custom domain (when ready)**

In Vercel Dashboard → Project Settings → Domains → Add `wassimbensalem.com`.
Update DNS at your registrar to point to Vercel's nameservers or A record.

---

## Post-Deploy Checklist

- [ ] Replace `wassimbensalem.com` placeholder with actual domain in `app/layout.tsx`, `lib/metadata.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/og/route.tsx`
- [ ] Submit sitemap to Google Search Console: `https://wassimbensalem.com/sitemap.xml`
- [ ] Add `@vercel/analytics` for visitor tracking (v2 feature, add when ready)
- [ ] Share on LinkedIn and X after launch

---

*Plan written 2026-03-30. Spec: `docs/superpowers/specs/2026-03-30-portfolio-design.md`*
