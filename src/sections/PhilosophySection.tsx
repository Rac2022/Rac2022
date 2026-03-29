import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import { useLanguage } from '@/i18n'

function PrincipleCard({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className="liquid-glass rounded-2xl p-5 hover:bg-white/[0.03] transition-colors duration-500"
    >
      <p className="font-body font-light text-white/70 text-sm md:text-base leading-relaxed italic">
        &ldquo;{text}&rdquo;
      </p>
    </motion.div>
  )
}

export default function PhilosophySection() {
  const { t } = useLanguage()

  return (
    <section id="philosophy" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <SectionBadge text={t.manifesto.badge} />
          <BlurText
            text={t.manifesto.heading}
            as="h2"
            className="text-4xl md:text-5xl font-heading italic text-white leading-[0.85] tracking-[-2px] mb-8"
          />
          <p className="font-body font-light text-white/50 text-sm md:text-base leading-relaxed">
            {t.manifesto.body}
          </p>
        </div>

        <div className="space-y-3">
          {t.manifesto.principles.map((principle, i) => (
            <PrincipleCard key={i} text={principle} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
