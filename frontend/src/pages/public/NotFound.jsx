import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: '8rem', marginBottom: '1rem', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 400, marginBottom: '2rem', lineHeight: 1.7 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">🏠 Go Home</Link>
        <Link to="/login" className="btn btn-secondary">🔑 Login</Link>
      </div>
    </div>
  );
}
