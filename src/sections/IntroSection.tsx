import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'
import { useLanguage } from '@/i18n'

export default function IntroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-28 md:py-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <SectionBadge text={t.intro.badge} />

        <BlurText
          text={t.intro.heading}
          as="h2"
          className="text-4xl md:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center mb-8"
        />

        <p className="max-w-2xl mx-auto font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-6">
          {t.intro.p1}
        </p>
        <p className="max-w-2xl mx-auto font-body font-light text-white/40 text-sm leading-relaxed mb-16">
          {t.intro.p2}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.intro.pillars.map((pillar, i) => (
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
