import { useState } from 'react'
import {
  User,
  Lock,
  Mail,
  Shield,
  CreditCard,
  LogOut,
  Calendar,
  Save,
  CheckCircle,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { showToast } from '../../components/ui/Toast'

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    currency: user?.currency || 'INR',
    careerInterests: user?.careerInterests?.join(', ') || '',
  })
  const [profileSaving, setProfileSaving] = useState(false)

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!profileForm.name.trim()) {
      showToast.error('Name cannot be empty')
      return
    }

    setProfileSaving(true)
    try {
      const interestsArray = profileForm.careerInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      await updateProfile({
        name: profileForm.name,
        currency: profileForm.currency,
        careerInterests: interestsArray,
      })
      showToast.success('Profile details updated!')
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!passwordForm.currentPassword) {
      showToast.error('Please enter your current password')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      showToast.error('New password must be at least 8 characters')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      showToast.error('New passwords do not match')
      return
    }

    setPasswordSaving(true)
    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      })
      showToast.success('Password changed successfully! Please log in again.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account & Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your personal details, preferences, and account security
        </p>
      </div>

      {/* Account Info Summary Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:bg-red-50 hover:border-red-200"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </Card>

      {/* Profile Information Form */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600" /> Personal Information & Preferences
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Currency
              </label>
              <select
                value={profileForm.currency}
                onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="INR">INR (₹) — Indian Rupee (Default)</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Career Interests (comma separated tags)"
              value={profileForm.careerInterests}
              onChange={(e) => setProfileForm({ ...profileForm, careerInterests: e.target.value })}
              placeholder="e.g., Frontend Engineering, Cloud Computing, Fintech"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" isLoading={profileSaving}>
              <Save className="h-4 w-4" /> Save Profile Details
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Card */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600" /> Security & Password
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
            }
            placeholder="••••••••"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Minimum 8 characters"
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              value={passwordForm.confirmNewPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
              }
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" isLoading={passwordSaving}>
              <Shield className="h-4 w-4" /> Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProfilePage
