import { Briefcase, Sparkles, Layers3, Orbit } from 'lucide-react'
import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'

const focusAreas = [
  {
    icon: Briefcase,
    title: 'Sales Systems',
    desc: 'Refining outreach, territory planning, and customer engagement with sharper structure and better timing.',
  },
  {
    icon: Sparkles,
    title: 'AI Tooling',
    desc: 'Using AI to build workflows, prompts, content systems, dashboards, and decision support layers.',
  },
  {
    icon: Layers3,
    title: 'Personal Brand + Creative Projects',
    desc: 'Exploring media, websites, ideas, and digital assets that combine strategy with imagination.',
  },
  {
    icon: Orbit,
    title: 'Long-Term Future Thinking',
    desc: 'Deep interest in technology, intelligence, science, consciousness, and how systems evolve over time.',
  },
]

export default function FocusAreasSection() {
  return (
    <section className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionBadge text="Focus Areas" />
          <BlurText
            text="Some of the areas I care most about."
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {focusAreas.map((area, i) => (
            <GlassCard key={i} delay={i * 0.1} className="group hover:bg-white/[0.03] transition-colors duration-500">
              <area.icon className="w-5 h-5 text-white/40 mb-4 group-hover:text-white/60 transition-colors" />
              <h3 className="font-heading italic text-xl text-white mb-2">{area.title}</h3>
              <p className="font-body font-light text-white/40 text-sm leading-relaxed">{area.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
