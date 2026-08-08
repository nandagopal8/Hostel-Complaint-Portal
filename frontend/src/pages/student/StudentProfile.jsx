import { useState, useEffect, useRef } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getInitials, getImageUrl, getErrorMessage } from '../../utils/helpers';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BLOCKS = ['A','B','C','D','E','F','G','H','Other'];

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: '', phone: '', hostelBlock: '', roomNumber: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', hostelBlock: user.hostelBlock || '', roomNumber: user.roomNumber || '' });
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('profileImage', imageFile);
      const { data } = await authService.updateProfile(fd);
      updateUser(data.user);
      toast.success('Profile updated! ✅');
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully! 🔐');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const avatarSrc = imagePreview || getImageUrl(user?.profileImage);

  return (
    <AppLayout title="My Profile">
      <div style={{ maxWidth: 700 }}>
        <div className="page-header">
          <h1 className="page-title">👤 My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div className="avatar avatar-xl" style={{ background: 'var(--primary)' }}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : getInitials(user?.name)}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--primary)', color: 'white',
                  border: '2px solid white', fontSize: '0.8rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✏️</button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </div>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.email}</div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-resolved">🎓 Student</span>
                {user?.hostelBlock && <span className="badge badge-assigned">🏠 Block {user.hostelBlock}</span>}
                {user?.roomNumber && <span className="badge badge-pending">🚪 Room {user.roomNumber}</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Member since {formatDate(user?.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', borderBottom: '2px solid var(--border)' }}>
          {['profile', 'password'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '0.75rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${tab === t ? 'var(--primary)' : 'transparent'}`,
                marginBottom: '-2px', fontWeight: tab === t ? 700 : 500,
                color: tab === t ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}>
              {t === 'profile' ? '👤 Edit Profile' : '🔐 Change Password'}
            </button>
          ))}
        </div>

        {/* Edit Profile */}
        {tab === 'profile' && (
          <div className="card">
            <form onSubmit={handleProfileSave}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="profile-name" className="form-control" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" value={user?.email} disabled />
                <div className="form-hint">Email cannot be changed.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input id="profile-phone" type="tel" className="form-control" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="10-digit number" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Hostel Block</label>
                  <select id="profile-block" className="form-control" value={form.hostelBlock} onChange={(e) => setForm({...form, hostelBlock: e.target.value})}>
                    <option value="">Select Block</option>
                    {BLOCKS.map((b) => <option key={b} value={b}>Block {b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Room Number</label>
                  <input id="profile-room" className="form-control" value={form.roomNumber} onChange={(e) => setForm({...form, roomNumber: e.target.value})} placeholder="e.g. 204" />
                </div>
              </div>
              {imageFile && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                  📸 New photo selected: {imageFile.name}
                  <button type="button" className="btn btn-ghost btn-sm" style={{ marginLeft: '0.5rem' }} onClick={() => { setImageFile(null); setImagePreview(null); }}>✕</button>
                </div>
              )}
              <button type="submit" id="save-profile-btn" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner spinner-sm" /> Saving...</> : '💾 Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Change Password */}
        {tab === 'password' && (
          <div className="card">
            <form onSubmit={handlePasswordSave}>
              <div className="form-group">
                <label className="form-label">Current Password <span className="required">*</span></label>
                <input id="current-password" type="password" className="form-control" value={pwForm.currentPassword} onChange={(e) => setPwForm({...pwForm, currentPassword: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password <span className="required">*</span></label>
                <input id="new-password" type="password" className="form-control" value={pwForm.newPassword} onChange={(e) => setPwForm({...pwForm, newPassword: e.target.value})} placeholder="Min 6 characters" required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password <span className="required">*</span></label>
                <input id="confirm-new-password" type="password" className="form-control" value={pwForm.confirmPassword} onChange={(e) => setPwForm({...pwForm, confirmPassword: e.target.value})} required />
                {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                  <div className="form-error">⚠ Passwords don't match</div>
                )}
              </div>
              <button type="submit" id="change-password-btn" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner spinner-sm" /> Updating...</> : '🔐 Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
