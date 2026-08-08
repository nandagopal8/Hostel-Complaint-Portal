import { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { notificationService } from '../../services/notificationService';
import { timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await notificationService.getAll();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch { toast.error('Failed to update notifications'); }
  };

  const handleMark = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* silent */ }
  };

  const notifIcon = (type) => {
    const map = { assigned: '👤', resolved: '✅', closed: '🔒', status_change: '🔄', general: '📢' };
    return map[type] || '🔔';
  };

  return (
    <AppLayout title="Notifications">
      <div style={{ maxWidth: 700 }}>
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">🔔 Notifications</h1>
            {unreadCount > 0 && <p className="page-subtitle">{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={handleMarkAll} id="mark-all-read-btn">
              ✓ Mark All Read
            </button>
          )}
        </div>

        {loading ? <Spinner /> : notifications.length === 0 ? (
          <EmptyState icon="🔕" title="No notifications" description="You'll receive notifications when your complaint status changes." />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                onClick={() => !n.isRead && handleMark(n._id)}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: n.isRead ? 'var(--bg-secondary)' : 'var(--primary-50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>
                  {notifIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="notif-text" style={{ fontWeight: n.isRead ? 400 : 600 }}>
                    {n.message}
                  </div>
                  <div className="notif-time">{timeAgo(n.createdAt)}</div>
                </div>
                {!n.isRead && <span className="notif-dot" style={{ flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
