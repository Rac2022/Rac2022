import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'
import { Briefcase, Sparkles, Target, BookOpen } from 'lucide-react'

const areas = [
  {
    icon: Briefcase,
    title: 'Business Development',
    desc: 'Complex B2B sales, territory strategy, and growth systems built on relationships, not just pipelines.',
  },
  {
    icon: Sparkles,
    title: 'AI Systems & Workflows',
    desc: 'Designing AI-assisted processes where machines handle the repeatable and humans handle the irreplaceable.',
  },
  {
    icon: Target,
    title: 'Strategy & Systems Design',
    desc: 'Turning complexity into clarity. Building the structures that produce good decisions, not just fast ones.',
  },
  {
    icon: BookOpen,
    title: 'Writing & Thinking',
    desc: 'Long-form essays on intelligence, judgment, and the deeper questions that shape how we build the future.',
  },
]

export default function WhatIDoSection() {
  return (
    <section id="work" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionBadge text="Focus" />
          <BlurText
            text="Where I spend my time and attention."
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((area, i) => (
            <GlassCard key={i} delay={i * 0.1} className="group hover:bg-white/[0.03] transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="liquid-glass rounded-xl p-3 flex-shrink-0">
                  <area.icon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                </div>
                <div>
                  <h3 className="font-heading italic text-lg text-white mb-2">{area.title}</h3>
                  <p className="font-body font-light text-white/40 text-sm leading-relaxed">{area.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
