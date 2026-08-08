import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-icon">🏫</div>
          <h2>Welcome Back!</h2>
          <p>
            Login to access your hostel complaint portal. Track your complaints,
            receive updates, and get issues resolved quickly.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            {[
              { icon: '📋', text: 'View all your submitted complaints' },
              { icon: '🔔', text: 'Get real-time status notifications' },
              { icon: '📊', text: 'Track resolution progress' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', opacity: 0.9 }}>
                <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                <span style={{ fontSize: '0.9rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-logo">
            <div className="auth-logo-icon" style={{ background: 'var(--primary)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🏫</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>Hostel Portal</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Complaint Management</div>
            </div>
          </div>

          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                id="login-email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="login-password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    fontSize: '1rem',
                  }}
                >{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="login-btn">
              {loading ? <><span className="spinner spinner-sm" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>Register here</Link>
          </div>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: '1.5rem', padding: '0.875rem 1rem',
            background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--primary-100)', fontSize: '0.8rem',
          }}>
            <strong style={{ color: 'var(--primary)' }}>🔑 Demo Credentials:</strong>
            <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
              Admin: admin@hostel.edu / Admin@123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
