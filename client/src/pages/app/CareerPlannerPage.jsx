import { useState, useEffect } from 'react'
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  ListTodo,
} from 'lucide-react'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { StatusBadge } from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import EmptyState from '../../components/ui/EmptyState'
import { showToast } from '../../components/ui/Toast'

const SAMPLE_CAREER_PATHS = [
  {
    role: 'Frontend Developer',
    description: 'Build modern, accessible user interfaces using React, TypeScript, and Tailwind CSS.',
    skills: [
      { name: 'JavaScript / ES6+', targetLevel: 4 },
      { name: 'React & React Router', targetLevel: 4 },
      { name: 'Tailwind CSS / UI Styling', targetLevel: 4 },
      { name: 'Git & Version Control', targetLevel: 3 },
      { name: 'Web Performance & Accessibility', targetLevel: 3 },
    ],
    milestones: [
      { title: 'Learn Modern JavaScript fundamentals & DOM manipulation' },
      { title: 'Build 3 portfolio projects in React' },
      { title: 'Contribute to open source or build a full-stack demo' },
    ],
  },
  {
    role: 'Backend Developer',
    description: 'Design robust APIs, handle server architecture, database schemas, and background jobs.',
    skills: [
      { name: 'Node.js & Express', targetLevel: 4 },
      { name: 'MongoDB / PostgreSQL', targetLevel: 4 },
      { name: 'REST & Authentication (JWT/Cookies)', targetLevel: 4 },
      { name: 'System Design & Caching', targetLevel: 3 },
      { name: 'Docker & Deployment', targetLevel: 3 },
    ],
    milestones: [
      { title: 'Master Node.js runtime and asynchronous event loop' },
      { title: 'Build a secure RESTful API with database indexing' },
      { title: 'Deploy a containerized application to cloud' },
    ],
  },
  {
    role: 'Data Analyst',
    description: 'Translate raw data into actionable business intelligence using SQL, Python, and dashboards.',
    skills: [
      { name: 'SQL Querying & Joins', targetLevel: 4 },
      { name: 'Python (Pandas, NumPy)', targetLevel: 4 },
      { name: 'Data Visualization (PowerBI / Tableau)', targetLevel: 4 },
      { name: 'Statistical Analysis', targetLevel: 3 },
    ],
    milestones: [
      { title: 'Complete advanced SQL problem sets' },
      { title: 'Build interactive dashboards from public datasets' },
      { title: 'Publish exploratory data analysis case studies' },
    ],
  },
  {
    role: 'UI/UX Designer',
    description: 'Craft intuitive, accessible user journeys, wireframes, and design systems in Figma.',
    skills: [
      { name: 'Figma & Design Systems', targetLevel: 4 },
      { name: 'User Research & Wireframing', targetLevel: 4 },
      { name: 'Prototyping & Usability Testing', targetLevel: 3 },
      { name: 'Design Tokens & Typography', targetLevel: 3 },
    ],
    milestones: [
      { title: 'Create complete design system in Figma' },
      { title: 'Conduct usability test with 5 real users' },
      { title: 'Design a responsive web application case study' },
    ],
  },
  {
    role: 'Cybersecurity Analyst',
    description: 'Identify system vulnerabilities, manage security incidents, and maintain defense operations.',
    skills: [
      { name: 'Network Fundamentals & Protocols', targetLevel: 4 },
      { name: 'Linux Command Line & Scripting', targetLevel: 4 },
      { name: 'Vulnerability Assessment & OWASP Top 10', targetLevel: 3 },
      { name: 'SIEM Tools & Log Analysis', targetLevel: 3 },
    ],
    milestones: [
      { title: 'Attain entry certification (CompTIA Security+ or equivalent)' },
      { title: 'Solve 20 CTF security labs on TryHackMe/HackTheBox' },
      { title: 'Audit a web application against OWASP security checklist' },
    ],
  },
]

