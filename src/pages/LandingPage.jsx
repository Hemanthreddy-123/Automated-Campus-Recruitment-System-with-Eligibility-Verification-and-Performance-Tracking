import { Link } from 'react-router-dom';
import {
    FiCheckCircle, FiBriefcase, FiCode, FiBarChart2, FiShield,
    FiUsers, FiArrowRight, FiStar, FiCheck
} from 'react-icons/fi';
import { MdOutlineAutoAwesome } from 'react-icons/md';

const features = [
    { icon: <FiCheckCircle />, title: 'Auto Eligibility Verification', desc: 'System automatically filters students by CGPA, branch, year, and backlogs before allowing applications.' },
    { icon: <FiBriefcase />, title: 'Drive Management', desc: 'Placement officers can create, schedule and manage multiple job drives with granular eligibility controls.' },
    { icon: <FiCode />, title: 'Coding Competitions', desc: 'Built-in code editor with timer, real-time test cases, leaderboard and instant score feedback.' },
    { icon: <FiBarChart2 />, title: 'Performance Tracking', desc: 'Complete analytics on quiz scores, coding ratings, placement history and skill-wise breakdown.' },
    { icon: <FiShield />, title: 'Secure Role-Based Access', desc: 'JWT-secured login with separate Student and Officer portals and permission controls.' },
    { icon: <FiUsers />, title: 'Student Management', desc: 'Officers can add, update, and review students with advanced search and export functionality.' },
];

const stats = [
    { value: '500+', label: 'Students Placed' },
    { value: '120+', label: 'Companies Visited' },
    { value: '95%', label: 'Placement Rate' },
    { value: '8.2L', label: 'Avg. Package' },
];

const steps = [
    { step: '01', title: 'Register', desc: 'Create your account with academic details — CGPA, branch, and year.' },
    { step: '02', title: 'Browse Drives', desc: 'System auto-verifies eligibility. See only drives you qualify for.' },
    { step: '03', title: 'Apply & Compete', desc: 'Apply, take coding tests, quizzes, and track your progress.' },
    { step: '04', title: 'Get Placed', desc: 'Officers shortlist and finalize selections — all on one platform.' },
];

