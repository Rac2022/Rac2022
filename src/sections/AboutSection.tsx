import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'
import { useLanguage } from '@/i18n'

export default function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="about" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <SectionBadge text={t.about.badge} />
          <BlurText
            text={t.about.heading}
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] mb-8"
          />
          <p className="font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-4">
            {t.about.p1}
          </p>
          <p className="font-body font-light text-white/40 text-sm leading-relaxed">
            {t.about.p2}
          </p>
        </div>

        <div className="space-y-4">
          <GlassCard variant="strong" className="aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}me.JPG`}
              alt={t.about.imgAlt}
              loading="lazy"
              decoding="async"
              width={600}
              height={450}
              className="w-full h-full object-cover rounded-xl"
            />
          </GlassCard>

          <GlassCard delay={0.2}>
            <ul className="space-y-3">
              {t.about.bullets.map((bullet, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                  <span className="font-body font-light text-white/60 text-sm">{bullet}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
