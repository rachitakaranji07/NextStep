import { Heart, Target, Users, Lightbulb, Shield, Globe, Compass, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import Button from '../../components/ui/Button'

const PRINCIPLES = [
  {
    icon: Heart,
    title: 'Student-First Clarity',
    desc: 'Every feature is built around real questions college students ask during placement season and graduation.',
  },
  {
    icon: Shield,
    title: 'Data Integrity & Privacy',
    desc: 'Your financial entries and career aspirations belong to you. Encrypted credentials and strictly isolated user records.',
  },
  {
    icon: Lightbulb,
    title: 'Unified Context',
    desc: 'Career roadmaps and money management reinforce each other. No more fragmented spreadsheets.',
  },
  {
    icon: Globe,
    title: 'Accessible & Inclusive',
    desc: 'Designed with Indian collegiate systems, INR (₹) standards, and campus hiring pipelines in mind.',
  },
]

const AUDIENCE = [
  'Pre-final and final-year undergraduate students preparing for placements',
  'Postgraduate students balancing campus life and independent budgets',
  'Fresh graduates navigating their first full-time role and salary',
  'Students managing education loans, hostel fees, and monthly stipends',
]

export function AboutPage() {
  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="bg-surface-warm border-b border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              Our Mission
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
              Bridging the gap between academic ambition and real-world independence.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-5 leading-relaxed">
              NextStep was born from a simple realization: students work tirelessly to build technical and domain competence, but receive almost zero guidance on navigating career milestones and personal financial wellness simultaneously.
            </p>
          </div>
        </div>
      </section>

      {/* The Core Problem & Connection */}
      <section className="py-20 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                The Disconnection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
                Career planning without financial context is incomplete.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Applying for internships requires funding interview travel, certification costs, and tech gear. Accepting an offer requires understanding cost-of-living adjustments, tax deductions, and savings buffers.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                By uniting milestone tracking, interview pipelines, Indian rupee budgeting, and dedicated savings vaults, NextStep offers students clarity from day one.
              </p>
            </div>

            <div className="bg-surface-warm border border-border rounded-2xl p-7 space-y-4 shadow-card">
              <h3 className="text-base font-bold text-charcoal">Who NextStep Is Designed For</h3>
              <div className="space-y-3">
                {AUDIENCE.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 bg-surface-warm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              Our Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Built on transparency and respect for student aspirations.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl border border-border p-6 shadow-subtle space-y-3">
                <div className="h-10 w-10 rounded-xl bg-mint-100 text-emerald-800 flex items-center justify-center">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-charcoal">{p.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-forest-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ready to build your personal roadmap?
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">
            Create an account in 30 seconds and start mapping your goals and budget.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default AboutPage
