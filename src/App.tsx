import Navbar from '@/components/Navbar'
import HeroSection from '@/sections/HeroSection'
import IntroSection from '@/sections/IntroSection'
import AboutSection from '@/sections/AboutSection'
import WhatIDoSection from '@/sections/WhatIDoSection'
import FocusAreasSection from '@/sections/FocusAreasSection'
import ProjectsSection from '@/sections/ProjectsSection'
import PhilosophySection from '@/sections/PhilosophySection'
import PersonalSection from '@/sections/PersonalSection'
import ContactSection from '@/sections/ContactSection'
import Footer from '@/sections/Footer'

export default function App() {
  return (
    <div className="bg-black text-white overflow-visible min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <AboutSection />
        <WhatIDoSection />
        <FocusAreasSection />
        <ProjectsSection />
        <PhilosophySection />
        <PersonalSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
