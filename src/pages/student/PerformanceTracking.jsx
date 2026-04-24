import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getToken } from '../../services/api';
import useStudentData from '../../hooks/useStudentData';
import { FiTrendingUp, FiAward, FiCode, FiBookOpen, FiBriefcase, FiCheckCircle, FiAlertCircle, FiTarget, FiZap } from 'react-icons/fi';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };

const STATUS_CFG = {
    Pending:     { label: 'Under Review', cls: 'badge-primary' },
    Shortlisted: { label: 'Shortlisted',  cls: 'badge-warning' },
    Selected:    { label: 'Selected 🎉',  cls: 'badge-success' },
    Rejected:    { label: 'Rejected',     cls: 'badge-danger'  },
};

export default function PerformanceTracking() {
    const { student, performance, applications, loading, error } = useStudentData();
    const [quizHistory,   setQuizHistory]   = useState([]);
    const [codingHistory, setCodingHistory] = useState([]);
    const [extraLoading,  setExtraLoading]  = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token || !student) return;
        const headers = { Authorization: `Bearer ${token}` };
        (async () => {
            try {
                const [qr, cr] = await Promise.all([
                    fetch(`${BASE}/quiz/history`,   { headers }),
                    fetch(`${BASE}/coding/history`, { headers }),
                ]);
                const [q, c] = await Promise.all([qr.json(), cr.json()]);
                setQuizHistory(q.success   ? q.data : []);
                setCodingHistory(c.success ? c.data : []);
            } finally {
                setExtraLoading(false);
            }
        })();
    }, [student]);

    if (loading) return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: '...', roll: '' }} />
            <main className="dashboard-main" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ textAlign:'center' }}>
                    <div style={{ width:44, height:44, border:'4px solid var(--gray-200)', borderTopColor:'var(--green)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
                    <p style={{ color:'var(--gray-500)', fontSize:13 }}>Loading performance data...</p>
                </div>
            </main>
        </div>
    );

    if (error || !student) return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={{ name: 'Error', roll: '' }} />
            <main className="dashboard-main" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ textAlign:'center', color:'#ef4444' }}>
                    <FiAlertCircle size={36} />
                    <p style={{ marginTop:10 }}>{error || 'Profile not found'}</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop:10 }} onClick={() => window.location.reload()}>Retry</button>
                </div>
            </main>
        </div>
    );

    const yearLabel    = YEAR_LABELS[student.year] || `Year ${student.year}`;
    const quizAvg      = parseFloat(performance?.avg_quiz_score || 0).toFixed(0);
    const codingTotal  = performance?.total_coding_score || 0;
    const rank         = performance?.overall_rank;
    const selected     = applications.filter(a => a.application_status === 'Selected').length;
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

    const statCards = [
        { icon: <FiBookOpen size={20} />, label: 'Quiz Average',  value: `${quizAvg}%`,        sub: `${performance?.quiz_attempts || 0} attempts`,    grad: 'linear-gradient(135deg,#6366f1,#4f46e5)', glow: 'rgba(99,102,241,0.28)' },
        { icon: <FiCode size={20} />,     label: 'Coding Score',  value: codingTotal,           sub: `${performance?.coding_submissions || 0} submits`, grad: 'linear-gradient(135deg,#f59e0b,#d97706)', glow: 'rgba(245,158,11,0.28)'  },
        { icon: <FiBriefcase size={20} />,label: 'Drives Applied',value: applications.length,   sub: `${selected} selected`,                           grad: 'linear-gradient(135deg,#00A63F,#0E5F3A)', glow: 'rgba(0,166,63,0.28)'   },
        { icon: <FiAward size={20} />,    label: 'Overall Rank',  value: rank ? `#${rank}` : '—', sub: 'Among all students',                           grad: 'linear-gradient(135deg,#0ea5e9,#0284c7)', glow: 'rgba(14,165,233,0.28)' },
    ];

    const bars = [
        { label: 'Academic %',           val: Math.min(parseFloat(student.percentage), 100),    color: 'var(--green)' },
        { label: 'Quiz Performance',      val: Math.min(parseFloat(quizAvg), 100),               color: '#6366f1'      },
        { label: 'Coding Score (scaled)', val: Math.min(codingTotal / 10, 100),                  color: '#f59e0b'      },
        { label: 'Application Activity',  val: Math.min(applications.length * 10, 100),          color: '#0ea5e9'      },
        { label: 'Backlogs (inverse)',     val: Math.max(100 - (parseInt(student.backlogs) * 25), 0), color: '#10b981' },
    ];

    return (
        <div className="dashboard-layout">
            <style>{`
                @keyframes pt-in { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                .pt-card { animation: pt-in 0.35s ease both; }
                .pt-card:nth-child(1){animation-delay:.05s} .pt-card:nth-child(2){animation-delay:.1s}
                .pt-card:nth-child(3){animation-delay:.15s} .pt-card:nth-child(4){animation-delay:.2s}
                .pt-tr:hover td { background: var(--soft-mint) !important; }
            `}</style>
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">

                {/* Top bar */}
                <div className="dashboard-topbar">
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <FiTrendingUp style={{ color:'var(--green)' }} />
                        <span style={{ fontSize:14, fontWeight:700, color:'var(--black)' }}>Performance Tracking</span>
                        <span style={{ fontSize:12, color:'var(--gray-500)' }}>— Real-time overview</span>
                    </div>
                    <span style={{ fontSize:12, color:'var(--gray-500)' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'short', year:'numeric' })}
                    </span>
                </div>

                {/* Hero banner */}
                <div style={{
                    background:'linear-gradient(135deg,#0a0a0a 0%,#1a2a1a 50%,#0a3a1a 100%)',
                    borderRadius:16, padding:'22px 28px', marginBottom:20,
                    display:'flex', alignItems:'center', gap:28, flexWrap:'wrap',
                    position:'relative', overflow:'hidden',
                }}>
                    <div style={{ position:'absolute', top:'-30%', right:'8%', width:200, height:200, background:'rgba(0,166,63,0.08)', borderRadius:'50%', pointerEvents:'none' }} />
                    <div style={{ position:'absolute', bottom:'-40%', right:'30%', width:150, height:150, background:'rgba(99,102,241,0.06)', borderRadius:'50%', pointerEvents:'none' }} />

                    {/* Score ring */}
                    <div style={{ textAlign:'center', flexShrink:0, position:'relative', zIndex:1 }}>
                        <div style={{ width:88, height:88, borderRadius:'50%', background:'linear-gradient(135deg,#00A63F,#0E5F3A)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxShadow:'0 0 28px rgba(0,166,63,0.45)', margin:'0 auto 8px' }}>
                            <span style={{ fontSize:24, fontWeight:900, color:'#fff', fontFamily:'var(--font-display)', lineHeight:1 }}>{overallScore}</span>
                            <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>/ 100</span>
                        </div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1 }}>Overall Score</div>
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:180, position:'relative', zIndex:1 }}>
                        <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'#fff', marginBottom:4 }}>{student.full_name}</h2>
                        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginBottom:12 }}>
                            {student.branch} • {yearLabel} • {student.roll_number}
                        </p>
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                            <span className="badge badge-success">CGPA: {student.percentage}</span>
                            {rank && <span className="badge badge-primary">Rank #{rank}</span>}
                            <span className={`badge ${parseFloat(student.percentage) >= 60 && parseInt(student.backlogs) === 0 ? 'badge-success' : 'badge-warning'}`}>
                                {parseFloat(student.percentage) >= 60 && parseInt(student.backlogs) === 0 ? '✓ Placement Ready' : '⚠ Review Profile'}
                            </span>
                        </div>
                    </div>

                    {/* Mini stats */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, position:'relative', zIndex:1 }}>
                        {[
                            { label:'Quiz Avg',  value:`${quizAvg}%`,                    icon:'📝' },
                            { label:'Coding',    value: codingTotal,                      icon:'💻' },
                            { label:'Applied',   value:`${applications.length}`,          icon:'📋' },
                            { label:'Selected',  value:`${selected} offer${selected!==1?'s':''}`, icon:'🏆' },
                        ].map((s, i) => (
                            <div key={i} style={{ background:'rgba(255,255,255,0.07)', borderRadius:10, padding:'10px 14px', textAlign:'center', minWidth:80 }}>
                                <div style={{ fontSize:18, marginBottom:3 }}>{s.icon}</div>
                                <div style={{ fontWeight:800, fontSize:14, color:'#fff' }}>{s.value}</div>
                                <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stat cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }}>
                    {statCards.map((s, i) => (
                        <div key={i} className="pt-card" style={{ background:s.grad, borderRadius:13, padding:'18px 18px 14px', boxShadow:`0 5px 20px ${s.glow}`, position:'relative', overflow:'hidden' }}>
                            <div style={{ position:'absolute', top:'-20%', right:'-10%', width:80, height:80, background:'rgba(255,255,255,0.07)', borderRadius:'50%', pointerEvents:'none' }} />
                            <div style={{ width:38, height:38, borderRadius:9, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', marginBottom:10 }}>
                                {s.icon}
                            </div>
                            <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'#fff', lineHeight:1, marginBottom:3 }}>{s.value}</div>
                            <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:600, marginBottom:2 }}>{s.label}</div>
                            <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Breakdown bars */}
                <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'18px 20px', marginBottom:18, boxShadow:'var(--shadow-sm)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                        <span style={{ width:28, height:28, borderRadius:8, background:'var(--soft-mint)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--green)' }}>
                            <FiTarget size={14} />
                        </span>
                        <span style={{ fontSize:14, fontWeight:700, color:'var(--black)' }}>Academic & Placement Breakdown</span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 32px' }}>
                        {bars.map((b, i) => (
                            <div key={i}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                                    <span style={{ fontSize:12, color:'var(--gray-700)', fontWeight:500 }}>{b.label}</span>
                                    <span style={{ fontSize:12, fontWeight:700, color: b.val >= 80 ? 'var(--green)' : b.val >= 60 ? 'var(--warning)' : '#ef4444' }}>{b.val.toFixed(0)}%</span>
                                </div>
                                <div style={{ background:'var(--gray-200)', borderRadius:99, height:6, overflow:'hidden' }}>
                                    <div style={{ height:'100%', borderRadius:99, background:b.color, width:`${b.val}%`, transition:'width 0.8s ease' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom tables */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

                    {/* Application History */}
                    <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 18px', borderBottom:'1px solid var(--gray-200)' }}>
                            <span style={{ width:26, height:26, borderRadius:7, background:'var(--soft-mint)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--green)' }}><FiBriefcase size={13} /></span>
                            <span style={{ fontSize:13, fontWeight:700, color:'var(--black)' }}>Application History</span>
                        </div>
                        {applications.length === 0 ? (
                            <div style={{ textAlign:'center', padding:'28px 16px', color:'var(--gray-500)', fontSize:13 }}>No applications yet.</div>
                        ) : (
                            <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                <thead>
                                    <tr style={{ background:'var(--gray-100)' }}>
                                        {['Company','Role','Date','Status'].map(h => (
                                            <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((a) => {
                                        const cfg = STATUS_CFG[a.application_status] || { label: a.application_status, cls: 'badge-muted' };
                                        return (
                                            <tr key={a.application_id} className="pt-tr">
                                                <td style={{ padding:'11px 14px', fontWeight:700, color:'var(--black)', fontSize:13 }}>{a.company_name}</td>
                                                <td style={{ padding:'11px 14px', fontSize:12, color:'var(--gray-700)' }}>{a.job_role}</td>
                                                <td style={{ padding:'11px 14px', fontSize:11, color:'var(--gray-500)' }}>
                                                    {new Date(a.applied_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                                                </td>
                                                <td style={{ padding:'11px 14px' }}><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Quiz + Coding */}
                    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

                        {/* Quiz History */}
                        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 18px', borderBottom:'1px solid var(--gray-200)' }}>
                                <span style={{ width:26, height:26, borderRadius:7, background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366f1' }}><FiBookOpen size={13} /></span>
                                <span style={{ fontSize:13, fontWeight:700, color:'var(--black)' }}>Quiz History</span>
                            </div>
                            {extraLoading ? (
                                <div style={{ padding:'20px', textAlign:'center', color:'var(--gray-500)', fontSize:12 }}>Loading...</div>
                            ) : quizHistory.length === 0 ? (
                                <div style={{ textAlign:'center', padding:'20px', color:'var(--gray-500)', fontSize:12 }}>No quizzes taken yet.</div>
                            ) : (
                                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                    <thead>
                                        <tr style={{ background:'var(--gray-100)' }}>
                                            {['Quiz','Score','Result'].map(h => (
                                                <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizHistory.map((q) => (
                                            <tr key={q.quiz_id} className="pt-tr">
                                                <td style={{ padding:'10px 14px' }}>
                                                    <div style={{ fontWeight:600, color:'var(--black)', fontSize:12 }}>{q.quiz_name}</div>
                                                    <div style={{ fontSize:10, color:'var(--gray-500)' }}>
                                                        {new Date(q.attempt_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })}
                                                    </div>
                                                </td>
                                                <td style={{ padding:'10px 14px', fontWeight:700, fontSize:13, color: q.passed ? 'var(--green)' : '#ef4444' }}>{q.score}/{q.total_marks}</td>
                                                <td style={{ padding:'10px 14px' }}>
                                                    <span className={`badge ${q.passed ? 'badge-success' : 'badge-danger'}`}>{q.passed ? 'Pass' : 'Fail'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Coding History */}
                        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 18px', borderBottom:'1px solid var(--gray-200)' }}>
                                <span style={{ width:26, height:26, borderRadius:7, background:'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center', color:'#d97706' }}><FiCode size={13} /></span>
                                <span style={{ fontSize:13, fontWeight:700, color:'var(--black)' }}>Coding History</span>
                            </div>
                            {extraLoading ? (
                                <div style={{ padding:'20px', textAlign:'center', color:'var(--gray-500)', fontSize:12 }}>Loading...</div>
                            ) : codingHistory.length === 0 ? (
                                <div style={{ textAlign:'center', padding:'20px', color:'var(--gray-500)', fontSize:12 }}>No submissions yet.</div>
                            ) : (
                                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                    <thead>
                                        <tr style={{ background:'var(--gray-100)' }}>
                                            {['Problem','Score','Lang'].map(h => (
                                                <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-700)', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {codingHistory.map((c) => (
                                            <tr key={c.coding_id} className="pt-tr">
                                                <td style={{ padding:'10px 14px' }}>
                                                    <div style={{ fontWeight:600, color:'var(--black)', fontSize:12 }}>{c.problem_title || c.contest_name}</div>
                                                    <div style={{ fontSize:10, color:'var(--gray-500)' }}>
                                                        {new Date(c.submission_time).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })}
                                                    </div>
                                                </td>
                                                <td style={{ padding:'10px 14px', fontWeight:700, fontSize:13, color:'var(--green)' }}>{c.score}/{c.max_score}</td>
                                                <td style={{ padding:'10px 14px' }}>
                                                    <span className="badge badge-muted" style={{ fontSize:10 }}>{c.language}</span>
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
