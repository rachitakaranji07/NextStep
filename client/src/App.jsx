import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ToastProvider from './components/ui/Toast'

// Public Pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import FeaturesPage from './pages/public/FeaturesPage'
import HowItWorksPage from './pages/public/HowItWorksPage'
import ContactPage from './pages/public/ContactPage'
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage'
import TermsPage from './pages/public/TermsPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// App Shell & Dashboard Pages
import AppLayout from './components/layout/AppLayout'
import OverviewPage from './pages/app/OverviewPage'
import CareerPlannerPage from './pages/app/CareerPlannerPage'
import JobApplicationsPage from './pages/app/JobApplicationsPage'
import FinanceTrackerPage from './pages/app/FinanceTrackerPage'
import BudgetsPage from './pages/app/BudgetsPage'
import SavingsGoalsPage from './pages/app/SavingsGoalsPage'
import ProfilePage from './pages/app/ProfilePage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium">Loading NextStep...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (user) {
    return <Navigate to="/app" replace />
  }

  return children
}

export function App() {
  return (
    <>
      <ToastProvider />
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="career" element={<CareerPlannerPage />} />
          <Route path="jobs" element={<JobApplicationsPage />} />
          <Route path="finance" element={<FinanceTrackerPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="savings" element={<SavingsGoalsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
