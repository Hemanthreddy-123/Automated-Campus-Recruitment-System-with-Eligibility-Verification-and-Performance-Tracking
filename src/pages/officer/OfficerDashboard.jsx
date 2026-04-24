import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import {
    FiUsers, FiBriefcase, FiFileText, FiCheckCircle,
    FiArrowRight, FiTrendingUp, FiPlus, FiBarChart2, FiClock
} from 'react-icons/fi';
import { getAnalytics, getApplications, getDrives, getUser } from '../../services/api';

const STATUS_CFG = {
    Pending:     { label: 'Pending',     cls: 'badge-primary' },
    Shortlisted: { label: 'Shortlisted', cls: 'badge-warning' },
    Selected:    { label: 'Selected 🎉', cls: 'badge-success' },
    Rejected:    { label: 'Rejected',    cls: 'badge-danger'  },
};

export default function OfficerDashboard() {
    const [summary, setSummary] = useState(null);
    const [drives, setDrives]   = useState([]);
    const [apps, setApps]       = useState([]);
    const [loading, setLoading] = useState(true);
    const officer = getUser();

    useEffect(() => {
        (async () => {
            try {
                const [aRes, dRes, apRes] = await Promise.all([
                    getAnalytics(), getDrives(), getApplications(),
                ]);
                setSummary(aRes.data.summary);
                setDrives(dRes.data || []);
                setApps(apRes.data || []);
            } catch (e) {
                console.error('Dashboard load failed:', e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const sidebarUser = {
        name: officer?.full_name || 'Officer',
        id: `ID: ${officer?.employee_id || ''}`,
        sessionInfo: 'Placement Officer',
    };

    const firstName = officer?.full_name?.split(' ').slice(-1)[0] || 'Officer';
    const placementRate = summary?.total_students > 0
        ? ((summary.students_placed / summary.total_students) * 100).toFixed(1)
        : '0.0';

    const statCards = [
        { icon: <FiUsers size={20} />,       label: 'Total Students',  value: summary?.total_students ?? '—',     sub: '4th Year batch',                          grad: 'linear-gradient(135deg,#6366f1,#4f46e5)', glow: 'rgba(99,102,241,0.28)'  },
        { icon: <FiBriefcase size={20} />,   label: 'Active Drives',   value: summary?.active_drives ?? '—',      sub: 'Live now',                                grad: 'linear-gradient(135deg,#a855f7,#7e22ce)', glow: 'rgba(168,85,247,0.28)'  },
        { icon: <FiFileText size={20} />,    label: 'Applications',    value: summary?.total_applications ?? '—', sub: `${summary?.pending_applications ?? 0} pending`, grad: 'linear-gradient(135deg,#0891b2,#0e7490)', glow: 'rgba(8,145,178,0.28)'   },
        { icon: <FiCheckCircle size={20} />, label: 'Students Placed', value: summary?.students_placed ?? '—',    sub: `${placementRate}% rate`,                  grad: 'linear-gradient(135deg,#059669,#047857)', glow: 'rgba(5,150,105,0.28)'   },
    ];

    if (loading) return (
        <div className="dashboard-layout">
            <Sidebar role="officer" user={sidebarUser} />
            <main className="dashboard-main" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ textAlign:'center' }}>
                    <div style={{ width:44, height:44, border:'4px solid #e5e7eb', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
                    <p style={{ color:'#6b7280', fontSize:13 }}>Loading dashboard...</p>
                </div>
            </main>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <style>{`
                @keyframes od-in { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                @keyframes pulse2 { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.5)} 70%{box-shadow:0 0 0 7px rgba(99,102,241,0)} }
                .od-card { animation: od-in 0.35s ease both; }
                .od-card:nth-child(1){animation-delay:.05s} .od-card:nth-child(2){animation-delay:.1s}
                .od-card:nth-child(3){animation-delay:.15s} .od-card:nth-child(4){animation-delay:.2s}
                .od-tr:hover td { background:#f5f3ff !important; }
                .od-drive-row:hover { background:#faf5ff; }
            `}</style>
            <Sidebar role="officer" user={sidebarUser} />
            <main className="dashboard-main">

                {/* Topbar */}
                <div className="dashboard-topbar">
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:13, color:'#9ca3af' }}>
                            {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'short', year:'numeric' })}
                        </span>
                        <span style={{ width:4, height:4, borderRadius:'50%', background:'#d1d5db', display:'inline-block' }} />
                        <span style={{ fontSize:13, fontWeight:600, color:'#6366f1', display:'flex', alignItems:'center', gap:5 }}>
                            <span style={{ width:7, height:7, borderRadius:'50%', background:'#6366f1', display:'inline-block', animation:'pulse2 2s infinite' }} />
                            Placement Season Active
                        </span>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                        <Link to="/officer/create-drive" className="btn btn-primary btn-sm"><FiPlus size={13} /> Create Drive</Link>
                        <Link to="/officer/reports" className="btn btn-outline btn-sm"><FiBarChart2 size={13} /> Reports</Link>
                    </div>
                </div>

                {/* Welcome banner */}
                <div style={{
                    background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 45%,#4c1d95 100%)',
                    borderRadius:16, padding:'22px 28px', marginBottom:20,
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    position:'relative', overflow:'hidden',
                }}>
                    {/* Blobs */}
                    <div style={{ position:'absolute', top:'-30%', right:'5%', width:200, height:200, background:'radial-gradient(circle,rgba(139,92,246,0.35) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />
                    <div style={{ position:'absolute', bottom:'-40%', right:'25%', width:150, height:150, background:'radial-gradient(circle,rgba(99,102,241,0.25) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(35px)', pointerEvents:'none' }} />
                    {/* Dot grid */}
                    <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />

                    <div style={{ position:'relative', zIndex:1 }}>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:50, padding:'4px 12px', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.8)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:10 }}>
                            <span style={{ width:5, height:5, borderRadius:'50%', background:'#a5b4fc', display:'inline-block' }} />
                            Placement Officer Portal
                        </div>
                        <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'#fff', marginBottom:4, letterSpacing:'-0.3px' }}>
                            👋 Welcome back, {firstName}!
                        </h1>
                        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13 }}>
                            {officer?.full_name} · {officer?.department || 'Training & Placement'}
                        </p>
                    </div>
                    <div style={{ display:'flex', gap:10, position:'relative', zIndex:1, flexShrink:0 }}>
                        <Link to="/officer/students" className="btn btn-sm" style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', fontFamily:'var(--font-sans)' }}>
                            <FiUsers size={13} /> Students
                        </Link>
                        <Link to="/officer/applications" className="btn btn-sm" style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'#fff', border:'none', fontFamily:'var(--font-sans)', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
                            <FiFileText size={13} /> Applications
                        </Link>
                    </div>
                </div>

                {/* Stat cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }}>
                    {statCards.map((s, i) => (
                        <div key={i} className="od-card" style={{ background:s.grad, borderRadius:13, padding:'18px 18px 14px', boxShadow:`0 5px 20px ${s.glow}`, position:'relative', overflow:'hidden' }}>
                            <div style={{ position:'absolute', top:'-20%', right:'-10%', width:80, height:80, background:'rgba(255,255,255,0.08)', borderRadius:'50%', pointerEvents:'none' }} />
                            <div style={{ width:38, height:38, borderRadius:9, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', marginBottom:10 }}>
                                {s.icon}
                            </div>
                            <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'#fff', lineHeight:1, marginBottom:3 }}>{s.value}</div>
                            <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:600, marginBottom:2 }}>{s.label}</div>
                            <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
                    <Link to="/officer/create-drive" className="btn btn-primary btn-sm"><FiPlus size={13} /> Create Job Drive</Link>
                    <Link to="/officer/applications" className="btn btn-dark btn-sm"><FiFileText size={13} /> View Applications</Link>
                    <Link to="/officer/students" className="btn btn-ghost btn-sm"><FiUsers size={13} /> Manage Students</Link>
                    <Link to="/officer/reports" className="btn btn-outline btn-sm"><FiBarChart2 size={13} /> Reports & Analytics</Link>
                </div>

                {/* Main grid */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, marginBottom:16 }}>

                    {/* Active Drives */}
                    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid #f3f4f6' }}>
                            <span style={{ fontSize:13, fontWeight:700, color:'#111827', display:'flex', alignItems:'center', gap:8 }}>
                                <span style={{ width:26, height:26, borderRadius:7, background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366f1' }}><FiBriefcase size={13} /></span>
                                Active Drives
                            </span>
                            <Link to="/officer/create-drive" className="btn btn-primary btn-sm"><FiPlus size={12} /> New</Link>
                        </div>
                        {drives.length === 0 ? (
                            <div style={{ padding:'28px', textAlign:'center', color:'#9ca3af', fontSize:13 }}>No active drives. Create one!</div>
                        ) : drives.slice(0, 5).map((d, i) => (
                            <div key={d.drive_id} className="od-drive-row" style={{ padding:'11px 18px', borderBottom: i < Math.min(drives.length,5)-1 ? '1px solid #f9fafb' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'background .15s', cursor:'default' }}>
                                <div>
                                    <div style={{ fontWeight:700, color:'#111827', fontSize:13 }}>{d.company_name}</div>
                                    <div style={{ fontSize:11, color:'#9ca3af', marginTop:2, display:'flex', alignItems:'center', gap:5 }}>
                                        {d.job_role}
                                        <span style={{ opacity:0.4 }}>•</span>
                                        <FiClock size={10} />
                                        {new Date(d.last_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                                    </div>
                                </div>
                                <div style={{ textAlign:'right', flexShrink:0 }}>
                                    <div style={{ fontSize:13, fontWeight:800, color:'#6366f1' }}>{d.package_lpa} LPA</div>
                                    <div style={{ fontSize:11, color:'#9ca3af' }}>{d.available_seats ?? '—'} seats</div>
                                </div>
                            </div>
                        ))}
                        <div style={{ padding:'10px 18px', borderTop:'1px solid #f3f4f6' }}>
                            <Link to="/officer/applications" className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center' }}>
                                View All Applications <FiArrowRight size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* Placement Status */}
                    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                            <span style={{ width:26, height:26, borderRadius:7, background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366f1' }}><FiTrendingUp size={13} /></span>
                            <span style={{ fontSize:13, fontWeight:700, color:'#111827' }}>Placement Status</span>
                        </div>
                        {[
                            { label:'Placed',         value: summary?.students_placed ?? 0,       total: summary?.total_students ?? 1,      color:'#059669' },
                            { label:'Shortlisted',    value: summary?.students_shortlisted ?? 0,   total: summary?.total_students ?? 1,      color:'#a855f7' },
                            { label:'Applied',        value: summary?.total_applications ?? 0,     total: summary?.total_students ?? 1,      color:'#6366f1' },
                            { label:'Pending Review', value: summary?.pending_applications ?? 0,   total: summary?.total_applications || 1,  color:'#0891b2' },
                        ].map((s, i) => (
                            <div key={i} style={{ marginBottom:12 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                                    <span style={{ fontSize:12, color:'#6b7280', fontWeight:500 }}>{s.label}</span>
                                    <span style={{ fontSize:12, fontWeight:700, color:s.color }}>{s.value}</span>
                                </div>
                                <div style={{ background:'#f3f4f6', borderRadius:99, height:6, overflow:'hidden' }}>
                                    <div style={{ height:'100%', borderRadius:99, background:s.color, width:`${Math.min((s.value/s.total)*100,100)}%`, transition:'width 0.8s ease' }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0 0', borderTop:'1px solid #f3f4f6', marginTop:4 }}>
                            <span style={{ fontSize:12, color:'#9ca3af' }}>Placement Rate</span>
                            <span style={{ fontSize:20, fontWeight:800, color:'#6366f1', fontFamily:'var(--font-display)' }}>{placementRate}%</span>
                        </div>
                        <Link to="/officer/reports" className="btn btn-outline btn-sm" style={{ marginTop:12, width:'100%', justifyContent:'center' }}>
                            Full Analytics <FiArrowRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Recent Applications */}
                <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid #f3f4f6' }}>
                        <span style={{ fontSize:13, fontWeight:700, color:'#111827', display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ width:26, height:26, borderRadius:7, background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366f1' }}><FiFileText size={13} /></span>
                            Recent Applications
                        </span>
                        <Link to="/officer/applications" className="btn btn-outline btn-sm">View All <FiArrowRight size={12} /></Link>
                    </div>
                    {apps.length === 0 ? (
                        <div style={{ padding:'28px', textAlign:'center', color:'#9ca3af', fontSize:13 }}>No applications yet.</div>
                    ) : (
                        <table style={{ width:'100%', borderCollapse:'collapse' }}>
                            <thead>
                                <tr style={{ background:'#f9fafb' }}>
                                    {['Student','Roll No.','Company','CGPA','Status','Action'].map(h => (
                                        <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {apps.slice(0, 8).map((a, i) => (
                                    <tr key={a.application_id} className="od-tr" style={{ borderBottom: i < Math.min(apps.length,8)-1 ? '1px solid #f9fafb' : 'none', transition:'background .15s' }}>
                                        <td style={{ padding:'11px 16px' }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>
                                                    {a.full_name?.[0] || 'S'}
                                                </div>
                                                <span style={{ fontWeight:600, color:'#111827', fontSize:13 }}>{a.full_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding:'11px 16px', fontFamily:'monospace', fontSize:12, color:'#6b7280' }}>{a.roll_number}</td>
                                        <td style={{ padding:'11px 16px', fontSize:13, color:'#374151' }}>{a.company_name}</td>
                                        <td style={{ padding:'11px 16px', fontWeight:700, color:'#6366f1', fontSize:13 }}>{a.percentage}</td>
                                        <td style={{ padding:'11px 16px' }}>
                                            <span className={`badge ${STATUS_CFG[a.application_status]?.cls || 'badge-muted'}`}>
                                                {STATUS_CFG[a.application_status]?.label || a.application_status}
                                            </span>
                                        </td>
                                        <td style={{ padding:'11px 16px' }}>
                                            <Link to="/officer/applications" className="btn btn-outline btn-xs">View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}
