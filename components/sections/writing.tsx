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
