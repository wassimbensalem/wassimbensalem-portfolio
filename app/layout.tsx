import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
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
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@wassimbs2',
  },
  metadataBase: new URL('https://wassimbensalem.com'),
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
      </body>
    </html>
  )
}
