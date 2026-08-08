import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      {/* Nav */}
      <nav className="landing-nav" style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" className="landing-nav-logo" style={{ color: 'var(--text)' }}>
          <span style={{ fontSize: '1.5rem' }}>🏫</span> Hostel Portal
        </Link>
        <div className="landing-nav-links">
          <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Home</Link>
          <Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Contact</Link>
          <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        padding: '5rem 5%', color: 'white', textAlign: 'center',
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>About the Portal</h1>
        <p style={{ opacity: 0.8, maxWidth: 600, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
          A transparent, efficient complaint management system designed to improve hostel living for every student.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            We believe every student deserves a comfortable and well-maintained hostel environment. 
            Our portal bridges the gap between students and hostel administration by providing a 
            streamlined, transparent, and efficient complaint resolution system.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '⚡', title: 'Fast Resolution', desc: 'Complaints are prioritized and resolved within 24-48 hours.' },
            { icon: '🔒', title: 'Secure Platform', desc: 'Your data is protected with industry-standard encryption.' },
            { icon: '📊', title: 'Full Transparency', desc: 'Track every update from submission to resolution.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
