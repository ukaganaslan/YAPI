import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, getUser, setSession, clearSession, updateStoredUser } from '../utils/api';
import { COUNTRIES_AND_CITIES, COUNTRIES } from '../utils/locations';

export default function Profile() {
  const currentUser = getUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    institution: currentUser?.institution || '',
    city: currentUser?.city || '',
    country: currentUser?.country || '',
    bio: currentUser?.bio || '',
    expertiseTags: (currentUser?.expertiseTags || []).join(', '),
  });

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    authAPI.me().then(({ user }) => {
      setForm({
        name: user.name || '',
        institution: user.institution || '',
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || '',
        expertiseTags: (user.expertiseTags || []).join(', '),
      });
      updateStoredUser(user);
    }).catch(() => {});
  }, []);

  const setField = (field, value) => setForm((f) => {
    const updated = { ...f, [field]: value };
    if (field === 'country') {
      updated.city = ''; // reset city when country changes
    }
    return updated;
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    try {
      const payload = {
        ...form,
        expertiseTags: form.expertiseTags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const { user } = await authAPI.updateProfile(payload);
      updateStoredUser(user);
      setSaveMsg('Profile updated successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveErr(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await authAPI.exportData();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'healthai-my-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await authAPI.deleteAccount();
      clearSession();
      navigate('/');
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Profile</h1>
          <p className="text-slate-500 text-sm">{currentUser?.email}</p>
        </div>

        {/* Profile form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h2>
          <form onSubmit={handleSave} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <input
                  type="text"
                  value={currentUser?.role || ''}
                  disabled
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Institution</label>
              <input
                type="text"
                value={form.institution}
                onChange={(e) => setField('institution', e.target.value)}
                placeholder="e.g., Harvard Medical School"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => setField('country', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 bg-white focus:border-blue-500 transition-colors text-sm"
                >
                  <option value="">Select country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                <select
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  disabled={!form.country}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 bg-white focus:border-blue-500 transition-colors text-sm disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">{form.country ? 'Select city…' : 'Select country first'}</option>
                  {form.country && COUNTRIES_AND_CITIES[form.country] && COUNTRIES_AND_CITIES[form.country].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setField('bio', e.target.value.slice(0, 500))}
                placeholder="Tell collaborators about your background and expertise…"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:border-blue-500 transition-colors resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">{form.bio.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Expertise Tags</label>
              <input
                type="text"
                value={form.expertiseTags}
                onChange={(e) => setField('expertiseTags', e.target.value)}
                placeholder="e.g., Machine Learning, Computer Vision, Genomics"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-slate-400 mt-1">Separate tags with commas.</p>
            </div>

            {saveMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-emerald-700 text-sm">{saveMsg}</p>
              </div>
            )}
            {saveErr && (
              <p className="text-red-600 text-sm">{saveErr}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* GDPR Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Privacy & Data</h2>
          <p className="text-slate-500 text-sm mb-6">Your rights under GDPR.</p>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 border border-slate-200 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Export My Data</p>
                <p className="text-slate-500 text-xs mt-0.5">Download all your data including profile and posts as JSON.</p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex-shrink-0 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {exporting ? 'Exporting…' : 'Export'}
              </button>
            </div>

            <div className="flex items-start justify-between gap-4 p-4 border border-red-200 bg-red-50 rounded-xl">
              <div>
                <p className="font-semibold text-red-700 text-sm">Delete Account</p>
                <p className="text-red-500 text-xs mt-0.5">Permanently delete your account and all associated data. This cannot be undone.</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete your account?</h3>
            <p className="text-slate-500 text-sm mb-6">All your data, posts, and meeting requests will be permanently deleted. This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-xl text-sm"
              >
                {deleting ? 'Deleting…' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
