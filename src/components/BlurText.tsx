import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface BlurTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  delay?: number
}

export default function BlurText({ text, className, as: Tag = 'h2', delay = 0 }: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const words = text.split(' ')

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
