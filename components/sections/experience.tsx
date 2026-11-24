import { FadeUp, StaggerContainer, StaggerItem } from '@/components/motion-wrapper'
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
    title: 'MSc Computer Science — with Distinction',
    org: 'Technical University of Darmstadt',
    period: 'GPA 1.2 · Thesis 1.0',
    location: 'Darmstadt, Germany',
    highlight:
      'Thesis: Generative compression of time-series models using WGANs, Knowledge Distillation, and Neural Architecture Search for automotive edge deployment.',
    metric: '91% model size reduction · state-of-the-art benchmarks',
  },
  {
    title: 'McKinsey Forward Program',
    org: 'McKinsey & Company',
    period: '2023',
    location: 'Certificate',
    highlight:
      'Selective leadership and capability-building program. Focus on structured problem solving, data-driven decision making, and effective communication in complex organizations.',
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

        {/* CV download — use buttonVariants() + <a> tag */}
        <FadeUp delay={0.4} className="mt-12">
          <a
            href="/wassim-ben-salem-cv.pdf"
            download
            className="inline-flex items-center gap-2 font-mono text-xs border border-[--color-border] text-[--color-muted] hover:text-[--color-foreground] hover:border-[--color-muted] bg-transparent px-4 py-2 rounded-md transition-colors duration-200"
          >
            <Download size={14} />
            Download CV (PDF)
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
