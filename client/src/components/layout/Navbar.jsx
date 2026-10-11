import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/contact', label: 'Contact' },
]

export function NextStepLogo({ className = '', iconOnly = false }) {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-forest-900 shadow-sm border border-emerald-500/20 text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 translate-x-px"
        >
          <path d="M4 19 L10 13 L14 16 L20 6" />
          <polyline points="15 6 20 6 20 11" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-white" />
        </span>
      </div>
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-extrabold tracking-tight text-charcoal">
              Next<span className="text-emerald-600">Step</span>
            </span>
          </div>
          <span className="text-[9.5px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
            Career & Finance
          </span>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <NextStepLogo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-warm/80 border border-border/60 rounded-full px-4 py-1.5 shadow-2xs">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-[13px] font-medium px-3 py-1.5 rounded-full transition-all duration-150',
                    isActive
                      ? 'bg-white text-emerald-800 font-semibold shadow-xs border border-border/50'
                      : 'text-slate-600 hover:text-charcoal hover:bg-white/60'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 px-3.5 py-2 rounded-lg transition-colors hover:bg-mint-50/60"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-forest-900 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-charcoal rounded-lg hover:bg-surface-subtle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block text-sm font-medium py-2 px-3 rounded-lg',
                    isActive
                      ? 'bg-mint-100/60 text-emerald-900 font-semibold'
                      : 'text-slate-700 hover:bg-surface-warm'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-3 flex flex-col gap-2 border-t border-border">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold text-slate-700 border border-border rounded-lg hover:bg-surface-warm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
