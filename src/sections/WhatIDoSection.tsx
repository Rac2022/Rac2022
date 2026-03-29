import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'
import { Briefcase, Sparkles, Target, BookOpen } from 'lucide-react'
import { useLanguage } from '@/i18n'

const icons = [Briefcase, Sparkles, Target, BookOpen]

export default function WhatIDoSection() {
  const { t } = useLanguage()

  return (
    <section id="work" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionBadge text={t.focus.badge} />
          <BlurText
            text={t.focus.heading}
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.focus.areas.map((area, i) => {
            const Icon = icons[i]
            return (
              <GlassCard key={i} delay={i * 0.1} className="group hover:bg-white/[0.03] transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="liquid-glass rounded-xl p-3 flex-shrink-0">
                    <Icon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-heading italic text-lg text-white mb-2">{area.title}</h3>
                    <p className="font-body font-light text-white/40 text-sm leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
