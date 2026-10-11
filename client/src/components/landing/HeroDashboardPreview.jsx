import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  TrendingUp,
  Target,
  Briefcase,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react'

export function HeroDashboardPreview() {
  const [activeTab, setActiveTab] = useState('overview')
  const shouldReduceMotion = useReducedMotion()

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative rounded-2xl border border-border bg-white shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Top OS-style header strip with Meridian-style tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle/90 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          </div>
          <span className="text-[11px] font-medium text-slate-500 ml-2 hidden sm:inline">nextstep.app/workspace</span>
        </div>
        
        {/* Meridian-style segmented tab switcher */}
        <div className="flex items-center bg-white p-0.5 rounded-lg border border-border shadow-2xs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'career', label: 'Career' },
            { id: 'finance', label: 'Finance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-charcoal hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-mint-100/70 border border-emerald-300/40 px-2 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Live Preview
        </div>
      </div>

      {/* Internal Mini App Navigation */}
      <div className="p-4 sm:p-5 space-y-4 bg-white">
        {/* User Welcome Row */}
        <motion.div variants={childVariants} className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-forest-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              AD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-charcoal">Aarav Deshmukh</h4>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Pre-Final Year B.Tech
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Target Role: SDE-1 · Campus Placements 2026</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-medium text-slate-400 block">October Cycle</span>
            <span className="text-xs font-bold text-charcoal">24 Days to Interview</span>
          </div>
        </motion.div>

        {/* 3 Metric Summary Cards */}
        <motion.div variants={childVariants} className="grid grid-cols-3 gap-2.5">
          <div className={`border rounded-xl p-3 transition-all duration-200 cursor-pointer ${activeTab === 'career' ? 'border-emerald-500 bg-mint-50/50 shadow-xs' : 'bg-surface-warm border-border/80 hover:border-emerald-300 hover:bg-mint-50/30'}`} onClick={() => setActiveTab('career')}>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Career Plan</span>
              <Target className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="text-base font-extrabold text-charcoal leading-tight">72% Done</p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5 flex items-center gap-0.5">
              <span>5 of 7 Milestones</span>
            </p>
          </div>

          <div className={`border rounded-xl p-3 transition-all duration-200 cursor-pointer ${activeTab === 'finance' ? 'border-emerald-500 bg-mint-50/50 shadow-xs' : 'bg-surface-warm border-border/80 hover:border-emerald-300 hover:bg-mint-50/30'}`} onClick={() => setActiveTab('finance')}>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Monthly Spend</span>
              <Wallet className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="text-base font-extrabold text-charcoal leading-tight">₹14,250</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              of ₹18,000 Budget
            </p>
          </div>

          <div className="bg-surface-warm border border-border/80 rounded-xl p-3 hover:border-emerald-300 hover:bg-mint-50/30 transition-all duration-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Savings Fund</span>
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="text-base font-extrabold text-emerald-700 leading-tight">₹45,000</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Laptop & Cert Fund
            </p>
          </div>
        </motion.div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <motion.div variants={childVariants} className="grid sm:grid-cols-2 gap-3">
            {/* Active Career Goal */}
            <div className="rounded-xl border border-border p-3.5 bg-white space-y-2.5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-600" /> Active Career Goal
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-mint-100/60 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-800">Become a Junior Software Engineer</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <motion.div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: 0.35, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Milestones preview */}
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Master DS & Algorithms in Java</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Deploy Full-Stack Project on AWS</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="h-3.5 w-3.5 rounded-full border border-slate-300 shrink-0" />
                  <span className="truncate">Mock Tech & System Design Rounds</span>
                </div>
              </div>
            </div>

            {/* Cashflow & Applications Glance */}
            <div className="rounded-xl border border-border p-3.5 bg-white space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> October Cashflow
                </span>
                <span className="text-[10px] text-slate-500 font-medium">INR (₹)</span>
              </div>

              {/* Micro bar chart */}
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Stipend Income</span>
                    <span className="font-bold text-emerald-700">+₹25,000</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.85, delay: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Living & Study Expenses</span>
                    <span className="font-bold text-slate-700">−₹14,250</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-amber-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '57%' }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.85, delay: 0.45, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Net Surplus pill */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-mint-50 border border-emerald-100/70 text-[11px]">
                <span className="text-emerald-900 font-medium">Monthly Savings Surplus</span>
                <span className="font-extrabold text-emerald-800">+₹10,750</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'career' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-xl border border-border bg-surface-warm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-emerald-600" /> SDE Placement Milestones & Timeline
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-mint-100 px-2 py-0.5 rounded-full">
                5 of 7 Completed
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-border">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Core Languages</span>
                <p className="font-bold text-charcoal mt-0.5">Java, Python, TypeScript</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[90%]" />
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-border">
                <span className="text-[10px] font-bold text-slate-400 uppercase">System Design</span>
                <p className="font-bold text-charcoal mt-0.5">Scalability & Database Indexing</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[65%]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'finance' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-xl border border-border bg-surface-warm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Monthly Budget Allocation (INR ₹)
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-mint-100 px-2 py-0.5 rounded-full">
                ₹3,750 Available
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-white border border-border">
                <p className="text-[10px] text-slate-500">Rent & Hostel</p>
                <p className="font-extrabold text-charcoal">₹8,000</p>
                <span className="text-[9px] text-amber-600 font-bold">100% used</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border">
                <p className="text-[10px] text-slate-500">Food & Mess</p>
                <p className="font-extrabold text-charcoal">₹4,200</p>
                <span className="text-[9px] text-emerald-600 font-bold">76% used</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border">
                <p className="text-[10px] text-slate-500">Certifications</p>
                <p className="font-extrabold text-charcoal">₹2,050</p>
                <span className="text-[9px] text-emerald-600 font-bold">68% used</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Strip: Recent Job Tracker Pipeline */}
        <motion.div
          variants={childVariants}
          className="rounded-xl border border-border/80 p-3 bg-surface-warm flex items-center justify-between gap-3 text-xs hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-white border border-border flex items-center justify-center shrink-0 shadow-2xs">
              <Building className="h-3.5 w-3.5 text-slate-600" />
            </div>
            <div className="truncate">
              <p className="font-bold text-charcoal truncate text-[11.5px]">Zomato · Graduate Engineer Trainee</p>
              <p className="text-[10px] text-slate-500 truncate">Applied: 18 Sept · Technical Interview scheduled</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 border border-amber-300/40 px-2 py-0.5 rounded-full shrink-0">
            Round 2 Interview
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default HeroDashboardPreview
