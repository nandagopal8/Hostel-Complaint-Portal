import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { timeAgo } from '../utils/helpers';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationService.getAll();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch { /* silent */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  };

  const handleClick = async (n) => {
    if (!n.isRead) {
      await notificationService.markAsRead(n._id);
      setNotifications((prev) => prev.map((x) => x._id === n._id ? { ...x, isRead: true } : x));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (n.complaintId) navigate(`/student/complaints/${n.complaintId}`);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button className="notif-btn" onClick={() => setOpen(!open)} aria-label="Notifications">
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 360, background: 'var(--card)',
          borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)', zIndex: 300,
          maxHeight: 420, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
              >Mark all read</button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                🔔 No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={() => handleClick(n)}>
                  {!n.isRead && <span className="notif-dot" />}
                  <div style={{ flex: 1 }}>
                    <div className="notif-text">{n.message}</div>
                    <div className="notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button
              onClick={() => { navigate('/student/notifications'); setOpen(false); }}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >View all notifications →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
