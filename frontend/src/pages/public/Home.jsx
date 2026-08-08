import { Link } from 'react-router-dom';

const features = [
  { icon: '📝', title: 'Easy Complaint Filing', desc: 'Submit complaints with photos in under 2 minutes. No paperwork needed.' },
  { icon: '🔔', title: 'Real-time Notifications', desc: 'Get instant updates when your complaint status changes or is resolved.' },
  { icon: '📊', title: 'Track Progress', desc: 'Monitor every complaint from Pending to Resolved with a full audit trail.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with JWT authentication and encrypted storage.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Works perfectly on any device — desktop, tablet, or phone.' },
  { icon: '⚡', title: 'Fast Resolution', desc: 'Priority system ensures high-urgency issues get immediate attention.' },
];

const categories = [
  { icon: '⚡', name: 'Electrical' },
  { icon: '🔧', name: 'Plumbing' },
  { icon: '💧', name: 'Water Supply' },
  { icon: '📶', name: 'Wi-Fi / Internet' },
  { icon: '🪑', name: 'Furniture' },
  { icon: '🧹', name: 'Room Cleaning' },
  { icon: '🚿', name: 'Washroom' },
  { icon: '🍽️', name: 'Mess / Food' },
  { icon: '🔒', name: 'Security' },
  { icon: '📋', name: 'Others' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="landing-hero">
        <nav className="landing-nav">
          <div className="landing-nav-logo">
            <span style={{ fontSize: '1.5rem' }}>🏫</span>
            Hostel Portal
          </div>
          <div className="landing-nav-links">
            <Link to="/about" className="landing-nav-link">About</Link>
            <Link to="/contact" className="landing-nav-link">Contact</Link>
            <Link to="/login" style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.875rem',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
            }}>Login</Link>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>🏆</span> Trusted by 1000+ Students
            </div>
            <h1 className="hero-title">
              Your Hostel Complaints,<br />
              <span>Resolved Faster</span>
            </h1>
            <p className="hero-desc">
              A smart, transparent platform to file, track, and resolve hostel complaints.
              Say goodbye to unheard issues — every complaint matters here.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="hero-btn hero-btn-primary">
                Get Started Free →
              </Link>
              <Link to="/login" className="hero-btn hero-btn-secondary">
                Login to Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        background: 'white',
        padding: '2rem 5%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        {[
          { value: '1000+', label: 'Students Served' },
          { value: '5000+', label: 'Complaints Resolved' },
          { value: '98%', label: 'Satisfaction Rate' },
          { value: '24h', label: 'Avg Resolution Time' },
        ].map(({ value, label }) => (
          <div key={label}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="features-section">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <h2>Everything You Need</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            A complete complaint management system designed specifically for college hostels.
          </p>
        </div>
        <div className="features-grid">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h4 className="feature-title">{title}</h4>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: 'var(--bg-secondary)', padding: '4rem 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Complaint Categories</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            File complaints across 10 different categories
          </p>
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
          justifyContent: 'center', maxWidth: 800, margin: '0 auto',
        }}>
          {categories.map(({ icon, name }) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'white', padding: '0.6rem 1.25rem',
              borderRadius: '999px', border: '1px solid var(--border)',
              fontSize: '0.875rem', fontWeight: '500',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {icon} {name}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        padding: '5rem 5%',
        textAlign: 'center',
        color: 'white',
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to File Your First Complaint?</h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
          Join thousands of students already using the portal to get their issues resolved quickly.
        </p>
        <Link to="/register" className="hero-btn hero-btn-primary" style={{ display: 'inline-flex' }}>
          Register Now — It's Free
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#0f172a', color: 'rgba(255,255,255,0.5)',
        padding: '2rem 5%', textAlign: 'center', fontSize: '0.875rem',
      }}>
        <p>© 2024 Hostel Complaint Portal. Built for students, by students.</p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/about" style={{ color: 'rgba(255,255,255,0.5)' }}>About</Link>
          <Link to="/contact" style={{ color: 'rgba(255,255,255,0.5)' }}>Contact</Link>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.5)' }}>Login</Link>
        </div>
      </footer>
    </div>
  );
}
