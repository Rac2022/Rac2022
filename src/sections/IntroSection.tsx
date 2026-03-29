import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'

const pillars = [
  { title: 'AI Systems', desc: 'Building workflows where machines handle process and humans handle judgment' },
  { title: 'Strategy', desc: 'Turning complexity into clarity through systems thinking' },
  { title: 'Writing', desc: 'Essays on intelligence, decision-making, and the path ahead' },
  { title: 'Long-Term Thinking', desc: 'Asking the questions that matter in five years, not five minutes' },
]

export default function IntroSection() {
  return (
    <section className="relative py-28 md:py-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <SectionBadge text="Who I Am" />

        <BlurText
          text="Builder. Strategist. Student of what comes next."
          as="h2"
          className="text-4xl md:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center mb-8"
        />

        <p className="max-w-2xl mx-auto font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-6">
          I sit at the intersection of business development, AI systems, and long-range strategy. Most people chase tools. I think about the thinking behind the tools.
        </p>
        <p className="max-w-2xl mx-auto font-body font-light text-white/40 text-sm leading-relaxed mb-16">
          This site is where I share that thinking: essays on intelligence, systems design, and the human decisions that technology cannot replace.
        </p>

        {/* Pillar strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, i) => (
            <GlassCard key={i} delay={i * 0.1} className="text-left">
              <h4 className="font-body font-medium text-white text-sm mb-1">{pillar.title}</h4>
              <p className="font-body font-light text-white/40 text-xs leading-relaxed">{pillar.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
