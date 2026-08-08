import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { StatusBadge, PriorityBadge } from '../../components/Badges';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getCategoryIcon } from '../../utils/helpers';

const statConfig = [
  { key: 'total', label: 'Total', icon: '📋', color: '#2563eb', bg: '#eff6ff' },
  { key: 'Pending', label: 'Pending', icon: '⏳', color: '#f59e0b', bg: '#fef3c7' },
  { key: 'Assigned', label: 'Assigned', icon: '👤', color: '#0891b2', bg: '#cffafe' },
  { key: 'In Progress', label: 'In Progress', icon: '🔄', color: '#7c3aed', bg: '#ede9fe' },
  { key: 'Resolved', label: 'Resolved', icon: '✅', color: '#16a34a', bg: '#dcfce7' },
  { key: 'Closed', label: 'Closed', icon: '🔒', color: '#6b7280', bg: '#f3f4f6' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getStats()
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout title="Dashboard"><Spinner /></AppLayout>;

  const stats = data?.stats || {};
  const recent = data?.recentComplaints || [];

  return (
    <AppLayout title="Student Dashboard">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.25rem' }}>Welcome back,</div>
          <h1 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            {user?.name} 👋
          </h1>
          <p style={{ opacity: 0.75, fontSize: '0.9rem' }}>
            Block {user?.hostelBlock || '—'} · Room {user?.roomNumber || '—'}
          </p>
          <Link to="/student/complaints/new" className="btn" style={{
            background: 'white', color: 'var(--primary)', marginTop: '1.25rem',
            display: 'inline-flex', fontWeight: 700,
          }}>
            ➕ File New Complaint
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statConfig.map(({ key, label, icon, color, bg }) => (
          <div key={key} className="stat-card" style={{ '--stat-color': color, '--stat-bg': bg }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-value">{stats[key] || 0}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📋 Recent Complaints</h3>
          <Link to="/student/complaints" className="btn btn-secondary btn-sm">View All</Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No complaints yet"
            description="You haven't filed any complaints. Click the button above to get started."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recent.map((c) => (
              <Link key={c._id} to={`/student/complaints/${c._id}`} style={{ textDecoration: 'none' }}>
                <div className="complaint-card">
                  <div className="complaint-card-header">
                    <div>
                      <div className="complaint-card-id">{c.complaintId}</div>
                      <div className="complaint-card-title">{c.title}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="complaint-card-meta">
                    <span className="complaint-card-meta-item">{getCategoryIcon(c.category)} {c.category}</span>
                    <span className="complaint-card-meta-item">🏠 Block {c.hostelBlock} · Room {c.roomNumber}</span>
                    <span className="complaint-card-meta-item">📅 {formatDate(c.createdAt)}</span>
                    <PriorityBadge priority={c.priority} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
