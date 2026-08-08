import AppLayout from '../../layouts/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <AppLayout title="Admin Profile">
      <div style={{ maxWidth: 600 }}>
        <h1 className="page-title" style={{ marginBottom: '2rem' }}>🛡️ Admin Profile</h1>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{user?.email}</div>
              <span className="badge badge-resolved">🛡️ System Administrator</span>
            </div>
          </div>
        </div>

        <div className="card">
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email Address', value: user?.email },
            { label: 'Role', value: 'Admin' },
            { label: 'Member Since', value: formatDate(user?.createdAt) },
            { label: 'Account Status', value: '✅ Active' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--primary-50)', borderRadius: 'var(--radius)', border: '1px solid var(--primary-100)', fontSize: '0.875rem', color: 'var(--primary)' }}>
          ℹ️ To change admin credentials, update the <strong>.env</strong> file and restart the server.
        </div>
      </div>
    </AppLayout>
  );
}
