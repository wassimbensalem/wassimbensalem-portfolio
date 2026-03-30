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
