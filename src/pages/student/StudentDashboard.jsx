import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import useStudentData from '../../hooks/useStudentData';
import {
    FiBriefcase, FiCode, FiBookOpen, FiTrendingUp,
    FiArrowRight, FiCheckCircle, FiClock, FiAlertCircle, FiAward
} from 'react-icons/fi';

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function StudentDashboard() {
    const { student, performance, applications, drives, loading, error } = useStudentData();

    // ── Loading state ────────────────────────────────────────
    const sidebarUser = student
        ? { name: student.full_name, roll: `Roll: ${student.roll_number}`, sessionInfo: `${YEAR_LABELS[student.year] || 'Year ' + student.year} · ${student.branch?.split(' ')[0]}` }
        : { name: '...', roll: '', sessionInfo: '' };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar role="student" user={{ name: '...', roll: '' }} />
                <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="spinner" style={{ width: 48, height: 48, border: '4px solid var(--gray-200)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Loading your dashboard...</p>
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
                        <FiAlertCircle size={40} />
                        <p style={{ marginTop: 12 }}>{error}</p>
                        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>Retry</button>
                    </div>
                </main>
            </div>
        );
    }

    // ── Derived values from real DB data ─────────────────────
    const firstName = student?.full_name?.split(' ')[0] || 'Student';
    const yearLabel = YEAR_LABELS[student?.year] || `Year ${student?.year}`;
    const eligibleDrives = drives.filter(d => d.is_eligible).length;
    const appliedCount = applications.length;
    const shortlisted = applications.filter(a => a.application_status === 'Shortlisted').length;
    const selected = applications.filter(a => a.application_status === 'Selected').length;
    const quizAvg = performance?.avg_quiz_score ? `${parseFloat(performance.avg_quiz_score).toFixed(0)}%` : '—';
    const codingScore = performance?.total_coding_score || 0;
    const overallRank = performance?.overall_rank ? `#${performance.overall_rank}` : '—';

    // Recent 4 drives (most recently created)
    const recentDrives = drives.slice(0, 4);

    return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">

                {/* Top bar */}
                <div className="dashboard-topbar">
                    <div>
                        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} •{' '}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Placement Season Active</span>
                    </div>
                    <Link to="/student/drives" className="btn btn-primary btn-sm">Browse Job Drives <FiArrowRight /></Link>
                </div>

                {/* Welcome */}
                <div className="page-header">
                    <h1 className="page-title">👋 {greeting()}, {firstName}!</h1>
                    <p className="page-subtitle">
                        {student?.roll_number} • {student?.branch} • {yearLabel} • CGPA: <strong style={{ color: 'var(--green)' }}>{student?.percentage}</strong>
                    </p>
                </div>

                {/* Stats from real DB */}
                <div className="stats-grid">
                    {[
                        { icon: <FiBriefcase />, label: 'Eligible Drives', value: eligibleDrives, color: 'green', change: `${drives.length} total drives`, up: true },
                        { icon: <FiCheckCircle />, label: 'Applications', value: appliedCount, color: 'teal', change: shortlisted > 0 ? `${shortlisted} shortlisted` : selected > 0 ? `${selected} selected 🎉` : 'No applications yet', up: appliedCount > 0 },
                        { icon: <FiCode />, label: 'Coding Score', value: codingScore, color: 'orange', change: `Rank ${overallRank}`, up: codingScore > 0 },
                        { icon: <FiBookOpen />, label: 'Quiz Average', value: quizAvg, color: 'black', change: `${performance?.quiz_attempts || 0} attempts`, up: parseFloat(performance?.avg_quiz_score) >= 50 },
                    ].map((s, i) => (
                        <div key={i} className="stat-card">
                            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                            <div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                            <span className={`stat-change ${s.up ? 'up' : 'neutral'}`}>
                                <FiTrendingUp /> {s.change}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
                    <Link to="/student/drives" className="btn btn-primary"><FiBriefcase /> View Job Drives</Link>
                    <Link to="/student/coding" className="btn btn-dark"><FiCode /> Coding Contest</Link>
                    <Link to="/student/quiz" className="btn btn-ghost"><FiBookOpen /> Take Quiz</Link>
                    <Link to="/student/performance" className="btn btn-outline"><FiTrendingUp /> My Performance</Link>
                </div>

                {/* Main content */}
                <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>

                    {/* Drives Table — real data */}
                    <div className="table-container">
                        <div className="table-header-bar">
                            <span className="table-title"><FiBriefcase style={{ marginRight: 6 }} />Active Job Drives</span>
                            <Link to="/student/drives" className="btn btn-secondary btn-sm">View All <FiArrowRight /></Link>
                        </div>
                        {recentDrives.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-500)', fontSize: 14 }}>
                                No active drives at the moment. Check back soon!
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr><th>Company</th><th>Package</th><th>Deadline</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {recentDrives.map((d) => {
                                        const alreadyApplied = applications.some(a => a.drive_id === d.drive_id);
                                        return (
                                            <tr key={d.drive_id}>
                                                <td>
                                                    <div style={{ fontWeight: 700, color: 'var(--black)', fontSize: 14 }}>{d.company_name}</div>
                                                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{d.job_role}</div>
                                                </td>
                                                <td style={{ fontWeight: 700, color: 'var(--green)' }}>{d.package_lpa} LPA</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--gray-500)' }}>
                                                        <FiClock fontSize={12} />
                                                        {new Date(d.last_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                </td>
                                                <td>
                                                    {!d.is_eligible
                                                        ? <span className="badge badge-danger"><FiAlertCircle /> {d.ineligibility_reason || 'Not eligible'}</span>
                                                        : alreadyApplied
                                                            ? <span className="badge badge-success"><FiCheckCircle /> Applied</span>
                                                            : <Link to="/student/drives" className="btn btn-primary btn-xs">Apply</Link>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Performance Overview — real data */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--black)', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Performance Overview
                                <Link to="/student/performance" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Full Report →</Link>
                            </h3>
                            {[
                                { label: 'Quiz Average', val: Math.min(parseFloat(performance?.avg_quiz_score || 0), 100) },
                                { label: 'Coding Progress', val: Math.min(Math.round((performance?.total_coding_score || 0) / 10), 100) },
                                { label: 'Academic %', val: Math.min(parseFloat(student?.percentage || 0), 100) },
                                { label: 'Applications', val: Math.min(((applications.length || 0) / 10) * 100, 100) },
                            ].map((s, i) => (
                                <div key={i} style={{ marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{s.label}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: s.val >= 60 ? 'var(--green)' : 'var(--warning)' }}>{s.val.toFixed(0)}%</span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div className={`progress-bar-fill ${s.val < 50 ? 'warning' : ''}`} style={{ width: `${s.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* My Applications — real data */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--black)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                My Applications
                                <Link to="/student/drives" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Apply More →</Link>
                            </h3>
                            {applications.length === 0 ? (
                                <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', padding: '20px 0' }}>No applications yet. Browse drives and apply!</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {applications.slice(0, 4).map((a, i) => (
                                        <div key={a.application_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < Math.min(applications.length, 4) - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--black)' }}>{a.company_name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.job_role} • {a.package_lpa} LPA</div>
                                            </div>
                                            <span className={`badge ${a.application_status === 'Selected' ? 'badge-success' : a.application_status === 'Shortlisted' ? 'badge-primary' : a.application_status === 'Rejected' ? 'badge-danger' : 'badge-muted'}`}>
                                                {a.application_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
