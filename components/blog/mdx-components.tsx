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

// Chart — stub placeholder
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
