import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { adminAPI, getUser } from '../utils/api';

const TABS = ['Stats', 'Users', 'Posts', 'Logs'];

function StatCard({ label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <div className={`rounded-2xl border p-6 ${colors[color]}`}>
      <p className="text-sm font-semibold opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value ?? '—'}</p>
    </div>
  );
}

function StatsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then((s) => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard label="Total Users" value={stats?.totalUsers} color="blue" />
      <StatCard label="Engineers" value={stats?.engineers} color="purple" />
      <StatCard label="Healthcare Professionals" value={stats?.healthProfs} color="emerald" />
      <StatCard label="Total Posts" value={stats?.totalPosts} color="blue" />
      <StatCard label="Active Posts" value={stats?.activePosts} color="emerald" />
      <StatCard label="Partners Found" value={stats?.closedPosts} color="amber" />
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [suspendedFilter, setSuspendedFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (suspendedFilter !== '') params.suspended = suspendedFilter;
      const data = await adminAPI.getUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [roleFilter, suspendedFilter]);

  const handleSuspend = async (id) => {
    try {
      const { user } = await adminAPI.suspendUser(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isSuspended: user.isSuspended } : u));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-xl text-slate-700 text-sm bg-white focus:border-blue-500"
        >
          <option value="">All Roles</option>
          <option>Engineer</option>
          <option>Healthcare Professional</option>
          <option>Admin</option>
        </select>
        <select
          value={suspendedFilter}
          onChange={(e) => setSuspendedFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-xl text-slate-700 text-sm bg-white focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Suspended</option>
        </select>
        <span className="px-3 py-2 text-slate-500 text-sm">{total} users</span>
      </div>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Institution</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-[180px]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">{u.institution || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${u.isSuspended ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleSuspend(u._id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        u.isSuspended ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      {u.isSuspended ? 'Reactivate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function PostsTab() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const data = await adminAPI.getPosts(params);
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await adminAPI.deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-xl text-slate-700 text-sm bg-white focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          {['Active', 'Draft', 'Meeting Scheduled', 'Partner Found', 'Expired'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="px-3 py-2 text-slate-500 text-sm">{total} posts</span>
      </div>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Domain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">{p.domain}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">{p.authorEmail}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function LogsTab() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (emailFilter) params.userEmail = emailFilter;
      if (actionFilter) params.action = actionFilter;
      const data = await adminAPI.getLogs(params);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [emailFilter, actionFilter]);

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/logs/export', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'healthai-audit-logs.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const filtered = search ? logs.filter((l) =>
    l.userEmail?.includes(search) || l.action?.includes(search) || l.details?.includes(search)
  ) : logs;

  const RESULT_COLOR = {
    SUCCESS: 'text-emerald-600',
    FAILURE: 'text-red-500',
    INFO: 'text-blue-500',
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs…"
          className="px-3 py-2 border border-slate-300 rounded-xl text-slate-700 text-sm focus:border-blue-500 w-48"
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-xl text-slate-700 text-sm bg-white focus:border-blue-500"
        >
          <option value="">All Actions</option>
          {['LOGIN_SUCCESS', 'LOGIN_FAILED', 'REGISTER', 'POST_CREATE', 'POST_UPDATE', 'POST_DELETE', 'MEETING_REQUEST_SENT', 'MEETING_REQUEST_ACCEPTED', 'MEETING_REQUEST_DECLINED', 'ADMIN_SUSPEND_USER', 'DATA_EXPORT', 'ACCOUNT_DELETE'].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          Export CSV
        </button>
        <span className="px-3 py-2 text-slate-500 text-sm">{total} logs</span>
      </div>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Timestamp</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Result</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Details</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{l.userEmail || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{l.action}</span>
                  </td>
                  <td className={`px-4 py-3 text-xs font-semibold ${RESULT_COLOR[l.result] || 'text-slate-400'}`}>{l.result}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-[200px] truncate">{l.details || '—'}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{l.ipAddress || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No logs found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

export default function Admin() {
  const currentUser = getUser();
  const [activeTab, setActiveTab] = useState('Stats');

  if (!currentUser || currentUser.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Platform management and audit logs</p>

          <div className="flex gap-1 mt-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'Stats' && <StatsTab />}
        {activeTab === 'Users' && <UsersTab />}
        {activeTab === 'Posts' && <PostsTab />}
        {activeTab === 'Logs' && <LogsTab />}
      </div>
    </div>
  );
}
