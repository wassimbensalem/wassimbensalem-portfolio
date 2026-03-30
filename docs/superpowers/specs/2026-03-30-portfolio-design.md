# Portfolio Website — Design Spec
**Date:** 2026-03-30
**Author:** Wassim Ben Salem
**Status:** Approved

---

## 1. Overview

Personal portfolio website for Wassim Ben Salem — AI Systems Engineer based in Munich, Germany.

**Core message:** The rare engineer who can both design and ship AI systems. Production MLOps discipline + Agentic AI frontier work in one profile.

**Three goals (equal weight):**
1. Land senior ML/AI engineering roles
2. Build personal brand in the Agentic AI / MLOps space
3. Attract consulting / freelance pipeline for AI system design

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Already used in Diwan; full RSC support; Vercel-native; latest stable |
| Styling | Tailwind CSS v4 | CSS-first config, Lightning CSS, design token system |
| Animations | Framer Motion 11 (`motion/react`) | Spring-based, declarative, React-native |
| Blog | MDX via `next-mdx-remote` | Interactive React components in posts |
| Components | shadcn/ui | Button, Card, Badge, Sheet (mobile nav), Skeleton |
| Typography | `next/font` → Geist Sans + Geist Mono | Zero CLS, self-hosted, Vercel's own type system |
| Images | `next/image` | Automatic WebP/AVIF, retina-ready |
| Deployment | Vercel (Hobby tier) | Native Next.js, preview URLs, edge CDN |
| Domain | `wassimbensalem.com` (placeholder) | Replace with actual domain before launch |

---

## 3. Visual Design System

### Color Tokens (globals.css)

```css
:root {
  --background:     #0A0A0A;   /* deep black, not pure */
  --foreground:     #FAFAFA;   /* primary text */
  --muted:          #71717A;   /* zinc-500, secondary text */
  --muted-light:    #A1A1AA;   /* zinc-400, captions */
  --border:         #1A1A1A;   /* barely-visible structure */
  --card:           #111111;   /* card backgrounds */
  --accent:         oklch(0.65 0.2 220);   /* electric blue */
  --accent-glow:    oklch(0.65 0.2 220 / 0.15); /* hover states */
}
```

**Rules:**
- One accent color only — never use multiple accent colors
- No text gradients (dated as of 2025)
- Subtle CSS dot grid background on hero (no animations, pure CSS)
- Grain/noise overlay at 4% opacity on cards for tactility

### Typography

| Role | Font | Weight | Size (desktop) | Tracking |
|---|---|---|---|---|
| Display (name) | Geist Sans | 700 | `clamp(2.5rem, 8vw, 4.5rem)` | `-0.03em` |
| Section headings | Geist Sans | 600 | `2rem` | `-0.02em` |
| Body | Geist Sans | 400 | `1rem` / `1.625` line-height | normal |
| Mono labels | Geist Mono | 400 | `0.8125rem` | `0.05em` |
| Tech badges | Geist Mono | 400 | `0.75rem` | normal |

### Motion Language

- **Entrance:** `fade-up 40px, 0.6s ease-out` — all section entries via Framer Motion
- **Stagger:** `0.08s` between children in grids/lists
- **Hover:** `200ms ease` for all interactive states
- **Page load text:** Name scrambles from random chars → settles in `1.2s`
- **Nav blur:** Appears at `scrollY > 80px` with `backdrop-blur-md`
- **`prefers-reduced-motion`:** All Framer Motion animations disabled; CSS transitions kept at `200ms`

---

## 4. URL Structure

```
/                    → Landing page (single-scroll)
/blog                → Blog index (all posts)
/blog/[slug]         → Individual MDX post
```

No `/projects/[slug]` for now — project depth lives on the cards themselves. Can be added later.

---

## 5. Page Sections (in order)

### 5.1 Navigation

- **Position:** Sticky top, `z-50`
- **Layout:** `max-w-6xl mx-auto px-6`, flex row, space-between
- **Left:** `WBS` monogram in Geist Mono 500, links to `#hero`
- **Right (desktop):** Links — Projects · Blog · Contact
- **Right (mobile):** Hamburger icon → shadcn `Sheet` with stacked nav links (full-screen overlay feel)
- **Scroll behavior:** On `scrollY > 80px`, `backdrop-blur-md` + `border-b border-[--border]` fade in with `transition: 300ms`
- **Active state:** Current section link gets accent color underline via Intersection Observer

---

### 5.2 Hero

- **Height:** `100dvh`, centered flex column
- **Content (top to bottom):**

