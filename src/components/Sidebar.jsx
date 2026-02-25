import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import {
    FiGrid, FiUser, FiBriefcase, FiCode, FiBookOpen,
    FiTrendingUp, FiUsers, FiPlus, FiFileText, FiBarChart2,
    FiLogOut, FiChevronRight
} from 'react-icons/fi';

const studentNav = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/student/profile', label: 'My Profile', icon: <FiUser /> },
    { to: '/student/drives', label: 'Job Drives', icon: <FiBriefcase />, badge: '3' },
    { to: '/student/coding', label: 'Coding Contest', icon: <FiCode /> },
    { to: '/student/quiz', label: 'Quiz Module', icon: <FiBookOpen /> },
    { to: '/student/performance', label: 'Performance', icon: <FiTrendingUp /> },
];

const officerNav = [
    { to: '/officer/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/officer/create-drive', label: 'Create Drive', icon: <FiPlus /> },
    { to: '/officer/applications', label: 'Applications', icon: <FiFileText />, badge: '47' },
    { to: '/officer/students', label: 'Students', icon: <FiUsers /> },
    { to: '/officer/reports', label: 'Reports', icon: <FiBarChart2 /> },
];

export default function Sidebar({ role, user }) {
    const location = useLocation();
    const navItems = role === 'student' ? studentNav : officerNav;
    const displayName = user?.name || 'User';
    const displayId = user?.roll || user?.id || '';
    const sessionInfo = user?.sessionInfo || (role === 'officer' ? 'Placement Officer' : displayId.replace('Roll: ', '') || '');
    const isOfficer = role === 'officer';

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <aside className="sidebar">
            {/* Logo Header */}
            <div className="sidebar-header">
                <div className="sidebar-logo">C</div>
                <div>
                    <div className="sidebar-title">CampusHire</div>
                    <div className="sidebar-subtitle">{isOfficer ? 'Officer Portal' : 'Student Portal'}</div>
                </div>
            </div>

            {/* Profile */}
            <div className="sidebar-profile">
                <div className="avatar-placeholder" style={{ width: 38, height: 38, fontSize: 15 }}>
                    {displayName[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>{displayId}</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Main Menu</div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link key={item.to} to={item.to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="link-icon">{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.badge && !isActive && (
                                <span className="link-badge">{item.badge}</span>
                            )}
                            {isActive && <FiChevronRight style={{ fontSize: 14, opacity: 0.7 }} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div style={{ background: 'rgba(0,166,63,0.12)', border: '1px solid rgba(0,166,63,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Session Active</div>
                    <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, background: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
                        {sessionInfo}
                    </div>
                </div>
                <a href="/" onClick={handleLogout} className="sidebar-link" style={{ color: '#ef4444' }}>
                    <span className="link-icon"><FiLogOut /></span>
                    <span>Logout</span>
                </a>
            </div>
        </aside>
    );
}
