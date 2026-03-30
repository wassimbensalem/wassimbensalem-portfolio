import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
      </main>
      <Footer />
    </>
  )
}
