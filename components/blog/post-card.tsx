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
