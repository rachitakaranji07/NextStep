import { useState, useEffect } from 'react'
import {
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit,
  History,
  TrendingUp,
} from 'lucide-react'
import api from '../../lib/api'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import ProgressBar from '../../components/ui/ProgressBar'
import EmptyState from '../../components/ui/EmptyState'
import { StatusBadge } from '../../components/ui/Badge'
import { showToast } from '../../components/ui/Toast'

export function SavingsGoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  // Goal Modal (Create / Edit)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    description: '',
    status: 'active',
  })

  // Contribution Modal
  const [contribModalOpen, setContribModalOpen] = useState(false)
  const [activeGoalForContrib, setActiveGoalForContrib] = useState(null)
  const [contribForm, setContribForm] = useState({
    amount: '',
    type: 'deposit',
    note: '',
  })

  // Selected Goal for Contribution History
  const [historyGoal, setHistoryGoal] = useState(null)

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const res = await api.get('/savings-goals')
      setGoals(res.data?.data?.goals || [])
    } catch {
      showToast.error('Failed to load savings goals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleOpenGoalModal = (g = null) => {
    if (g) {
      setEditingGoal(g)
      setGoalForm({
        name: g.name,
        targetAmount: String(g.targetAmount),
        targetDate: g.targetDate ? g.targetDate.split('T')[0] : '',
        description: g.description || '',
        status: g.status || 'active',
      })
    } else {
      setEditingGoal(null)
      setGoalForm({
        name: '',
        targetAmount: '',
        targetDate: '',
        description: '',
        status: 'active',
      })
    }
    setGoalModalOpen(true)
  }

  const handleSaveGoal = async (e) => {
    e.preventDefault()
    const numericTarget = parseFloat(goalForm.targetAmount)
    if (isNaN(numericTarget) || numericTarget <= 0) {
      showToast.error('Please enter a valid target amount')
      return
    }

    try {
      const payload = {
        ...goalForm,
        targetAmount: numericTarget,
      }

      if (editingGoal) {
        const res = await api.patch(`/savings-goals/${editingGoal._id}`, payload)
        showToast.success('Goal updated')
        setGoals((prev) =>
          prev.map((g) => (g._id === editingGoal._id ? res.data?.data?.goal : g))
        )
      } else {
        const res = await api.post('/savings-goals', payload)
        showToast.success('Savings goal created')
        setGoals((prev) => [res.data?.data?.goal, ...prev])
      }
      setGoalModalOpen(false)
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save goal')
    }
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Delete this savings goal and its records?')) return
    try {
      await api.delete(`/savings-goals/${id}`)
      showToast.success('Goal deleted')
      setGoals((prev) => prev.filter((g) => g._id !== id))
    } catch {
      showToast.error('Failed to delete goal')
    }
  }

  const handleOpenContribModal = (goal) => {
    setActiveGoalForContrib(goal)
    setContribForm({
      amount: '',
      type: 'deposit',
      note: '',
    })
    setContribModalOpen(true)
  }

  const handleSaveContrib = async (e) => {
    e.preventDefault()
    const numericAmt = parseFloat(contribForm.amount)
    if (isNaN(numericAmt) || numericAmt <= 0) {
      showToast.error('Please enter a positive contribution amount')
      return
    }

    if (
      contribForm.type === 'withdrawal' &&
      numericAmt > (activeGoalForContrib?.currentAmount || 0)
    ) {
      showToast.error('Withdrawal exceeds current saved amount')
      return
    }

    try {
      const res = await api.post(`/savings-goals/${activeGoalForContrib._id}/contribute`, {
        amount: numericAmt,
        type: contribForm.type,
        note: contribForm.note,
      })

      showToast.success(
        contribForm.type === 'deposit' ? 'Deposit recorded!' : 'Withdrawal recorded'
      )
      const updated = res.data?.data?.goal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
      setContribModalOpen(false)
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Transaction failed')
    }
  }

  // Calculate monthly contribution estimate
  const getRequiredMonthly = (goal) => {
    if (!goal.targetDate) return null
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
    if (remaining === 0) return 0

    const now = new Date()
    const target = new Date(goal.targetDate)
    const diffMonths =
      (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())

    if (diffMonths <= 0) return remaining
    return Math.ceil(remaining / diffMonths)
  }

  const totalSavedAll = goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0)
  const totalTargetAll = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Savings Goals</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Plan for emergencies, certifications, college gear, and future milestones
          </p>
        </div>
        <Button onClick={() => handleOpenGoalModal()} variant="primary">
          <Plus className="h-4 w-4" /> Create Savings Goal
        </Button>
      </div>

      {/* Aggregate Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Total Savings Accumulated</p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(totalSavedAll)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Across all goals</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Total Target Pool</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(totalTargetAll)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{goals.length} active goals</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Overall Progress</p>
          <p className="text-2xl font-bold text-slate-900">
            {totalTargetAll > 0 ? Math.round((totalSavedAll / totalTargetAll) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-400 mt-1">Goal completion rate</p>
        </div>
      </div>

      {/* Goals Cards List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading savings goals...</div>
      ) : goals.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={Target}
            title="No savings goals yet"
            description="Create your first goal like an Emergency Fund, New Laptop, or Course Fee."
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => {
            const percent = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0
            const remaining = Math.max(0, g.targetAmount - g.currentAmount)
            const reqMonthly = getRequiredMonthly(g)
            const isCompleted = g.currentAmount >= g.targetAmount

            return (
              <div
                key={g._id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{g.name}</h3>
                      {g.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{g.description}</p>
                      )}
                    </div>
                    <StatusBadge status={isCompleted ? 'completed' : g.status} />
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xl font-bold text-emerald-600">
                        {formatCurrency(g.currentAmount)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Target: {formatCurrency(g.targetAmount)}
                      </span>
                    </div>
                    <ProgressBar
                      value={g.currentAmount}
                      max={g.targetAmount}
                      size="md"
                      color={isCompleted ? 'green' : 'emerald'}
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{percent}% saved</span>
                      <span>{formatCurrency(remaining)} to go</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-500 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    {g.targetDate && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" /> Target Date:
                        </span>
                        <span className="font-medium text-slate-700">{formatDate(g.targetDate)}</span>
                      </div>
                    )}
                    {reqMonthly !== null && !isCompleted && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Est. Monthly:
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {formatCurrency(reqMonthly)} / mo
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenContribModal(g)}
                    >
                      <Plus className="h-3.5 w-3.5" /> Deposit / Withdraw
                    </Button>
                    <button
                      onClick={() => setHistoryGoal(g)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                      title="View history"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenGoalModal(g)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(g._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <Modal
        open={goalModalOpen}
        onOpenChange={setGoalModalOpen}
        title={editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
        description="Set a financial goal to fund your student life and future plans"
      >
        <form onSubmit={handleSaveGoal} className="space-y-3.5 pt-2">
          <Input
            label="Goal Name"
            required
            value={goalForm.name}
            onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
            placeholder="e.g., Emergency Buffer, Coding Bootcamp, New Laptop"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Amount (₹)"
              type="number"
              min="1"
              required
              value={goalForm.targetAmount}
              onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
              placeholder="e.g., 25000"
            />
            <Input
              label="Target Date"
              type="date"
              value={goalForm.targetDate}
              onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
              placeholder="What this goal is for and why it matters..."
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setGoalModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contribution / Withdrawal Modal */}
      <Modal
        open={contribModalOpen}
        onOpenChange={setContribModalOpen}
        title={`Update Savings: ${activeGoalForContrib?.name}`}
        description="Record a deposit or withdrawal with audit history"
      >
        <form onSubmit={handleSaveContrib} className="space-y-3.5 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Action</label>
              <select
                value={contribForm.type}
                onChange={(e) => setContribForm({ ...contribForm, type: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="deposit">Deposit (+)</option>
                <option value="withdrawal">Withdrawal (−)</option>
              </select>
            </div>
            <Input
              label="Amount (₹)"
              type="number"
              min="1"
              required
              value={contribForm.amount}
              onChange={(e) => setContribForm({ ...contribForm, amount: e.target.value })}
              placeholder="e.g., 2000"
            />
          </div>

          <Input
            label="Note / Reference"
            value={contribForm.note}
            onChange={(e) => setContribForm({ ...contribForm, note: e.target.value })}
            placeholder="e.g., Monthly stipend savings deposit"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setContribModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      {historyGoal && (
        <Modal
          open={!!historyGoal}
          onOpenChange={() => setHistoryGoal(null)}
          title={`Activity History: ${historyGoal.name}`}
          description="Detailed transaction records for this savings goal"
        >
          <div className="space-y-2 py-2">
            {historyGoal.contributions?.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {historyGoal.contributions
                  .slice()
                  .reverse()
                  .map((c) => (
                    <div key={c._id} className="py-2.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-1.5 rounded-full ${
                            c.type === 'deposit'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {c.type === 'deposit' ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownLeft className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 capitalize">
                            {c.type} {c.note && `· ${c.note}`}
                          </p>
                          <p className="text-xs text-slate-400">{formatDate(c.date)}</p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          c.type === 'deposit' ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {c.type === 'deposit' ? '+' : '−'}
                        {formatCurrency(c.amount)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                No contribution history recorded yet.
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SavingsGoalsPage
