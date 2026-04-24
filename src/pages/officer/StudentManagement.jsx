import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiDownload, FiUser, FiFilter } from 'react-icons/fi';
import { getAllStudents } from '../../services/api';

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterBranch, setFilterBranch] = useState('all');
    const [showAdd, setShowAdd] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewId, setViewId] = useState(null);
    const [form, setForm] = useState({ full_name: '', roll_number: '', branch: 'Computer Science', year: '4', percentage: '', backlogs: '0', email: '', mobile_number: '' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getAllStudents();
            setStudents(response.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = (e) => {
        e.preventDefault();
        if (editId) {
            setStudents(prev => prev.map(s => s.id === editId ? { ...s, ...form, cgpa: parseFloat(form.cgpa), backlogs: parseInt(form.backlogs) } : s));
            setEditId(null);
        } else {
            setStudents(prev => [...prev, { ...form, id: Date.now(), cgpa: parseFloat(form.cgpa), backlogs: parseInt(form.backlogs), placed: false, status: 'not_applied' }]);
        }
        setForm({ name: '', roll: '', branch: 'CS', year: '4th', cgpa: '', backlogs: '0', email: '', mobile: '' });
        setShowAdd(false);
    };

    const handleEdit = (s) => { setForm({ name: s.name, roll: s.roll, branch: s.branch, year: s.year, cgpa: String(s.cgpa), backlogs: String(s.backlogs), email: s.email, mobile: s.mobile }); setEditId(s.id); setShowAdd(true); };
    const handleDelete = (id) => setStudents(prev => prev.filter(s => s.id !== id));

    const filtered = students.filter(s => {
        const m = s.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                s.roll_number?.toLowerCase().includes(search.toLowerCase()) || 
                s.email?.toLowerCase().includes(search.toLowerCase());
        const b = filterBranch === 'all' || s.branch === filterBranch;
        return m && b;
    });

    const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil'];
    const placedCount = students.filter(s => s.placed).length;

    const viewStudent = students.find(s => s.student_id === viewId);

    return (
        <div className="dashboard-layout">
            <Sidebar role="officer" user={{ name: 'Dr. M.Rajaiah', id: 'ID: PO-001' }} />
            <main className="dashboard-main">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Student Management</h1>
                        <p className="page-subtitle">Manage all registered students and their academic details</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-success"><FiDownload /> Export</button>
                        <button className="btn btn-primary" onClick={() => { setShowAdd(true); setEditId(null); }}><FiPlus /> Add Student</button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Total Students', value: students.length, icon: '👥' },
                        { label: 'Placed', value: students.filter(s => s.placed).length, icon: '🏆' },
                        { label: 'High CGPA (≥8)', value: students.filter(s => s.percentage >= 8).length, icon: '⭐' },
                        { label: 'No Backlogs', value: students.filter(s => s.backlogs === 0).length, icon: '✅' },
                    ].map((s, i) => (
                        <div key={i} className="stat-card">
                            <div style={{ fontSize: 36 }}>{s.icon}</div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="form-input" placeholder="Search by name, roll, or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                    </div>
                    <select className="form-select" style={{ width: 160 }} value={filterBranch} onChange={e => setFilterBranch(e.target.value)}>
                        <option value="all">All Branches</option>
                        {branches.map(b => <option key={b}>{b}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="table-container">
                    <div className="table-header-bar">
                        <span className="table-title">All Students ({filtered.length})</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span className="badge badge-success">Placed: {placedCount}</span>
                            <span className="badge badge-muted">Not Placed: {students.length - placedCount}</span>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Student</th><th>Branch/Year</th><th>CGPA</th><th>Backlogs</th><th>Placed</th><th>Performance</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.student_id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 13 }}>{s.full_name?.[0] || 'S'}</div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{s.full_name || 'Student Name'}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.roll_number || 'Roll No'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: 600 }}>{s.branch || 'N/A'}</span> • {s.year || 'N/A'} Yr</td>
                                    <td><span style={{ fontWeight: 800, fontSize: 15, color: s.percentage >= 8 ? 'var(--secondary)' : s.percentage >= 7 ? 'var(--accent2)' : 'var(--accent)' }}>{s.percentage || 'N/A'}</span></td>
                                    <td><span className={`badge ${s.backlogs === 0 ? 'badge-success' : s.backlogs <= 1 ? 'badge-warning' : 'badge-danger'}`}>{s.backlogs || 0}</span></td>
                                    <td>{s.placed ? <span className="badge badge-success">Placed 🎉</span> : <span className="badge badge-muted">Not Yet</span>}</td>
                                    <td>
                                        <div className="progress-bar-container" style={{ width: 80 }}>
                                            <div className={`progress-bar-fill ${s.percentage >= 8 ? 'success' : s.percentage >= 7 ? 'warning' : 'danger'}`} style={{ width: `${(s.percentage / 10) * 100}%` }} />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setViewId(s.student_id)}><FiEye /></button>
                                            <button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}><FiEdit2 /></button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.student_id)}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add/Edit Modal */}
                {showAdd && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
                        <div className="modal">
                            <div className="modal-header">
                                <h3 className="modal-title">{editId ? 'Edit Student' : 'Add New Student'}</h3>
                                <button className="btn btn-outline btn-sm btn-icon" onClick={() => setShowAdd(false)}>✕</button>
                            </div>
                            <form onSubmit={handleAdd}>
                                <div className="grid-2" style={{ columnGap: 16 }}>
                                    <div className="form-group"><label className="form-label">Full Name</label><input name="name" className="form-input" value={form.name} onChange={handleChange} required /></div>
                                    <div className="form-group"><label className="form-label">Roll Number</label><input name="roll" className="form-input" value={form.roll} onChange={handleChange} required /></div>
                                    <div className="form-group"><label className="form-label">Email</label><input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required /></div>
                                    <div className="form-group"><label className="form-label">Mobile</label><input name="mobile" className="form-input" value={form.mobile} onChange={handleChange} required /></div>
                                    <div className="form-group">
                                        <label className="form-label">Branch</label>
                                        <select name="branch" className="form-select" value={form.branch} onChange={handleChange}>
                                            {branches.map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Year</label>
                                        <select name="year" className="form-select" value={form.year} onChange={handleChange}>
                                            <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                                        </select>
                                    </div>
                                    <div className="form-group"><label className="form-label">CGPA</label><input name="cgpa" type="number" step="0.1" min="0" max="10" className="form-input" value={form.cgpa} onChange={handleChange} required /></div>
                                    <div className="form-group"><label className="form-label">Backlogs</label><input name="backlogs" type="number" min="0" className="form-input" value={form.backlogs} onChange={handleChange} required /></div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editId ? 'Update Student' : 'Add Student'}</button>
                                    <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Student Modal */}
                {viewId && viewStudent && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewId(null)}>
                        <div className="modal">
                            <div className="modal-header">
                                <h3 className="modal-title">Student Profile</h3>
                                <button className="btn btn-outline btn-sm btn-icon" onClick={() => setViewId(null)}>✕</button>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div className="avatar-placeholder" style={{ width: 64, height: 64, fontSize: 26, margin: '0 auto 12px' }}>{viewStudent.full_name?.[0] || 'S'}</div>
                                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 }}>{viewStudent.full_name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{viewStudent.roll_number} · {viewStudent.branch} · {viewStudent.year} Year</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { label: 'Email', value: viewStudent.email },
                                    { label: 'Mobile', value: viewStudent.mobile_number },
                                    { label: 'CGPA', value: viewStudent.percentage },
                                    { label: 'Backlogs', value: viewStudent.backlogs },
                                    { label: 'Placement Status', value: viewStudent.is_placed ? '✅ Placed' : '⏳ Not Placed Yet' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                                        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.label}</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={() => { handleEdit(viewStudent); setViewId(null); }}>
                                <FiEdit2 /> Edit Student
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
