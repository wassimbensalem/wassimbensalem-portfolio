'use client'

import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/motion-wrapper'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/wassimbensalem',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/wassimbs2',
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
                <div className="flex flex-col gap-2">
                  {SOCIAL_LINKS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center gap-2 font-sans text-sm text-[--color-muted] hover:text-[--color-accent] transition-colors duration-200"
                    >
                      {label}
                      <ExternalLink size={14} className="opacity-60" />
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
