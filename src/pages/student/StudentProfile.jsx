import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import useStudentData from '../../hooks/useStudentData';
import { updateStudentProfile } from '../../services/api';
import { FiEdit2, FiSave, FiX, FiAward, FiBook, FiMail, FiPhone, FiAlertCircle, FiCheckCircle, FiPlus } from 'react-icons/fi';

const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };

export default function StudentProfile() {
    const { student, performance, applications, loading, error, setStudent } = useStudentData();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [saveError, setSaveError] = useState('');
    const [skills, setSkills] = useState(['Data Structures', 'Python', 'MySQL', 'React.js']);
    const [newSkill, setNewSkill] = useState('');

    // Local edit form — pre-filled from DB
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (!student || form) return;
        setForm({
            full_name: student.full_name,
            email: student.email,
            mobile_number: student.mobile_number || '',
            branch: student.branch,
            year: String(student.year),
            percentage: String(student.percentage),
            backlogs: String(student.backlogs),
        });
    }, [student, form]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true); setSaveMsg(''); setSaveError('');
        try {
            const res = await updateStudentProfile({
                full_name: form.full_name,
                mobile_number: form.mobile_number,
                branch: form.branch,
                year: parseInt(form.year),
                percentage: parseFloat(form.percentage),
                backlogs: parseInt(form.backlogs),
            });
            setStudent(res.data); // update shared state
            setSaveMsg('Profile saved successfully!');
            setEditing(false);
        } catch (err) {
            setSaveError(err.message || 'Save failed');
        } finally {
            setSaving(false);
            setTimeout(() => { setSaveMsg(''); setSaveError(''); }, 3500);
        }
    };

    const addSkill = () => { if (newSkill.trim() && !skills.includes(newSkill.trim())) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } };
    const removeSkill = (s) => setSkills(skills.filter(x => x !== s));

    // ── Loading / Error states ───────────────────────────────
    if (loading || !form) {
        return (
            <div className="dashboard-layout">
                <Sidebar role="student" user={{ name: '...', roll: '' }} />
                <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 48, height: 48, border: '4px solid var(--gray-200)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Loading your profile...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-layout">
                <Sidebar role="student" user={{ name: 'Error', roll: '' }} />
                <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#ef4444' }}>
                        <FiAlertCircle size={40} /><p style={{ marginTop: 12 }}>{error}</p>
                        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>Retry</button>
                    </div>
                </main>
            </div>
        );
    }

    const yearLabel = YEAR_LABELS[student?.year] || `Year ${student?.year}`;
    const firstLetter = (student?.full_name || 'S')[0].toUpperCase();
    const cgpaStatus = parseFloat(student?.percentage) >= 60;
    const backlogStatus = parseInt(student?.backlogs) === 0;

    return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: student.full_name, roll: `Roll: ${student.roll_number}` }} />
            <main className="dashboard-main">

                {/* Header */}
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">My Profile</h1>
                        <p className="page-subtitle">View and manage your academic information</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {saveMsg && <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>✅ {saveMsg}</span>}
                        {saveError && <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>❌ {saveError}</span>}
                        {editing ? (
                            <>
                                <button className="btn btn-success" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : <><FiSave /> Save Changes</>}</button>
                                <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                            </>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setEditing(true)}><FiEdit2 /> Edit Profile</button>
                        )}
                    </div>
                </div>

                <div className="grid-2" style={{ alignItems: 'start' }}>
                    {/* ── Left column ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Profile Card — real data */}
                        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
                            <div className="avatar-placeholder" style={{ width: 88, height: 88, fontSize: 36, margin: '0 auto 20px', background: 'var(--gradient-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                {firstLetter}
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 6, color: 'var(--black)' }}>
                                {student.full_name}
                            </h2>
                            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 16 }}>
                                {student.branch} • {yearLabel}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                                <span className="badge badge-primary">Roll: {student.roll_number}</span>
                                <span className="badge badge-success">CGPA: {student.percentage}</span>
                                <span className={`badge ${backlogStatus ? 'badge-muted' : 'badge-danger'}`}>
                                    Backlogs: {student.backlogs}
                                </span>
                            </div>
                            <div className="divider" style={{ height: 1, background: 'var(--gray-200)', margin: '16px 0' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--gray-600)' }}>
                                    <FiMail style={{ color: 'var(--green)', flexShrink: 0 }} /> {student.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--gray-600)' }}>
                                    <FiPhone style={{ color: 'var(--green)', flexShrink: 0 }} /> {student.mobile_number || 'Not provided'}
                                </div>
                            </div>
                        </div>

                        {/* Application Summary */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Application Summary</h3>
                            {applications.length === 0 ? (
                                <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', padding: '12px 0' }}>No applications yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {applications.map((a, i) => (
                                        <div key={a.application_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < applications.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.company_name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.job_role}</div>
                                            </div>
                                            <span className={`badge ${a.application_status === 'Selected' ? 'badge-success' : a.application_status === 'Shortlisted' ? 'badge-primary' : a.application_status === 'Rejected' ? 'badge-danger' : 'badge-muted'}`}>
                                                {a.application_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiAward style={{ color: 'var(--green)' }} /> Skills
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: editing ? 16 : 0 }}>
                                {skills.map(s => (
                                    <span key={s} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }}>
                                        {s}
                                        {editing && <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 1 }}><FiX size={12} /></button>}
                                    </span>
                                ))}
                            </div>
                            {editing && (
                                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                                    <input className="form-input" placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} style={{ flex: 1 }} />
                                    <button className="btn btn-primary btn-sm" onClick={addSkill}><FiPlus /> Add</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Academic Details Form — editable */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Academic Details</h3>
                            <div className="grid-2" style={{ columnGap: 20, rowGap: 0 }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input name="full_name" className="form-input" value={form.full_name} onChange={handleChange} disabled={!editing} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Roll Number</label>
                                    <input className="form-input" value={student.roll_number} disabled style={{ background: 'var(--gray-100)' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input className="form-input" value={student.email} disabled style={{ background: 'var(--gray-100)' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mobile</label>
                                    <input name="mobile_number" className="form-input" value={form.mobile_number} onChange={handleChange} disabled={!editing} placeholder="+91 XXXXXXXXXX" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Branch</label>
                                    {editing ? (
                                        <select name="branch" className="form-select" value={form.branch} onChange={handleChange}>
                                            {BRANCHES.map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    ) : (
                                        <input className="form-input" value={form.branch} disabled />
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                    {editing ? (
                                        <select name="year" className="form-select" value={form.year} onChange={handleChange}>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    ) : (
                                        <input className="form-input" value={yearLabel} disabled />
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">CGPA / Percentage</label>
                                    <input name="percentage" type="number" step="0.01" min="0" max="10" className="form-input" value={form.percentage} onChange={handleChange} disabled={!editing} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Active Backlogs</label>
                                    <input name="backlogs" type="number" min="0" className="form-input" value={form.backlogs} onChange={handleChange} disabled={!editing} />
                                </div>
                            </div>
                        </div>

                        {/* Eligibility Summary — dynamically from real data */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Eligibility Summary</h3>
                            {[
                                { label: 'CGPA / Percentage', value: `${student.percentage}%`, pass: cgpaStatus, note: cgpaStatus ? '≥ 60% — Eligible for most drives' : '< 60% — Some drives require higher CGPA' },
                                { label: 'Active Backlogs', value: student.backlogs, pass: backlogStatus, note: backlogStatus ? 'No backlogs — Fully eligible' : `${student.backlogs} active backlog(s)` },
                                { label: 'Year of Study', value: yearLabel, pass: student.year >= 3, note: student.year >= 3 ? 'Eligible for placement drives' : 'Placement drives open from 3rd year' },
                                { label: 'Branch', value: student.branch, pass: true, note: 'CSE branch accepted for all major tech drives' },
                            ].map((e, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none' }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--black)' }}>{e.label}</div>
                                        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{e.note}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>{e.value}</div>
                                        <span className={`badge ${e.pass ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 11 }}>
                                            {e.pass ? <><FiCheckCircle size={10} /> Pass</> : <><FiAlertCircle size={10} /> Review</>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Performance from DB */}
                        {performance && (
                            <div className="card">
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                                    <FiAward style={{ color: 'var(--green)', marginRight: 8 }} />Performance Stats
                                </h3>
                                <div className="grid-2" style={{ gap: 16 }}>
                                    {[
                                        { label: 'Quiz Score', value: performance.total_quiz_score || 0 },
                                        { label: 'Quiz Attempts', value: performance.quiz_attempts || 0 },
                                        { label: 'Avg Quiz Score', value: `${parseFloat(performance.avg_quiz_score || 0).toFixed(0)}%` },
                                        { label: 'Coding Score', value: performance.total_coding_score || 0 },
                                        { label: 'Code Submissions', value: performance.coding_submissions || 0 },
                                        { label: 'Overall Rank', value: performance.overall_rank ? `#${performance.overall_rank}` : 'Not ranked yet' },
                                    ].map((s, i) => (
                                        <div key={i} style={{ background: 'var(--cloud-gray)', borderRadius: 10, padding: '12px 16px' }}>
                                            <div style={{ fontSize: 11, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
                                            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
