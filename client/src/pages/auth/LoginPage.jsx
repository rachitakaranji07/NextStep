import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { NextStepLogo } from '../../components/layout/Navbar'

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/app', { replace: true })
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-warm flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <NextStepLogo />
          </Link>
          <h1 className="text-2xl font-black text-charcoal tracking-tight pt-3">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to continue planning your career and finances
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border p-7 shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@college.edu"
              icon={Mail}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              autoComplete="current-password"
            />

            {serverError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="pt-3 border-t border-border/70 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Secure session protected with HTTP-only cookies</span>
          </div>
        </div>

        {/* Sub-links */}
        <div className="text-center space-y-2 text-xs">
          <p className="text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-700 font-bold hover:underline">
              Create one free
            </Link>
          </p>
          <p>
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              ← Return to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
