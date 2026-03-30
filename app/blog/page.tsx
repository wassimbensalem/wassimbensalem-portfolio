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
