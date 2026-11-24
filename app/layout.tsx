import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wassim Ben Salem — AI Systems Engineer',
  description: 'MLOps engineer and Agentic AI builder based in Munich. Production ML pipelines, autonomous agents, automotive AI.',
  openGraph: {
    title: 'Wassim Ben Salem — AI Systems Engineer',
    description: 'MLOps engineer and Agentic AI builder based in Munich.',
    url: 'https://wassimbensalem.com',
    siteName: 'Wassim Ben Salem',
    type: 'website',
    images: [
      {
        url: '/og?title=Wassim%20Ben%20Salem&subtitle=AI%20Systems%20Engineer',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@wassimbs2',
  },
  metadataBase: new URL('https://wassimbensalem.com'),
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-[--color-background] text-[--color-foreground] antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