export default function LandingPage() {
    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            {/* Navbar */}
            <nav className="navbar">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">C</div>
                    <span className="navbar-logo-text">Campus<span style={{ color: 'var(--green)' }}>Hire</span></span>
                </Link>
                <ul className="navbar-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how">How It Works</a></li>
                    <li><a href="#stats">About</a></li>
                </ul>
                <div className="navbar-actions">
                    <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Get Started <FiArrowRight /></Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero-pattern" />
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        <span className="hero-eyebrow-dot" />
                        Automated Campus Recruitment Platform
                    </div>

                    <h1 className="hero-title">
                        Smart Placement.<br />
                        <span className="text-green">Zero Manual Work.</span>
                    </h1>

                    <p className="hero-subtitle">
                        Automate eligibility checks, manage job drives, run coding competitions & quizzes — one unified platform for your campus placement cell.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Student Register <FiArrowRight />
                        </Link>
                        <Link to="/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 600,
                            textDecoration: 'none', transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                        >
                            Officer Login →
                        </Link>
                    </div>

                    <div className="hero-stats">
                        {stats.map((s, i) => (
                            <div key={i} className="hero-stat-item">
                                <span className="hero-stat-value">{s.value}</span>
                                <span className="hero-stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Role Cards ── */}
            <section style={{ background: 'var(--cloud-gray)', padding: '80px 48px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div className="section-header">
                        <div className="section-tag">Quick Access</div>
                        <h2 className="section-title">Choose Your Role</h2>
                        <p className="section-desc">Two dedicated portals — built for students and placement officers.</p>
                    </div>
                    <div className="grid-2" style={{ maxWidth: 780, margin: '0 auto', gap: 24 }}>
                        {/* Student */}
                        <div style={{ background: 'var(--white)', border: '2px solid var(--gray-200)', borderRadius: 20, padding: '40px 36px', textAlign: 'center', transition: 'all 0.25s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.boxShadow = 'var(--shadow-green)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ width: 72, height: 72, background: 'var(--soft-mint)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>🎓</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--black)', marginBottom: 12 }}>Student</h3>
                            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>View eligible drives, apply, take quizzes, join coding contests, and track your performance in real-time.</p>
                            <ul style={{ textAlign: 'left', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {['Auto eligibility check', 'Apply to drives', 'Coding & quiz modules', 'Performance dashboard'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--gray-700)' }}>
                                        <FiCheck style={{ color: 'var(--green)', flexShrink: 0 }} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/login" className="btn btn-primary w-full" style={{ width: '100%', justifyContent: 'center' }}>Student Login <FiArrowRight /></Link>
                        </div>

                        {/* Officer */}
                        <div style={{ background: 'var(--black)', border: '2px solid var(--gray-800)', borderRadius: 20, padding: '40px 36px', textAlign: 'center', transition: 'all 0.25s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.boxShadow = 'var(--shadow-green)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-800)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ width: 72, height: 72, background: 'rgba(0,166,63,0.2)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>🏢</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--white)', marginBottom: 12 }}>Placement Officer</h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>Create drives, auto-filter eligible students, review applications, shortlist candidates, and download reports.</p>
                            <ul style={{ textAlign: 'left', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {['Post job drives', 'Manage applications', 'Shortlist students', 'Reports & analytics'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                                        <FiCheck style={{ color: 'var(--green)', flexShrink: 0 }} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/login" className="btn btn-secondary w-full" style={{ width: '100%', justifyContent: 'center', background: 'transparent' }}>Officer Login <FiArrowRight /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <div className="section-tag">Platform Features</div>
                    <h2 className="section-title">Everything Built In</h2>
                    <p className="section-desc">A complete automated recruitment solution — no integrations needed.</p>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon">{f.icon}</div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how" style={{ background: 'var(--black)', padding: '96px 48px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="section-header" style={{ marginBottom: 60 }}>
                        <div className="section-tag" style={{ background: 'rgba(0,166,63,0.15)', color: 'var(--green)', borderColor: 'rgba(0,166,63,0.3)' }}>How It Works</div>
                        <h2 className="section-title" style={{ color: 'var(--white)' }}>From Register to Placed</h2>
                        <p className="section-desc" style={{ color: 'rgba(255,255,255,0.45)' }}>Four simple steps to get your students placed efficiently.</p>
                    </div>
                    <div className="grid-4">
                        {steps.map((s, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 22px', height: '100%' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, color: 'var(--green)', opacity: 0.7, marginBottom: 16 }}>{s.step}</div>
                                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--white)', marginBottom: 10 }}>{s.title}</h4>
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{s.desc}</p>
                                </div>
                                {i < steps.length - 1 && (
                                    <div style={{ position: 'absolute', right: -12, top: 36, color: 'rgba(0,166,63,0.4)', fontSize: 20, zIndex: 1 }}>→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats / Social Proof ── */}
            <section id="stats" style={{ padding: '96px 48px', background: 'var(--soft-mint)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <div className="section-tag">Why CampusHire?</div>
                    <h2 className="section-title" style={{ marginTop: 12 }}>Trusted by Colleges</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '12px 0 8px' }}>
                        {[1, 2, 3, 4, 5].map(i => <FiStar key={i} style={{ color: 'var(--warning)', fill: 'var(--warning)', fontSize: 20 }} />)}
                    </div>
                    <p style={{ color: 'var(--gray-700)', fontSize: 15, marginBottom: 40, maxWidth: 520, margin: '12px auto 40px' }}>
                        Streamline your entire placement cell — from eligibility filtering to offer letters, all automated.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary btn-lg">Start Today — It's Free <FiArrowRight /></Link>
                        <Link to="/login" className="btn btn-dark btn-lg" style={{ background: 'var(--black)' }}>Sign In</Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="footer">
                <div style={{ maxWidth: 1160, margin: '0 auto' }}>
                    <div className="footer-top">
                        <div>
                            <div className="footer-brand">Campus<span>Hire</span></div>
                            <p style={{ fontSize: 13, maxWidth: 320, lineHeight: 1.7 }}>Automated Campus Recruitment System with Eligibility Verification and Performance Tracking.</p>
                        </div>
                        <div className="footer-links">
                            <a href="#features">Features</a>
                            <a href="#how">How It Works</a>
                            <Link to="/login" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Register</Link>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2025 CampusHire — Automated Campus Recruitment System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
