import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  )
}
