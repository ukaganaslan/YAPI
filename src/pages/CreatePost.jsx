import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../utils/api';

const DOMAINS = [
  'Cardiology', 'Radiology', 'Neurology', 'General Surgery',
  'Software Development', 'Genomics', 'Oncology', 'Orthopedics',
  'Ophthalmology', 'Psychiatry', 'Other',
];

const STAGES = [
  { id: 'Idea', label: 'Idea', desc: 'Early concept, exploring feasibility' },
  { id: 'Concept Validation', label: 'Concept Validation', desc: 'Testing if the idea has merit' },
  { id: 'Prototype', label: 'Prototype', desc: 'Building an initial working model' },
  { id: 'Pilot Testing', label: 'Pilot Testing', desc: 'Running limited real-world tests' },
  { id: 'Pre-Deployment', label: 'Pre-Deployment', desc: 'Preparing for full launch' },
  { id: 'MVP', label: 'MVP', desc: 'Minimum viable product in use' },
];

const COMMITMENT_LEVELS = ['Low', 'Medium', 'High', 'Full-Time'];
const COLLABORATION_TYPES = ['Advisor', 'Co-Founder', 'Research Partner', 'Contractor'];

const EMPTY_FORM = {
  title: '', domain: '', stage: '', expertiseRequired: '', description: '',
  commitmentLevel: '', collaborationType: '', confidentiality: 'Public',
  city: '', country: '', expiresAt: '',
};

export default function CreatePost() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEdit);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;
    postsAPI.getById(id)
      .then(({ post }) => {
        setForm({
          title: post.title || '',
          domain: post.domain || '',
          stage: post.stage || '',
          expertiseRequired: post.expertiseRequired || '',
          description: post.description || '',
          commitmentLevel: post.commitmentLevel || '',
          collaborationType: post.collaborationType || '',
          confidentiality: post.confidentiality || 'Public',
          city: post.city || '',
          country: post.country || '',
          expiresAt: post.expiresAt ? post.expiresAt.slice(0, 10) : '',
        });
        setLoadingPost(false);
      })
      .catch(() => { setLoadingPost(false); navigate('/dashboard'); });
  }, [id, isEdit, navigate]);

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

  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);

    const payload = {
      ...form,
      expiresAt: form.expiresAt || undefined,
      status: asDraft ? 'Draft' : 'Active',
    };

    try {
      if (isEdit) {
        await postsAPI.update(id, payload);
      } else {
        await postsAPI.create(payload);
      }
      navigate('/my-posts');
    } catch (err) {
      setErrors({ title: err.message || 'Failed to save. Please try again.' });
      setLoading(false);
    }
  };

  const charCount = form.description.length;

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {isEdit ? 'Edit Project' : 'Post a New Project'}
          </h1>
          <p className="text-slate-500">
            {isEdit ? 'Update your project details.' : 'Share your research initiative and attract the right collaborators.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">

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

            {/* Domain + Expertise */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setField('stage', s.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      form.stage === s.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'
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
                rows={5}
                className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-colors text-sm resize-none leading-relaxed ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
              />
              {errors.description && <p className="text-red-600 text-xs mt-1.5">{errors.description}</p>}
            </div>

            {/* Commitment + Collaboration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Commitment Level</label>
                <select
                  value={form.commitmentLevel}
                  onChange={(e) => setField('commitmentLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 bg-white text-sm focus:border-blue-500 transition-colors"
                >
                  <option value="">Select…</option>
                  {COMMITMENT_LEVELS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Collaboration Type</label>
                <select
                  value={form.collaborationType}
                  onChange={(e) => setField('collaborationType', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 bg-white text-sm focus:border-blue-500 transition-colors"
                >
                  <option value="">Select…</option>
                  {COLLABORATION_TYPES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* City + Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  placeholder="e.g., Boston"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setField('country', e.target.value)}
                  placeholder="e.g., United States"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Confidentiality + Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confidentiality</label>
                <div className="flex gap-3">
                  {['Public', 'Details in Meeting'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setField('confidentiality', opt)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.confidentiality === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setField('expiresAt', e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Privacy notice */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-semibold">Privacy Protected</p>
                <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                  Your contact details remain private until you mutually consent to collaboration.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              {!isEdit && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => handleSubmit(e, true)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
                >
                  {loading ? 'Saving…' : 'Save as Draft'}
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors btn-press text-sm"
              >
                {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
