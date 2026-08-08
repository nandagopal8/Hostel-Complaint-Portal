import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Other'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    hostelBlock: '', roomNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.register({
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, hostelBlock: form.hostelBlock, roomNumber: form.roomNumber,
      });
      // Auto-login after register
      localStorage.setItem('hcp_token', data.token);
      localStorage.setItem('hcp_user', JSON.stringify(data.user));
      toast.success('Account created! Welcome 🎉');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-icon">🎓</div>
          <h2>Join the Portal</h2>
          <p>
            Register as a student to start filing hostel complaints. 
            Get quick resolutions with our transparent tracking system.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            {[
              { icon: '✅', text: 'Free to use, always' },
              { icon: '🔐', text: 'Secure & encrypted data' },
              { icon: '⚡', text: 'Get issues resolved fast' },
              { icon: '📱', text: 'Works on all devices' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', opacity: 0.9 }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <span style={{ fontSize: '0.9rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-side" style={{ overflowY: 'auto' }}>
        <div className="auth-form-container">
          <div className="auth-logo">
            <div style={{ background: 'var(--primary)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🏫</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>Hostel Portal</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Create your account</div>
            </div>
          </div>

          <h1 className="auth-title">Student Registration</h1>
          <p className="auth-subtitle">Fill in your details to create an account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input id="reg-name" name="name" type="text" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input id="reg-email" name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input id="reg-phone" name="phone" type="tel" className="form-control" placeholder="10-digit number" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Hostel Block</label>
                <select id="reg-block" name="hostelBlock" className="form-control" value={form.hostelBlock} onChange={handleChange}>
                  <option value="">Select Block</option>
                  {BLOCKS.map((b) => <option key={b} value={b}>Block {b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input id="reg-room" name="roomNumber" type="text" className="form-control" placeholder="e.g. 204" value={form.roomNumber} onChange={handleChange} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control" placeholder="Min 6 chars"
                    value={form.password} onChange={handleChange} required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password <span className="required">*</span></label>
                <input
                  id="reg-confirm" name="confirmPassword" type="password"
                  className="form-control" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={handleChange} required
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <div className="form-error">⚠ Passwords don't match</div>
                )}
              </div>
            </div>

            <button id="register-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><span className="spinner spinner-sm" /> Creating account...</> : 'Create Account →'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
