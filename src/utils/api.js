const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const setSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const updateStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (options._raw) return res;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiFetch('/auth/me'),
  updateProfile: (body) => apiFetch('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
  exportData: () => apiFetch('/auth/me/export', { _raw: true }),
  deleteAccount: () => apiFetch('/auth/me', { method: 'DELETE' }),
};

// ── Posts ─────────────────────────────────────────────────────────────────────
export const postsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'All' && v !== 'All Stages'))
    ).toString();
    return apiFetch(`/posts${qs ? `?${qs}` : ''}`);
  },
  getMine: () => apiFetch('/posts/mine'),
  getNotifications: () => apiFetch('/posts/notifications'),
  getById: (id) => apiFetch(`/posts/${id}`),
  create: (body) => apiFetch('/posts', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  close: (id) => apiFetch(`/posts/${id}/close`, { method: 'PATCH' }),
  delete: (id) => apiFetch(`/posts/${id}`, { method: 'DELETE' }),
  sendMeetingRequest: (id, body) =>
    apiFetch(`/posts/${id}/meeting-request`, { method: 'POST', body: JSON.stringify(body) }),
  respondToMeetingRequest: (postId, requestId, body) =>
    apiFetch(`/posts/${postId}/meeting-request/${requestId}`, { method: 'PATCH', body: JSON.stringify(body) }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/admin/users${qs ? `?${qs}` : ''}`);
  },
  suspendUser: (id) => apiFetch(`/admin/users/${id}/suspend`, { method: 'PATCH' }),
  getPosts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/admin/posts${qs ? `?${qs}` : ''}`);
  },
  deletePost: (id) => apiFetch(`/admin/posts/${id}`, { method: 'DELETE' }),
  getLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/admin/logs${qs ? `?${qs}` : ''}`);
  },
  exportLogs: () => `${BASE_URL}/admin/logs/export?token=${getToken()}`,
  getStats: () => apiFetch('/admin/stats'),
};

// ── Messages ──────────────────────────────────────────────────────────────────
export const messagesAPI = {
  getConversations: () => apiFetch('/messages/conversations'),
  getHistory: (postId, partnerId) => apiFetch(`/messages/${postId}/${partnerId}`),
  send: (postId, partnerId, content) =>
    apiFetch(`/messages/${postId}/${partnerId}`, { method: 'POST', body: JSON.stringify({ content }) }),
  getUnreadCount: () => apiFetch('/messages/unread-count'),
};

export default apiFetch;

