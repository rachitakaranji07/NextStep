import { useState, useEffect } from 'react'
import {
  PieChart as PieChartIcon,
  Plus,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit,
  TrendingDown,
  Info,
} from 'lucide-react'
import api from '../../lib/api'
import { formatCurrency } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import ProgressBar from '../../components/ui/ProgressBar'
import EmptyState from '../../components/ui/EmptyState'
import { showToast } from '../../components/ui/Toast'

const COMMON_BUDGET_CATEGORIES = [
  'Food & Groceries',
  'Rent & Housing',
  'Transportation',
  'Entertainment',
  'Tuition & Books',
  'Health & Personal',
  'Other',
]

export function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [form, setForm] = useState({
    category: 'Food & Groceries',
    limit: '',
  })

  const fetchBudgets = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/budgets?month=${month}&year=${year}`)
      setBudgets(res.data?.data?.budgets || [])
    } catch {
      showToast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [month, year])

  const handleOpenModal = (b = null) => {
    if (b) {
      setEditingBudget(b)
      setForm({
        category: b.category,
        limit: String(b.limit),
      })
    } else {
      setEditingBudget(null)
      setForm({
        category: 'Food & Groceries',
        limit: '',
      })
    }
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const numericLimit = parseFloat(form.limit)
    if (isNaN(numericLimit) || numericLimit < 0) {
      showToast.error('Please enter a valid budget limit')
      return
    }

    try {
      if (editingBudget) {
        await api.patch(`/budgets/${editingBudget._id}`, { limit: numericLimit })
        showToast.success('Budget limit updated')
      } else {
        await api.post('/budgets', {
          month: Number(month),
          year: Number(year),
          category: form.category,
          limit: numericLimit,
        })
        showToast.success('Budget added')
      }
      setModalOpen(false)
      fetchBudgets()
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save budget')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return
    try {
      await api.delete(`/budgets/${id}`)
      showToast.success('Budget deleted')
      setBudgets((prev) => prev.filter((b) => b._id !== id))
    } catch {
      showToast.error('Failed to delete budget')
    }
  }

  // Calculate totals
  const totalBudgetLimit = budgets.reduce((acc, b) => acc + (b.limit || 0), 0)
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + (b.actualSpending || 0), 0)
  const totalBudgetRemaining = Math.max(0, totalBudgetLimit - totalBudgetSpent)
  const overallUsedPercent = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Budget Planner</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Set spending limits and receive real-time alerts before you overspend
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <Button onClick={() => handleOpenModal()} variant="primary">
            <Plus className="h-4 w-4" /> Set Category Budget
          </Button>
        </div>
      </div>

      {/* Overview Aggregation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Total Monthly Budget</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(totalBudgetLimit)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{budgets.length} categories tracked</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Actual Total Spent</p>
          <p className={`text-2xl font-bold ${overallUsedPercent > 100 ? 'text-red-600' : 'text-slate-900'}`}>
            {formatCurrency(totalBudgetSpent)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{overallUsedPercent}% of monthly total utilized</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Remaining to Spend</p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(totalBudgetRemaining)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Safe allowance</p>
        </div>
      </div>

      {/* Budgets List Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={PieChartIcon}
            title="No budgets set for this month"
            description="Create a category budget (e.g., Food, Transportation) to prevent overspending."
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const spent = b.actualSpending || 0
            const limit = b.limit || 0
            const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0
            const remaining = Math.max(0, limit - spent)
            const isOver = spent > limit
            const isWarning = percent >= 80 && percent <= 100

            return (
              <div
                key={b._id}
                className={`bg-white rounded-xl border p-5 transition-all shadow-2xs flex flex-col justify-between ${
                  isOver
                    ? 'border-red-300 bg-red-50/20 ring-1 ring-red-400'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{b.category}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Limit: <span className="font-medium text-slate-700">{formatCurrency(limit)}</span>
                      </p>
                    </div>

                    {isOver ? (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                        <AlertTriangle className="h-3 w-3" /> Over Budget
                      </span>
                    ) : isWarning ? (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                        <Info className="h-3 w-3" /> Near Limit
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        <CheckCircle className="h-3 w-3" /> On Track
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Spent: <strong className="text-slate-800">{formatCurrency(spent)}</strong></span>
                      <span className="font-semibold">{percent}%</span>
                    </div>
                    <ProgressBar
                      value={spent}
                      max={limit}
                      size="md"
                      color={isOver ? 'red' : isWarning ? 'yellow' : 'emerald'}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-3">
                    {isOver ? (
                      <span className="text-red-600 font-medium">
                        Exceeded by {formatCurrency(spent - limit)}
                      </span>
                    ) : (
                      <span>{formatCurrency(remaining)} remaining this month</span>
                    )}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                    title="Edit limit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    title="Delete budget"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Set / Edit Budget Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingBudget ? `Edit ${editingBudget.category} Budget` : 'Set Monthly Budget'}
        description={`Configure your spending target for ${new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' })} ${year}`}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {!editingBudget && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                {COMMON_BUDGET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Spending Limit (₹)"
            type="number"
            min="0"
            step="any"
            required
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            placeholder="e.g., 5000"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingBudget ? 'Update Limit' : 'Save Budget'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default BudgetsPage
