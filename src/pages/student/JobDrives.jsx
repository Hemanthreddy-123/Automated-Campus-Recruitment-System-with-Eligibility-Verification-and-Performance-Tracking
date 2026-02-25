import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import useStudentData from '../../hooks/useStudentData';
import { applyForDrive } from '../../services/api';
import {
    FiSearch, FiMapPin, FiBriefcase, FiCalendar, FiDollarSign,
    FiClock, FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiRefreshCw
} from 'react-icons/fi';

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };

export default function JobDrives() {
    const { student, applications, drives, loading, error } = useStudentData();

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [applying, setApplying] = useState(null);   // drive_id being applied
    const [applyMsg, setApplyMsg] = useState('');
    const [applyErr, setApplyErr] = useState('');
    const [localApplied, setLocalApplied] = useState(new Set()); // track newly applied

    // All drive_ids already applied (from DB + local state)
    const appliedIds = new Set([
        ...applications.map(a => a.drive_id),
        ...localApplied,
    ]);

    // Apply to a drive → saves to applications table in DB
    const handleApply = async (driveId) => {
        setApplying(driveId);
        setApplyMsg(''); setApplyErr('');
        try {
            await applyForDrive(driveId);
            setLocalApplied(prev => new Set([...prev, driveId]));
            setApplyMsg(`Application submitted! 🎉`);
            setTimeout(() => setApplyMsg(''), 3000);
        } catch (err) {
            setApplyErr(err.message || 'Failed to apply');
            setTimeout(() => setApplyErr(''), 4000);
        } finally {
            setApplying(null);
        }
    };

    const filtered = drives.filter(d =>
        d.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.job_role?.toLowerCase().includes(search.toLowerCase()) ||
        d.location?.toLowerCase().includes(search.toLowerCase())
    );

    const sidebarUser = student
        ? { name: student.full_name, roll: `Roll: ${student.roll_number}`, sessionInfo: `${YEAR_LABELS[student.year] || ''} · ${student.branch?.split(' ')[0]}` }
        : { name: '...', roll: '' };

    // ── Loading ──────────────────────────────────────────────
    if (loading) return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '4px solid var(--gray-200)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Loading drives from database...</p>
                </div>
            </main>
        </div>
    );

    if (error) return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#ef4444' }}>
                    <FiAlertCircle size={40} /><p style={{ marginTop: 12 }}>{error}</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>Retry</button>
                </div>
            </main>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <Sidebar role="student" user={sidebarUser} />
            <main className="dashboard-main">

                <div className="page-header">
                    <h1 className="page-title">Job Drives</h1>
                    <p className="page-subtitle">All active placement drives — eligibility auto-checked against your real profile.</p>
                </div>

                {/* Toast messages */}
                {applyMsg && (
                    <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCheckCircle style={{ color: 'var(--green)' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>{applyMsg}</span>
                    </div>
                )}
                {applyErr && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiAlertCircle style={{ color: '#ef4444' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>{applyErr}</span>
                    </div>
                )}

                {/* My Profile Eligibility Banner — real DB data */}
                {student && (
                    <div style={{ background: 'var(--soft-mint)', border: '1px solid var(--mint-mid)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FiInfo style={{ color: 'var(--green)', fontSize: 20, flexShrink: 0 }} />
                        <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                            Your profile: &nbsp;
                            <strong style={{ color: 'var(--green-dark)' }}>CGPA {student.percentage}%</strong> ·&nbsp;
                            <strong style={{ color: 'var(--green-dark)' }}>{student.branch}</strong> ·&nbsp;
                            <strong style={{ color: 'var(--green-dark)' }}>{YEAR_LABELS[student.year]}</strong> ·&nbsp;
                            <strong style={{ color: parseInt(student.backlogs) > 0 ? '#ef4444' : 'var(--green-dark)' }}>
                                Backlogs: {student.backlogs}
                            </strong>
                            &nbsp;— Eligibility is automatically verified for each drive.
                        </p>
                    </div>
                )}

                {/* Search */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                        <input className="form-input" placeholder="Search by company, role, location..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                    </div>
                    <button className="btn btn-outline" onClick={() => window.location.reload()} title="Refresh from DB">
                        <FiRefreshCw /> Refresh
                    </button>
                </div>

                {/* Drive Count */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                        <strong style={{ color: 'var(--black)' }}>{drives.filter(d => d.is_eligible).length}</strong> eligible drives
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                        <strong style={{ color: 'var(--black)' }}>{appliedIds.size}</strong> applied
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                        <strong style={{ color: 'var(--black)' }}>{filtered.length}</strong> shown
                    </span>
                </div>

                {/* Drive Cards — real DB data */}
                {filtered.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🏢</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--black)', marginBottom: 8 }}>
                            {drives.length === 0 ? 'No Drives Posted Yet' : 'No Drives Match Your Search'}
                        </h3>
                        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                            {drives.length === 0
                                ? 'Officers haven\'t posted any placement drives yet. Check back soon!'
                                : 'Try a different search term.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.map(drive => {
                            const isApplied = appliedIds.has(drive.drive_id);
                            const isApplying = applying === drive.drive_id;
                            const eligible = drive.is_eligible;
                            const reason = drive.ineligibility_reason;
                            const branches = (drive.required_branch || '').split(',').map(b => b.trim()).filter(Boolean);
                            const years = (drive.required_year || '').split(',').map(y => y.trim()).filter(Boolean);
                            const deadline = new Date(drive.last_date);
                            const driveDate = new Date(drive.drive_date);
                            const isExpired = deadline < new Date();

                            return (
                                <div key={drive.drive_id} className="card" style={{ position: 'relative', border: eligible ? '1px solid var(--gray-200)' : '1px solid var(--gray-100)' }}>
                                    {/* Status badge */}
                                    <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
                                        {isApplied ? (
                                            <span className="badge badge-success"><FiCheckCircle /> Applied</span>
                                        ) : eligible ? (
                                            <span className="badge badge-success"><FiCheckCircle /> Eligible</span>
                                        ) : (
                                            <span className="badge badge-danger"><FiXCircle /> Not Eligible</span>
                                        )}
                                        {isExpired && <span className="badge badge-muted">Deadline Passed</span>}
                                    </div>

                                    <div style={{ display: 'flex', gap: 20 }}>
                                        {/* Company logo placeholder */}
                                        <div style={{ width: 64, height: 64, borderRadius: 14, background: eligible ? 'var(--soft-mint)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, border: '1px solid var(--gray-200)', fontWeight: 800, color: 'var(--gray-500)', fontFamily: 'var(--font-display)' }}>
                                            {drive.company_name?.substring(0, 2).toUpperCase()}
                                        </div>

                                        <div style={{ flex: 1, paddingRight: 120 }}>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--black)', marginBottom: 2 }}>{drive.company_name}</h3>
                                            <p style={{ color: 'var(--gray-500)', fontWeight: 600, marginBottom: 12, fontSize: 14 }}>{drive.job_role}</p>

                                            {/* Key info */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--gray-500)', marginBottom: 14 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <FiDollarSign style={{ color: 'var(--green)' }} />
                                                    <strong style={{ color: 'var(--green)' }}>{drive.package_lpa} LPA</strong>
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <FiMapPin /> {drive.location}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <FiClock /> Deadline: {deadline.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <FiCalendar /> Drive: {driveDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                {drive.available_seats && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        👥 {drive.available_seats} seats
                                                    </span>
                                                )}
                                            </div>

                                            {/* Eligibility criteria badges */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                                                <span className="badge badge-muted">Min CGPA: {drive.required_percentage}%</span>
                                                <span className="badge badge-muted">Max Backlogs: {drive.allowed_backlogs}</span>
                                                {years.map(y => <span key={y} className="badge badge-muted">{y}</span>)}
                                                {branches.slice(0, 2).map(b => <span key={b} className="badge badge-muted">{b}</span>)}
                                                {branches.length > 2 && <span className="badge badge-muted">+{branches.length - 2} more</span>}
                                            </div>

                                            {/* Not eligible reason */}
                                            {!eligible && reason && (
                                                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                                                    <p style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>⚠ Not eligible: {reason}</p>
                                                </div>
                                            )}

                                            {/* Description (expanded) */}
                                            {selected === drive.drive_id && drive.description && (
                                                <div style={{ marginBottom: 14, padding: '12px 16px', background: 'var(--cloud-gray)', borderRadius: 10 }}>
                                                    <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.7 }}>{drive.description}</p>
                                                </div>
                                            )}

                                            {/* Action buttons */}
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                {eligible && !isApplied && !isExpired && (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleApply(drive.drive_id)}
                                                        disabled={isApplying}
                                                    >
                                                        {isApplying ? 'Applying...' : 'Apply Now'}
                                                    </button>
                                                )}
                                                {isApplied && (
                                                    <span className="badge badge-success" style={{ padding: '8px 16px', fontSize: 13 }}>
                                                        Application Submitted ✓
                                                    </span>
                                                )}
                                                {!eligible && (
                                                    <button className="btn btn-outline btn-sm" disabled>Not Eligible</button>
                                                )}
                                                {isExpired && !isApplied && (
                                                    <button className="btn btn-outline btn-sm" disabled>Deadline Passed</button>
                                                )}
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setSelected(selected === drive.drive_id ? null : drive.drive_id)}
                                                >
                                                    {selected === drive.drive_id ? 'Less Info' : 'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
