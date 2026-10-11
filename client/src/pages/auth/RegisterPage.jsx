import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { NextStepLogo } from '../../components/layout/Navbar'

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
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
      await register(form.name, form.email, form.password)
      navigate('/app', { replace: true })
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
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
            Create your account
          </h1>
          <p className="text-xs text-slate-500">
            Start planning your placement roadmaps and student finances for free
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border p-7 shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Aarav Sharma"
              icon={User}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="aarav@college.edu"
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
              placeholder="Min. 8 characters"
              icon={Lock}
              error={errors.password}
              hint="Must be at least 8 characters"
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              icon={Lock}
              error={errors.confirmPassword}
              autoComplete="new-password"
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
              <span>Initialize Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick checklist */}
          <div className="pt-3 border-t border-border/70 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Full access to Career Roadmaps & INR (₹) Money Tracker</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Credentials encrypted with bcrypt (12 rounds)</span>
            </div>
          </div>
        </div>

        {/* Sub-links */}
        <div className="text-center space-y-2 text-xs">
          <p className="text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">
              Sign in
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

export default RegisterPage
