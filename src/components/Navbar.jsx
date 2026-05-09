import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearSession, messagesAPI, postsAPI } from '../utils/api';

function HeartbeatIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function NavPill({ to, children, dark }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
        ? 'bg-blue-50 text-blue-700'
        : dark
          ? 'text-white/70 hover:text-white hover:bg-white/10'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  // Poll unread message count and notifications every 30s
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setUnreadCount(0); setNotifications([]); return; }
    
    const fetch = () => {
      messagesAPI.getUnreadCount().then((d) => setUnreadCount(d.unreadCount || 0)).catch(() => { });
      postsAPI.getNotifications().then((d) => setNotifications(d.notifications || [])).catch(() => { });
    };
    
    fetch();
    const id = setInterval(fetch, 30_000);
    return () => clearInterval(id);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const logout = () => {
    clearSession();
    setUser(null);
    setOpen(false);
    setUnreadCount(0);
    navigate('/');
  };

  const isHero = location.pathname === '/';
  const dark = isHero && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHero
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <HeartbeatIcon />
            </div>
            <span className="text-lg font-bold tracking-tight transition-colors" style={{ color: dark ? '#FFFFFF' : '#0F172A' }}>
              Health<span style={{ color: '#3B82F6' }}>AI</span>
            </span>
          </Link>

          {/* Left nav links — Dashboard & Admin */}
          {user && (
            <div className="hidden md:flex items-center gap-1 ml-4">
              <NavPill to="/dashboard" dark={dark}>Dashboard</NavPill>
              {user.role === 'Admin' && (
                <NavPill to="/admin" dark={dark}>Admin</NavPill>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">
            {user ? (
              <>
                {/* Notifications icon */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    title="Notifications"
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, transition: 'background 0.15s', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke={dark ? 'rgba(255,255,255,0.8)' : '#64748B'} strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications.length > 0 && (
                      <span style={{
                        position: 'absolute', top: 2, right: 2,
                        background: '#EF4444', color: '#fff',
                        borderRadius: '50%', width: 16, height: 16,
                        fontSize: 9, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid white',
                      }}>
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" style={{ zIndex: 100 }}>
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <h3 className="text-sm font-semibold text-slate-900 m-0">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-slate-500 text-sm">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((n, i) => (
                            <Link
                              key={i}
                              to={`/post/${n.postId}`}
                              onClick={() => setNotifOpen(false)}
                              className="block px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <p className="text-xs text-slate-800 m-0 leading-relaxed">
                                <span className="font-semibold text-blue-600">{n.fromName}</span> sent a meeting request for your project <span className="font-medium text-slate-900">{n.postTitle}</span>.
                              </p>
                              <p className="text-[10px] text-slate-400 m-0 mt-1">
                                {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages icon */}
                <Link
                  to="/messages"
                  title="Messages"
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke={dark ? 'rgba(255,255,255,0.8)' : '#64748B'} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: 2, right: 2,
                      background: '#EF4444', color: '#fff',
                      borderRadius: '50%', width: 16, height: 16,
                      fontSize: 9, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid white',
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* New Project CTA button */}
                <Link
                  to="/create-post"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all btn-press shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 0 0 0 rgba(37,99,235,0.5)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.45)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0 0 0 rgba(37,99,235,0.5)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  New Project
                </Link>

                {/* User avatar menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setOpen(!open)}
                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors ${dark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium transition-colors" style={{ color: dark ? '#FFFFFF' : '#334155' }}>
                      {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                      style={{ color: dark ? 'rgba(255,255,255,0.55)' : '#94A3B8' }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name || user.email?.split('@')[0]}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
                        {user.role && (
                          <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                            {user.role}
                          </span>
                        )}
                      </div>

                      <DropdownItem to="/dashboard" onClick={() => setOpen(false)} iconPath="M4 6h16M4 10h16M4 14h16M4 18h16">
                        Dashboard
                      </DropdownItem>
                      <DropdownItem to="/create-post" onClick={() => setOpen(false)} iconPath="M12 4v16m8-8H4">
                        New Project
                      </DropdownItem>
                      <DropdownItem to="/messages" onClick={() => setOpen(false)} iconPath="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                        Messages{unreadCount > 0 && <span style={{ marginLeft: 6, background: '#EF4444', color: '#fff', borderRadius: 99, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>{unreadCount}</span>}
                      </DropdownItem>
                      <DropdownItem to="/profile" onClick={() => setOpen(false)} iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                        Profile & Settings
                      </DropdownItem>
                      {user.role === 'Admin' && (
                        <DropdownItem to="/admin" onClick={() => setOpen(false)} iconPath="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                          Admin Panel
                        </DropdownItem>
                      )}

                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-medium transition-colors hover:opacity-100"
                  style={{ color: dark ? 'rgba(255,255,255,0.75)' : '#475569' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors btn-press shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DropdownItem({ to, children, onClick, iconPath }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
      {children}
    </Link>
  );
}
