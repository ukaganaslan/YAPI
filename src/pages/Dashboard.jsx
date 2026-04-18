import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DOMAINS = ['All', 'Cardiology', 'Radiology', 'Neurology', 'General Surgery', 'Software Development', 'Genomics', 'Oncology'];
const STAGES = ['All Stages', 'Idea', 'Prototype', 'MVP', 'Active Product'];

const DOMAIN_STYLE = {
  'Cardiology': 'bg-red-50 text-red-700 border-red-200',
  'Radiology': 'bg-purple-50 text-purple-700 border-purple-200',
  'Neurology': 'bg-amber-50 text-amber-700 border-amber-200',
  'General Surgery': 'bg-orange-50 text-orange-700 border-orange-200',
  'Software Development': 'bg-blue-50 text-blue-700 border-blue-200',
  'Genomics': 'bg-teal-50 text-teal-700 border-teal-200',
  'Oncology': 'bg-pink-50 text-pink-700 border-pink-200',
};

function PostCard({ post }) {
  const isOpen = post.status === 'Open' || post.status === 'Açık';
  return (
    <Link
      to={`/post/${post.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-6 card-lift hover:border-blue-200 transition-all"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${DOMAIN_STYLE[post.domain] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
          {post.domain}
        </span>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${isOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {isOpen ? 'Open' : post.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
        {post.title}
      </h3>

      {/* Stage */}
      {post.stage && (
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          {post.stage === 'Fikir Aşaması' ? 'Idea Stage' : post.stage}
        </p>
      )}

      {/* Description */}
      {post.description && (
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.description}</p>
      )}

      {/* Footer */}
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

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [stage, setStage] = useState('All Stages');

  useEffect(() => {
    fetch('http://localhost:3001/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.expertiseRequired?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    const matchDomain = domain === 'All' || p.domain === domain;
    const stageNorm = stage === 'All Stages' ? null : stage;
    const matchStage = !stageNorm || p.stage === stageNorm;
    return matchSearch && matchDomain && matchStage;
  });

  const clearFilters = () => { setSearch(''); setDomain('All'); setStage('All Stages'); };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Projects</h1>
              <p className="text-slate-500 text-sm mt-1">{posts.length} active collaboration opportunit{posts.length === 1 ? 'y' : 'ies'}</p>
            </div>
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors btn-press shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post Project
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search & stage filter */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, expertise, keywords…"
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 text-sm transition-colors"
            />
          </div>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 text-sm focus:border-blue-500 transition-colors"
          >
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Domain pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                domain === d
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-slate-500 text-sm">Loading projects…</span>
          </div>
        ) : filtered.length === 0 ? (
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
            <p className="text-slate-500 text-sm mb-4">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
