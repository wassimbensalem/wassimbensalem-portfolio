import type { Metadata } from 'next'

interface PageMetaInput {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  publishedAt?: string
}

export function buildMetadata({
  title,
  description,
  path = '',
  type = 'website',
  publishedAt,
}: PageMetaInput): Metadata {
  const url = `https://wassimbensalem.com${path}`

  return {
    title: `${title} — Wassim Ben Salem`,
    description,
    openGraph: {
      title: `${title} — Wassim Ben Salem`,
      description,
      url,
      type,
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
    },
    alternates: {
      canonical: url,
    },
  }
}
