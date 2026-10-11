import { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Briefcase,
  ClipboardList,
  Target,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Circle,
  Calendar,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../lib/api'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { StatCardSkeleton, CardSkeleton, TableSkeleton } from '../../components/ui/LoadingSkeleton'
import ProgressBar from '../../components/ui/ProgressBar'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'

const PIE_COLORS = ['#059669', '#10B981', '#34D399', '#0EA5E9', '#6366F1', '#F59E0B', '#EF4444', '#17211D']

const ONBOARDING_STEPS = [
  { label: 'Create a career roadmap goal', link: '/app/career' },
  { label: 'Track your first job application', link: '/app/jobs' },
  { label: 'Log an income or expense in ₹', link: '/app/finance' },
  { label: 'Set a monthly category budget', link: '/app/budgets' },
  { label: 'Create a savings goal bucket', link: '/app/savings' },
]

function StatMetricCard({ title, value, icon: Icon, subtext, isLoading, trendPositive }) {
  if (isLoading) return <StatCardSkeleton />

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-card hover:border-emerald-200 transition-all">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-black text-charcoal truncate tracking-tight">{value}</p>
          {subtext && (
            <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${
              trendPositive === undefined
                ? 'text-slate-500'
                : trendPositive
                ? 'text-emerald-700'
                : 'text-red-600'
            }`}>
              {trendPositive !== undefined && (
                trendPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />
              )}
              {subtext}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-100 text-emerald-800 border border-emerald-200/50 shadow-2xs">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export function OverviewPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const firstName = user?.name?.split(' ')[0] || 'Member'

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/dashboard/summary?month=${month}&year=${year}`)
      setData(res.data?.data || null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const isNewUser =
    data &&
    data.careerGoals?.total === 0 &&
    data.applications?.total === 0 &&
    data.finances?.income === 0 &&
    data.finances?.expenses === 0

  const monthlyTrendData = [
    {
      month: `${new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' })} ${year}`,
      income: data?.finances?.income || 0,
      expenses: data?.finances?.expenses || 0,
    },
  ]

  const applicationStatusList = data?.applications
    ? [
        { name: 'Applied', count: data.applications.applied || 0 },
        { name: 'Assessment', count: data.applications.assessment || 0 },
        { name: 'Interview', count: data.applications.interview || 0 },
        { name: 'Offer', count: data.applications.offer || 0 },
        { name: 'Rejected', count: data.applications.rejected || 0 },
      ].filter((item) => item.count > 0)
    : []

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Good {getGreeting()}, {firstName}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unified overview of your placement trajectory and monthly personal finances.
          </p>
        </div>

        {/* Date Selector Filter */}
        <div className="flex items-center gap-2 bg-white border border-border rounded-xl p-1 shadow-2xs">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="text-xs font-semibold border-none bg-transparent py-1.5 px-2 focus:ring-0 text-charcoal cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <span className="text-slate-300">/</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="text-xs font-semibold border-none bg-transparent py-1.5 px-2 focus:ring-0 text-charcoal cursor-pointer"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-mint-50 rounded-lg transition-colors"
            title="Refresh dashboard stats"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-red-700 font-medium">{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchData}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {/* Onboarding Checklist for brand new empty accounts */}
      {isNewUser && !loading && (
        <div className="bg-gradient-to-br from-mint-50 to-white border border-emerald-300/80 rounded-2xl p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h2 className="font-bold text-forest-900 text-sm">Getting Started With NextStep</h2>
          </div>
          <p className="text-xs text-slate-600 mb-4 max-w-xl">
            Your workspace is ready! Take a moment to set up your primary goals so the dashboard charts and analytics come to life.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ONBOARDING_STEPS.map((step) => (
              <Link
                key={step.label}
                to={step.link}
                className="flex items-center justify-between text-xs font-semibold text-emerald-900 bg-white hover:bg-mint-100/50 p-3 rounded-xl border border-emerald-200/60 shadow-2xs transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Circle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{step.label}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Primary Top Stat Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatMetricCard
          title="Active Goals"
          value={loading ? '—' : `${data?.careerGoals?.active || 0}`}
          subtext={`${data?.careerGoals?.total || 0} total roadmaps`}
          icon={Briefcase}
          isLoading={loading}
        />
        <StatMetricCard
          title="Applications"
          value={loading ? '—' : `${data?.applications?.total || 0}`}
          subtext={`${data?.applications?.interview || 0} interviews live`}
          icon={ClipboardList}
          isLoading={loading}
        />
        <StatMetricCard
          title="Income (₹)"
          value={loading ? '—' : formatCurrency(data?.finances?.income || 0)}
          subtext="Recorded this month"
          icon={TrendingUp}
          isLoading={loading}
          trendPositive={true}
        />
        <StatMetricCard
          title="Expenses (₹)"
          value={loading ? '—' : formatCurrency(data?.finances?.expenses || 0)}
          subtext="Recorded this month"
          icon={TrendingDown}
          isLoading={loading}
          trendPositive={false}
        />
        <StatMetricCard
          title="Net Cashflow"
          value={loading ? '—' : formatCurrency(data?.finances?.netBalance || 0)}
          subtext="Available buffer"
          icon={Wallet}
          isLoading={loading}
          trendPositive={(data?.finances?.netBalance || 0) >= 0}
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Income vs Expense Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-5 shadow-card">
            <CardHeader className="p-0 pb-4 flex items-center justify-between border-b border-border">
              <div>
                <CardTitle className="text-sm font-bold text-charcoal">
                  Monthly Cashflow Breakdown ({month}/{year})
                </CardTitle>
                <p className="text-[11px] text-slate-500">Income received vs. expenses logged</p>
              </div>
              <Link to="/app/finance" className="text-xs font-semibold text-emerald-700 hover:underline">
                Open tracker →
              </Link>
            </CardHeader>
            <div className="pt-4">
              {loading ? (
                <div className="h-52 bg-surface-warm rounded-xl animate-pulse" />
              ) : data?.finances?.income > 0 || data?.finances?.expenses > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="income" name="Inflow (Income)" fill="#059669" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expenses" name="Outflow (Expenses)" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title="No cashflow recorded for this month"
                  description="Add your stipend, tuition fee, or groceries to visualize monthly trends."
                />
              )}
            </div>
          </Card>
        </div>

        {/* Job Application Funnel Mini (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-5 shadow-card">
            <CardHeader className="p-0 pb-4 flex items-center justify-between border-b border-border">
              <div>
                <CardTitle className="text-sm font-bold text-charcoal">
                  Job Pipeline Status
                </CardTitle>
                <p className="text-[11px] text-slate-500">Active placement submissions</p>
              </div>
              <Link to="/app/jobs" className="text-xs font-semibold text-emerald-700 hover:underline">
                View pipeline →
              </Link>
            </CardHeader>
            <div className="pt-4">
              {loading ? (
                <div className="h-52 bg-surface-warm rounded-xl animate-pulse" />
              ) : applicationStatusList.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={applicationStatusList}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name, count }) => `${name} (${count})`}
                    >
                      {applicationStatusList.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  icon={ClipboardList}
                  title="No job applications yet"
                  description="Log applications to monitor your interview rounds in one place."
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Two-Column Lower Details: Recent Transactions & Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions List */}
        <Card className="p-5 shadow-card">
          <CardHeader className="p-0 pb-3 flex items-center justify-between border-b border-border">
            <div>
              <CardTitle className="text-sm font-bold text-charcoal">Recent Transactions</CardTitle>
              <p className="text-[11px] text-slate-500">Latest financial ledger activity</p>
            </div>
            <Link to="/app/finance" className="text-xs font-semibold text-emerald-700 hover:underline">
              All transactions →
            </Link>
          </CardHeader>
          <div className="pt-2">
            {loading ? (
              <TableSkeleton rows={4} />
            ) : data?.recentTransactions?.length > 0 ? (
              <div className="divide-y divide-border/60">
                {data.recentTransactions.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                          tx.type === 'income'
                            ? 'bg-mint-100 text-emerald-800'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '−'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal">{tx.description || tx.category}</p>
                        <p className="text-[10px] text-slate-400">
                          {tx.category} · {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-extrabold ${
                        tx.type === 'income' ? 'text-emerald-700' : 'text-slate-800'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '−'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Wallet}
                title="No transactions logged"
                description="Record income or expenses to see real-time updates."
              />
            )}
          </div>
        </Card>

        {/* Upcoming Tasks & Milestones */}
        <Card className="p-5 shadow-card">
          <CardHeader className="p-0 pb-3 flex items-center justify-between border-b border-border">
            <div>
              <CardTitle className="text-sm font-bold text-charcoal">Upcoming Career Tasks</CardTitle>
              <p className="text-[11px] text-slate-500">Tasks due in the next 30 days</p>
            </div>
            <Link to="/app/career" className="text-xs font-semibold text-emerald-700 hover:underline">
              Career planner →
            </Link>
          </CardHeader>
          <div className="pt-2">
            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : data?.upcomingTasks?.length > 0 ? (
              <div className="divide-y divide-border/60">
                {data.upcomingTasks.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between py-2.5">
                    <div>
                      <p className="text-xs font-bold text-charcoal">{item.task?.title}</p>
                      <p className="text-[10px] text-slate-400">
                        Goal: {item.goalTitle} · Due: {formatDate(item.task?.dueDate)}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-border">
                      {item.task?.priority || 'medium'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No upcoming tasks"
                description="Break your active goals into tasks with target due dates."
              />
            )}
          </div>
        </Card>
      </div>

      {/* Savings Fund Global Overview */}
      <Card className="p-5 shadow-card">
        <CardHeader className="p-0 pb-3 flex items-center justify-between border-b border-border">
          <div>
            <CardTitle className="text-sm font-bold text-charcoal">Savings Goals Health</CardTitle>
            <p className="text-[11px] text-slate-500">Progress toward personal savings targets</p>
          </div>
          <Link to="/app/savings" className="text-xs font-semibold text-emerald-700 hover:underline">
            Manage goals →
          </Link>
        </CardHeader>
        <div className="pt-4">
          {loading ? (
            <div className="h-12 bg-surface-warm rounded animate-pulse" />
          ) : data?.savingsGoals?.count > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                <span>{data.savingsGoals.active} Active Vaults</span>
                <span className="text-emerald-700">
                  {formatCurrency(data.savingsGoals.totalSaved)} saved of {formatCurrency(data.savingsGoals.totalTarget)}
                </span>
              </div>
              <ProgressBar
                value={data.savingsGoals.totalSaved}
                max={data.savingsGoals.totalTarget}
                size="md"
                color="emerald"
              />
              <p className="text-[11px] text-slate-400 text-right">
                {data.savingsGoals.overallProgress}% of aggregate savings target fulfilled
              </p>
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="No savings goals created"
              description="Establish an emergency reserve or fund for certifications and hardware."
            />
          )}
        </div>
      </Card>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export default OverviewPage
