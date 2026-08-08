import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import { adminService } from '../../services/adminService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_COLORS = {
  Pending: '#f59e0b', Assigned: '#0891b2',
  'In Progress': '#7c3aed', Resolved: '#16a34a', Closed: '#6b7280',
};

const statCards = [
  { key: 'totalStudents', label: 'Total Students', icon: '👥', color: '#2563eb', bg: '#eff6ff' },
  { key: 'totalComplaints', label: 'Total Complaints', icon: '📋', color: '#7c3aed', bg: '#ede9fe' },
  { key: 'todayComplaints', label: "Today's Complaints", icon: '📅', color: '#0891b2', bg: '#cffafe' },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout title="Admin Dashboard"><Spinner /></AppLayout>;

  const { statusStats = {}, monthlyStats = [], categoryStats = [], priorityStats = [] } = data || {};

  const monthlyChartData = monthlyStats.map((m) => ({
    name: MONTHS[(m._id.month || 1) - 1],
    Complaints: m.count,
  }));

  const pieData = Object.entries(statusStats).map(([name, value]) => ({ name, value }));
  const COLORS = Object.values(STATUS_COLORS);

  const statusCards = [
    { key: 'Pending', label: 'Pending', icon: '⏳', color: '#f59e0b', bg: '#fef3c7' },
    { key: 'Assigned', label: 'Assigned', icon: '👤', color: '#0891b2', bg: '#cffafe' },
    { key: 'In Progress', label: 'In Progress', icon: '🔄', color: '#7c3aed', bg: '#ede9fe' },
    { key: 'Resolved', label: 'Resolved', icon: '✅', color: '#16a34a', bg: '#dcfce7' },
    { key: 'Closed', label: 'Closed', icon: '🔒', color: '#6b7280', bg: '#f3f4f6' },
  ];

  return (
    <AppLayout title="Admin Dashboard">
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e40af)',
        borderRadius: 'var(--radius-lg)', padding: '2rem',
        color: 'white', marginBottom: '2rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.25rem' }}>Admin Portal</div>
          <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️ Dashboard Overview</h1>
          <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Manage all hostel complaints and student accounts</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/admin/complaints" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>📋 View Complaints</Link>
            <Link to="/admin/students" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>👥 Manage Students</Link>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {statCards.map(({ key, label, icon, color, bg }) => (
          <div key={key} className="stat-card" style={{ '--stat-color': color, '--stat-bg': bg }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-value">{data?.[key] || 0}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Status Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '2rem' }}>
        {statusCards.map(({ key, label, icon, color, bg }) => (
          <div key={key} className="stat-card" style={{ '--stat-color': color, '--stat-bg': bg }}>
            <div className="stat-icon" style={{ fontSize: '1.1rem' }}>{icon}</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{statusStats[key] || 0}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Monthly Bar Chart */}
        <div className="chart-wrapper">
          <div className="chart-title">📈 Monthly Complaints (Last 6 Months)</div>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Complaints" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet</div>}
        </div>

        {/* Status Pie */}
        <div className="chart-wrapper">
          <div className="chart-title">📊 Status Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📂 Complaints by Category</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {categoryStats.slice(0, 8).map((cat) => {
            const pct = data?.totalComplaints ? Math.round((cat.count / data.totalComplaints) * 100) : 0;
            return (
              <div key={cat._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.3rem' }}>
                  <span>{cat._id}</span>
                  <span style={{ fontWeight: 600 }}>{cat.count} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 999 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 999, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
