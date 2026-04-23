import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsAPI, getUser } from '../utils/api';

const DOMAIN_STYLE = {
  'Cardiology': 'bg-red-50 text-red-700 border-red-200',
  'Radiology': 'bg-purple-50 text-purple-700 border-purple-200',
  'Neurology': 'bg-amber-50 text-amber-700 border-amber-200',
  'General Surgery': 'bg-orange-50 text-orange-700 border-orange-200',
  'Software Development': 'bg-blue-50 text-blue-700 border-blue-200',
  'Genomics': 'bg-teal-50 text-teal-700 border-teal-200',
  'Oncology': 'bg-pink-50 text-pink-700 border-pink-200',
};

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interested, setInterested] = useState(false);
  const [meetingMsg, setMeetingMsg] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState('');
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    postsAPI.getById(id)
      .then((data) => { setPost(data.post); setLoading(false); })
      .catch(() => { setError('Project not found.'); setLoading(false); });
  }, [id]);

  const handleMeetingRequest = async () => {
    if (!ndaAccepted) { setRequestError('You must accept the NDA to proceed.'); return; }
    setSendingRequest(true);
    setRequestError('');
    try {
      await postsAPI.sendMeetingRequest(post._id || post.id, {
        message: meetingMsg,
        ndaAccepted,
        proposedSlots: [],
      });
      setRequestSent(true);
      setInterested(false);
    } catch (err) {
      setRequestError(err.message || 'Failed to send request.');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-500 text-sm">Loading project…</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-3">{error || 'Project not found'}</h2>
          <Link to="/dashboard" className="text-blue-600 text-sm font-medium hover:text-blue-700">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const isOpen = post.status === 'Active' || post.status === 'Open';
  const isOwner = currentUser && (post.authorEmail === currentUser.email);
  const tags = post.expertiseRequired
    ?.split(',')
    .map((t) => t.trim())
    .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${DOMAIN_STYLE[post.domain] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  {post.domain}
                </span>
                {post.stage && (
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    {post.stage === 'Fikir Aşaması' ? 'Idea Stage' : post.stage}
                  </span>
                )}
                <span className={`flex items-center gap-1.5 text-xs font-semibold ${isOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isOpen ? 'Actively Recruiting' : post.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">{post.title}</h1>

              {post.createdAt && (
                <p className="text-slate-400 text-sm">
                  Posted{' '}
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Project Overview</h2>
              <p className="text-slate-600 leading-relaxed text-[15px]">
                {post.description || 'No description provided.'}
              </p>
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Expertise Sought</h2>
              <div className="flex flex-wrap gap-2">
                {(tags.length > 0 ? tags : [post.expertiseRequired]).map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* CTA card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">Interested in this project?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Express your interest and the project lead will review your profile. Your contact details stay private until mutual consent.
              </p>

              {requestSent ? (
                <div className="text-center py-5">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">Meeting Request Sent</p>
                  <p className="text-slate-500 text-xs mt-1">You'll be notified when the project lead responds.</p>
                </div>
              ) : interested ? (
                <div className="space-y-3">
                  <textarea
                    value={meetingMsg}
                    onChange={(e) => setMeetingMsg(e.target.value)}
                    placeholder="Briefly introduce yourself and explain your interest…"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm resize-none focus:border-blue-500 transition-colors"
                  />
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ndaAccepted}
                      onChange={(e) => setNdaAccepted(e.target.checked)}
                      className="mt-0.5 accent-blue-600"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I accept the{' '}
                      <span className="text-blue-600 font-medium">Non-Disclosure Agreement</span>
                      {' '}and understand that sensitive project details will only be shared in meeting.
                    </span>
                  </label>
                  {requestError && <p className="text-red-600 text-xs">{requestError}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInterested(false)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMeetingRequest}
                      disabled={sendingRequest}
                      className="flex-[2] py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      {sendingRequest ? 'Sending…' : 'Send Request'}
                    </button>
                  </div>
                </div>
              ) : isOwner ? (
                <button
                  onClick={async () => { await postsAPI.close(post._id || post.id); setPost((p) => ({ ...p, status: 'Partner Found' })); }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm mb-3"
                >
                  ✓ Mark as Partner Found
                </button>
              ) : isOpen ? (
                <button
                  onClick={() => setInterested(true)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors btn-press text-sm mb-3"
                >
                  Express Interest
                </button>
              ) : (
                <div className="text-center py-3">
                  <span className="text-slate-500 text-sm">This project is no longer accepting requests.</span>
                </div>
              )}

              <Link
                to="/dashboard"
                className="w-full block text-center py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Browse Other Projects
              </Link>
            </div>

            {/* Trust */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-slate-700 text-sm font-semibold">Privacy Protected</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                All collaborations are initiated through HealthAI's secure messaging system. Contact details are never shared without explicit consent from both parties. GDPR & KVKK compliant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
