import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials, getImageUrl } from '../utils/helpers';

const studentNav = [
  { label: 'Dashboard', icon: '🏠', path: '/student/dashboard' },
  { label: 'My Complaints', icon: '📋', path: '/student/complaints' },
  { label: 'New Complaint', icon: '➕', path: '/student/complaints/new' },
  { label: 'Notifications', icon: '🔔', path: '/student/notifications' },
  { label: 'Profile', icon: '👤', path: '/student/profile' },
  { label: 'Settings', icon: '⚙️', path: '/student/settings' },
];

const adminNav = [
  { label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
  { label: 'Complaints', icon: '📋', path: '/admin/complaints' },
  { label: 'Students', icon: '👥', path: '/admin/students' },
  { label: 'Reports', icon: '📈', path: '/admin/reports' },
  { label: 'Profile', icon: '👤', path: '/admin/profile' },
  { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === 'admin' ? adminNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏫</div>
        <div>
          <div className="sidebar-logo-text">Hostel Portal</div>
          <div className="sidebar-logo-sub">Complaint Management</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">
          {user?.role === 'admin' ? 'Admin Menu' : 'Student Menu'}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '0 0 0.5rem' }}>
        <button
          className="sidebar-nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#f87171' }}
          onClick={handleLogout}
        >
          <span className="sidebar-nav-icon">🚪</span>
          Logout
        </button>
      </div>

      {/* User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.profileImage ? (
              <img src={getImageUrl(user.profileImage)} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(user?.name)
            )}
          </div>
          <div>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
