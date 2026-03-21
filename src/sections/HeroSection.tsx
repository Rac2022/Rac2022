import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import BlurText from '@/components/BlurText'
import AnimatedBackground from '@/components/AnimatedBackground'

const credibilityItems = ['Business Development', 'AI Workflows', 'Personal Systems', 'Creative Technology']

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[1000px] flex flex-col items-center justify-center bg-black overflow-visible">
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-20 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-block mb-10"
        >
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs font-body font-medium text-white/70">
            Business Development • AI Systems • Strategy • Builder
          </span>
        </motion.div>

        {/* Hero heading */}
        <BlurText
          text="Building smarter systems for work, growth, and the future."
          as="h1"
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px] md:tracking-[-4px] justify-center mb-8"
          delay={0.6}
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="max-w-2xl mx-auto font-body font-light text-white/50 text-base md:text-lg leading-relaxed mb-10"
        >
          Rodolfo Avalos blends business development, AI-enabled workflows, strategic thinking, and creative execution to build modern systems that perform.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <a
            href="#work"
            className="liquid-glass-strong flex items-center gap-2 px-6 py-3 rounded-full font-body font-medium text-sm text-white hover:bg-white/10 transition-colors"
          >
            See My Work <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="#about"
            className="font-body font-light text-sm text-white/50 hover:text-white transition-colors"
          >
            About Rodolfo
          </a>
        </motion.div>

        {/* Credibility row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {credibilityItems.map((item, i) => (
            <span key={i} className="font-body text-xs font-light text-white/30 uppercase tracking-wider">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  )
}
