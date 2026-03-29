import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body font-light text-white/30 text-xs">
          &copy; 2026 Rodolfo Avalos
        </p>
        <div className="flex items-center gap-6">
          <Link to="/writing" className="font-body font-light text-white/30 text-xs hover:text-white/60 transition-colors">
            Writing
          </Link>
          <a
            href="https://www.linkedin.com/in/rodolfo-avalos-69683168/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-light text-white/30 text-xs hover:text-white/60 transition-colors"
          >
            LinkedIn
          </a>
          <Link to="/#contact" className="font-body font-light text-white/30 text-xs hover:text-white/60 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
