import {
  Briefcase,
  BookOpen,
  ClipboardList,
  Wallet,
  PieChart,
  Target,
  BarChart3,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import Button from '../../components/ui/Button'

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Career Roadmaps',
    badge: 'Career',
    desc: 'Create structured career goals with target roles, timelines, and milestone tracking. Visualize your path from where you are to where you want to be.',
    points: [
      'Multiple goals with individual progress tracking',
      'Milestone and sub-task breakdown',
      'Status tracking: Active, Completed, Paused',
      'Target date reminders',
    ],
  },
  {
    icon: BookOpen,
    title: 'Skill Gap Planning',
    badge: 'Career',
    desc: 'Identify the skills required for your target role and track your proficiency growth over time.',
    points: [
      'Add skills with proficiency levels',
      'Link skills to career goals',
      'Suggested paths for common roles',
      'Track learning progress',
    ],
  },
  {
    icon: ClipboardList,
    title: 'Job Application Tracker',
    badge: 'Career',
    desc: 'Never lose track of a job application again. From first click to final offer, every stage is tracked.',
    points: [
      'Status pipeline: Applied → Screening → Interview → Offer',
      'Company, role, URL, date tracking',
      'Follow-up date reminders',
      'Notes and feedback recording',
    ],
  },
  {
    icon: Wallet,
    title: 'Expense Tracking',
    badge: 'Finance',
    desc: 'Log every income and expense with categories, payment methods, and detailed descriptions.',
    points: [
      'Income and expense categories',
      'Multiple payment method support',
      'Date-range filtering',
      'Category-wise breakdown charts',
    ],
  },
  {
    icon: PieChart,
    title: 'Budget Planner',
    badge: 'Finance',
    desc: 'Set monthly spending limits per category and get visual warnings when you\'re close to the edge.',
    points: [
      'Per-category monthly limits',
      'Real-time spending vs. limit comparison',
      'Color-coded alerts: Green, Yellow, Red',
      'Monthly budget summaries',
    ],
  },
  {
    icon: Target,
    title: 'Savings Goals',
    badge: 'Finance',
    desc: 'Define what you\'re saving for, contribute regularly, and track how close you are to reaching it.',
    points: [
      'Target amount and deadline setting',
      'Contribution and withdrawal history',
      'Monthly savings requirement calculator',
      'Progress bar visualization',
    ],
  },
  {
    icon: BarChart3,
    title: 'Progress Dashboard',
    badge: 'All-in-One',
    desc: 'See your career and financial life in one beautiful, data-rich dashboard.',
    points: [
      'Income vs. expense bar charts',
      'Expense breakdown pie charts',
      'Recent transactions table',
      'Savings goals summary',
    ],
  },
]

const BADGE_COLORS = {
  Career: 'bg-blue-100 text-blue-700',
  Finance: 'bg-emerald-100 text-emerald-700',
  'All-in-One': 'bg-purple-100 text-purple-700',
}

export function FeaturesPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-slate-900 to-emerald-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Platform Features</h1>
          <p className="text-emerald-200 max-w-xl mx-auto text-lg">
            Every tool you need to navigate your career and manage your money — all in one place.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
              >
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${BADGE_COLORS[feature.badge]}`}>
                    {feature.badge}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h2>
                  <p className="text-slate-500 leading-relaxed mb-6">{feature.desc}</p>
                  <ul className="space-y-2">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <ArrowRight className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-slate-50 rounded-2xl border border-slate-100 p-8 flex items-center justify-center min-h-48 ${i % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                      <feature.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <p className="font-semibold text-slate-900">{feature.title}</p>
                    <p className="text-xs text-slate-500">Available in the app dashboard</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Explore All Features?</h2>
          <p className="text-emerald-100 mb-6">Create a free account and get access to everything.</p>
          <Link to="/register">
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}

export default FeaturesPage
