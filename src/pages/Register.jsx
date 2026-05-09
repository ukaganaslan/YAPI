import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setSession } from '../utils/api';
import { COUNTRIES_AND_CITIES, COUNTRIES } from '../utils/locations';

const ROLES = [
  {
    id: 'Engineer',
    label: 'Engineer',
    desc: 'Biomedical, software, or hardware engineer applying technical expertise to healthcare challenges.',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 'Healthcare Professional',
    label: 'Healthcare Professional',
    desc: 'Physician, nurse, or clinical researcher seeking engineering partners for medical innovation.',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', institution: '', city: '', country: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const setField = (field, value) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === 'country') {
        updated.city = ''; // reset city when country changes
      }
      return updated;
    });
    setErrors((e) => ({ ...e, [field]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email) errs.email = 'Email is required.';
    else if (!/\.edu(\.[a-z]{2})?$/i.test(form.email)) errs.email = 'Only .edu institutional email addresses are accepted.';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (!form.role) errs.role = 'Please select your role.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');

    try {
      const data = await authAPI.register(form);
      setSession(data.token, data.user);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
          <p className="text-slate-500 text-sm">Redirecting you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">Health<span className="text-blue-600">AI</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Join HealthAI</h1>
          <p className="text-slate-500 text-sm">Create your institutional research account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Dr. Jane Smith"
                className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-colors text-sm ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Institutional Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="your@university.edu"
                className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-colors text-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>}
              {!errors.email && <p className="text-slate-400 text-xs mt-1.5">Must be a verified .edu institutional email.</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder="Minimum 6 characters"
                className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-colors text-sm ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
              />
              {errors.password && <p className="text-red-600 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Institution</label>
              <input
                type="text"
                value={form.institution}
                onChange={(e) => setField('institution', e.target.value)}
                placeholder="Harvard Medical School"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            {/* Country & City */}
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

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Your Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setField('role', role.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.role === role.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`mb-2 ${form.role === role.id ? 'text-blue-600' : 'text-slate-400'}`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={role.iconPath} />
                      </svg>
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">{role.label}</div>
                    <div className="text-slate-500 text-xs mt-1 leading-relaxed">{role.desc}</div>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-red-600 text-xs mt-1.5">{errors.role}</p>}
            </div>

            {apiError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors btn-press text-sm"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
