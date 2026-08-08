import AppLayout from '../../layouts/AppLayout';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <AppLayout title="Settings">
      <div style={{ maxWidth: 600 }}>
        <h1 className="page-title" style={{ marginBottom: '2rem' }}>⚙️ Admin Settings</h1>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>System Configuration</h3>
          {[
            { label: 'Complaint Categories', value: '10 categories' },
            { label: 'Max File Upload Size', value: '5 MB' },
            { label: 'JWT Expiry', value: '7 days' },
            { label: 'API Version', value: 'v1.0.0' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
              <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{value}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Admin Account</h3>
          <div style={{ padding: '0.875rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div><strong>Email:</strong> {user?.email}</div>
            <div style={{ marginTop: '0.5rem' }}>Admin credentials are managed through environment variables. Edit <code>.env</code> to change them.</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
