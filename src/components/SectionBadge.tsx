import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface SectionBadgeProps {
  text: string
}

export default function SectionBadge({ text }: SectionBadgeProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4"
    >
      {text}
    </motion.span>
  )
}
