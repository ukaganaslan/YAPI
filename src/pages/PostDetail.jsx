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

const STATUS_STYLE = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  'Meeting Scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
  'Partner Found': 'bg-purple-50 text-purple-700 border-purple-200',
  Expired: 'bg-red-50 text-red-500 border-red-200',
};

function MeetingRequestCard({ req, onAccept, onDecline }) {
  const [confirmedSlot, setConfirmedSlot] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [showAcceptForm, setShowAcceptForm] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    await onAccept(req._id, confirmedSlot);
    setAccepting(false);
  };

  const statusColor = {
    Pending: 'text-amber-600 bg-amber-50 border-amber-200',
    Accepted: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    Declined: 'text-red-600 bg-red-50 border-red-200',
  }[req.status] || 'text-slate-600 bg-slate-50 border-slate-200';

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900 text-sm">{req.fromName || req.fromEmail}</p>
          <p className="text-xs text-slate-500">{req.fromRole} · {req.fromEmail}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>{req.status}</span>
      </div>

      {req.message && (
        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-lg p-3">{req.message}</p>
      )}

      {req.proposedSlots?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Proposed time slots:</p>
          <div className="flex flex-wrap gap-2">
            {req.proposedSlots.map((slot, i) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg">
                {new Date(slot).toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      )}

      {req.confirmedSlot && (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          Confirmed: {new Date(req.confirmedSlot).toLocaleString()}
        </p>
      )}

      {req.status === 'Pending' && (
        <div className="space-y-2">
          {showAcceptForm ? (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">Confirm meeting date/time</label>
              <input
                type="datetime-local"
                value={confirmedSlot}
                onChange={(e) => setConfirmedSlot(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAcceptForm(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={handleAccept}
                  disabled={accepting || !confirmedSlot}
                  className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-semibold rounded-lg"
                >
                  {accepting ? 'Confirming…' : 'Confirm Meeting'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onDecline(req._id)}
                className="flex-1 py-2 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50"
              >
                Decline
              </button>
              <button
                onClick={() => setShowAcceptForm(true)}
                className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                Accept
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Meeting request (send)
  const [interested, setInterested] = useState(false);
  const [meetingMsg, setMeetingMsg] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [proposedSlots, setProposedSlots] = useState(['', '', '']);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      const slots = proposedSlots.filter(Boolean);
      await postsAPI.sendMeetingRequest(post._id, {
        message: meetingMsg,
        ndaAccepted,
        proposedSlots: slots,
      });
      setRequestSent(true);
      setInterested(false);
    } catch (err) {
      setRequestError(err.message || 'Failed to send request.');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleAcceptRequest = async (requestId, confirmedSlot) => {
    try {
      const res = await postsAPI.respondToMeetingRequest(post._id, requestId, {
        status: 'Accepted',
        confirmedSlot,
      });
      setPost(res.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const res = await postsAPI.respondToMeetingRequest(post._id, requestId, { status: 'Declined' });
      setPost(res.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postsAPI.delete(post._id);
      navigate('/my-posts');
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
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

  const isOpen = post.status === 'Active';
  const isOwner = currentUser && (post.authorEmail === currentUser.email);
  const tags = post.expertiseRequired?.split(',').map((t) => t.trim()).filter(Boolean) || [];
  const pendingRequests = (post.meetingRequests || []).filter((r) => r.status === 'Pending');
  const allRequests = post.meetingRequests || [];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

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
                    {post.stage}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${STATUS_STYLE[post.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {post.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">{post.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                {post.createdAt && (
                  <span>Posted {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
                {post.city && <span>📍 {post.city}{post.country ? `, ${post.country}` : ''}</span>}
                {post.commitmentLevel && <span>⏱ {post.commitmentLevel} commitment</span>}
                {post.collaborationType && <span>🤝 {post.collaborationType}</span>}
                {post.confidentiality === 'Details in Meeting' && (
                  <span className="text-amber-600">🔒 Details shared in meeting</span>
                )}
              </div>

              {isOwner && (
                <div className="flex gap-2 mt-5 pt-5 border-t border-slate-100">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Project Overview</h2>
              <p className="text-slate-600 leading-relaxed text-[15px]">{post.description || 'No description provided.'}</p>
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

            {/* Owner: Meeting Requests */}
            {isOwner && allRequests.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900">Meeting Requests</h2>
                  {pendingRequests.length > 0 && (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                      {pendingRequests.length} pending
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {allRequests.map((req) => (
                    <MeetingRequestCard
                      key={req._id}
                      req={req}
                      onAccept={handleAcceptRequest}
                      onDecline={handleDeclineRequest}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* CTA card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-20">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                {isOwner ? 'Manage Project' : 'Interested in this project?'}
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {isOwner
                  ? 'Review incoming meeting requests and manage the project status.'
                  : 'Express your interest and the project lead will review your profile. Your contact details stay private until mutual consent.'}
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

                  {/* Time slot proposals */}
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">Propose up to 3 time slots <span className="font-normal text-slate-400">(optional)</span></p>
                    {proposedSlots.map((slot, i) => (
                      <input
                        key={i}
                        type="datetime-local"
                        value={slot}
                        onChange={(e) => {
                          const updated = [...proposedSlots];
                          updated[i] = e.target.value;
                          setProposedSlots(updated);
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-1.5 focus:border-blue-500"
                      />
                    ))}
                  </div>

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
                <div className="space-y-2">
                  {isOpen && (
                    <button
                      onClick={async () => { await postsAPI.close(post._id); setPost((p) => ({ ...p, status: 'Partner Found' })); }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                      ✓ Mark as Partner Found
                    </button>
                  )}
                  {pendingRequests.length > 0 && (
                    <p className="text-center text-amber-600 text-sm font-medium">
                      {pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''} below ↓
                    </p>
                  )}
                  {allRequests.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-2">No meeting requests yet.</p>
                  )}
                </div>
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
                className="w-full block text-center py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm mt-3"
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

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete this project?</h3>
              <p className="text-slate-500 text-sm mb-6">This action cannot be undone. All associated meeting requests will also be removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-xl text-sm"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
