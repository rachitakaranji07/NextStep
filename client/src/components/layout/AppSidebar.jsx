import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  TrendingUp,
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Wallet,
  PieChart,
  Target,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn, getInitials } from '../../lib/utils'
import { showToast } from '../ui/Toast'

const NAV_ITEMS = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/career', label: 'Career Planner', icon: Briefcase },
  { to: '/app/jobs', label: 'Job Applications', icon: ClipboardList },
  { to: '/app/finance', label: 'Finance Tracker', icon: Wallet },
  { to: '/app/budgets', label: 'Budgets', icon: PieChart },
  { to: '/app/savings', label: 'Savings Goals', icon: Target },
  { to: '/app/profile', label: 'Profile & Settings', icon: User },
]

export function AppSidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      showToast.error('Logout failed')
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className={cn('flex items-center gap-2.5 px-4 h-16 border-b border-border', collapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-forest-900 text-white shadow-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
            <path d="M4 19 L10 13 L14 16 L20 6" />
            <polyline points="15 6 20 6 20 11" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-[16px] font-extrabold text-charcoal tracking-tight">
              Next<span className="text-emerald-600">Step</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
              Workspace
            </span>
          </div>
        )}
      </div>

      {/* User Information Card */}
      {user && (
        <div className={cn('flex items-center gap-3 px-4 py-3.5 border-b border-border/80 bg-surface-warm/60', collapsed && 'justify-center px-2')}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-mint-100 text-emerald-800 text-xs font-bold border border-emerald-300/50 shadow-2xs">
            {getInitials(user.name)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-charcoal truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onMobileClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-mint-100/70 text-emerald-900 shadow-2xs border border-emerald-200/50 font-bold'
                  : 'text-slate-600 hover:bg-surface-subtle hover:text-charcoal',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out / Bottom Section */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col relative bg-white border-r border-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-xs text-slate-400 hover:text-charcoal hover:bg-slate-50 transition-colors"
          aria-label="Toggle sidebar width"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in">
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-modal">
            <button
              onClick={onMobileClose}
              className="absolute right-3 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

export default AppSidebar
