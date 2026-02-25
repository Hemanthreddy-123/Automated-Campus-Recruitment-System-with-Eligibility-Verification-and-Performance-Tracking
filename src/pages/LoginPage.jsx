import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { loginUser, setToken, setUser, setRole } from '../services/api';

export default function LoginPage() {
    const [role, setRoleState] = useState('student');
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            const res = await loginUser({ email, password, role });
            setToken(res.data.token);
            setUser(res.data.user);
            setRole(res.data.role);
            if (role === 'student') navigate('/student/dashboard');
            else navigate('/officer/dashboard');
        } catch (error) {
            setErr(error.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--white)' }}>
            {/* ── Left Panel ── */}
            <div style={{
                flex: '0 0 44%', background: 'var(--black)', display: 'flex', flexDirection: 'column',
                padding: '48px', justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -80, left: -80, width: 280, height: 280, background: 'radial-gradient(circle, rgba(0,166,63,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,150,136,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 64 }}>
                        <div style={{ width: 40, height: 40, background: 'var(--gradient-green)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#fff' }}>C</div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#fff' }}>Campus<span style={{ color: 'var(--green)' }}>Hire</span></span>
                    </Link>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: -0.5, lineHeight: 1.2 }}>
                        Welcome to your<br />Placement Portal
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.75, maxWidth: 340 }}>
                        The all-in-one automated campus recruitment platform for students and placement officers.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        'Auto eligibility verification for drives',
                        'Live coding contests with leaderboard',
                        'Timed quiz modules with instant results',
                        'Full placement performance analytics',
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 24, height: 24, background: 'rgba(0,166,63,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FiCheck style={{ color: 'var(--green)', fontSize: 13 }} />
                            </div>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item}</span>
                        </div>
                    ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© 2025 CampusHire. All rights reserved.</p>
            </div>

            {/* ── Right Panel ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'var(--cloud-gray)' }}>
                <div style={{ width: '100%', maxWidth: 440 }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--black)', marginBottom: 6 }}>Sign In</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 32 }}>Access your account to continue</p>

                    {/* Error */}
                    {err && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
                            <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: '#dc2626' }}>{err}</span>
                        </div>
                    )}

                    {/* Role Toggle */}
                    <div style={{ display: 'flex', background: 'var(--gray-200)', borderRadius: 10, padding: 3, marginBottom: 32, gap: 3 }}>
                        {['student', 'officer'].map(r => (
                            <button key={r} onClick={() => setRoleState(r)} style={{
                                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                                background: role === r ? 'var(--white)' : 'transparent',
                                color: role === r ? 'var(--green)' : 'var(--gray-500)',
                                boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                            }}>
                                {r === 'student' ? '🎓 Student' : '🏢 Officer'}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="form-group">
                            <label className="form-label">
                                {role === 'student' ? 'Regd.No or Email' : 'Email / Employee ID'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)', fontSize: 16 }} />
                                <input
                                    type="text" className="form-input" required
                                    placeholder={role === 'student' ? '22G21A0575  or  you@college.edu' : 'officer@campus.edu or PO-001'}
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    style={{ paddingLeft: 44, background: 'var(--white)' }}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                                <a href="#" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)', fontSize: 16 }} />
                                <input
                                    type={showPass ? 'text' : 'password'} className="form-input" required placeholder="Enter password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    style={{ paddingLeft: 44, paddingRight: 44, background: 'var(--white)' }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'flex', padding: 4 }}>
                                    {showPass ? <FiEyeOff fontSize={16} /> : <FiEye fontSize={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 12, opacity: loading ? 0.75 : 1 }}>
                            {loading ? 'Signing in...' : <><span>Sign In</span> <FiArrowRight /></>}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
                        <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>Don't have an account?</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
                    </div>

                    <Link to="/register" className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                        Create New Account
                    </Link>

                    {/* Demo Credentials */}
                    <div style={{ marginTop: 28, background: 'var(--soft-mint)', border: '1px solid var(--mint-mid)', borderRadius: 10, padding: '14px 18px' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Login Info</p>
                        <p style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 700, marginBottom: 4 }}>🎓 Class Students (22G21A05xx):</p>
                        <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>Login ID: <code style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 4, padding: '1px 6px' }}>Your Regd.No  (e.g. 22G21A0575)</code></p>
                        <p style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 3 }}>Password: <code style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 4, padding: '1px 6px' }}>Your Regd.No  (e.g. 22G21A0575)</code></p>
                        <div style={{ borderTop: '1px solid var(--mint-mid)', margin: '10px 0' }} />
                        <p style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 700, marginBottom: 4 }}>🏢 Officer Demo:</p>
                        <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>Login ID: <code style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 4, padding: '1px 6px' }}>officer@campus.edu</code></p>
                        <p style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 3 }}>Password: <code style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 4, padding: '1px 6px' }}>Test@1234</code></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
