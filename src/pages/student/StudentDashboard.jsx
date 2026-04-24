import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import useStudentData from '../../hooks/useStudentData';
import {
    FiBriefcase, FiCode, FiBookOpen, FiTrendingUp,
    FiArrowRight, FiCheckCircle, FiClock, FiAlertCircle, FiAward, FiTarget
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

    const statCards = [
        {
            icon: <FiBriefcase size={22} />,
            label: 'Eligible Drives',
            value: eligibleDrives,
            sub: `${drives.length} total drives`,
            up: true,
            grad: 'linear-gradient(135deg,#00A63F 0%,#0E5F3A 100%)',
            glow: 'rgba(0,166,63,0.3)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            icon: <FiCheckCircle size={22} />,
            label: 'Applications',
            value: appliedCount,
            sub: shortlisted > 0 ? `${shortlisted} shortlisted` : selected > 0 ? `${selected} selected 🎉` : 'None yet',
            up: appliedCount > 0,
            grad: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)',
            glow: 'rgba(99,102,241,0.3)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            icon: <FiCode size={22} />,
            label: 'Coding Score',
            value: codingScore,
            sub: `Rank ${overallRank}`,
            up: codingScore > 0,
            grad: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)',
            glow: 'rgba(245,158,11,0.3)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            icon: <FiBookOpen size={22} />,
            label: 'Quiz Average',
            value: quizAvg,
            sub: `${performance?.quiz_attempts || 0} attempts`,
            up: parseFloat(performance?.avg_quiz_score) >= 50,
            grad: 'linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)',
            glow: 'rgba(14,165,233,0.3)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
    ];

    return (
        <div className="dashboard-layout">
            <style>{`
                @keyframes sd-fadein { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .sd-stat { animation: sd-fadein 0.4s ease both; }
                .sd-stat:nth-child(1){animation-delay:0.05s}
                .sd-stat:nth-child(2){animation-delay:0.1s}
                .sd-stat:nth-child(3){animation-delay:0.15s}
                .sd-stat:nth-child(4){animation-delay:0.2s}
                .sd-qa-btn { display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;text-decoration:none;transition:all .2s;font-family:var(--font-sans); }
                .sd-qa-btn:hover { transform:translateY(-2px); }
                .sd-row-hover:hover { background:var(--soft-mint)!important; }
            `}</style>
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">

                {/* Top bar */}
                <div className="dashboard-topbar">
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--gray-300)', display:'inline-block' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)', display:'flex', alignItems:'center', gap:5 }}>
                            <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', display:'inline-block', boxShadow:'0 0 0 3px rgba(0,166,63,0.2)' }} />
                            Placement Season Active
                        </span>
                    </div>
                    <Link to="/student/drives" className="btn btn-primary btn-sm">Browse Drives <FiArrowRight /></Link>
                </div>

                {/* Welcome banner */}
                <div style={{
                    background: 'linear-gradient(135deg,#0a4a2d 0%,#00A63F 60%,#009688 100%)',
                    borderRadius: 16, padding: '24px 28px', marginBottom: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position:'absolute', top:'-30%', right:'5%', width:220, height:220, background:'rgba(255,255,255,0.06)', borderRadius:'50%', pointerEvents:'none' }} />
                    <div style={{ position:'absolute', bottom:'-40%', right:'20%', width:160, height:160, background:'rgba(255,255,255,0.04)', borderRadius:'50%', pointerEvents:'none' }} />
                    <div style={{ position:'relative', zIndex:1 }}>
                        <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'#fff', marginBottom:4, letterSpacing:'-0.3px' }}>
                            👋 {greeting()}, {firstName}!
                        </h1>
                        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                            <span>{student?.roll_number}</span>
                            <span style={{ opacity:0.4 }}>•</span>
                            <span>{student?.branch}</span>
                            <span style={{ opacity:0.4 }}>•</span>
                            <span>{yearLabel}</span>
                            <span style={{ opacity:0.4 }}>•</span>
                            <span>CGPA: <strong style={{ color:'#6ee7b7' }}>{student?.percentage}</strong></span>
                        </p>
                    </div>
                    <div style={{ display:'flex', gap:10, position:'relative', zIndex:1, flexShrink:0 }}>
                        <Link to="/student/profile" className="sd-qa-btn" style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.25)' }}>
                            <FiAward size={14} /> My Profile
                        </Link>
                        <Link to="/student/performance" className="sd-qa-btn" style={{ background:'#fff', color:'var(--green-dark)' }}>
                            <FiTrendingUp size={14} /> Performance
                        </Link>
                    </div>
                </div>

                {/* Stat Cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:22 }}>
                    {statCards.map((s, i) => (
                        <div key={i} className="sd-stat" style={{
                            background: s.grad, borderRadius:14, padding:'20px 20px 16px',
                            boxShadow: `0 6px 24px ${s.glow}`, position:'relative', overflow:'hidden',
                        }}>
                            <div style={{ position:'absolute', top:'-20%', right:'-10%', width:90, height:90, background:'rgba(255,255,255,0.08)', borderRadius:'50%', pointerEvents:'none' }} />
                            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                                <div style={{ width:42, height:42, borderRadius:10, background:s.iconBg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                                    {s.icon}
                                </div>
                                <span style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.7)', background:'rgba(255,255,255,0.15)', borderRadius:20, padding:'3px 9px', display:'flex', alignItems:'center', gap:4 }}>
                                    <FiTrendingUp size={10} /> {s.up ? 'Active' : 'Pending'}
                                </span>
                            </div>
                            <div style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:800, color:'#fff', lineHeight:1, marginBottom:4 }}>{s.value}</div>
                            <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontWeight:600, marginBottom:2 }}>{s.label}</div>
                            <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display:'flex', gap:10, marginBottom:22, flexWrap:'wrap' }}>
                    <Link to="/student/drives" className="btn btn-primary btn-sm"><FiBriefcase size={13} /> Job Drives</Link>
                    <Link to="/student/coding" className="btn btn-dark btn-sm"><FiCode size={13} /> Coding Contest</Link>
                    <Link to="/student/quiz" className="btn btn-ghost btn-sm"><FiBookOpen size={13} /> Take Quiz</Link>
                    <Link to="/student/performance" className="btn btn-outline btn-sm"><FiTrendingUp size={13} /> Performance</Link>
                </div>

                {/* Main content */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20, alignItems:'start' }}>

                    {/* Drives Table */}
                    <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', background:'#fff' }}>
                            <span style={{ fontSize:14, fontWeight:700, color:'var(--black)', display:'flex', alignItems:'center', gap:8 }}>
                                <span style={{ width:28, height:28, borderRadius:8, background:'var(--soft-mint)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--green)' }}>
                                    <FiBriefcase size={14} />
                                </span>
                                Active Job Drives
                            </span>
                            <Link to="/student/drives" className="btn btn-secondary btn-sm">View All <FiArrowRight size={12} /></Link>
                        </div>
                        {recentDrives.length === 0 ? (
                            <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--gray-500)', fontSize:14 }}>
                                No active drives at the moment. Check back soon!
                            </div>
                        ) : (
                            <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                <thead>
                                    <tr style={{ background:'var(--gray-100)' }}>
                                        <th style={{ padding:'10px 18px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.7px' }}>Company</th>
                                        <th style={{ padding:'10px 18px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.7px' }}>Package</th>
                                        <th style={{ padding:'10px 18px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.7px' }}>Deadline</th>
                                        <th style={{ padding:'10px 18px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.7px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentDrives.map((d, idx) => {
                                        const alreadyApplied = applications.some(a => a.drive_id === d.drive_id);
                                        return (
                                            <tr key={d.drive_id} className="sd-row-hover" style={{ borderBottom: idx < recentDrives.length - 1 ? '1px solid var(--gray-100)' : 'none', transition:'background .15s' }}>
                                                <td style={{ padding:'13px 18px' }}>
                                                    <div style={{ fontWeight:700, color:'var(--black)', fontSize:13 }}>{d.company_name}</div>
                                                    <div style={{ fontSize:11, color:'var(--gray-500)', marginTop:2 }}>{d.job_role}</div>
                                                </td>
                                                <td style={{ padding:'13px 18px' }}>
                                                    <span style={{ fontWeight:700, color:'var(--green)', fontSize:14 }}>{d.package_lpa}</span>
                                                    <span style={{ fontSize:11, color:'var(--gray-500)', marginLeft:3 }}>LPA</span>
                                                </td>
                                                <td style={{ padding:'13px 18px' }}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--gray-500)' }}>
                                                        <FiClock size={11} />
                                                        {new Date(d.last_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                                                    </div>
                                                </td>
                                                <td style={{ padding:'13px 18px' }}>
                                                    {!d.is_eligible
                                                        ? <span className="badge badge-danger"><FiAlertCircle size={10} /> Not eligible</span>
                                                        : alreadyApplied
                                                            ? <span className="badge badge-success"><FiCheckCircle size={10} /> Applied</span>
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
                    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                        {/* Performance Overview */}
                        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'18px 20px', boxShadow:'var(--shadow-sm)' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                                <span style={{ fontSize:14, fontWeight:700, color:'var(--black)', display:'flex', alignItems:'center', gap:8 }}>
                                    <span style={{ width:28, height:28, borderRadius:8, background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366f1' }}>
                                        <FiTarget size={14} />
                                    </span>
                                    Performance
                                </span>
                                <Link to="/student/performance" style={{ fontSize:12, color:'var(--green)', fontWeight:600, textDecoration:'none' }}>Full Report →</Link>
                            </div>
                            {[
                                { label:'Quiz Average', val: Math.min(parseFloat(performance?.avg_quiz_score || 0), 100), color:'#6366f1' },
                                { label:'Coding Progress', val: Math.min(Math.round((performance?.total_coding_score || 0) / 10), 100), color:'#f59e0b' },
                                { label:'Academic %', val: Math.min(parseFloat(student?.percentage || 0), 100), color:'var(--green)' },
                                { label:'Applications', val: Math.min(((applications.length || 0) / 10) * 100, 100), color:'#0ea5e9' },
                            ].map((s, i) => (
                                <div key={i} style={{ marginBottom:12 }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                                        <span style={{ fontSize:12, color:'var(--gray-700)', fontWeight:500 }}>{s.label}</span>
                                        <span style={{ fontSize:12, fontWeight:700, color: s.val >= 60 ? s.color : 'var(--warning)' }}>{s.val.toFixed(0)}%</span>
                                    </div>
                                    <div style={{ background:'var(--gray-200)', borderRadius:99, height:6, overflow:'hidden' }}>
                                        <div style={{ height:'100%', borderRadius:99, background:s.val >= 60 ? s.color : 'var(--warning)', width:`${s.val}%`, transition:'width 0.8s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* My Applications */}
                        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'18px 20px', boxShadow:'var(--shadow-sm)' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                                <span style={{ fontSize:14, fontWeight:700, color:'var(--black)', display:'flex', alignItems:'center', gap:8 }}>
                                    <span style={{ width:28, height:28, borderRadius:8, background:'var(--soft-mint)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--green)' }}>
                                        <FiCheckCircle size={14} />
                                    </span>
                                    My Applications
                                </span>
                                <Link to="/student/drives" style={{ fontSize:12, color:'var(--green)', fontWeight:600, textDecoration:'none' }}>Apply More →</Link>
                            </div>
                            {applications.length === 0 ? (
                                <p style={{ fontSize:13, color:'var(--gray-500)', textAlign:'center', padding:'16px 0' }}>No applications yet. Browse drives and apply!</p>
                            ) : (
                                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                                    {applications.slice(0, 4).map((a, i) => (
                                        <div key={a.application_id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i < Math.min(applications.length, 4) - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                                            <div>
                                                <div style={{ fontWeight:600, fontSize:13, color:'var(--black)' }}>{a.company_name}</div>
                                                <div style={{ fontSize:11, color:'var(--gray-500)', marginTop:1 }}>{a.job_role} • {a.package_lpa} LPA</div>
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
