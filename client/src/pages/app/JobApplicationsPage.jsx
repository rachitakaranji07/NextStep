import { useState, useEffect } from 'react'
import {
  ClipboardList,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
} from 'lucide-react'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { StatusBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { showToast } from '../../components/ui/Toast'

const APPLICATION_STATUSES = [
  { id: 'all', label: 'All' },
  { id: 'saved', label: 'Saved' },
  { id: 'applied', label: 'Applied' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
]

export function JobApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [form, setForm] = useState({
    company: '',
    jobTitle: '',
    jobUrl: '',
    status: 'saved',
    applicationDate: new Date().toISOString().split('T')[0],
    followUpDate: '',
    salary: '',
    location: '',
    remote: false,
    notes: '',
  })

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (search.trim()) params.append('search', search.trim())

      const res = await api.get(`/job-applications?${params.toString()}`)
      setApplications(res.data?.data?.applications || [])
    } catch {
      showToast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, search])

  const handleOpenModal = (app = null) => {
    if (app) {
      setEditingApp(app)
      setForm({
        company: app.company,
        jobTitle: app.jobTitle,
        jobUrl: app.jobUrl || '',
        status: app.status || 'saved',
        applicationDate: app.applicationDate ? app.applicationDate.split('T')[0] : '',
        followUpDate: app.followUpDate ? app.followUpDate.split('T')[0] : '',
        salary: app.salary || '',
        location: app.location || '',
        remote: !!app.remote,
        notes: app.notes || '',
      })
    } else {
      setEditingApp(null)
      setForm({
        company: '',
        jobTitle: '',
        jobUrl: '',
        status: 'applied',
        applicationDate: new Date().toISOString().split('T')[0],
        followUpDate: '',
        salary: '',
        location: '',
        remote: false,
        notes: '',
      })
    }
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.jobTitle.trim()) {
      showToast.error('Company and Job Title are required')
      return
    }

    try {
      if (editingApp) {
        const res = await api.patch(`/job-applications/${editingApp._id}`, form)
        showToast.success('Application updated')
        setApplications((prev) =>
          prev.map((a) => (a._id === editingApp._id ? res.data?.data?.application : a))
        )
      } else {
        const res = await api.post('/job-applications', form)
        showToast.success('Application saved')
        setApplications((prev) => [res.data?.data?.application, ...prev])
      }
      setModalOpen(false)
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save application')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job application?')) return
    try {
      await api.delete(`/job-applications/${id}`)
      showToast.success('Application deleted')
      setApplications((prev) => prev.filter((a) => a._id !== id))
    } catch {
      showToast.error('Failed to delete application')
    }
  }

  const handleQuickStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.patch(`/job-applications/${appId}`, { status: newStatus })
      const updated = res.data?.data?.application
      setApplications((prev) => prev.map((a) => (a._id === appId ? updated : a)))
      showToast.success(`Status updated to ${newStatus}`)
    } catch {
      showToast.error('Failed to update status')
    }
  }

  // Count summaries
  const statusCounts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize applications, manage interviews, and track offers
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus className="h-4 w-4" /> Add Application
        </Button>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {APPLICATION_STATUSES.filter((s) => s.id !== 'all').map((st) => (
          <button
            key={st.id}
            onClick={() => setStatusFilter(statusFilter === st.id ? 'all' : st.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === st.id
                ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-xs text-slate-500 capitalize">{st.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {statusCounts[st.id] || 0}
            </p>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Cards/Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading applications...</div>
      ) : applications.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={ClipboardList}
            title="No applications found"
            description="Start logging the positions you have saved or applied to."
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-base">
                      {app.jobTitle}
                    </h3>
                    <p className="text-sm font-medium text-emerald-700 flex items-center gap-1.5 mt-0.5">
                      <Building className="h-3.5 w-3.5" />
                      {app.company}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Applied: {formatDate(app.applicationDate)}</span>
                  </div>

                  {app.followUpDate && (
                    <div className="flex items-center gap-2 text-amber-600 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Follow-up: {formatDate(app.followUpDate)}</span>
                    </div>
                  )}

                  {app.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {app.location} {app.remote ? '(Remote)' : ''}
                      </span>
                    </div>
                  )}

                  {app.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      <span>{app.salary}</span>
                    </div>
                  )}
                </div>

                {app.notes && (
                  <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-3">
                    {app.notes}
                  </p>
                )}
              </div>

              {/* Card Footer / Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={app.status}
                  onChange={(e) => handleQuickStatusChange(app._id, e.target.value)}
                  className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="assessment">Assessment</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>

                <div className="flex items-center gap-1">
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                      title="Open job link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenModal(app)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingApp ? 'Edit Application' : 'Add Job Application'}
        description="Track your application details, status, and timeline"
      >
        <form onSubmit={handleSave} className="space-y-3.5 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company Name"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g., Google, Infosys, Startup"
            />
            <Input
              label="Job Title"
              required
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              placeholder="e.g., Associate Software Engineer"
            />
          </div>

          <Input
            label="Job URL"
            value={form.jobUrl}
            onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
            placeholder="https://linkedin.com/jobs/..."
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="assessment">Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <Input
              label="Application Date"
              type="date"
              value={form.applicationDate}
              onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Follow-up Date"
              type="date"
              value={form.followUpDate}
              onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
            />
            <Input
              label="Compensation / Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              placeholder="e.g., ₹8,00,000 / year"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Bengaluru, Mumbai"
            />
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="remote"
                checked={form.remote}
                onChange={(e) => setForm({ ...form, remote: e.target.checked })}
                className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="remote" className="text-sm font-medium text-slate-700">
                Remote position
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Key requirements, recruiter contacts, interview round takeaways..."
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingApp ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default JobApplicationsPage
