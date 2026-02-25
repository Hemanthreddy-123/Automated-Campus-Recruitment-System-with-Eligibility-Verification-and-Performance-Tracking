import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getToken } from '../../services/api';
import { FiTrendingUp, FiAward, FiCode, FiBookOpen, FiBriefcase, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };

const STATUS_CFG = {
    Pending: { label: 'Under Review', cls: 'badge-primary' },
    Shortlisted: { label: 'Shortlisted', cls: 'badge-warning' },
    Selected: { label: 'Selected 🎉', cls: 'badge-success' },
    Rejected: { label: 'Rejected', cls: 'badge-danger' },
};

export default function PerformanceTracking() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = getToken();
        if (!token) { window.location.href = '/login'; return; }

        const headers = { Authorization: `Bearer ${token}` };

        async function fetchAll() {
            try {
                // Fetch all in parallel
                const [profileRes, appRes, quizRes, codingRes, perfRes] = await Promise.all([
                    fetch(`${BASE}/student/profile`, { headers }),
                    fetch(`${BASE}/student/applications`, { headers }),
                    fetch(`${BASE}/quiz/history`, { headers }),
                    fetch(`${BASE}/coding/history`, { headers }),
                    fetch(`${BASE}/reports/my-performance`, { headers }),
                ]);

                const [profile, apps, quizzes, coding, perf] = await Promise.all([
                    profileRes.json(), appRes.json(), quizRes.json(), codingRes.json(), perfRes.json(),
                ]);

                setData({
                    student: profile.success ? profile.data.student : null,
                    performance: profile.success ? profile.data.performance : null,
                    applications: apps.success ? apps.data : [],
                    quizHistory: quizzes.success ? quizzes.data : [],
                    codingHistory: coding.success ? coding.data : [],
                    myPerf: perf.success ? perf.data : null,
                });
            } catch (err) {
                setError(err.message || 'Failed to load performance data');
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    // ── Loading ──────────────────────────────────────────────
    if (loading) return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: '...', roll: '' }} />
            <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '4px solid var(--gray-200)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Loading performance data...</p>
                </div>
            </main>
        </div>
    );

    if (error || !data?.student) return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Error', roll: '' }} />
            <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#ef4444' }}>
                    <FiAlertCircle size={40} />
                    <p style={{ marginTop: 12 }}>{error || 'Profile not found'}</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>Retry</button>
                </div>
            </main>
        </div>
    );

    const { student, performance, applications, quizHistory, codingHistory, myPerf } = data;

    const yearLabel = YEAR_LABELS[student.year] || `Year ${student.year}`;
    const firstName = student.full_name?.split(' ')[0];
    const quizAvg = parseFloat(performance?.avg_quiz_score || 0).toFixed(0);
    const codingTotal = performance?.total_coding_score || 0;
    const rank = performance?.overall_rank;
    const selected = applications.filter(a => a.application_status === 'Selected').length;

    // Overall score — weighted average
    const overallScore = Math.round(
        (parseFloat(quizAvg) * 0.35) +
        (Math.min(codingTotal / 10, 100) * 0.35) +
        (Math.min(parseFloat(student.percentage), 100) * 0.30)
    );

    const sidebarUser = {
        name: student.full_name,
        roll: `Roll: ${student.roll_number}`,
        sessionInfo: `${yearLabel} · ${student.branch?.split(' ')[0]}`,
    };

    return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">
                <div className="page-header">
                    <h1 className="page-title">Performance Tracking</h1>
                    <p className="page-subtitle">Complete real-time overview of your academic and placement performance</p>
                </div>

                {/* Overall Score Banner — real data */}
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--black) 0%, #1a2a1a 100%)', border: 'none', marginBottom: 28, padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
                        {/* Score circle */}
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--gradient-green)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 0 30px rgba(0,166,63,0.4)' }}>
                                <span style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{overallScore}</span>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>/ 100</span>
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Overall Score</div>
                        </div>

                        {/* Student Info */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                                {student.full_name}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontSize: 13 }}>
                                {student.branch} • {yearLabel} • Roll: {student.roll_number}
                            </p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <span className="badge badge-success">CGPA: {student.percentage}</span>
                                {rank && <span className="badge badge-primary">Rank: #{rank} in Class</span>}
                                <span className={`badge ${parseFloat(student.percentage) >= 60 && parseInt(student.backlogs) === 0 ? 'badge-success' : 'badge-warning'}`}>
                                    {parseFloat(student.percentage) >= 60 && parseInt(student.backlogs) === 0 ? '✓ Placement Ready' : '⚠ Review Profile'}
                                </span>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                { label: 'Quiz Avg', value: `${quizAvg}%`, icon: '📝' },
                                { label: 'Coding', value: codingTotal || 0, icon: '💻' },
                                { label: 'Applied', value: `${applications.length} Drives`, icon: '📋' },
                                { label: 'Selected', value: `${selected} Offer${selected !== 1 ? 's' : ''}`, icon: '🏆' },
                            ].map((s, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                                    <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{s.value}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Cards — real DB */}
                <div className="stats-grid" style={{ marginBottom: 28 }}>
                    {[
                        { icon: <FiBookOpen />, label: 'Quiz Average', value: `${quizAvg}%`, color: 'teal', desc: `${performance?.quiz_attempts || 0} quizzes taken` },
                        { icon: <FiCode />, label: 'Coding Score', value: codingTotal, color: 'orange', desc: `${performance?.coding_submissions || 0} submissions` },
                        { icon: <FiBriefcase />, label: 'Drives Applied', value: applications.length, color: 'green', desc: `${selected} selected` },
                        { icon: <FiAward />, label: 'Overall Rank', value: rank ? `#${rank}` : '—', color: 'black', desc: 'Among all students' },
                    ].map((s, i) => (
                        <div key={i} className="stat-card">
                            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                            <div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{s.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Academic performance bar */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiTrendingUp style={{ color: 'var(--green)' }} /> Academic & Placement Breakdown
                    </h3>
                    {[
                        { label: 'Academic CGPA / %', value: Math.min(parseFloat(student.percentage), 100) },
                        { label: 'Quiz Performance Avg', value: Math.min(parseFloat(quizAvg), 100) },
                        { label: 'Coding Score (scaled)', value: Math.min(codingTotal / 10, 100) },
                        { label: 'Application Activity', value: Math.min(applications.length * 10, 100) },
                        { label: 'Backlogs (inverse)', value: Math.max(100 - (parseInt(student.backlogs) * 25), 0) },
                    ].map((s, i) => (
                        <div key={i} style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                                <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>{s.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: s.value >= 80 ? 'var(--green)' : s.value >= 60 ? 'var(--warning)' : '#ef4444' }}>
                                    {s.value.toFixed(0)}%
                                </span>
                            </div>
                            <div className="progress-bar-container">
                                <div className={`progress-bar-fill ${s.value >= 80 ? '' : s.value >= 60 ? 'warning' : 'danger'}`} style={{ width: `${s.value}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid-2" style={{ gap: 24 }}>
                    {/* Application History — real DB */}
                    <div>
                        <div className="table-container">
                            <div className="table-header-bar">
                                <span className="table-title"><FiBriefcase style={{ marginRight: 8 }} />Application History</span>
                            </div>
                            {applications.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--gray-500)', fontSize: 13 }}>
                                    No applications yet. Browse job drives and apply!
                                </div>
                            ) : (
                                <table>
                                    <thead><tr><th>Company</th><th>Role</th><th>Date</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {applications.map((a) => {
                                            const cfg = STATUS_CFG[a.application_status] || { label: a.application_status, cls: 'badge-muted' };
                                            return (
                                                <tr key={a.application_id}>
                                                    <td style={{ fontWeight: 700, color: 'var(--black)' }}>{a.company_name}</td>
                                                    <td style={{ fontSize: 13 }}>{a.job_role}</td>
                                                    <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>
                                                        {new Date(a.applied_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </td>
                                                    <td><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Quiz + Coding History */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Quiz History — real quiz_results table */}
                        <div className="table-container">
                            <div className="table-header-bar">
                                <span className="table-title"><FiCheckCircle style={{ marginRight: 8 }} />Quiz History</span>
                            </div>
                            {quizHistory.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--gray-500)', fontSize: 13 }}>
                                    No quizzes taken yet.
                                </div>
                            ) : (
                                <table>
                                    <thead><tr><th>Quiz</th><th>Score</th><th>Result</th></tr></thead>
                                    <tbody>
                                        {quizHistory.map((q) => (
                                            <tr key={q.quiz_id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--black)', fontSize: 13 }}>{q.quiz_name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                                                        {new Date(q.attempt_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 700, color: q.passed ? 'var(--green)' : '#ef4444' }}>
                                                    {q.score}/{q.total_marks}
                                                </td>
                                                <td>
                                                    <span className={`badge ${q.passed ? 'badge-success' : 'badge-danger'}`}>
                                                        {q.passed ? 'Pass' : 'Fail'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Coding History — real coding_results table */}
                        <div className="table-container">
                            <div className="table-header-bar">
                                <span className="table-title"><FiCode style={{ marginRight: 8 }} />Coding History</span>
                            </div>
                            {codingHistory.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--gray-500)', fontSize: 13 }}>
                                    No coding submissions yet.
                                </div>
                            ) : (
                                <table>
                                    <thead><tr><th>Contest / Problem</th><th>Score</th><th>Lang</th></tr></thead>
                                    <tbody>
                                        {codingHistory.map((c) => (
                                            <tr key={c.coding_id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--black)', fontSize: 13 }}>{c.problem_title || c.contest_name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                                                        {new Date(c.submission_time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 700, color: 'var(--green)' }}>{c.score}/{c.max_score}</td>
                                                <td>
                                                    <span className="badge badge-muted" style={{ fontSize: 11 }}>{c.language}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
