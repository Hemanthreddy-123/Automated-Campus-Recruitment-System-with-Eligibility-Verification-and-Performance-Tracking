import Sidebar from '../../components/Sidebar';
import { FiDownload, FiTrendingUp, FiBarChart2, FiUsers, FiBriefcase, FiPieChart } from 'react-icons/fi';

const branchStats = [
    { branch: 'Computer Science', total: 78, placed: 62, percentage: 79.5, color: 'var(--primary)' },
    { branch: 'Information Technology', total: 64, placed: 48, percentage: 75.0, color: 'var(--secondary)' },
    { branch: 'Electronics & Communication', total: 72, placed: 18, percentage: 25.0, color: 'var(--accent2)' },
    { branch: 'Electrical Engineering', total: 48, placed: 9, percentage: 18.8, color: 'var(--accent)' },
    { branch: 'Mechanical Engineering', total: 50, placed: 4, percentage: 8.0, color: '#a855f7' },
];

const driveWise = [
    { company: 'Google', applications: 48, eligible: 31, shortlisted: 12, selected: 4, package: '45 LPA' },
    { company: 'Microsoft', applications: 62, eligible: 45, shortlisted: 18, selected: 6, package: '32 LPA' },
    { company: 'Amazon', applications: 37, eligible: 28, shortlisted: 10, selected: 5, package: '28 LPA' },
    { company: 'TCS', applications: 124, eligible: 98, shortlisted: 45, selected: 35, package: '7 LPA' },
    { company: 'Infosys', applications: 98, eligible: 72, shortlisted: 32, selected: 28, package: '6.5 LPA' },
    { company: 'Wipro', applications: 87, eligible: 65, shortlisted: 28, selected: 21, package: '5.5 LPA' },
];

const monthlyPlacements = [
    { month: 'Oct', count: 8 },
    { month: 'Nov', count: 14 },
    { month: 'Dec', count: 22 },
    { month: 'Jan', count: 31 },
    { month: 'Feb', count: 43 },
    { month: 'Mar', count: 25 },
];

const maxCount = Math.max(...monthlyPlacements.map(m => m.count));

export default function ReportsAnalytics() {
    const totalPlaced = branchStats.reduce((a, b) => a + b.placed, 0);
    const totalStudents = branchStats.reduce((a, b) => a + b.total, 0);
    const overallRate = ((totalPlaced / totalStudents) * 100).toFixed(1);
    const totalApps = driveWise.reduce((a, b) => a + b.applications, 0);
    const totalSelected = driveWise.reduce((a, b) => a + b.selected, 0);

    return (
        <div className="dashboard-layout">
            <Sidebar role="officer" user={{ name: 'Dr. M.Rajaiah', id: 'ID: PO-001' }} />
            <main className="dashboard-main">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Reports & Analytics</h1>
                        <p className="page-subtitle">Comprehensive placement statistics and performance insights for 2024-25</p>
                    </div>
                    <button className="btn btn-success"><FiDownload /> Export Report</button>
                </div>

                {/* Key Metrics */}
                <div className="stats-grid" style={{ marginBottom: 28 }}>
                    {[
                        { icon: <FiUsers />, label: 'Total Students', value: totalStudents, color: 'purple', sub: '4th Year Batch 2025' },
                        { icon: <FiBarChart2 />, label: 'Students Placed', value: totalPlaced, color: 'teal', sub: `${overallRate}% placement rate` },
                        { icon: <FiBriefcase />, label: 'Total Applications', value: totalApps, color: 'yellow', sub: '6 companies visited' },
                        { icon: <FiTrendingUp />, label: 'Offers Given', value: totalSelected, color: 'pink', sub: 'Across all companies' },
                    ].map((s, i) => (
                        <div key={i} className="stat-card">
                            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                            <div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Placement Rate Visual */}
                <div className="card" style={{ marginBottom: 24, padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FiPieChart style={{ color: 'var(--primary-light)' }} /> Overall Placement Rate
                        </h3>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            {overallRate}%
                        </span>
                    </div>
                    <div className="progress-bar-container" style={{ height: 16, marginBottom: 16 }}>
                        <div className="progress-bar-fill success" style={{ width: `${overallRate}%` }} />
                    </div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Placed', count: totalPlaced, color: 'var(--secondary)' },
                            { label: 'Not Placed', count: totalStudents - totalPlaced, color: 'var(--accent)' },
                            { label: 'Target', count: '90%', color: 'var(--accent2)' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', align: 'center', gap: 10 }}>
                                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: item.color, marginTop: 3 }} />
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 16 }}>{item.count}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Bar Chart + Branch Stats */}
                <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
                    {/* Monthly Placements Bar Chart */}
                    <div className="card">
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiTrendingUp style={{ color: 'var(--primary-light)' }} /> Monthly Placements
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, padding: '0 8px' }}>
                            {monthlyPlacements.map((m, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-light)' }}>{m.count}</div>
                                    <div style={{
                                        width: '100%', borderRadius: '6px 6px 0 0', transition: 'all 0.5s ease',
                                        height: `${(m.count / maxCount) * 140}px`,
                                        background: i === 4 ? 'var(--gradient-primary)' : 'rgba(108,99,255,0.3)',
                                    }} />
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.month}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Branch-wise */}
                    <div className="card">
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiBarChart2 style={{ color: 'var(--primary-light)' }} /> Branch-Wise Placement
                        </h3>
                        {branchStats.map((b, i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{b.branch}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{b.placed}/{b.total} ({b.percentage}%)</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div style={{ height: '100%', borderRadius: 10, background: b.color, width: `${b.percentage}%`, transition: 'width 1s ease' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drive-Wise Analytics Table */}
                <div className="table-container">
                    <div className="table-header-bar">
                        <span className="table-title">Drive-Wise Analytics</span>
                        <button className="btn btn-success btn-sm"><FiDownload /> Export</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Package</th>
                                <th>Applications</th>
                                <th>Eligible</th>
                                <th>Shortlisted</th>
                                <th>Selected</th>
                                <th>Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driveWise.map((d, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.company}</td>
                                    <td><span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{d.package}</span></td>
                                    <td>{d.applications}</td>
                                    <td><span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{d.eligible}</span></td>
                                    <td><span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{d.shortlisted}</span></td>
                                    <td><span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{d.selected}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="progress-bar-container" style={{ width: 60 }}>
                                                <div className="progress-bar-fill success" style={{ width: `${(d.selected / d.applications) * 100}%` }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)' }}>{((d.selected / d.applications) * 100).toFixed(0)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Insights Cards */}
                <div className="grid-3" style={{ gap: 16, marginTop: 24 }}>
                    {[
                        { icon: '🏆', title: 'Best Performer', desc: 'Priya Patel (CS) — CGPA 9.4, Selected by Google', color: 'var(--secondary)' },
                        { icon: '📈', title: 'Top Drive', desc: 'TCS placed the most students (35 offers)', color: 'var(--primary-light)' },
                        { icon: '🎯', title: 'Target Status', desc: `${overallRate}% placement rate. Target: 90%. Need ${(90 - parseFloat(overallRate)).toFixed(1)}% more.`, color: 'var(--accent2)' },
                    ].map((insight, i) => (
                        <div key={i} className="card" style={{ textAlign: 'center', padding: 28 }}>
                            <div style={{ fontSize: 40, marginBottom: 14 }}>{insight.icon}</div>
                            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: 8, color: insight.color }}>{insight.title}</h4>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{insight.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
