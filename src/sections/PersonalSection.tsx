import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'

export default function PersonalSection() {
  return (
    <section className="relative py-28 md:py-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <SectionBadge text="Beyond Work" />
        <BlurText
          text="Built by ambition. Grounded by life."
          as="h2"
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center mb-8"
        />

        <p className="max-w-2xl mx-auto font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-6">
          Behind the systems and strategy is a person grounded by family, fueled by curiosity, and driven by the belief that meaningful work and meaningful life aren't separate things.
        </p>
        <p className="max-w-2xl mx-auto font-body font-light text-white/40 text-sm leading-relaxed mb-14">
          Rodolfo finds energy in learning — about science, technology, nature, and the deeper questions that don't have quick answers. He's building a better future for the people he loves, one system, one idea, and one conversation at a time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <GlassCard delay={0} className="text-center">
            <h4 className="font-heading italic text-lg text-white mb-1">Family First</h4>
            <p className="font-body font-light text-white/40 text-xs">Grounded by the people who matter most.</p>
          </GlassCard>
          <GlassCard delay={0.1} className="text-center">
            <h4 className="font-heading italic text-lg text-white mb-1">Always Learning</h4>
            <p className="font-body font-light text-white/40 text-xs">Science, technology, ideas, and the unknown.</p>
          </GlassCard>
          <GlassCard delay={0.2} className="text-center">
            <h4 className="font-heading italic text-lg text-white mb-1">Future Builder</h4>
            <p className="font-body font-light text-white/40 text-xs">Creating something lasting and meaningful.</p>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
