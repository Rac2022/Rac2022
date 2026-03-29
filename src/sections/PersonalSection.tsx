import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'
import { useLanguage } from '@/i18n'

export default function PersonalSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-28 md:py-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <SectionBadge text={t.personal.badge} />
        <BlurText
          text={t.personal.heading}
          as="h2"
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center mb-8"
        />

        <p className="max-w-2xl mx-auto font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-6">
          {t.personal.p1}
        </p>
        <p className="max-w-2xl mx-auto font-body font-light text-white/40 text-sm leading-relaxed mb-14">
          {t.personal.p2}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {t.personal.cards.map((card, i) => (
            <GlassCard key={i} delay={i * 0.1} className="text-center">
              <h4 className="font-heading italic text-lg text-white mb-1">{card.title}</h4>
              <p className="font-body font-light text-white/40 text-xs">{card.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
