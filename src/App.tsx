import { lazy, Suspense } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/sections/HeroSection'

// Lazy load below-the-fold sections
const IntroSection = lazy(() => import('@/sections/IntroSection'))
const AboutSection = lazy(() => import('@/sections/AboutSection'))
const WhatIDoSection = lazy(() => import('@/sections/WhatIDoSection'))
const FocusAreasSection = lazy(() => import('@/sections/FocusAreasSection'))
const ProjectsSection = lazy(() => import('@/sections/ProjectsSection'))
const PhilosophySection = lazy(() => import('@/sections/PhilosophySection'))
const PersonalSection = lazy(() => import('@/sections/PersonalSection'))
const ContactSection = lazy(() => import('@/sections/ContactSection'))
const Footer = lazy(() => import('@/sections/Footer'))

export default function App() {
  return (
    <div className="bg-black text-white overflow-visible min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <Suspense>
          <IntroSection />
          <AboutSection />
          <WhatIDoSection />
          <FocusAreasSection />
          <ProjectsSection />
          <PhilosophySection />
          <PersonalSection />
          <ContactSection />
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  )
}
