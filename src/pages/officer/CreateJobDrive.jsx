import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { FiSave, FiSend, FiPlus, FiCalendar, FiBriefcase, FiDollarSign, FiMapPin, FiUsers, FiInfo } from 'react-icons/fi';

const branchOptions = ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
const yearOptions = ['3rd Year', '4th Year'];

export default function CreateJobDrive() {
    const navigate = useNavigate();
    const [savedDraft, setSavedDraft] = useState(false);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [form, setForm] = useState({
        company: '', role: '', minPercentage: '', maxBacklogs: '0', package: '', location: '', driveDate: '', deadline: '', description: '', seats: '', rounds: '',
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const toggleBranch = (b) => setSelectedBranches(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
    const toggleYear = (y) => setSelectedYears(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]);
    const selectAllBranches = () => setSelectedBranches(selectedBranches.length === branchOptions.length ? [] : [...branchOptions]);

    const handlePost = (e) => {
        e.preventDefault();
        navigate('/officer/applications');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar role="officer" user={{ name: 'Dr. S. Krishnan', id: 'ID: PO-001' }} />
            <main className="dashboard-main">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Create Job Drive</h1>
                        <p className="page-subtitle">Fill in the details to post a new placement drive</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-secondary" onClick={() => setSavedDraft(true)}><FiSave /> {savedDraft ? 'Draft Saved ✓' : 'Save Draft'}</button>
                        <button form="drive-form" type="submit" className="btn btn-primary"><FiSend /> Post Drive</button>
                    </div>
                </div>

                {/* Info Banner */}
                <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 12 }}>
                    <FiInfo style={{ color: 'var(--secondary)', fontSize: 18, flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        Once posted, the system will <strong style={{ color: 'var(--text-primary)' }}>automatically verify eligibility</strong> for all registered students based on the criteria set below. Eligible students will see an "Apply" button on their dashboard.
                    </p>
                </div>

                <form id="drive-form" onSubmit={handlePost}>
                    <div className="grid-2" style={{ gap: 24 }}>
                        {/* Left Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Company Info */}
                            <div className="card">
                                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiBriefcase style={{ color: 'var(--primary-light)' }} /> Company Information
                                </h3>
                                <div className="form-group">
                                    <label className="form-label">Company Name *</label>
                                    <input name="company" className="form-input" placeholder="e.g. Google, Microsoft, TCS" value={form.company} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Role / Position *</label>
                                    <input name="role" className="form-input" placeholder="e.g. Software Engineer, Intern, Analyst" value={form.role} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Description</label>
                                    <textarea name="description" className="form-input" placeholder="Brief description of the role and responsibilities..." value={form.description} onChange={handleChange} rows={4} style={{ resize: 'vertical' }} />
                                </div>
                                <div className="grid-2" style={{ columnGap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Salary Package *</label>
                                        <div style={{ position: 'relative' }}>
                                            <FiDollarSign style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input name="package" className="form-input" placeholder="e.g. 12 LPA" value={form.package} onChange={handleChange} style={{ paddingLeft: 40 }} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Location *</label>
                                        <div style={{ position: 'relative' }}>
                                            <FiMapPin style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input name="location" className="form-input" placeholder="e.g. Bangalore" value={form.location} onChange={handleChange} style={{ paddingLeft: 40 }} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid-2" style={{ columnGap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Available Seats</label>
                                        <div style={{ position: 'relative' }}>
                                            <FiUsers style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input name="seats" type="number" className="form-input" placeholder="e.g. 10" value={form.seats} onChange={handleChange} style={{ paddingLeft: 40 }} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Number of Rounds</label>
                                        <select name="rounds" className="form-select" value={form.rounds} onChange={handleChange}>
                                            <option value="">Select</option>
                                            {[1, 2, 3, 4, 5].map(n => <option key={n}>{n} Round{n > 1 ? 's' : ''}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="card">
                                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiCalendar style={{ color: 'var(--primary-light)' }} /> Important Dates
                                </h3>
                                <div className="grid-2" style={{ columnGap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Application Deadline *</label>
                                        <input name="deadline" type="date" className="form-input" value={form.deadline} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Drive Date *</label>
                                        <input name="driveDate" type="date" className="form-input" value={form.driveDate} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Eligibility */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="card">
                                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiInfo style={{ color: 'var(--accent2)' }} /> Eligibility Criteria
                                </h3>
                                <div className="form-group">
                                    <label className="form-label">Minimum CGPA / Percentage *</label>
                                    <input name="minPercentage" type="number" step="0.1" min="0" max="100" className="form-input" placeholder="e.g. 65 (percentage)" value={form.minPercentage} onChange={handleChange} required />
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Students below this percentage will be automatically marked ineligible</span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Maximum Backlogs Allowed *</label>
                                    <select name="maxBacklogs" className="form-select" value={form.maxBacklogs} onChange={handleChange}>
                                        <option value="0">0 — No Backlogs</option>
                                        <option value="1">1 Backlog</option>
                                        <option value="2">2 Backlogs</option>
                                        <option value="3">3 Backlogs</option>
                                        <option value="99">Any — All Allowed</option>
                                    </select>
                                </div>

                                {/* Year Selection */}
                                <div className="form-group">
                                    <label className="form-label">Eligible Year(s) *</label>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {yearOptions.map(y => (
                                            <button key={y} type="button" onClick={() => toggleYear(y)} style={{
                                                padding: '8px 16px', borderRadius: 8, border: `2px solid ${selectedYears.includes(y) ? 'var(--primary)' : 'var(--border)'}`,
                                                background: selectedYears.includes(y) ? 'rgba(108,99,255,0.2)' : 'var(--bg-card2)',
                                                color: selectedYears.includes(y) ? 'var(--primary-light)' : 'var(--text-secondary)',
                                                cursor: 'pointer', fontSize: 13, fontWeight: selectedYears.includes(y) ? 700 : 400, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                                            }}>
                                                {selectedYears.includes(y) ? '✓ ' : ''}{y}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Branch Selection */}
                                <div className="form-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <label className="form-label" style={{ marginBottom: 0 }}>Eligible Branches *</label>
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={selectAllBranches}>
                                            {selectedBranches.length === branchOptions.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {branchOptions.map(b => (
                                            <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px 14px', borderRadius: 8, border: `1px solid ${selectedBranches.includes(b) ? 'var(--primary)' : 'var(--border)'}`, background: selectedBranches.includes(b) ? 'rgba(108,99,255,0.1)' : 'var(--bg-card2)', transition: 'all 0.2s' }}>
                                                <input type="checkbox" checked={selectedBranches.includes(b)} onChange={() => toggleBranch(b)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                                                <span style={{ fontSize: 14, color: selectedBranches.includes(b) ? 'var(--primary-light)' : 'var(--text-secondary)', fontWeight: selectedBranches.includes(b) ? 600 : 400 }}>{b}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {(form.company || selectedBranches.length > 0) && (
                                <div className="card" style={{ border: '1px solid rgba(108,99,255,0.3)', background: 'rgba(108,99,255,0.05)' }}>
                                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--primary-light)' }}>📋 Drive Preview</h3>
                                    <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {form.company && <div><span style={{ color: 'var(--text-muted)' }}>Company:</span> <strong style={{ color: 'var(--text-primary)' }}>{form.company}</strong></div>}
                                        {form.role && <div><span style={{ color: 'var(--text-muted)' }}>Role:</span> <strong style={{ color: 'var(--text-primary)' }}>{form.role}</strong></div>}
                                        {form.package && <div><span style={{ color: 'var(--text-muted)' }}>Package:</span> <strong style={{ color: 'var(--secondary)' }}>{form.package}</strong></div>}
                                        {form.minPercentage && <div><span style={{ color: 'var(--text-muted)' }}>Min CGPA:</span> <strong style={{ color: 'var(--text-primary)' }}>{form.minPercentage}%</strong></div>}
                                        {selectedBranches.length > 0 && <div><span style={{ color: 'var(--text-muted)' }}>Branches:</span> <strong style={{ color: 'var(--text-primary)' }}>{selectedBranches.join(', ')}</strong></div>}
                                        {form.deadline && <div><span style={{ color: 'var(--text-muted)' }}>Deadline:</span> <strong style={{ color: 'var(--accent2)' }}>{form.deadline}</strong></div>}
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                                <FiSend /> Post Drive Now
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