```
WASSIM BEN SALEM
← Geist Sans 700, display size, letter-spacing -0.03em
← Framer Motion: fade-up on mount, 0.6s

AI Systems Engineer
← Geist Mono, --muted-light, 16px
← Text scramble effect: random chars → readable text, 1.2s duration

Production MLOps  ·  Agentic AI  ·  Munich
← Geist Mono, --muted, 13px, tracking widened
← Fade in after subtitle settles, 0.3s delay

[ View Projects ]  [ Get in Touch ]
← shadcn Button: variant="default" (filled accent) | variant="outline"
← Fade in last, 0.5s delay
```

- **Background:** CSS radial-gradient dot grid using `--border` color dots at `24px` spacing. Static — no JS, no canvas.
- **Scroll indicator:** Small animated chevron at bottom center, fades out after first scroll

---

### 5.3 Selected Work

- **Heading:** `Selected Work` in section heading style
- **Layout:** Bento grid (`grid-cols-3` desktop, `grid-cols-1` mobile)

```
┌─────────────────────┬──────────────┐
│  ReviveAI  (col-2)  │  TessynAI    │
├──────────┬──────────┴──────────────┤
│  Diwan   │  Menalena  │   Hidaya   │
└──────────┴────────────┴────────────┘
```

**Card anatomy (each):**
- Background: `--card` (#111111)
- Border: `1px solid --border` → on hover: `1px solid --accent-glow`
- Padding: `p-6`
- Top: Project name (Geist Sans 600, 18px) + Year (Geist Mono, --muted, right-aligned)
- Middle: One-line description (body, --muted-light)
- Bottom: Tech stack badges (shadcn `Badge` variant="secondary", Geist Mono xs)
- Hover: `scale(1.01)`, border glow, `200ms ease`
- All repos private — no external links on cards

| Project | One-liner | Tech Tags | Year |
|---|---|---|---|
| **ReviveAI** | Autonomous agent that industrializes ML research reproducibility with self-healing workflows | Python · Agentic AI · LLMs · MLOps | 2024 |
| **TessynAI** | Clean messy sensor time-series data 10× faster using natural language | LangGraph · FastAPI · React · PostgreSQL | 2024 |
| **Diwan** | AI financial copilot for German freelancers — tax, invoicing, compliance via Telegram | Claude API · FastAPI · pgvector · Next.js | 2024 |
| **Menalena** | Co-founded logistics platform connecting Tunisian clients with European transporters | Angular · Spring Boot · Entrepreneurship | 2022 |
| **Hidaya** | Chrome extension for daily Islamic practice — prayer times, mosque finder, Quran ayahs | Chrome Extension · Vanilla JS | 2023 |

---

### 5.4 Experience

- **Heading:** `Experience`
- **Layout:** Vertical timeline, left-border accent line (`2px solid --border`), `max-w-2xl`
- **Entries (3):**

```
Compredict GmbH — MLOps Engineer
Oct 2024 – Present · Darmstadt, Germany
"End-to-end automotive AI pipelines — 70% faster dev cycles, 63% cloud cost reduction."

Technical University of Darmstadt — MSc Computer Science, Honors
GPA 1.2 · Thesis grade 1.0
"Generative neural compression via WGANs — 91% size reduction for automotive edge deployment."

Earlier experience: Capgemini · Merck KGaA
← Shown in muted/collapsed style — available on CV
```

- **CV download link:** `Download CV (PDF)` in Geist Mono, ghost button style, links to `/wassim-ben-salem-cv.pdf` (static file in `/public`)

---

### 5.5 Writing

- **Heading:** `Writing`
- **Subtitle (Geist Mono, --muted):** `On AI systems, production ML, and autonomous machines`
- **Layout:** 3 post preview cards, single column, `max-w-2xl`

**Card anatomy:**
- Date + reading time in Geist Mono --muted (top)
- Post title in Geist Sans 600 (large)
- First sentence / excerpt in body --muted-light
- Hover: title color shifts to --accent, `translate-x(4px)` on arrow icon

**Initial blog posts (Claude-authored, Wassim-reviewed):**

| Slug | Title | Focus |
|---|---|---|
| `self-healing-ml-pipelines` | Building Self-Healing ML Pipelines: Lessons from Automotive AI at Scale | MLOps, Kubeflow, production patterns |
| `agentic-ai-engineer` | The Agentic AI Engineer: Why Production Experience Changes Everything | Agentic AI, LangGraph, systems thinking |
| `neural-compression-edge` | 91% Smaller, Just as Smart: Compressing Neural Networks for Edge Deployment | WGAN thesis, automotive, NAS |

- **"View all posts →"** link below the 3 previews

---

### 5.6 Contact

- **Heading:** `Let's work together`
- **Layout:** Two columns (desktop), stacked (mobile)

**Left column:**
```
Open to:
  · Senior ML/AI engineering roles
  · MLOps architecture consulting
  · Agentic AI system design
  · Co-founder conversations — building an Agentic AI platform

Available in Munich and remotely.
Response time: within 24 hours.
```

**Right column:**
- Email: `bswassim@gmail.com` — displayed as text + copy-to-clipboard button
- Social icons (lucide-react): LinkedIn → `linkedin.com/in/wassimbensalem` · X → `x.com/wassimbs2`
- No GitHub link (all repos private)

---

### 5.7 Footer

```
© 2026 Wassim Ben Salem  ·  Built with Next.js  ·  Deployed on Vercel
```

Single row, centered, Geist Mono --muted, 12px. No extra links.

---

## 6. Blog Architecture

### MDX Setup
- Posts stored in `/content/blog/[slug].mdx`
- Frontmatter schema:
```yaml
---
title: string
date: YYYY-MM-DD
readingTime: string  # "8 min read"
excerpt: string      # 1-2 sentences shown in preview card
tags: string[]
---
```

### Interactive Components Available in Posts
- `<Callout>` — highlighted note box
- `<CodeBlock>` — syntax-highlighted code (Shiki)
- `<Chart>` — for data visualizations (lazy-loaded Recharts)

### RSS Feed
- Auto-generated at `/rss.xml` from MDX frontmatter
- Enables LinkedIn article cross-posting and newsletter potential

---

## 7. Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| LCP | < 2.5s |
| CLS | 0 (all images have explicit dimensions) |
| INP | < 200ms |
| Total JS (homepage) | < 120KB gzipped |
| Font loading | Zero FOUC via `next/font` |

**Key optimizations:**
- Text scramble effect is pure CSS + minimal JS — no heavy library
- Framer Motion tree-shaken; only used in `'use client'` components
- All images via `next/image` with `width`/`height` to prevent CLS
- Dot grid background is pure CSS — no canvas, no JS

---

## 8. Project File Structure

```
PersonalPortfolio/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Landing page (all sections)
│   ├── blog/
│   │   ├── page.tsx        # Blog index
│   │   └── [slug]/
│   │       └── page.tsx    # Individual post
│   └── globals.css         # Design tokens, Tailwind v4 config
├── components/
│   ├── layout/
│   │   ├── nav.tsx         # Sticky navigation
│   │   └── footer.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── projects.tsx
│   │   ├── experience.tsx
│   │   ├── writing.tsx
│   │   └── contact.tsx
│   ├── blog/
│   │   ├── post-card.tsx
│   │   └── mdx-components.tsx  # Callout, CodeBlock, Chart
│   └── ui/                 # shadcn/ui components
├── content/
│   └── blog/
│       ├── self-healing-ml-pipelines.mdx
│       ├── agentic-ai-engineer.mdx
│       └── neural-compression-edge.mdx
├── public/
│   ├── wassim-ben-salem-cv.pdf
│   └── images/
│       └── wassim.jpg      # from cv/wassim-ben-salem.1024x1024.jpg
└── lib/
    ├── mdx.ts              # MDX parsing utilities
    └── metadata.ts         # SEO metadata helpers
```

---

## 9. SEO & Metadata

- `<title>`: `Wassim Ben Salem — AI Systems Engineer`
- `<description>`: `MLOps engineer and Agentic AI builder based in Munich. Production ML pipelines, autonomous agents, automotive AI.`
- Open Graph image: Auto-generated with `@vercel/og` — name + role on dark background
- `sitemap.xml` auto-generated from pages + blog slugs
- `robots.txt`: allow all
- Canonical URLs on all pages

---

## 10. Out of Scope (v1)

- Comments on blog posts
- Newsletter signup
- `/projects/[slug]` deep-dive case study pages
- Dark/light mode toggle (dark-only for v1)
- Analytics (add `@vercel/analytics` in v2)
- Contact form backend (email link only for v1)

---

## 11. Social Links Reference

| Platform | URL |
|---|---|
| LinkedIn | `https://linkedin.com/in/wassimbensalem` |
| X (Twitter) | `https://x.com/wassimbs2` |
| Email | `bswassim@gmail.com` |
| Domain | `wassimbensalem.com` (placeholder — update before launch) |

---

*Spec approved by Wassim Ben Salem · 2026-03-30*
