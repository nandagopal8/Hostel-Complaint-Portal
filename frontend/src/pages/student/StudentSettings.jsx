import AppLayout from '../../layouts/AppLayout';
import { useAuth } from '../../context/AuthContext';

export default function StudentSettings() {
  const { user } = useAuth();

  return (
    <AppLayout title="Settings">
      <div style={{ maxWidth: 600 }}>
        <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>⚙️ Settings</h1>
        <p className="page-subtitle" style={{ marginBottom: '2rem' }}>Manage your account preferences</p>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Role', value: 'Student' },
              { label: 'Hostel Block', value: user?.hostelBlock ? `Block ${user.hostelBlock}` : 'Not set' },
              { label: 'Room Number', value: user?.roomNumber || 'Not set' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', marginTop: '1.5rem' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>⚠ Danger Zone</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            These actions are irreversible. Please be careful.
          </p>
          <button className="btn btn-danger btn-sm" disabled style={{ opacity: 0.5 }}>Delete Account (Contact Admin)</button>
        </div>
      </div>
    </AppLayout>
  );
}
