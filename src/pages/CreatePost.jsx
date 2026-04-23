import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/api';

const DOMAINS = [
  'Cardiology', 'Radiology', 'Neurology', 'General Surgery',
  'Software Development', 'Genomics', 'Oncology', 'Orthopedics',
  'Ophthalmology', 'Psychiatry',
];

const STAGES = [
  { id: 'Idea', label: 'Idea', desc: 'Early concept, exploring feasibility' },
  { id: 'Prototype', label: 'Prototype', desc: 'Building an initial working model' },
  { id: 'MVP', label: 'MVP', desc: 'Minimum viable product in testing' },
  { id: 'Active Product', label: 'Active Product', desc: 'Deployed and actively used' },
];

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', domain: '', stage: '', expertiseRequired: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Project title is required.';
    if (!form.domain) errs.domain = 'Please select a medical domain.';
    if (!form.stage) errs.stage = 'Please select the project stage.';
    if (!form.expertiseRequired.trim()) errs.expertiseRequired = 'Expertise needed is required.';
    if (form.description.trim().length < 30) errs.description = 'Description must be at least 30 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);

    try {
      await postsAPI.create(form);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ title: err.message || 'Failed to publish. Please try again.' });
      setLoading(false);
    }
  };

  const charCount = form.description.length;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Post a New Project</h1>
          <p className="text-slate-500">Share your research initiative and attract the right collaborators.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="e.g., AI-Powered ECG Arrhythmia Detection System"
                className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-colors text-sm ${errors.title ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
              />
              {errors.title && <p className="text-red-600 text-xs mt-1.5">{errors.title}</p>}
            </div>

            {/* Domain + Expertise row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Medical Domain</label>
                <select
                  value={form.domain}
                  onChange={(e) => setField('domain', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-slate-900 bg-white transition-colors text-sm ${errors.domain ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
                >
                  <option value="">Select domain…</option>
                  {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                </select>
                {errors.domain && <p className="text-red-600 text-xs mt-1.5">{errors.domain}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Expertise Needed</label>
                <input
                  type="text"
                  value={form.expertiseRequired}
                  onChange={(e) => setField('expertiseRequired', e.target.value)}
                  placeholder="e.g., Machine Learning, Signal Processing"
                  className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-colors text-sm ${errors.expertiseRequired ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
                />
                {errors.expertiseRequired && <p className="text-red-600 text-xs mt-1.5">{errors.expertiseRequired}</p>}
              </div>
            </div>

            {/* Stage selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Project Stage</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setField('stage', s.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      form.stage === s.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 text-sm">{s.label}</div>
                    <div className="text-slate-400 text-xs mt-0.5 leading-snug">{s.desc}</div>
                  </button>
                ))}
              </div>
              {errors.stage && <p className="text-red-600 text-xs mt-1.5">{errors.stage}</p>}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">Project Description</label>
                <span className={`text-xs font-medium ${charCount < 30 ? 'text-slate-400' : 'text-emerald-600'}`}>
                  {charCount}/500
                </span>
              </div>
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value.slice(0, 500))}
                placeholder="Describe the clinical problem, your approach, what you've built so far, and what kind of engineering expertise you're looking for…"
                rows={6}
                className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-colors text-sm resize-none leading-relaxed ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
              />
              {errors.description && <p className="text-red-600 text-xs mt-1.5">{errors.description}</p>}
            </div>

            {/* Privacy notice */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-semibold">Privacy Protected</p>
                <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                  Your contact details remain private until you mutually consent to collaboration with a respondent.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors btn-press text-sm"
              >
                {loading ? 'Publishing…' : 'Publish Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
