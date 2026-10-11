import { Link } from 'react-router-dom'
import { NextStepLogo } from './Navbar'

const FOOTER_LINKS = {
  Platform: [
    { to: '/features', label: 'Feature Index' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/about', label: 'Mission & Vision' },
  ],
  Workspace: [
    { to: '/login', label: 'Sign In' },
    { to: '/register', label: 'Create Account' },
    { to: '/app', label: 'Member Dashboard' },
  ],
  Resources: [
    { to: '/contact', label: 'Contact & Support' },
    { to: '/privacy', label: 'Privacy Notice' },
    { to: '/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-slate-300 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                    <path d="M4 19 L10 13 L14 16 L20 6" />
                    <polyline points="15 6 20 6 20 11" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Next<span className="text-emerald-400">Step</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering students, fresh graduates, and early professionals to turn ambition into a structured career plan and lasting financial wellness.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Made for Indian students & graduates
              </span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-slate-400 hover:text-emerald-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NextStep. Built with care for student professional & financial literacy.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-slate-400 hover:text-white transition-colors">
              Privacy Notice
            </Link>
            <Link to="/terms" className="text-xs text-slate-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-xs text-slate-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
