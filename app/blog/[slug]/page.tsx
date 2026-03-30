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
          <h1
            className="font-sans font-bold text-[--color-foreground] leading-tight tracking-[-0.02em] mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
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
