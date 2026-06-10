import { useEffect, useRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'quiet' | 'ghost' | 'danger'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-red text-white hover:bg-press active:bg-press border border-red hover:border-press',
  quiet: 'bg-card text-ink border border-rule hover:border-soft',
  ghost: 'bg-transparent text-soft border border-transparent hover:text-ink underline underline-offset-4 decoration-rule hover:decoration-soft',
  danger: 'bg-card text-red border border-red hover:bg-tint',
}

export function Button({
  variant = 'quiet',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`rounded-ledger px-4 py-2.5 text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
    />
  )
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLElement>('button, input, [tabindex]')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-ledger border border-rule bg-card p-5"
      >
        <h2 className="font-display text-h3">{title}</h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-caption tracking-[0.12em] text-soft uppercase">{children}</div>
  )
}
