import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'

const stats = [
  { title: 'Sales + Growth', desc: 'B2B strategy and relationship building' },
  { title: 'AI + Automation', desc: 'Turning ideas into working systems' },
  { title: 'Builder Mindset', desc: 'From prompts and workflows to deployed tools' },
  { title: 'Big Curiosity', desc: 'Science, technology, philosophy, and future thinking' },
]

export default function IntroSection() {
  return (
    <section className="relative py-28 md:py-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <SectionBadge text="Who I Am" />

        <BlurText
          text="Operator. Builder. Curious mind."
          as="h2"
          className="text-4xl md:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center mb-8"
        />

        <p className="max-w-2xl mx-auto font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-6">
          Strategic in business. Creative in execution. Obsessive about systems. Curious about what comes next.
        </p>
        <p className="max-w-2xl mx-auto font-body font-light text-white/40 text-sm leading-relaxed mb-16">
          I work at the intersection of business development, territory strategy, compliance-driven sales systems, and AI-assisted workflows — while side projects and deep curiosity about science and technology keep the engine running.
        </p>

        {/* Stat strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <GlassCard key={i} delay={i * 0.1} className="text-left">
              <h4 className="font-body font-medium text-white text-sm mb-1">{stat.title}</h4>
              <p className="font-body font-light text-white/40 text-xs leading-relaxed">{stat.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
