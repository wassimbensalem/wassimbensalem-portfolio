import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Allow importing .mdx files as pages if needed later
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

export default nextConfig
