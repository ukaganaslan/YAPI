import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import { clearSession, getUser } from './utils/api';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function useSessionTimeout() {
  useEffect(() => {
    if (!getUser()) return;

    let lastActivity = Date.now();

    const resetTimer = () => { lastActivity = Date.now(); };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));

    const interval = setInterval(() => {
      if (getUser() && Date.now() - lastActivity > SESSION_TIMEOUT_MS) {
        clearSession();
        window.location.href = '/login';
      }
    }, 60_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, []);
}

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && getUser()?.role !== 'Admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  useSessionTimeout();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-posts" element={<ProtectedRoute><Dashboard defaultTab="mine" /></ProtectedRoute>} />
        <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/edit-post/:id" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
