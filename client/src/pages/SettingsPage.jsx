import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Trash2, Save, Loader2, Shield, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown';

  const passwordStrength = () => {
    const { newPassword } = passwordForm;
    if (newPassword.length >= 12) return { label: 'Strong', color: 'bg-green-500' };
    if (newPassword.length >= 8) return { label: 'Medium', color: 'bg-yellow-400' };
    if (newPassword.length > 0) return { label: 'Weak', color: 'bg-red-500' };
    return { label: 'Enter password', color: 'bg-gray-600' };
  };

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      if (!profileForm.name.trim() || !profileForm.email.trim()) {
        throw new Error('Name and email are required.');
      }
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccessMessage('Profile saved successfully.');
    } catch (err) {
      setError(err.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      if (passwordForm.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters.');
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccessMessage('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Unable to update password.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setSuccessMessage(null);
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }

    setDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMessage('Account deletion request submitted.');
      setDeleteConfirmation('');
    } catch (err) {
      setDeleteError('Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-4 rounded-3xl border border-surface-border bg-dark-900 p-6">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setActiveSection('profile')}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition ${
              activeSection === 'profile'
                ? 'bg-indigo-500/10 text-white ring-1 ring-indigo-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User size={18} />
            <div>
              <p className="text-sm font-semibold">Profile</p>
              <p className="text-xs text-gray-500">Update display name and email</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('security')}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition ${
              activeSection === 'security'
                ? 'bg-indigo-500/10 text-white ring-1 ring-indigo-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lock size={18} />
            <div>
              <p className="text-sm font-semibold">Security</p>
              <p className="text-xs text-gray-500">Change password and protect access</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('danger')}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition ${
              activeSection === 'danger'
                ? 'bg-red-500/10 text-white ring-1 ring-red-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Trash2 size={18} className="text-red-400" />
            <div>
              <p className="text-sm font-semibold">Danger Zone</p>
              <p className="text-xs text-gray-500">Delete account and wipe data</p>
            </div>
          </button>
        </div>
      </aside>

      <section className="space-y-8">
        {activeSection === 'profile' && (
          <div className="rounded-3xl border border-surface-border bg-dark-900 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-semibold text-white">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                    <p className="text-sm text-gray-400">Update your account details and membership info.</p>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-3 rounded-3xl bg-surface-raised px-4 py-3 text-sm text-gray-300">
                <Shield size={16} />
                Member since {memberSince}
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-8 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Name</span>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="input mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="input mt-2"
                  />
                </label>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary inline-flex items-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save profile
              </button>
            </form>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="rounded-3xl border border-surface-border bg-dark-900 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-indigo-600/10 p-3 text-indigo-300">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Change Password</h2>
                  <p className="text-sm text-gray-400">Keep your account secure with a strong password.</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-3xl bg-surface-raised px-4 py-3 text-sm text-gray-300">
                <Bell size={16} />
                Notifications on
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="mt-8 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Current password</span>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="input mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">New password</span>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="input mt-2"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Confirm new password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input mt-2"
                  />
                </label>
                <div className="rounded-3xl border border-surface-border bg-dark-800 p-4">
                  <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
                    <p>Password strength</p>
                    <span>{passwordStrength().label}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface-border">
                    <div
                      className={`h-2 rounded-full ${passwordStrength().color}`}
                      style={{ width: `${Math.min(passwordForm.newPassword.length * 8, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary inline-flex items-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Update password
              </button>
            </form>
          </div>
        )}

        {activeSection === 'danger' && (
          <div className="rounded-3xl border border-surface-border bg-dark-900 p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-3xl bg-red-500/10 p-3 text-red-400">
                <Trash2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
                <p className="text-sm text-gray-400">Proceed carefully — these actions are permanent.</p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-red-500/20 p-3 text-red-400">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    This will permanently delete your account, all projects, tasks, notes and sprints. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Type DELETE to confirm</span>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => {
                      setDeleteConfirmation(e.target.value);
                      setDeleteError(null);
                      setSuccessMessage(null);
                    }}
                    placeholder="DELETE"
                    className="input mt-2"
                  />
                </label>

                {deleteError && <p className="text-sm text-red-400">{deleteError}</p>}
                {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'DELETE' || deleting}
                  className="btn-primary inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