export function CareerPlannerPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Modal states
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetRole: '',
    description: '',
    targetDate: '',
    status: 'active',
  })

  // Selected goal details view
  const [selectedGoalId, setSelectedGoalId] = useState(null)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(3)

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/career-goals' : `/career-goals?status=${filter}`
      const res = await api.get(url)
      const list = res.data?.data?.goals || []
      setGoals(list)
      if (list.length > 0 && !selectedGoalId) {
        setSelectedGoalId(list[0]._id)
      }
    } catch {
      showToast.error('Failed to load career goals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [filter])

  const handleOpenGoalModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal)
      setGoalForm({
        title: goal.title,
        targetRole: goal.targetRole || '',
        description: goal.description || '',
        targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
        status: goal.status || 'active',
      })
    } else {
      setEditingGoal(null)
      setGoalForm({
        title: '',
        targetRole: '',
        description: '',
        targetDate: '',
        status: 'active',
      })
    }
    setGoalModalOpen(true)
  }

  const handleSaveGoal = async (e) => {
    e.preventDefault()
    if (!goalForm.title.trim()) {
      showToast.error('Please enter a goal title')
      return
    }

    try {
      if (editingGoal) {
        const res = await api.patch(`/career-goals/${editingGoal._id}`, goalForm)
        showToast.success('Goal updated successfully')
        setGoals((prev) =>
          prev.map((g) => (g._id === editingGoal._id ? res.data?.data?.careerGoal : g))
        )
      } else {
        const res = await api.post('/career-goals', goalForm)
        showToast.success('Goal created successfully')
        const newGoal = res.data?.data?.careerGoal
        setGoals((prev) => [newGoal, ...prev])
        setSelectedGoalId(newGoal._id)
      }
      setGoalModalOpen(false)
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save goal')
    }
  }

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this career goal?')) return
    try {
      await api.delete(`/career-goals/${goalId}`)
      showToast.success('Goal deleted')
      setGoals((prev) => prev.filter((g) => g._id !== goalId))
      if (selectedGoalId === goalId) {
        setSelectedGoalId(null)
      }
    } catch {
      showToast.error('Failed to delete goal')
    }
  }

  const handleApplySamplePath = (path) => {
    setGoalForm({
      title: `Become a ${path.role}`,
      targetRole: path.role,
      description: path.description,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
    })
    setEditingGoal(null)
    setGoalModalOpen(true)
  }

  const activeGoal = goals.find((g) => g._id === selectedGoalId)

  // Sub-items mutations (milestones, tasks, skills)
  const handleAddMilestone = async (e) => {
    e.preventDefault()
    if (!newMilestoneTitle.trim() || !activeGoal) return
    try {
      const res = await api.post(`/career-goals/${activeGoal._id}/milestones`, {
        title: newMilestoneTitle,
      })
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
      setNewMilestoneTitle('')
      showToast.success('Milestone added')
    } catch {
      showToast.error('Failed to add milestone')
    }
  }

  const handleToggleMilestone = async (milestone) => {
    if (!activeGoal) return
    const newStatus = milestone.status === 'completed' ? 'pending' : 'completed'
    try {
      const res = await api.patch(
        `/career-goals/${activeGoal._id}/milestones/${milestone._id}`,
        { status: newStatus }
      )
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
    } catch {
      showToast.error('Failed to update milestone status')
    }
  }

  const handleDeleteMilestone = async (milestoneId) => {
    if (!activeGoal) return
    try {
      const res = await api.delete(`/career-goals/${activeGoal._id}/milestones/${milestoneId}`)
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
      showToast.success('Milestone removed')
    } catch {
      showToast.error('Failed to remove milestone')
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !activeGoal) return
    try {
      const res = await api.post(`/career-goals/${activeGoal._id}/tasks`, {
        title: newTaskTitle,
        priority: 'medium',
      })
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
      setNewTaskTitle('')
      showToast.success('Task added')
    } catch {
      showToast.error('Failed to add task')
    }
  }

  const handleToggleTask = async (task) => {
    if (!activeGoal) return
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    try {
      const res = await api.patch(
        `/career-goals/${activeGoal._id}/tasks/${task._id}`,
        { status: newStatus }
      )
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
    } catch {
      showToast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!activeGoal) return
    try {
      const res = await api.delete(`/career-goals/${activeGoal._id}/tasks/${taskId}`)
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
      showToast.success('Task removed')
    } catch {
      showToast.error('Failed to remove task')
    }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!newSkillName.trim() || !activeGoal) return
    try {
      const res = await api.post(`/career-goals/${activeGoal._id}/skills`, {
        name: newSkillName,
        currentLevel: 1,
        targetLevel: Number(newSkillLevel),
      })
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
      setNewSkillName('')
      showToast.success('Skill added')
    } catch {
      showToast.error('Failed to add skill')
    }
  }

  const handleDeleteSkill = async (skillId) => {
    if (!activeGoal) return
    try {
      const res = await api.delete(`/career-goals/${activeGoal._id}/skills/${skillId}`)
      const updated = res.data?.data?.careerGoal
      setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)))
      showToast.success('Skill removed')
    } catch {
      showToast.error('Failed to remove skill')
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career Planner</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Define career roadmaps, bridge skill gaps, and track milestones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
          >
            <option value="all">All Goals</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          <Button onClick={() => handleOpenGoalModal()} variant="primary">
            <Plus className="h-4 w-4" /> New Career Goal
          </Button>
        </div>
      </div>

      {/* Suggested paths banner */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
            Suggested Career Paths (Click to start as template)
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_CAREER_PATHS.map((path) => (
            <button
              key={path.role}
              onClick={() => handleApplySamplePath(path)}
              className="text-xs bg-white hover:bg-emerald-100/60 text-slate-700 hover:text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors font-medium shadow-2xs"
            >
              + {path.role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Goals List on left, Selected Goal details on right */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Goal Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Your Goals ({goals.length})</h2>
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading career goals...</div>
          ) : goals.length === 0 ? (
            <Card className="p-8">
              <EmptyState
                icon={Briefcase}
                title="No career goals yet"
                description="Click 'New Career Goal' or select a suggested path above to get started."
              />
            </Card>
          ) : (
            goals.map((goal) => {
              const isSelected = goal._id === selectedGoalId
              const totalMilestones = goal.milestones?.length || 0
              const doneMilestones =
                goal.milestones?.filter((m) => m.status === 'completed')?.length || 0
              const progress =
                totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0

              return (
                <div
                  key={goal._id}
                  onClick={() => setSelectedGoalId(goal._id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/40 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 truncate">
                        {goal.title}
                      </h3>
                      {goal.targetRole && (
                        <p className="text-xs text-emerald-700 font-medium">{goal.targetRole}</p>
                      )}
                    </div>
                    <StatusBadge status={goal.status} />
                  </div>

                  {goal.targetDate && (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Target: {formatDate(goal.targetDate)}
                    </p>
                  )}

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Milestones: {doneMilestones}/{totalMilestones}</span>
                      <span>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} max={100} size="sm" />
                  </div>

                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenGoalModal(goal)
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteGoal(goal._id)
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Selected Goal Workspace */}
        <div className="lg:col-span-7">
          {activeGoal ? (
            <div className="space-y-6">
              {/* Goal Overview Card */}
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                      Active Plan
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">{activeGoal.title}</h2>
                    {activeGoal.description && (
                      <p className="text-sm text-slate-600 mt-1">{activeGoal.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenGoalModal(activeGoal)}
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
              </Card>

              {/* Milestones Section */}
              <Card className="p-5">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-emerald-600" /> Milestones
                  </CardTitle>
                </CardHeader>

                <form onSubmit={handleAddMilestone} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add a milestone (e.g., Complete React course)"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </form>

                <div className="space-y-2">
                  {activeGoal.milestones?.length > 0 ? (
                    activeGoal.milestones.map((m) => (
                      <div
                        key={m._id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                      >
                        <button
                          onClick={() => handleToggleMilestone(m)}
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          <div
                            className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                              m.status === 'completed'
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {m.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                          </div>
                          <span
                            className={`text-sm ${
                              m.status === 'completed'
                                ? 'line-through text-slate-400'
                                : 'text-slate-700'
                            }`}
                          >
                            {m.title}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(m._id)}
                          className="p-1 text-slate-300 hover:text-red-500 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No milestones yet. Break this goal into smaller milestones!
                    </p>
                  )}
                </div>
              </Card>

              {/* Skills Gap Section */}
              <Card className="p-5">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" /> Target Skills
                  </CardTitle>
                </CardHeader>

                <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Skill name (e.g., TypeScript)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 bg-white"
                  >
                    <option value="2">Level 2: Basic</option>
                    <option value="3">Level 3: Competent</option>
                    <option value="4">Level 4: Proficient</option>
                    <option value="5">Level 5: Master</option>
                  </select>
                  <Button type="submit" size="sm" variant="primary">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </form>

                <div className="grid sm:grid-cols-2 gap-3">
                  {activeGoal.skills?.length > 0 ? (
                    activeGoal.skills.map((s) => (
                      <div
                        key={s._id}
                        className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-500">
                            Current: {s.currentLevel || 0}/5 · Target: {s.targetLevel || 3}/5
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSkill(s._id)}
                          className="p-1 text-slate-300 hover:text-red-500 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4 col-span-2">
                      No target skills listed. Add required skills to identify gaps.
                    </p>
                  )}
                </div>
              </Card>

              {/* Learning Tasks Section */}
              <Card className="p-5">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-emerald-600" /> Actionable Learning Tasks
                  </CardTitle>
                </CardHeader>

                <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Task (e.g., Read React docs section on Hooks)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </form>

                <div className="space-y-2">
                  {activeGoal.tasks?.length > 0 ? (
                    activeGoal.tasks.map((t) => (
                      <div
                        key={t._id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50"
                      >
                        <button
                          onClick={() => handleToggleTask(t)}
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              t.status === 'completed'
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {t.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                          <span
                            className={`text-sm ${
                              t.status === 'completed'
                                ? 'line-through text-slate-400'
                                : 'text-slate-700'
                            }`}
                          >
                            {t.title}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(t._id)}
                          className="p-1 text-slate-300 hover:text-red-500 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No tasks yet. Add bite-sized weekly action items!
                    </p>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <EmptyState
                icon={Target}
                title="Select or create a career goal"
                description="Pick a goal from the left to view milestones, skills, and tasks."
              />
            </Card>
          )}
        </div>
      </div>

      {/* Goal Create/Edit Modal */}
      <Modal
        open={goalModalOpen}
        onOpenChange={setGoalModalOpen}
        title={editingGoal ? 'Edit Career Goal' : 'Create Career Goal'}
        description="Set a target role, timeline, and aspirations"
      >
        <form onSubmit={handleSaveGoal} className="space-y-4 pt-2">
          <Input
            label="Goal Title"
            required
            value={goalForm.title}
            onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
            placeholder="e.g., Become a Junior Frontend Engineer"
          />
          <Input
            label="Target Role"
            value={goalForm.targetRole}
            onChange={(e) => setGoalForm({ ...goalForm, targetRole: e.target.value })}
            placeholder="e.g., Frontend Developer"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
              placeholder="Why this goal matters and what success looks like"
              rows={3}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Date"
              type="date"
              value={goalForm.targetDate}
              onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={goalForm.status}
                onChange={(e) => setGoalForm({ ...goalForm, status: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
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
    </div>
  )
}

export default CareerPlannerPage
