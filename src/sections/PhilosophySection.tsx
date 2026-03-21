import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'

const beliefs = [
  'Systems matter because attention is limited.',
  'Technology should amplify human capability, not flatten it.',
  'The future belongs to people who can learn, adapt, and build.',
  'Good strategy is clarity under complexity.',
  'Curiosity is not a distraction. It is leverage.',
]

function BeliefCard({ text, index }: { text: string; index: number }) {
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
        "{text}"
      </p>
    </motion.div>
  )
}

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left */}
        <div>
          <SectionBadge text="Philosophy" />
          <BlurText
            text="Curiosity is part of the operating system."
            as="h2"
            className="text-4xl md:text-5xl font-heading italic text-white leading-[0.85] tracking-[-2px] mb-8"
          />
          <p className="font-body font-light text-white/50 text-sm md:text-base leading-relaxed">
            The best systems are built by people who ask better questions. Strategy without curiosity is just process. Execution without vision is just motion. Rodolfo believes in staying close to the frontier — not because it's trendy, but because it's where leverage lives.
          </p>
        </div>

        {/* Right — belief cards */}
        <div className="space-y-3">
          {beliefs.map((belief, i) => (
            <BeliefCard key={i} text={belief} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
