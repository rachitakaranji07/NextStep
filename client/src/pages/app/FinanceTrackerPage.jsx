import { useState, useEffect } from 'react'
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Trash2,
  Edit,
  Calendar,
  CreditCard,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import api from '../../lib/api'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { showToast } from '../../components/ui/Toast'

const PIE_COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#0EA5E9', '#6366F1', '#EC4899', '#F59E0B']

const CATEGORIES = [
  'Food & Groceries',
  'Rent & Housing',
  'Tuition & Books',
  'Transportation',
  'Entertainment',
  'Health & Personal',
  'Salary / Stipend',
  'Freelance / Gig',
  'Allowance',
  'Other',
]

const PAYMENT_METHODS = ['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Cash']

export function FinanceTrackerPage() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expenses: 0, netBalance: 0, categoryBreakdown: [] })
  const [loading, setLoading] = useState(true)

  // Filters
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: 'Food & Groceries',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'UPI',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.append('type', typeFilter)
      if (categoryFilter) params.append('category', categoryFilter)

      const [txRes, sumRes] = await Promise.all([
        api.get(`/transactions?${params.toString()}`),
        api.get('/transactions/summary'),
      ])

      setTransactions(txRes.data?.data?.transactions || [])
      setSummary(sumRes.data?.data || { income: 0, expenses: 0, netBalance: 0, categoryBreakdown: [] })
    } catch {
      showToast.error('Failed to load transaction data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [typeFilter, categoryFilter])

  const handleOpenModal = (tx = null) => {
    if (tx) {
      setEditingTx(tx)
      setForm({
        type: tx.type,
        amount: String(tx.amount),
        category: tx.category,
        date: tx.date ? tx.date.split('T')[0] : '',
        description: tx.description || '',
        paymentMethod: tx.paymentMethod || 'UPI',
      })
    } else {
      setEditingTx(null)
      setForm({
        type: 'expense',
        amount: '',
        category: 'Food & Groceries',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'UPI',
      })
    }
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const numericAmount = parseFloat(form.amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast.error('Please enter a valid amount greater than 0')
      return
    }

    try {
      const payload = {
        ...form,
        amount: numericAmount,
      }

      if (editingTx) {
        await api.patch(`/transactions/${editingTx._id}`, payload)
        showToast.success('Transaction updated')
      } else {
        await api.post('/transactions', payload)
        showToast.success('Transaction added')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save transaction')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await api.delete(`/transactions/${id}`)
      showToast.success('Transaction removed')
      setTransactions((prev) => prev.filter((t) => t._id !== id))
      fetchData()
    } catch {
      showToast.error('Failed to delete transaction')
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      t.description?.toLowerCase().includes(term) ||
      t.category?.toLowerCase().includes(term) ||
      t.paymentMethod?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance Tracker</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Log expenses, record income, and gain transparency over your student budget
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(summary.income)}
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
            Cash inflow
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500">
            {formatCurrency(summary.expenses)}
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
            Spending recorded
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <p className="text-xs text-slate-500 mb-1">Net Balance</p>
          <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            {formatCurrency(summary.netBalance)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Available balance</p>
        </div>
      </div>

      {/* Charts & Breakdown */}
      {summary.categoryBreakdown?.length > 0 && (
        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base">Expense Breakdown by Category</CardTitle>
          </CardHeader>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={summary.categoryBreakdown}
                  dataKey="total"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                >
                  {summary.categoryBreakdown.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              {summary.categoryBreakdown.map((item, idx) => (
                <div key={item._id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="font-medium text-slate-700">{item._id}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search description, category, payment method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table / List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Transactions History ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <div className="px-5 pb-5">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No transactions logged"
              description="Record your tuition, rent, groceries, or part-time earnings."
            />
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100">
                    <th className="py-3 pr-4">Type</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 pr-4">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            tx.type === 'income'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {tx.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{tx.category}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{formatDate(tx.date)}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {tx.paymentMethod || '—'}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '−'}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(tx)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx._id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Add / Edit Transaction Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingTx ? 'Edit Transaction' : 'Record Transaction'}
        description="Track financial movements in Indian Rupees (₹)"
      >
        <form onSubmit={handleSave} className="space-y-3.5 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <Input
              label="Amount (₹)"
              type="number"
              step="any"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g., 450"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Description / Note"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Books for semester 4"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTx ? 'Save Changes' : 'Record Transaction'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default FinanceTrackerPage
