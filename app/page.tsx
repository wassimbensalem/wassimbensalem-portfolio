import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Experience } from '@/components/sections/experience'
import { Writing } from '@/components/sections/writing'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
