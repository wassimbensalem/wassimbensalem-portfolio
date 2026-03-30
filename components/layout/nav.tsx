'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
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
            <SheetTrigger
              aria-label="Open menu"
              className="text-[--color-muted] hover:text-[--color-foreground] transition-colors"
            >
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[--color-background] border-[--color-border] w-72"
            >
              <div className="flex flex-col gap-8 mt-12 px-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <a
                        href={link.href}
                        className="font-mono text-lg text-[--color-muted] hover:text-[--color-foreground] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    }
                    nativeButton={false}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
