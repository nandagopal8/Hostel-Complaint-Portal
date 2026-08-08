import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
import Sidebar from '../components/Sidebar';

const AppLayout = ({ children, title }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <Sidebar onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none', background: 'none', border: 'none',
                fontSize: '1.3rem', cursor: 'pointer', color: 'var(--text)',
              }}
              className="menu-btn"
              aria-label="Toggle menu"
            >☰</button>
            <span className="topbar-title">{title}</span>
          </div>

          <div className="topbar-actions">
            {user?.role === 'student' && <NotificationBell />}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              background: 'var(--primary-50)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)',
            }}>
              {user?.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-wrapper fade-in">
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .menu-btn { display: flex !important; }
          .sidebar-overlay { display: block !important; }
        }
        ${sidebarOpen ? '.sidebar { transform: translateX(0) !important; }' : ''}
      `}</style>
    </div>
  );
};

export default AppLayout;
