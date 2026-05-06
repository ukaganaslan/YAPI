import { Link } from 'react-router-dom';

const STATS = [
  { value: '2,400+', label: 'Verified Experts' },
  { value: '180+', label: 'Active Projects' },
  { value: '50+', label: 'Institutions' },
  { value: '94%', label: 'Match Success Rate' },
];

const FEATURES = [
  {
    title: 'Institutional Authentication',
    description: 'Only verified academic and research email addresses (.edu) are accepted, ensuring every member is a credentialed professional.',
    color: 'blue',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Expert Role Matching',
    description: 'Biomedical engineers discover clinical challenges. Healthcare professionals find the engineering talent to bring their ideas to life.',
    color: 'teal',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    title: 'Structured Collaboration',
    description: 'From ideation to MVP, projects are organized by stage and domain. Filter by specialty to find exactly what you\'re looking for.',
    color: 'indigo',
    iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    title: 'Privacy-First Contact',
    description: 'First contact is governed by strict privacy protocols. Identities are protected until both parties consent to collaboration.',
    color: 'emerald',
    iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
];

const DOMAINS = [
  { name: 'Cardiology', emoji: '❤️', count: 34 },
  { name: 'Radiology', emoji: '🔬', count: 28 },
  { name: 'Neurology', emoji: '🧠', count: 22 },
  { name: 'Surgery', emoji: '⚕️', count: 19 },
  { name: 'Genomics', emoji: '🧬', count: 15 },
  { name: 'Software', emoji: '💻', count: 42 },
];

const STEPS = [
  {
    n: '01',
    title: 'Verify Your Institution',
    description: 'Sign up with your institutional .edu email. We verify your affiliation to ensure a trusted, professional community.',
  },
  {
    n: '02',
    title: 'Post or Discover',
    description: 'Share your project\'s needs or browse active collaboration requests filtered by your domain and expertise.',
  },
  {
    n: '03',
    title: 'Collaborate & Innovate',
    description: 'Connect through our secure platform, align on terms, and accelerate your path from concept to clinical prototype.',
  },
];

const featureIcon = {
  blue:    'bg-blue-100 text-blue-600',
  teal:    'bg-teal-100 text-teal-600',
  indigo:  'bg-indigo-100 text-indigo-600',
  emerald: 'bg-emerald-100 text-emerald-600',
};

export default function Landing() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section
        style={{ background: 'linear-gradient(140deg, #0F172A 0%, #1E3A5F 55%, #0F172A 100%)' }}
        className="min-h-screen flex items-center pt-16 relative overflow-hidden"
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'rgba(59,130,246,0.12)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(20,184,166,0.08)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">
          <div className="max-w-4xl">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full border"
              style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s infinite' }} />
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                180+ Active Research Projects
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-7"
              style={{ color: '#FFFFFF', lineHeight: 1.08 }}>
              Where Healthcare<br />
              Meets{' '}
              <span style={{ color: '#60A5FA' }}>Engineering</span>
              <br />Innovation
            </h1>

            <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
              style={{ color: 'rgba(255,255,255,0.60)' }}>
              HealthAI connects biomedical engineers with clinical professionals to co-create
              the next generation of medical technology. Verified institutions only.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base rounded-xl transition-all btn-press"
                style={{ background: '#2563EB', color: '#FFFFFF' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
              >
                Start Collaborating
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.20)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t pt-10"
              style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>{s.value}</div>
                  <div className="text-sm font-medium mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Platform Features</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-4 tracking-tight">Built for Trust & Impact</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Every feature is designed with the rigor and security that healthcare innovation demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-8 rounded-2xl border border-slate-100 bg-slate-50 card-lift cursor-default">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${featureIcon[f.color]}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.iconPath} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Process</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-4 tracking-tight">From Idea to Impact</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              A streamlined path from initial concept to active collaboration, designed for the pace of research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-3/4 right-0 h-px bg-slate-200" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-6">
                  {step.n}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domains ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Specialties</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 tracking-tight">Across Medical Domains</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DOMAINS.map((d) => (
              <div
                key={d.name}
                className="p-6 rounded-2xl border border-slate-200 text-center card-lift cursor-default hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-3xl mb-3">{d.emoji}</div>
                <div className="font-semibold text-slate-900 text-sm">{d.name}</div>
                <div className="text-slate-400 text-xs mt-1">{d.count} projects</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #0F172A 0%, #1E3A5F 55%, #0F172A 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight" style={{ color: '#FFFFFF' }}>
            Ready to Accelerate<br />Medical Innovation?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Join 2,400+ researchers and engineers already collaborating on the next breakthrough in healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base rounded-xl transition-all btn-press"
              style={{ background: '#2563EB', color: '#FFFFFF' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
            >
              Create Your Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.10)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.20)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#020617' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="font-bold" style={{ color: '#FFFFFF' }}>
                Health<span style={{ color: '#60A5FA' }}>AI</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: '#475569' }}>
              © 2026 HealthAI. Empowering medical innovation through collaboration.
            </p>
            <div className="flex items-center gap-6 text-sm" style={{ color: '#475569' }}>
              <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
