import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { FiGrid, FiUsers, FiBriefcase, FiFileText, FiCheckCircle, FiArrowRight, FiTrendingUp, FiPlus, FiEye, FiBarChart2 } from 'react-icons/fi';

const recentApplications = [
    { name: 'Priya Patel', roll: '21CS012', company: 'Google', status: 'shortlisted', cgpa: '9.1' },
    { name: 'Arjun Mehta', roll: '21CS047', company: 'Microsoft', status: 'applied', cgpa: '8.4' },
    { name: 'Sneha Reddy', roll: '21IT023', company: 'Amazon', status: 'selected', cgpa: '8.8' },
    { name: 'Rahul Sharma', roll: '21CS031', company: 'TCS', status: 'rejected', cgpa: '7.2' },
    { name: 'Kavya Singh', roll: '21IT045', company: 'Google', status: 'applied', cgpa: '8.6' },
];

const statusConfig = {
    shortlisted: { label: 'Shortlisted', cls: 'badge-warning' },
    applied: { label: 'Under Review', cls: 'badge-primary' },
    selected: { label: 'Selected 🎉', cls: 'badge-success' },
    rejected: { label: 'Rejected', cls: 'badge-danger' },
};

const activeDrives = [
    { company: 'Google', role: 'SWE', deadline: 'Mar 10', applications: 48, eligible: 31 },
    { company: 'Microsoft', role: 'SDE Intern', deadline: 'Mar 15', applications: 62, eligible: 45 },
    { company: 'Amazon', role: 'SDE-I', deadline: 'Mar 20', applications: 37, eligible: 28 },
];

export default function OfficerDashboard() {
    return (
        <div className="dashboard-layout">
            <Sidebar role="officer" user={{ name: 'Dr. S. Krishnan', id: 'ID: PO-001' }} />
            <main className="dashboard-main">
                {/* Topbar */}
                <div className="dashboard-topbar">
                    <div>
                        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Wednesday, 25 Feb 2026 • </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Placement Season 2024-25</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link to="/officer/create-drive" className="btn btn-primary btn-sm"><FiPlus /> Create Drive</Link>
                        <Link to="/officer/reports" className="btn btn-outline btn-sm"><FiBarChart2 /> Reports</Link>
                    </div>
                </div>

                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">👋 Welcome, Dr. Krishnan</h1>
                    <p className="page-subtitle">Placement Officer · Department of Training & Placement</p>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {[
                        { icon: <FiUsers />, label: 'Total Students', value: '312', color: 'green', change: '78 in 4th Year', up: true },
                        { icon: <FiBriefcase />, label: 'Active Drives', value: '8', color: 'teal', change: '3 ending soon', up: false },
                        { icon: <FiCheckCircle />, label: 'Total Applications', value: '847', color: 'orange', change: '+124 this week', up: true },
                        { icon: <FiTrendingUp />, label: 'Students Placed', value: '143', color: 'black', change: '45.8% rate', up: true },
                    ].map((s, i) => (
                        <div key={i} className="stat-card">
                            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                            <div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                            <span className={`stat-change ${s.up ? 'up' : 'neutral'}`}><FiTrendingUp /> {s.change}</span>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
                    <Link to="/officer/create-drive" className="btn btn-primary"><FiPlus /> Create Job Drive</Link>
                    <Link to="/officer/applications" className="btn btn-dark"><FiEye /> View Applications</Link>
                    <Link to="/officer/students" className="btn btn-ghost"><FiUsers /> Manage Students</Link>
                    <Link to="/officer/reports" className="btn btn-outline"><FiBarChart2 /> Reports & Analytics</Link>
                </div>

                <div className="grid-2" style={{ gap: 24 }}>
                    {/* Active Drives */}
                    <div className="table-container">
                        <div className="table-header-bar">
                            <span className="table-title">Active Drives</span>
                            <Link to="/officer/create-drive" className="btn btn-primary btn-sm"><FiPlus /> New</Link>
                        </div>
                        {activeDrives.map((d, i) => (
                            <div key={i} style={{ padding: '16px 22px', borderBottom: i < activeDrives.length - 1 ? '1px solid var(--gray-100)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--black)', marginBottom: 3 }}>{d.company}</div>
                                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{d.role} · Deadline: {d.deadline}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 600 }}>{d.applications} Applied</div>
                                    <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>{d.eligible} Eligible</div>
                                </div>
                            </div>
                        ))}
                        <div style={{ padding: '12px 22px' }}>
                            <Link to="/officer/applications" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>View All Applications <FiArrowRight /></Link>
                        </div>
                    </div>

                    {/* Placement Progress */}
                    <div className="card">
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--black)', marginBottom: 20 }}>Placement Status</h3>
                        {[
                            { label: 'Placed', value: 143, total: 312, color: '' },
                            { label: 'Applied / Active', value: 89, total: 312, color: 'teal' },
                            { label: 'Not Applied Yet', value: 80, total: 312, color: 'warning' },
                        ].map((s, i) => (
                            <div key={i} style={{ marginBottom: 18 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{s.label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)' }}>{s.value} / {s.total}</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div className={`progress-bar-fill ${s.color}`} style={{ width: `${(s.value / s.total) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', borderTop: '1px solid var(--gray-100)', marginTop: 4 }}>
                            <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>Overall Placement Rate</span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>45.8%</span>
                        </div>
                        <Link to="/officer/reports" className="btn btn-outline btn-sm" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>Full Analytics <FiArrowRight /></Link>
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="table-container" style={{ marginTop: 24 }}>
                    <div className="table-header-bar">
                        <span className="table-title">Recent Applications</span>
                        <Link to="/officer/applications" className="btn btn-outline btn-sm">View All <FiArrowRight /></Link>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Student</th><th>Roll No.</th><th>Company</th><th>CGPA</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {recentApplications.map((a, i) => (
                                <tr key={i}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12 }}>{a.name[0]}</div>
                                            <span style={{ fontWeight: 600, color: 'var(--black)' }}>{a.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{a.roll}</td>
                                    <td>{a.company}</td>
                                    <td><span style={{ color: 'var(--green)', fontWeight: 700 }}>{a.cgpa}</span></td>
                                    <td><span className={`badge ${statusConfig[a.status].cls}`}>{statusConfig[a.status].label}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-outline btn-sm">View</button>
                                            {a.status === 'applied' && <button className="btn btn-primary btn-sm">Shortlist</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
