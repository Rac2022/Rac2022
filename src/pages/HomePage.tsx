import { lazy, Suspense } from 'react'
import HeroSection from '@/sections/HeroSection'

const IntroSection = lazy(() => import('@/sections/IntroSection'))
const AboutSection = lazy(() => import('@/sections/AboutSection'))
const WhatIDoSection = lazy(() => import('@/sections/WhatIDoSection'))
const WritingSection = lazy(() => import('@/sections/WritingSection'))
const PhilosophySection = lazy(() => import('@/sections/PhilosophySection'))
const PersonalSection = lazy(() => import('@/sections/PersonalSection'))
const ContactSection = lazy(() => import('@/sections/ContactSection'))

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense>
        <IntroSection />
        <AboutSection />
        <WhatIDoSection />
        <WritingSection />
        <PhilosophySection />
        <PersonalSection />
        <ContactSection />
      </Suspense>
    </>
  )
}
