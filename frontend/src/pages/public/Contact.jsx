import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <nav className="landing-nav" style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" className="landing-nav-logo" style={{ color: 'var(--text)' }}>
          <span style={{ fontSize: '1.5rem' }}>🏫</span> Hostel Portal
        </Link>
        <div className="landing-nav-links">
          <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Home</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>About</Link>
          <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
        </div>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', padding: '4rem 5%', color: 'white', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '0.75rem' }}>Contact Us</h1>
        <p style={{ opacity: 0.8 }}>Have a question or need help? We're here for you.</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        <div>
          {[
            { icon: '📧', title: 'Email', value: 'support@hostel.edu' },
            { icon: '📞', title: 'Phone', value: '+91 98765 43210' },
            { icon: '⏰', title: 'Hours', value: 'Mon–Fri, 9 AM – 6 PM' },
            { icon: '📍', title: 'Office', value: 'Admin Block, Ground Floor' },
          ].map(({ icon, title, value }) => (
            <div key={title} className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{title}</div>
                <div style={{ fontWeight: 500 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Send a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-control" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} placeholder="What is this about?" required />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="Your message..." required />
            </div>
            <button type="submit" className="btn btn-primary btn-full">Send Message →</button>
          </form>
        </div>
      </div>
    </div>
  );
}
