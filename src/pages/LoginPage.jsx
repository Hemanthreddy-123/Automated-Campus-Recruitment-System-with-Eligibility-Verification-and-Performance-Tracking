import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiAlertCircle, FiZap } from 'react-icons/fi';
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

    const isStudent = role === 'student';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f6fa', fontFamily: 'var(--font-sans)' }}>
            <style>{`
                @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
                @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
                @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                @keyframes pulse2 { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.5)} 70%{box-shadow:0 0 0 7px rgba(99,102,241,0)} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin { to{transform:rotate(360deg)} }

                .li-input {
                    width:100%; background:#fff;
                    border:1.5px solid #e2e4f0;
                    border-radius:10px; padding:11px 14px;
                    color:#1a1a2e; font-size:14px; font-family:var(--font-sans);
                    font-weight:500; transition:all .2s; outline:none; box-sizing:border-box;
                }
                .li-input::placeholder { color:#aab0c6; }
                .li-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.12); }
                .li-input:hover:not(:focus) { border-color:#b0b8d8; }

                .li-role-btn { flex:1; padding:9px 0; border-radius:8px; border:none; cursor:pointer; font-family:var(--font-sans); font-size:13px; font-weight:600; transition:all .2s; }
                .li-role-btn.active { background:linear-gradient(135deg,#6366f1,#a855f7); color:#fff; box-shadow:0 3px 12px rgba(99,102,241,0.35); }
                .li-role-btn.inactive { background:transparent; color:#8892b0; }
                .li-role-btn.inactive:hover { color:#4a5568; background:rgba(99,102,241,0.06); }

                .li-submit { width:100%; padding:13px; border-radius:10px; border:none; cursor:pointer; font-family:var(--font-sans); font-size:15px; font-weight:700; background:linear-gradient(135deg,#6366f1,#a855f7); color:#fff; display:flex; align-items:center; justify-content:center; gap:8px; transition:all .3s; box-shadow:0 6px 20px rgba(99,102,241,0.35); }
                .li-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(99,102,241,0.45); }
                .li-submit:disabled { opacity:0.65; cursor:not-allowed; }

                .li-reg-btn { width:100%; padding:12px; border-radius:10px; border:1.5px solid #e2e4f0; cursor:pointer; font-family:var(--font-sans); font-size:14px; font-weight:600; background:#fff; color:#4a5568; display:flex; align-items:center; justify-content:center; gap:8px; transition:all .2s; text-decoration:none; }
                .li-reg-btn:hover { border-color:#6366f1; color:#6366f1; background:#f5f3ff; }

                .li-back { display:inline-flex; align-items:center; gap:5px; color:#8892b0; text-decoration:none; font-size:13px; font-weight:500; transition:color .2s; margin-bottom:24px; }
                .li-back:hover { color:#6366f1; }
                .li-forgot { font-size:12px; color:#6366f1; font-weight:600; text-decoration:none; }
                .li-forgot:hover { color:#a855f7; }
            `}</style>

            {/* ── LEFT PANEL ── */}
            <div style={{
                flex: '0 0 42%',
                background: 'linear-gradient(145deg,#1e1b4b 0%,#312e81 45%,#4c1d95 100%)',
                display: 'flex', flexDirection: 'column',
                padding: '40px 44px', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Blobs */}
                <div style={{ position:'absolute', top:'-8%', left:'-8%', width:320, height:320, background:'radial-gradient(circle,rgba(139,92,246,0.4) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(60px)', animation:'floatA 9s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:'-6%', right:'-6%', width:280, height:280, background:'radial-gradient(circle,rgba(99,102,241,0.35) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(55px)', animation:'floatB 11s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:'50%', right:'5%', width:160, height:160, background:'radial-gradient(circle,rgba(6,182,212,0.2) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(40px)', animation:'floatA 7s ease-in-out infinite reverse', pointerEvents:'none' }} />
                {/* Dot grid */}
                <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />

                {/* Top */}
                <div style={{ position:'relative', zIndex:1 }}>
                    <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:44 }}>
                        <div style={{ width:38, height:38, background:'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:800, color:'#fff', boxShadow:'0 4px 14px rgba(99,102,241,0.5)' }}>C</div>
                        <span style={{ fontFamily:'var(--font-display)', fontSize:19, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>
                            Campus<span style={{ background:'linear-gradient(90deg,#a5b4fc,#e879f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Hire</span>
                        </span>
                    </Link>

                    <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:50, padding:'5px 14px', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:18 }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'#a5b4fc', display:'inline-block', animation:'pulse2 2s infinite' }} />
                        Placement Portal
                    </div>

                    <h2 style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:800, color:'#fff', marginBottom:10, letterSpacing:'-0.5px', lineHeight:1.25 }}>
                        Welcome back to<br />
                        <span style={{ background:'linear-gradient(135deg,#a5b4fc 0%,#e879f9 50%,#67e8f9 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', backgroundSize:'200% 100%', animation:'shimmer 4s ease-in-out infinite', display:'inline-block' }}>
                            Your Portal
                        </span>
                    </h2>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, lineHeight:1.75, maxWidth:320, marginBottom:36 }}>
                        The all-in-one automated campus recruitment platform for students and placement officers.
                    </p>

                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                        {[
                            { text:'Auto eligibility verification for drives', color:'#a5b4fc' },
                            { text:'Live coding contests with leaderboard',     color:'#e879f9' },
                            { text:'Timed quiz modules with instant results',   color:'#67e8f9' },
                            { text:'Full placement performance analytics',      color:'#6ee7b7' },
                        ].map((item, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:22, height:22, background:`${item.color}22`, border:`1px solid ${item.color}55`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                    <FiCheck style={{ color:item.color, fontSize:12 }} />
                                </div>
                                <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom stats */}
                <div style={{ position:'relative', zIndex:1 }}>
                    <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, overflow:'hidden', marginBottom:20 }}>
                        {[
                            { v:'500+', l:'Placed',    c:'#a5b4fc' },
                            { v:'120+', l:'Companies', c:'#e879f9' },
                            { v:'95%',  l:'Rate',      c:'#67e8f9' },
                        ].map((s, i) => (
                            <div key={i} style={{ flex:1, textAlign:'center', padding:'14px 8px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                                <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:s.c, marginBottom:2 }}>{s.v}</div>
                                <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px' }}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                    <p style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>© 2025 CampusHire. All rights reserved.</p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px 32px', background:'#f5f6fa', overflow:'auto' }}>
                <div style={{ width:'100%', maxWidth:400, animation:'fadeUp 0.5s ease both' }}>

                    <Link to="/" className="li-back" style={{ marginBottom:10 }}>← Back to home</Link>

                    <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'#1a1a2e', marginBottom:2, letterSpacing:'-0.4px' }}>Sign In</h1>
                    <p style={{ color:'#8892b0', fontSize:12, marginBottom:12 }}>Access your account to continue</p>

                    {/* Error */}
                    {err && (
                        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:8, padding:'8px 12px', marginBottom:10 }}>
                            <FiAlertCircle style={{ color:'#f43f5e', flexShrink:0, fontSize:14 }} />
                            <span style={{ fontSize:12, color:'#e11d48', fontWeight:500 }}>{err}</span>
                        </div>
                    )}

                    {/* Role Toggle */}
                    <div style={{ display:'flex', background:'#ebebf5', borderRadius:10, padding:3, marginBottom:12, gap:3 }}>
                        {['student', 'officer'].map(r => (
                            <button key={r} onClick={() => setRoleState(r)} className={`li-role-btn ${role === r ? 'active' : 'inactive'}`}>
                                {r === 'student' ? '🎓 Student' : '🏢 Officer'}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        <div>
                            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:4 }}>
                                {isStudent ? 'Regd. No or Email' : 'Email / Employee ID'}
                            </label>
                            <div style={{ position:'relative' }}>
                                <FiMail style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#aab0c6', fontSize:14, pointerEvents:'none' }} />
                                <input
                                    type="text" className="li-input" required
                                    placeholder={isStudent ? '22G21A0575  or  you@college.edu' : 'officer@campus.edu or PO-001'}
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    style={{ paddingLeft:40 }}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                                <label style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.6px' }}>Password</label>
                                <a href="#" className="li-forgot">Forgot password?</a>
                            </div>
                            <div style={{ position:'relative' }}>
                                <FiLock style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#aab0c6', fontSize:14, pointerEvents:'none' }} />
                                <input
                                    type={showPass ? 'text' : 'password'} className="li-input" required
                                    placeholder="Enter your password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    style={{ paddingLeft:40, paddingRight:44 }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:'#aab0c6', display:'flex', padding:4, transition:'color .2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color='#6366f1'}
                                    onMouseLeave={e => e.currentTarget.style.color='#aab0c6'}
                                >
                                    {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="li-submit" style={{ padding:'11px' }}>
                            {loading
                                ? <><span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Signing in...</>
                                : <><FiZap size={14} /> Sign In <FiArrowRight size={14} /></>
                            }
                        </button>
                    </form>

                    <div style={{ display:'flex', alignItems:'center', gap:8, margin:'10px 0' }}>
                        <div style={{ flex:1, height:1, background:'#e2e4f0' }} />
                        <span style={{ fontSize:11, color:'#aab0c6', fontWeight:500 }}>Don't have an account?</span>
                        <div style={{ flex:1, height:1, background:'#e2e4f0' }} />
                    </div>

                    <Link to="/register" className="li-reg-btn" style={{ padding:'10px' }}>Create New Account</Link>

                    {/* Demo Credentials */}
                    <div style={{ marginTop:10, background:'#fff', border:'1px solid #e2e4f0', borderRadius:10, padding:'10px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                            <div style={{ width:5, height:5, borderRadius:'50%', background:'#6366f1' }} />
                            <p style={{ fontSize:10, fontWeight:700, color:'#6366f1', textTransform:'uppercase', letterSpacing:'0.7px', margin:0 }}>Login Info</p>
                        </div>

                        <div style={{ background:'#f5f3ff', borderRadius:7, padding:'8px 10px', marginBottom:6 }}>
                            <p style={{ fontSize:12, color:'#3730a3', fontWeight:700, marginBottom:3 }}>🎓 Class Students (22G21A05xx)</p>
                            <p style={{ fontSize:11, color:'#6b7280', marginBottom:2 }}>
                                Login ID: <code style={{ background:'#ede9fe', borderRadius:4, padding:'1px 5px', color:'#7c3aed', fontSize:10 }}>Your Regd.No (e.g. 22G21A0575)</code>
                            </p>
                            <p style={{ fontSize:11, color:'#6b7280', margin:0 }}>
                                Password: <code style={{ background:'#ede9fe', borderRadius:4, padding:'1px 5px', color:'#7c3aed', fontSize:10 }}>Your Regd.No (e.g. 22G21A0575)</code>
                            </p>
                        </div>

                        <div style={{ background:'#ecfeff', borderRadius:7, padding:'8px 10px', border:'1px solid #cffafe' }}>
                            <p style={{ fontSize:12, color:'#0e7490', fontWeight:700, marginBottom:3 }}>🏢 Officer Demo</p>
                            <p style={{ fontSize:11, color:'#6b7280', marginBottom:2 }}>
                                Login ID: <code style={{ background:'#cffafe', borderRadius:4, padding:'1px 5px', color:'#0891b2', fontSize:10 }}>officer@campus.edu</code>
                            </p>
                            <p style={{ fontSize:11, color:'#6b7280', margin:0 }}>
                                Password: <code style={{ background:'#cffafe', borderRadius:4, padding:'1px 5px', color:'#0891b2', fontSize:10 }}>Test@1234</code>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
