import {
  UserPlus,
  Target,
  Wallet,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import Button from '../../components/ui/Button'

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Free Account',
    desc: 'Sign up with just your name, email, and a password. No credit card, no subscription needed. Your account is ready in under 60 seconds.',
    details: [
      'Secure email + password registration',
      'Session-based authentication (no token storage)',
      'Instant access to all features',
    ],
  },
  {
    number: '02',
    icon: Target,
    title: 'Set Your Career Goals',
    desc: 'Define your target role, set a realistic timeline, add key milestones, and identify the skills you need to develop.',
    details: [
      'Create multiple career goals',
      'Break goals into milestones and tasks',
      'Add skills with current proficiency levels',
      'Browse suggested career paths',
    ],
  },
  {
    number: '03',
    icon: Wallet,
    title: 'Track Your Finances',
    desc: 'Add your income sources and expenses. Set monthly budgets per category and create savings goals for things that matter.',
    details: [
      'Log income and expenses in ₹',
      'Set monthly budgets per category',
      'Create savings goals with target dates',
      'View spending charts and summaries',
    ],
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Track Applications & Make Progress',
    desc: 'Log every job application, monitor the status pipeline, and watch your career and financial progress unfold on your dashboard.',
    details: [
      'Add applications with company, role, and date',
      'Move through the application pipeline',
      'See career + finance data together on overview',
      'Celebrate milestones as you reach them',
    ],
  },
]

export function HowItWorksPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-slate-900 to-emerald-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">How NextStep Works</h1>
          <p className="text-emerald-200 max-w-xl mx-auto text-lg">
            From sign-up to success — a simple four-step process designed to get
            you planning and tracking within minutes.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative flex gap-6 sm:gap-10">
                {/* Step number line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
                    {step.number}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 flex-1 mt-3 bg-gradient-to-b from-emerald-200 to-transparent min-h-12" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <step.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
                  </div>
                  <p className="text-slate-500 leading-relaxed mb-4">{step.desc}</p>
                  <ul className="space-y-2">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Sounds Simple? It Is.</h2>
          <p className="text-slate-500 mb-6">
            We designed NextStep to be the most intuitive career + finance tool for students.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}

export default HowItWorksPage
