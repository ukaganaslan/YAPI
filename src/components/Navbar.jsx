import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
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
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setOpen(false);
    navigate('/');
  };

  const isHero = location.pathname === '/';
  const dark = isHero && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHero
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <HeartbeatIcon />
            </div>
            <span className="text-lg font-bold tracking-tight transition-colors" style={{ color: dark ? '#FFFFFF' : '#0F172A' }}>
              Health<span style={{ color: '#3B82F6' }}>AI</span>
            </span>
          </Link>

          {/* Center nav links (only when logged in) */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <NavPill to="/dashboard" dark={dark}>Dashboard</NavPill>
              <NavPill to="/create-post" dark={dark}>New Project</NavPill>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors ${
                    dark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
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
