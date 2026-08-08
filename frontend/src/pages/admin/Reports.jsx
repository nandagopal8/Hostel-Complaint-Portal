import { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import { adminService } from '../../services/adminService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STATUS_COLORS = ['#f59e0b','#0891b2','#7c3aed','#16a34a','#6b7280'];
const PRIORITY_COLORS = { Low: '#16a34a', Medium: '#f59e0b', High: '#dc2626' };

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout title="Reports"><Spinner /></AppLayout>;

  const { statusStats = {}, monthlyStats = [], categoryStats = [], priorityStats = [], totalComplaints = 0 } = data || {};

  const monthlyData = monthlyStats.map((m) => ({ name: MONTHS[(m._id.month || 1) - 1], Complaints: m.count }));
  const pieData = Object.entries(statusStats).map(([name, value]) => ({ name, value }));
  const priorityData = priorityStats.map((p) => ({ name: p._id, value: p.count, color: PRIORITY_COLORS[p._id] }));

  return (
    <AppLayout title="Reports">
      <div>
        <div className="page-header">
          <h1 className="page-title">📈 Reports & Analytics</h1>
          <p className="page-subtitle">Overview of complaint statistics and trends</p>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {Object.entries(statusStats).map(([status, count]) => {
            const pct = totalComplaints ? Math.round((count / totalComplaints) * 100) : 0;
            return (
              <div key={status} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>{count}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>{status}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pct}% of total</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="chart-wrapper">
            <div className="chart-title">📅 Monthly Complaint Trend</div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Complaints" fill="var(--primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <div className="chart-title">⚡ Priority Distribution</div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {priorityData.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">📂 Complaints by Category</h3></div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats.map((c) => ({ name: c._id, count: c.count }))} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
