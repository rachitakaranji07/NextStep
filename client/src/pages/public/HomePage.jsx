import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Target,
  ClipboardList,
  Wallet,
  PieChart as PieChartIcon,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Layers,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Clock,
  Building,
} from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import HeroDashboardPreview from '../../components/landing/HeroDashboardPreview'
import HaikeiHeroBackground from '../../components/landing/HaikeiHeroBackground'
import TextEffect from '../../components/motion/TextEffect'
import InView from '../../components/motion/InView'
import AnimatedGroup from '../../components/motion/AnimatedGroup'

export function HomePage() {
  return (
    <PublicLayout>
      {/* ============================================================
          1. HERO SECTION (High Priority Redesign with Motion & Haikei)
          ============================================================ */}
      <section className="relative overflow-hidden bg-surface-warm border-b border-border py-12 lg:py-20">
        {/* Haikei Generative SVG Background */}
        <HaikeiHeroBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column (~48% desktop) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-mint-100/80 border border-emerald-300/60 px-3.5 py-1 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-forest-900 tracking-wide uppercase">
                  Next-Gen Student Platform
                </span>
              </div>

              {/* Headline with Motion Primitives TextEffect */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-charcoal tracking-tight leading-[1.12]">
                <TextEffect per="word" delay={0.1}>
                  Your
                </TextEffect>{' '}
                <span className="text-emerald-600 underline decoration-mint-500/40 decoration-wavy decoration-2 inline-block">
                  <TextEffect per="word" delay={0.2}>
                    next chapter
                  </TextEffect>
                </span>{' '}
                <TextEffect per="word" delay={0.3}>
                  starts here.
                </TextEffect>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Build a career you're proud of. Manage your money with confidence. Bring your goals together in one clear plan.
              </p>

              {/* Supporting Line */}
              <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 pt-1">
                <Compass className="h-4 w-4 text-emerald-600" />
                Career planning and money management, together.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] text-white px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-center"
                >
                  <span>Build My Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/features"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] text-slate-700 border border-border px-6 py-3.5 rounded-xl transition-all text-center hover:border-slate-300 shadow-2xs"
                >
                  <span>Explore the Platform</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 border-t border-border/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Free for students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>INR (₹) formatted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>No credit card needed</span>
                </div>
              </div>
            </div>

            {/* Right Column (~52% desktop) - Interactive Dashboard Preview */}
            <div className="lg:col-span-6 relative">
              <div className="relative">
                {/* Visual Backdrop Frame */}
                <div className="absolute -inset-2.5 bg-gradient-to-br from-mint-200/50 to-emerald-100/20 rounded-3xl blur-md -z-10" />
                <HeroDashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. MERIDIAN-INSPIRED TRUSTED REPUTATION BANNER
          ============================================================ */}
      <section className="py-6 bg-white border-b border-border/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tailored for ambitious students & fresh grads across India</span>
            </div>
            {/* Campus & tech tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6 text-xs font-semibold text-slate-600">
              <span className="px-3 py-1 rounded-lg bg-surface-warm border border-border/70 hover:border-emerald-300 transition-colors">
                IIT & NIT Campuses
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-warm border border-border/70 hover:border-emerald-300 transition-colors">
                Engineering & MCA
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-warm border border-border/70 hover:border-emerald-300 transition-colors">
                Fintech & Startup Roles
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-warm border border-border/70 hover:border-emerald-300 transition-colors">
                Freelance & Stipend Earners
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. MERIDIAN-INSPIRED 5 CORE PILLARS MATRIX
          ============================================================ */}
      <section className="py-20 lg:py-28 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              The NextStep Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
              Five connected engines. <br />
              <span className="text-emerald-700">Zero friction between ambition & money.</span>
            </h2>
            <p className="text-base text-slate-600 mt-4 leading-relaxed">
              Every tool in NextStep feeds directly into your personal dashboard, keeping your progress synchronized in real time.
            </p>
          </InView>

          <AnimatedGroup preset="fade-up" stagger={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1: Career Roadmaps */}
            <div className="p-7 rounded-2xl bg-surface-warm border border-border flex flex-col justify-between hover:border-emerald-400 hover:shadow-card transition-all duration-300 group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold mb-5 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Target className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-charcoal">Career Planning</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-mint-100 px-2 py-0.5 rounded-full">Core</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Break long-term aspirations into structured milestone roadmaps with concrete technical tasks, deadlines, and skill levels (1–5).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>View Career Planner</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 2: Job Tracker */}
            <div className="p-7 rounded-2xl bg-surface-warm border border-border flex flex-col justify-between hover:border-emerald-400 hover:shadow-card transition-all duration-300 group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold mb-5 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-charcoal">Job Applications</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-mint-100 px-2 py-0.5 rounded-full">Pipeline</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kanban pipeline from Saved to Applied, Assessment, Interview, and Offer. Log company notes, salary CTC expectations, and interview dates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>View Job Board</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 3: Expense Tracking */}
            <div className="p-7 rounded-2xl bg-surface-warm border border-border flex flex-col justify-between hover:border-emerald-400 hover:shadow-card transition-all duration-300 group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold mb-5 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-charcoal">Expense Tracking</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-mint-100 px-2 py-0.5 rounded-full">Cashflow</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Log stipend, freelancing income, tuition, hostel rent, food, and course fees. Instant breakdown analytics with monthly trend curves.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>View Transactions</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 4: Monthly Budgets */}
            <div className="p-7 rounded-2xl bg-surface-warm border border-border flex flex-col justify-between hover:border-emerald-400 hover:shadow-card transition-all duration-300 group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold mb-5 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-charcoal">Monthly Budgets</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-mint-100 px-2 py-0.5 rounded-full">Limits</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Set category caps in INR (₹) with color-coded alerts (green, yellow, red) that calculate actual spending directly against your logged transactions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>View Budgets</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 5: Savings Goals & Vaults */}
            <div className="p-7 rounded-2xl bg-surface-warm border border-border flex flex-col justify-between hover:border-emerald-400 hover:shadow-card transition-all duration-300 group sm:col-span-2 lg:col-span-2">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold mb-5 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-charcoal">Dedicated Savings Vaults</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-mint-100 px-2 py-0.5 rounded-full">Growth</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                  Fund specific milestones like new coding laptops, cloud certifications, hackathon travel, or graduation emergency cushions with calculated monthly contribution targets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Explore Savings Vaults</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      {/* ============================================================
          4. PROBLEM & VALUE PROPOSITION (Editorial Layout with Motion)
          ============================================================ */}
      <section className="py-20 lg:py-28 bg-surface-warm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Headline with InView */}
          <InView className="max-w-3xl mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              Why NextStep
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
              Your future is connected. <br />
              <span className="text-emerald-700">Your planning should be too.</span>
            </h2>
            <p className="text-base text-slate-600 mt-4 leading-relaxed">
              In college and early career, your professional goals and your personal finances constantly influence each other. Yet students are forced to juggle disconnected spreadsheets, generic note apps, and isolated trackers.
            </p>
          </InView>

          {/* Editorial 3-Panel Asymmetric Showcase with AnimatedGroup */}
          <AnimatedGroup preset="fade-up" stagger={0.12} className="grid md:grid-cols-3 gap-6">
            {/* Panel 1: Fragmented Problem */}
            <div className="p-7 rounded-2xl bg-white border border-border flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-subtle">
              <div>
                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-5 border border-red-200/50">
                  ✕
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">The Fragmented Approach</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Career goals in Google Docs. Job applications in an untracked sheet. Expenses calculated randomly on notes apps. Nothing talks to each other.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border/80 text-xs text-slate-400">
                Result: Forgotten deadlines, financial stress, lack of clarity.
              </div>
            </div>

            {/* Panel 2: Connected Platform */}
            <div className="p-7 rounded-2xl bg-mint-50/70 border border-emerald-300/60 flex flex-col justify-between relative shadow-xs hover:border-emerald-400 transition-all">
              <span className="absolute -top-3 right-5 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                NextStep Solution
              </span>
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-5 shadow-xs">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-forest-900 mb-2">One Unified Command Center</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every step of your career trajectory is paired with its financial reality — stipend planning, course investments, interview cycles, and savings targets.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-emerald-200/60 text-xs font-semibold text-emerald-800">
                Result: Confident preparation, predictable budget, clear milestones.
              </div>
            </div>

            {/* Panel 3: Student-Centric Principles */}
            <div className="p-7 rounded-2xl bg-white border border-border flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-subtle">
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-5">
                  ★
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">Engineered for Indian Students</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Pre-configured with Indian Rupee (₹) standards, placement calendar timings, standard student budget categories, and verified campus roles.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border/80 text-xs text-slate-400">
                Result: Built specifically for your reality, not Western corporate workflows.
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      {/* ============================================================
          3. SIGNATURE SECTION 1: CAREER — "Turn ambition into action"
          ============================================================ */}
      <section className="py-20 lg:py-28 bg-surface-warm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Visual Mini Roadmap Preview (Left) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-charcoal">Placement Roadmap 2026</h4>
                      <p className="text-[11px] text-slate-500">Frontend / Full-Stack Engineer Path</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-mint-100 px-2.5 py-1 rounded-full">
                    80% Complete
                  </span>
                </div>

                {/* Interactive Connected Roadmap Timeline */}
                <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] ring-4 ring-white">
                      ✓
                    </div>
                    <div className="bg-surface-warm border border-border rounded-xl p-3 hover:border-emerald-300 transition-colors">
                      <p className="text-xs font-bold text-charcoal">Core JavaScript & Modern React</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Completed 4 projects & state management</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] ring-4 ring-white">
                      ✓
                    </div>
                    <div className="bg-surface-warm border border-border rounded-xl p-3 hover:border-emerald-300 transition-colors">
                      <p className="text-xs font-bold text-charcoal">Backend Fundamentals & MongoDB</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">REST APIs, JWT authentication, cookies</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-400 text-white flex items-center justify-center text-[10px] ring-4 ring-white">
                      ●
                    </div>
                    <div className="bg-mint-50/60 border border-emerald-300 rounded-xl p-3 hover:border-emerald-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-forest-900">Live Mock Interviews & DSA Drills</p>
                        <span className="text-[10px] font-bold text-emerald-800">In Progress</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">LeetCode 75 Roadmap & System Architecture</p>
                    </div>
                  </div>
                </div>

                {/* Skill Chips */}
                <div className="pt-2 border-t border-border">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Verified Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js 4/5', 'Node.js 4/5', 'MongoDB 3/5', 'Git & CI/CD 4/5', 'REST 4/5'].map((sk) => (
                      <span key={sk} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md hover:bg-mint-100 hover:text-emerald-800 transition-colors">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Copy (Right) */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Career Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
                Turn ambition into action.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Vague goals lead to stalled momentum. NextStep turns your desired professional role into concrete, bite-sized milestones with skill proficiency indicators and follow-up schedules.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: 'Role-Specific Roadmaps',
                    desc: 'Pre-loaded paths for Software Engineering, Data Analysis, UI/UX, and Cybersecurity.',
                  },
                  {
                    title: 'Skill Gap Transparency',
                    desc: 'Self-evaluate your current proficiency vs. employer expectations on a 1–5 scale.',
                  },
                  {
                    title: 'End-to-End Application Pipeline',
                    desc: 'Track jobs from Saved → Applied → Assessment → Interview → Offer with follow-up reminders.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-charcoal">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </InView>
        </div>
      </section>

      {/* ============================================================
          4. SIGNATURE SECTION 2: FINANCE — "Make every rupee count"
          ============================================================ */}
      <section className="py-20 lg:py-28 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Finance Copy (Left) */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Financial Wellness
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
                Make every rupee count.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Whether managing a hostel allowance, freelancing gig earnings, or your very first internship stipend, NextStep helps you build the money habits that fund your future.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: 'Student-Focused Budgeting',
                    desc: 'Set category thresholds for Rent, Food, Tuition & Books, Transport, and Entertainment.',
                  },
                  {
                    title: 'Real-Time Overspend Guards',
                    desc: 'Visual warnings turn yellow at 80% and red if spending threatens your targets.',
                  },
                  {
                    title: 'Goal-Driven Savings Vaults',
                    desc: 'Dedicated buckets for laptop upgrades, certifications, and emergency peace of mind.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-charcoal">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Finance UI Preview (Right) */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-bold text-charcoal">Monthly Budget & Vaults</h4>
                    <p className="text-[11px] text-slate-500">October 2026 Budget Performance</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-mint-100 px-2.5 py-1 rounded-full">
                    INR (₹) Standard
                  </span>
                </div>

                {/* 2 Category Budget Bars */}
                <div className="space-y-3">
                  <div className="bg-surface-warm border border-border rounded-xl p-3 hover:border-emerald-300 transition-colors">
                    <div className="flex justify-between text-xs font-bold text-charcoal mb-1">
                      <span>Food & Groceries</span>
                      <span>₹4,200 / ₹5,500</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full w-[76%]" />
                    </div>
                    <p className="text-[10px] text-emerald-700 mt-1 font-medium">On Track · ₹1,300 remaining</p>
                  </div>

                  <div className="bg-surface-warm border border-border rounded-xl p-3 hover:border-amber-300 transition-colors">
                    <div className="flex justify-between text-xs font-bold text-charcoal mb-1">
                      <span>Rent & Hostel</span>
                      <span>₹8,000 / ₹8,000</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full w-[100%]" />
                    </div>
                    <p className="text-[10px] text-amber-700 mt-1 font-medium">Limit reached for month</p>
                  </div>
                </div>

                {/* Savings Goal Card Highlight */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-mint-50 to-white border border-emerald-200 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-forest-900">M1 Pro / Coding Laptop Goal</span>
                    <span className="text-xs font-extrabold text-emerald-700">60% Reached</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-lg font-black text-charcoal">₹48,000</span>
                    <span className="text-xs text-slate-500">Target: ₹80,000</span>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full w-[60%]" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    Estimated ₹4,000/mo needed to complete by June 2027.
                  </p>
                </div>
              </div>
            </div>
          </InView>
        </div>
      </section>

      {/* ============================================================
          5. HOW IT WORKS (Timeline Section with Motion)
          ============================================================ */}
      <section className="py-20 lg:py-28 bg-surface-warm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InView className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              Four Clear Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              How NextStep works
            </h2>
            <p className="text-base text-slate-500 mt-3">
              No complicated setups or corporate onboarding hurdles.
            </p>
          </InView>

          <AnimatedGroup preset="fade-up" stagger={0.1} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up in 30 seconds with email and password. Your personal workspace initializes instantly.',
              },
              {
                step: '02',
                title: 'Set your career goals',
                desc: 'Pick your dream role or choose from sample career paths. Break it into achievable milestones.',
              },
              {
                step: '03',
                title: 'Organize your money',
                desc: 'Record living expenses, assign monthly budgets, and create dedicated savings goals in ₹.',
              },
              {
                step: '04',
                title: 'Track and take the next step',
                desc: 'Log interviews, mark tasks done, inspect progress charts, and step into placement season prepared.',
              },
            ].map((st, i) => (
              <div
                key={st.step}
                className="bg-white rounded-2xl border border-border p-6 shadow-subtle flex flex-col justify-between hover:border-emerald-300 hover:shadow-card hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  <span className="text-2xl font-black text-emerald-600/80 tracking-tight block mb-4">
                    {st.step}
                  </span>
                  <h3 className="text-base font-bold text-charcoal mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <span>Step {i + 1} of 4</span>
                </div>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* ============================================================
          6. FINAL CALL TO ACTION (Deep Forest Green Banner)
          ============================================================ */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-forest-900 via-forest-950 to-charcoal text-white relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" /> Start Today — It's Free
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your future isn't built in a day. <br />
            <span className="text-emerald-400">It's built one step at a time.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start building a clearer plan for your career and your finances today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-forest-950 px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center text-sm font-semibold text-slate-300 hover:text-white px-6 py-3.5 transition-colors"
            >
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default HomePage
