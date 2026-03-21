import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'

const features = [
  {
    title: 'Business development with substance.',
    text: 'I help organizations uncover needs, build trust, and create momentum through thoughtful outreach, strategic positioning, and real relationship building.',
  },
  {
    title: 'AI-assisted workflows that save time.',
    text: 'I design systems, prompts, and tools that reduce friction, improve clarity, and turn scattered information into action.',
  },
  {
    title: 'Territory and opportunity intelligence.',
    text: 'I think in patterns, pipelines, timing, and leverage. I care about building smarter ways to spot opportunities and follow through.',
  },
  {
    title: 'Creative execution for modern ideas.',
    text: 'Whether it is a website, a concept, a dashboard, or a new business idea, I like turning raw vision into something tangible.',
  },
]

function FeatureRow({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
        isEven ? '' : 'lg:[direction:rtl]'
      }`}
    >
      <div className={isEven ? '' : 'lg:[direction:ltr]'}>
        <h3 className="font-heading italic text-2xl md:text-3xl text-white leading-[0.9] tracking-tight mb-4">
          {feature.title}
        </h3>
        <p className="font-body font-light text-white/50 text-sm md:text-base leading-relaxed">
          {feature.text}
        </p>
      </div>
      <div className={isEven ? '' : 'lg:[direction:ltr]'}>
        <div className="liquid-glass rounded-2xl aspect-[16/10] flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent flex items-center justify-center">
            <span className="font-body text-xs text-white/20 uppercase tracking-widest">Visual {index + 1}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function WhatIDoSection() {
  return (
    <section id="work" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <SectionBadge text="What I Do" />
          <BlurText
            text="From growth conversations to intelligent systems."
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center"
          />
        </div>

        <div className="space-y-20 md:space-y-28">
          {features.map((feature, i) => (
            <FeatureRow key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
