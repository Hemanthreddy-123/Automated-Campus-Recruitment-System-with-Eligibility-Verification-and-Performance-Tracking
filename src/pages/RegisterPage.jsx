import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBriefcase, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { registerUser, setToken, setUser, setRole } from '../services/api';

const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function RegisterPage() {
    const [role, setRoleState] = useState('student');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [form, setForm] = useState({
        name: '', email: '', mobile: '', rollOrId: '',
        branch: '', year: '', cgpa: '', backlogs: '0', password: '',
    });
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            const payload = {
                role,
                full_name: form.name,
                email: form.email,
                password: form.password,
                mobile_number: form.mobile,
                ...(role === 'student'
                    ? { roll_number: form.rollOrId, branch: form.branch, year: form.year, percentage: form.cgpa, backlogs: form.backlogs }
                    : { employee_id: form.rollOrId, department: form.branch || 'Training & Placement' }
                ),
            };
            const res = await registerUser(payload);
            setToken(res.data.token);
            setUser(res.data.user);
            setRole(res.data.role);
            if (role === 'student') navigate('/student/dashboard');
            else navigate('/officer/dashboard');
        } catch (error) {
            setErr(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--cloud-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
            <div style={{ width: '100%', maxWidth: 960, background: 'var(--white)', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex' }}>

                {/* ── Left panel ── */}
                <div style={{ flex: '0 0 38%', background: 'var(--black)', padding: '48px 36px', display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,166,63,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{ width: 38, height: 38, background: 'var(--gradient-green)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#fff' }}>C</div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#fff' }}>Campus<span style={{ color: 'var(--green)' }}>Hire</span></span>
                    </Link>

                    <div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>Join the Recruitment Platform</h2>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.75 }}>Create your account to access job drives, coding competitions, quizzes, and your placement dashboard.</p>
                    </div>

                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {['Auto eligibility check on every drive', 'Live coding contests with timer', 'Quiz module with instant results', 'Complete placement analytics'].map((f, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(0,166,63,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FiCheck style={{ color: 'var(--green)', fontSize: 12 }} />
                                </div>
                                {f}
                            </li>
                        ))}
                    </ul>

                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 'auto' }}>
                        Already registered? <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Sign In →</Link>
                    </p>
                </div>

                {/* ── Right Panel ── */}
                <div style={{ flex: 1, padding: '44px 44px', overflowY: 'auto' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--black)', marginBottom: 6 }}>Create Your Account</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>Fill in your details to get started</p>

                    {/* Error */}
                    {err && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                            <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: '#dc2626' }}>{err}</span>
                        </div>
                    )}

                    {/* Role Toggle */}
                    <div style={{ display: 'flex', border: '1.5px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden', marginBottom: 24, width: 'fit-content' }}>
                        <button onClick={() => setRoleState('student')} style={{
                            display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', border: 'none', cursor: 'pointer',
                            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                            background: role === 'student' ? 'var(--green)' : 'transparent',
                            color: role === 'student' ? '#fff' : 'var(--gray-500)',
                        }}>
                            <FiUser /> Student
                        </button>
                        <button onClick={() => setRoleState('officer')} style={{
                            display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', border: 'none',
                            borderLeft: '1.5px solid var(--gray-200)', cursor: 'pointer',
                            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                            background: role === 'officer' ? 'var(--black)' : 'transparent',
                            color: role === 'officer' ? '#fff' : 'var(--gray-500)',
                        }}>
                            <FiBriefcase /> Officer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid-2" style={{ columnGap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input name="name" className="form-input" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{role === 'student' ? 'Roll Number *' : 'Employee ID *'}</label>
                                <input name="rollOrId" className="form-input" placeholder={role === 'student' ? '21CS047' : 'PO-001'} value={form.rollOrId} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input name="email" type="email" className="form-input" placeholder="you@college.edu" value={form.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mobile Number *</label>
                                <input name="mobile" className="form-input" placeholder="9876543210" value={form.mobile} onChange={handleChange} required />
                            </div>

                            {role === 'student' ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Branch *</label>
                                        <select name="branch" className="form-select" value={form.branch} onChange={handleChange} required>
                                            <option value="">Select Branch</option>
                                            {BRANCHES.map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Year *</label>
                                        <select name="year" className="form-select" value={form.year} onChange={handleChange} required>
                                            <option value="">Select Year</option>
                                            {YEARS.map((y, i) => <option key={y} value={i + 1}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CGPA / Percentage *</label>
                                        <input name="cgpa" type="number" step="0.01" min="0" max="10" className="form-input" placeholder="8.5" value={form.cgpa} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Number of Backlogs *</label>
                                        <select name="backlogs" className="form-select" value={form.backlogs} onChange={handleChange}>
                                            {[0, 1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Department *</label>
                                    <input name="branch" className="form-input" placeholder="Training & Placement" value={form.branch} onChange={handleChange} />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Create Password *</label>
                            <div style={{ position: 'relative' }}>
                                <input name="password" type={showPass ? 'text' : 'password'} className="form-input" placeholder="Minimum 6 characters" value={form.password} onChange={handleChange} required style={{ paddingRight: 44 }} />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}>
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: loading ? 0.75 : 1 }}>
                            {loading ? 'Creating account...' : <><span>Create Account</span> <FiArrowRight /></>}
                        </button>

                        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--gray-500)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
