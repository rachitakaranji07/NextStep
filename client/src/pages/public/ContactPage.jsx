import { useState } from 'react'
import { Mail, Send, CheckCircle2, MessageSquare, Compass, ShieldCheck } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import api from '../../lib/api'

const SUBJECTS = [
  'General Inquiry',
  'Campus Partnership / Society',
  'Feature Suggestion',
  'Bug Report',
  'Student Feedback',
]

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [serverError, setServerError] = useState(null)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please provide a valid email'
    if (!form.subject) errs.subject = 'Please select a topic'
    if (!form.message.trim()) errs.message = 'Message cannot be empty'
    else if (form.message.trim().length < 15) errs.message = 'Please provide at least 15 characters'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    setServerError(null)
    try {
      const res = await api.post('/contact', form)
      setSuccess(
        res.data?.message || 'Your message has been securely recorded. Our team will review it shortly!'
      )
      setForm({ name: '', email: '', subject: 'General Inquiry', message: '' })
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Unable to submit your message at this time. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <section className="py-16 lg:py-24 bg-surface-warm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Context Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
                Get In Touch
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
                We'd love to hear from your campus.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Have feedback on our placement trackers, suggestions for new student budget categories, or questions about using NextStep? Drop us a note.
              </p>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-mint-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">Student Community & Placements</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tailored for colleges, placement cells, and student societies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-mint-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">Responsible Inquiries</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submissions are saved directly into our secure database.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-border p-7 sm:p-8 shadow-card">
                {success ? (
                  <div className="text-center py-8 space-y-3 animate-in fade-in">
                    <div className="h-12 w-12 rounded-full bg-mint-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal">Message Sent Successfully</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">{success}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSuccess(null)}
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Priya Nair"
                        error={errors.name}
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="priya@college.edu"
                        error={errors.email}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Topic of Inquiry
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full text-xs font-medium border border-border rounded-xl p-2.5 bg-white text-charcoal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {SUBJECTS.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind or how we can improve NextStep..."
                        className="w-full text-xs border border-border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      {errors.message && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>
                      )}
                    </div>

                    {serverError && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">
                        {serverError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={loading}
                      className="w-full mt-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Inquiries</span>
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default ContactPage
