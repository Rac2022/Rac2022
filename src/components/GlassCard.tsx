import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'subtle' | 'strong'
  delay?: number
}

export default function GlassCard({ children, className, variant = 'subtle', delay = 0 }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        'rounded-2xl p-6',
        variant === 'subtle' ? 'liquid-glass' : 'liquid-glass-strong',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
