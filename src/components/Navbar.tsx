import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Writing', to: '/writing' },
  { label: 'Manifesto', to: '/#philosophy' },
  { label: 'Contact', to: '/#contact' },
]

function NavLink({ label, to, onClick }: { label: string; to: string; onClick?: () => void; className?: string }) {
  const location = useLocation()

  if (to.includes('#')) {
    const [path, hash] = to.split('#')
    const targetPath = path || '/'
    const isOnPage = location.pathname === targetPath

    const handleClick = (e: React.MouseEvent) => {
      onClick?.()
      if (isOnPage) {
        e.preventDefault()
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return (
      <Link to={to} onClick={handleClick}>
        {label}
      </Link>
    )
  }

  return (
    <Link to={to} onClick={onClick}>
      {label}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-4 left-0 right-0 z-50 px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Monogram */}
          <Link to="/" className="font-heading italic text-2xl text-white tracking-tight z-10">
            RA
          </Link>

          {/* Desktop nav pill */}
          <div
            className={cn(
              'hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500',
              scrolled ? 'liquid-glass-strong' : 'liquid-glass'
            )}
          >
            {navLinks.map((link) => (
              <span
                key={link.to}
                className="px-3 py-1.5 text-sm font-body font-light text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <NavLink label={link.label} to={link.to} />
              </span>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3 z-10">
            <Link
              to="/#contact"
              className="hidden md:flex items-center gap-1.5 bg-white text-black font-body font-medium text-sm px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
            >
              Connect <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            {navLinks.map((link) => (
              <span
                key={link.to}
                className="text-2xl font-heading italic text-white/80 hover:text-white transition-colors"
              >
                <NavLink label={link.label} to={link.to} onClick={() => setMobileOpen(false)} />
              </span>
            ))}
            <Link
              to="/#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center gap-2 bg-white text-black font-body font-medium px-6 py-3 rounded-full"
            >
              Connect <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
