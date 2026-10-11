import PublicLayout from '../../components/layout/PublicLayout'

export function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Notice</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: October 2026</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
            <p>
              NextStep collects only the information necessary to provide career planning and personal financial management tools:
              your name, email address, hashed authentication credentials, career goals, job applications, transaction logs, budgets, and savings goals.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. How We Protect Your Data</h2>
            <p>
              All personal records are scoped strictly to your authenticated account ID. Passwords are encrypted with bcrypt (12 salt rounds),
              and session credentials reside solely in HTTP-only, secure cookies. We never store plaintext passwords or tokens in client-side storage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Third Parties & Privacy</h2>
            <p>
              We do not sell, rent, or trade your personal or financial records to third parties or marketing platforms. Data is stored solely to provide you with your personal dashboards and reports.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Educational Purpose</h2>
            <p>
              NextStep is an educational wellness tool for students and early-career job seekers. The tools provided are meant for self-directed organization and do not constitute certified professional financial or legal advisory.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  )
}

export default PrivacyPolicyPage
