import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, getUser } from '../utils/api';

const DOMAINS = ['All', 'Cardiology', 'Radiology', 'Neurology', 'General Surgery', 'Software Development', 'Genomics', 'Oncology', 'Orthopedics', 'Ophthalmology', 'Psychiatry'];
const STAGES = ['All Stages', 'Idea', 'Concept Validation', 'Prototype', 'Pilot Testing', 'Pre-Deployment', 'MVP'];

const DOMAIN_STYLE = {
  Cardiology: 'bg-red-50 text-red-700 border-red-200',
  Radiology: 'bg-purple-50 text-purple-700 border-purple-200',
  Neurology: 'bg-amber-50 text-amber-700 border-amber-200',
  'General Surgery': 'bg-orange-50 text-orange-700 border-orange-200',
  'Software Development': 'bg-blue-50 text-blue-700 border-blue-200',
  Genomics: 'bg-teal-50 text-teal-700 border-teal-200',
  Oncology: 'bg-pink-50 text-pink-700 border-pink-200',
};

const STATUS_BADGE = {
  Active: 'text-emerald-600',
  Draft: 'text-slate-400',
  'Meeting Scheduled': 'text-blue-600',
  'Partner Found': 'text-purple-600',
  Expired: 'text-red-400',
};

function PostCard({ post, userCity }) {
  const statusColor = STATUS_BADGE[post.status] || 'text-slate-400';
  const dotColor = post.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400';
  const isNearby = userCity && post.city && post.city.toLowerCase() === userCity.toLowerCase();

  return (
    <Link
      to={`/post/${post._id || post.id}`}
      className={`group flex flex-col bg-white rounded-2xl border p-6 card-lift transition-all ${isNearby ? 'border-emerald-300 hover:border-emerald-400 ring-1 ring-emerald-100' : 'border-slate-200 hover:border-blue-200'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${DOMAIN_STYLE[post.domain] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {post.domain}
          </span>
          {isNearby && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              📍 Near You
            </span>
          )}
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium flex-shrink-0 ml-2 ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {post.status}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
        {post.title}
      </h3>

      {post.stage && (
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{post.stage}</p>
      )}

      {post.description && (
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.description}</p>
      )}

      {post.city && (
        <p className="text-slate-400 text-xs mb-3">📍 {post.city}{post.country ? `, ${post.country}` : ''}</p>
      )}

      <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Expertise Needed</p>
          <p className="text-sm font-semibold text-slate-700 line-clamp-1">{post.expertiseRequired}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors flex-shrink-0 ml-3">
          <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function DomainDropdown({ domains, setDomains }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (d) => {
    setDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const hasSelection = domains.length > 0;
  const label = hasSelection
    ? domains.length === 1 ? domains[0] : `${domains.length} Domains`
    : 'All Domains';

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
          hasSelection
            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
            : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-600'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        {label}
        {hasSelection && (
          <span
            onClick={(e) => { e.stopPropagation(); setDomains([]); }}
            className="w-4 h-4 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-20">
          {DOMAINS.filter(d => d !== 'All').map((d) => {
            const checked = domains.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggle(d)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  checked ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <span className={`w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                  checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                }`}>
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {d}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AllPosts({ userCity }) {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [domains, setDomains] = useState([]);
  const [stage, setStage] = useState('All Stages');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const domain = domains.length === 0 ? 'All' : domains.join(',');
        const data = await postsAPI.getAll({ domain, stage, search });
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message || 'Failed to load posts.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetch, 300);
    return () => clearTimeout(timer);
  }, [domains, stage, search]);

  const clearFilters = () => { setSearch(''); setDomains([]); setStage('All Stages'); };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 text-sm transition-colors"
          />
        </div>
        <DomainDropdown domains={domains} setDomains={setDomains} />
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 text-sm focus:border-blue-500 transition-colors flex-shrink-0"
        >
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 gap-3">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-500 text-sm">Loading projects…</span>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection error</h3>
          <p className="text-slate-500 text-sm mb-1">{error}</p>
          <p className="text-slate-400 text-xs">Make sure the backend server is running on port 5000.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-28">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500 text-sm mb-5">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-slate-500 text-sm mb-4">{total} project{total !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {posts.map((post) => <PostCard key={post._id} post={post} userCity={userCity} />)}
          </div>
        </>
      )}
    </>
  );
}

function MyPosts({ userCity }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    postsAPI.getMine()
      .then((data) => { setPosts(data.posts || []); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-28">
        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-sm py-10 text-center">{error}</p>;

  if (posts.length === 0) {
    return (
      <div className="text-center py-28">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
        <p className="text-slate-500 text-sm mb-5">Post your first research project to get started.</p>
        <Link to="/create-post" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors">
          Post a Project
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {posts.map((post) => <PostCard key={post._id} post={post} userCity={userCity} />)}
    </div>
  );
}

export default function Dashboard({ defaultTab = 'all' }) {
  const [tab, setTab] = useState(defaultTab);
  const currentUser = getUser();

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Projects</h1>
              <p className="text-slate-500 text-sm mt-1">Browse and manage health-tech collaboration opportunities</p>
            </div>
          </div>

          <div className="flex gap-1 mt-6">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'mine', label: 'My Projects' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  tab === t.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'all' ? <AllPosts userCity={currentUser?.city} /> : <MyPosts userCity={currentUser?.city} />}
      </div>
    </div>
  );
}
