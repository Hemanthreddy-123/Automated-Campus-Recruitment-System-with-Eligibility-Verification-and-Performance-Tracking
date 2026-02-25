import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FiSearch, FiDownload, FiFilter, FiEye, FiCheckCircle, FiXCircle, FiChevronDown } from 'react-icons/fi';

const allApplications = [
    { id: 1, name: 'Priya Patel', roll: '21CS012', branch: 'CS', year: '4th', cgpa: 9.1, backlogs: 0, company: 'Google', role: 'SWE', status: 'shortlisted', date: 'Feb 15', eligible: true },
    { id: 2, name: 'Arjun Mehta', roll: '21CS047', branch: 'CS', year: '4th', cgpa: 8.4, backlogs: 0, company: 'Microsoft', role: 'SDE Intern', status: 'applied', date: 'Feb 16', eligible: true },
    { id: 3, name: 'Sneha Reddy', roll: '21IT023', branch: 'IT', year: '4th', cgpa: 8.8, backlogs: 0, company: 'Amazon', role: 'SDE-I', status: 'selected', date: 'Feb 12', eligible: true },
    { id: 4, name: 'Rahul Sharma', roll: '21CS031', branch: 'CS', year: '4th', cgpa: 7.2, backlogs: 1, company: 'TCS', role: 'Developer', status: 'applied', date: 'Feb 18', eligible: true },
    { id: 5, name: 'Kavya Singh', roll: '21IT045', branch: 'IT', year: '4th', cgpa: 8.6, backlogs: 0, company: 'Google', role: 'SWE', status: 'applied', date: 'Feb 19', eligible: true },
    { id: 6, name: 'Dev Patel', roll: '21ECE012', branch: 'ECE', year: '4th', cgpa: 6.9, backlogs: 2, company: 'Infosys', role: 'Systems Eng.', status: 'applied', date: 'Feb 20', eligible: false },
    { id: 7, name: 'Riya Sharma', roll: '21CS088', branch: 'CS', year: '4th', cgpa: 9.4, backlogs: 0, company: 'Google', role: 'SWE', status: 'shortlisted', date: 'Feb 15', eligible: true },
    { id: 8, name: 'Amit Kumar', roll: '21ME033', branch: 'ME', year: '4th', cgpa: 6.5, backlogs: 0, company: 'Wipro', role: 'Engineer', status: 'rejected', date: 'Feb 11', eligible: true },
];

const statusConfig = {
    shortlisted: { label: 'Shortlisted', cls: 'badge-warning', icon: '⭐' },
    applied: { label: 'Under Review', cls: 'badge-primary', icon: '📋' },
    selected: { label: 'Selected', cls: 'badge-success', icon: '🏆' },
    rejected: { label: 'Rejected', cls: 'badge-danger', icon: '✗' },
};

export default function ApplicationsManagement() {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDrive, setFilterDrive] = useState('all');
    const [applications, setApplications] = useState(allApplications);

    const filtered = applications.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.roll.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || a.status === filterStatus;
        const matchDrive = filterDrive === 'all' || a.company === filterDrive;
        return matchSearch && matchStatus && matchDrive;
    });

    const updateStatus = (id, newStatus) => setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));

    const drives = [...new Set(allApplications.map(a => a.company))];
    const counts = { all: applications.length, shortlisted: applications.filter(a => a.status === 'shortlisted').length, selected: applications.filter(a => a.status === 'selected').length, applied: applications.filter(a => a.status === 'applied').length };

    return (
        <div className="dashboard-layout">
            <Sidebar role="officer" user={{ name: 'Dr. S. Krishnan', id: 'ID: PO-001' }} />
            <main className="dashboard-main">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Applications Management</h1>
                        <p className="page-subtitle">Review, shortlist, and manage student applications</p>
                    </div>
                    <button className="btn btn-success"><FiDownload /> Download Excel</button>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                        { key: 'all', label: `All Applications (${counts.all})` },
                        { key: 'applied', label: `Under Review (${counts.applied})` },
                        { key: 'shortlisted', label: `Shortlisted (${counts.shortlisted})` },
                        { key: 'selected', label: `Selected (${counts.selected})` },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setFilterStatus(tab.key)} className={`btn btn-sm ${filterStatus === tab.key ? 'btn-primary' : 'btn-secondary'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
                        <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="form-input" placeholder="Search by name, roll, or company..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                    </div>
                    <select className="form-select" style={{ width: 180 }} value={filterDrive} onChange={e => setFilterDrive(e.target.value)}>
                        <option value="all">All Drives</option>
                        {drives.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <button className="btn btn-secondary"><FiFilter /> More Filters</button>
                </div>

                {/* Table */}
                <div className="table-container">
                    <div className="table-header-bar">
                        <span className="table-title">Applicants ({filtered.length})</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span className="badge badge-success"><FiCheckCircle /> Eligible: {filtered.filter(a => a.eligible).length}</span>
                            <span className="badge badge-danger"><FiXCircle /> Issues: {filtered.filter(a => !a.eligible).length}</span>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Roll / Branch</th>
                                <th>CGPA</th>
                                <th>Backlogs</th>
                                <th>Company</th>
                                <th>Eligibility</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 13 }}>{a.name[0]}</div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{a.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{a.roll}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.branch} • {a.year} Yr</div>
                                    </td>
                                    <td><span style={{ fontWeight: 800, color: a.cgpa >= 8 ? 'var(--secondary)' : a.cgpa >= 7 ? 'var(--accent2)' : 'var(--accent)', fontSize: 15 }}>{a.cgpa}</span></td>
                                    <td><span className={`badge ${a.backlogs === 0 ? 'badge-success' : a.backlogs <= 1 ? 'badge-warning' : 'badge-danger'}`}>{a.backlogs}</span></td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.company}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.role}</div>
                                    </td>
                                    <td>
                                        {a.eligible
                                            ? <span className="badge badge-success"><FiCheckCircle /> Eligible</span>
                                            : <span className="badge badge-danger"><FiXCircle /> Invalid</span>}
                                    </td>
                                    <td><span className={`badge ${statusConfig[a.status].cls}`}>{statusConfig[a.status].icon} {statusConfig[a.status].label}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            <button className="btn btn-secondary btn-sm"><FiEye /></button>
                                            {a.status === 'applied' && (
                                                <>
                                                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(a.id, 'shortlisted')}>Shortlist</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a.id, 'rejected')}>Reject</button>
                                                </>
                                            )}
                                            {a.status === 'shortlisted' && (
                                                <button className="btn btn-primary btn-sm" onClick={() => updateStatus(a.id, 'selected')}>Select ✓</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                            <p>No applications found matching your filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
