import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { complaintService } from '../../services/complaintService';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electrical','Plumbing','Water Supply','Wi-Fi / Internet','Furniture','Room Cleaning','Washroom','Mess / Food','Security','Others'];
const PRIORITIES = ['Low','Medium','High'];
const BLOCKS = ['A','B','C','D','E','F','G','H','Other'];

export default function CreateComplaint() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'Low',
    hostelBlock: '', roomNumber: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.length < 5) errs.title = 'Title must be at least 5 characters';
    if (!form.description.trim() || form.description.length < 10) errs.description = 'Description must be at least 10 characters';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.hostelBlock) errs.hostelBlock = 'Please select your hostel block';
    if (!form.roomNumber.trim()) errs.roomNumber = 'Room number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('complaintImage', image);

      await complaintService.create(fd);
      toast.success('Complaint submitted successfully! 🎉');
      navigate('/student/complaints');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="File New Complaint">
      <div style={{ maxWidth: 700 }}>
        <div className="page-header">
          <h1 className="page-title">📝 File New Complaint</h1>
          <p className="page-subtitle">Describe your issue clearly and we'll get it resolved quickly.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Complaint Title <span className="required">*</span></label>
              <input
                id="complaint-title" name="title" type="text"
                className={`form-control ${errors.title ? 'error' : ''}`}
                placeholder="Brief description of the issue"
                value={form.title} onChange={handleChange} maxLength={100}
              />
              {errors.title && <div className="form-error">⚠ {errors.title}</div>}
              <div className="form-hint">{form.title.length}/100 characters</div>
            </div>

            {/* Category & Priority */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Category <span className="required">*</span></label>
                <select
                  id="complaint-category" name="category"
                  className={`form-control ${errors.category ? 'error' : ''}`}
                  value={form.category} onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <div className="form-error">⚠ {errors.category}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Priority <span className="required">*</span></label>
                <select id="complaint-priority" name="priority" className="form-control" value={form.priority} onChange={handleChange}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="form-hint">
                  {form.priority === 'High' ? '🔴 Needs immediate attention' : form.priority === 'Medium' ? '🟡 Moderate urgency' : '🟢 Can wait a bit'}
                </div>
              </div>
            </div>

            {/* Block & Room */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Hostel Block <span className="required">*</span></label>
                <select
                  id="complaint-block" name="hostelBlock"
                  className={`form-control ${errors.hostelBlock ? 'error' : ''}`}
                  value={form.hostelBlock} onChange={handleChange}
                >
                  <option value="">Select Block</option>
                  {BLOCKS.map((b) => <option key={b} value={b}>Block {b}</option>)}
                </select>
                {errors.hostelBlock && <div className="form-error">⚠ {errors.hostelBlock}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Room Number <span className="required">*</span></label>
                <input
                  id="complaint-room" name="roomNumber" type="text"
                  className={`form-control ${errors.roomNumber ? 'error' : ''}`}
                  placeholder="e.g. 204"
                  value={form.roomNumber} onChange={handleChange}
                />
                {errors.roomNumber && <div className="form-error">⚠ {errors.roomNumber}</div>}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description <span className="required">*</span></label>
              <textarea
                id="complaint-desc" name="description"
                className={`form-control ${errors.description ? 'error' : ''}`}
                placeholder="Describe the issue in detail. Include when it started, how it affects you, etc."
                value={form.description} onChange={handleChange}
                rows={5} maxLength={1000}
              />
              {errors.description && <div className="form-error">⚠ {errors.description}</div>}
              <div className="form-hint">{form.description.length}/1000 characters</div>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Attach Photo (Optional)</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="complaint-image" />
              
              {!preview ? (
                <div className="upload-area" onClick={() => fileRef.current?.click()}>
                  <div className="upload-icon">📸</div>
                  <div className="upload-text">Click to upload a photo</div>
                  <div className="upload-hint">JPEG, PNG, WEBP — Max 5MB</div>
                </div>
              ) : (
                <div className="upload-preview" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={preview} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--border)' }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{image?.name}</p>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setImage(null); setPreview(null); }}>
                      ✕ Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" id="submit-complaint-btn" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1 }}>
                {loading ? <><span className="spinner spinner-sm" /> Submitting...</> : '📤 Submit Complaint'}
              </button>
              <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
