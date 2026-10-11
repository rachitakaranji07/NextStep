import PublicLayout from '../../components/layout/PublicLayout'

export function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: October 2026</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using NextStep, you agree to these Terms of Service. If you do not agree, you may discontinue use of the platform at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Purpose of Platform</h2>
            <p>
              NextStep provides goal planning, job application tracking, and personal budgeting utilities for students and fresh graduates. The platform provides tools for personal organization and financial literacy, not professional financial advice, wealth management, or guaranteed employment outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and ensuring the information you enter accurately reflects your personal planning needs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Service Availability</h2>
            <p>
              We strive to keep NextStep reliably available but provide the service on an "as is" and "as available" basis.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  )
}

export default TermsPage
