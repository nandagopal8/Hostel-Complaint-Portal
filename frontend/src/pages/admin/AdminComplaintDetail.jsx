import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import { StatusBadge, PriorityBadge } from '../../components/Badges';
import { adminService } from '../../services/adminService';
import { complaintService } from '../../services/complaintService';
import { formatDateTime, getCategoryIcon, getImageUrl, getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['Pending','Assigned','In Progress','Resolved','Closed'];

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ status: '', assignedTo: '', adminComment: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    complaintService.getById(id)
      .then(({ data }) => {
        setComplaint(data.complaint);
        setForm({ status: data.complaint.status, assignedTo: data.complaint.assignedTo || '', adminComment: data.complaint.adminComment || '' });
      })
      .catch(() => { toast.error('Complaint not found'); navigate('/admin/complaints'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await adminService.updateComplaintStatus(id, form);
      setComplaint(data.complaint);
      toast.success('Complaint updated successfully! ✅');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppLayout title="Complaint Details"><Spinner /></AppLayout>;
  if (!complaint) return null;

  const imgUrl = getImageUrl(complaint.complaintImage);

  return (
    <AppLayout title="Complaint Details">
      <div style={{ maxWidth: 900 }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>← Back to Complaints</button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{complaint.complaintId}</div>
            <h1 className="page-title">{complaint.title}</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Details */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header"><h3 className="card-title">📋 Complaint Info</h3></div>
              <div className="detail-grid">
                <div className="detail-section"><div className="detail-label">Student</div><div className="detail-value">👤 {complaint.student?.name}</div></div>
                <div className="detail-section"><div className="detail-label">Email</div><div className="detail-value">{complaint.student?.email}</div></div>
                <div className="detail-section"><div className="detail-label">Phone</div><div className="detail-value">{complaint.student?.phone || '—'}</div></div>
                <div className="detail-section"><div className="detail-label">Category</div><div className="detail-value">{getCategoryIcon(complaint.category)} {complaint.category}</div></div>
                <div className="detail-section"><div className="detail-label">Hostel Block</div><div className="detail-value">Block {complaint.hostelBlock}</div></div>
                <div className="detail-section"><div className="detail-label">Room Number</div><div className="detail-value">{complaint.roomNumber}</div></div>
                <div className="detail-section"><div className="detail-label">Filed On</div><div className="detail-value">{formatDateTime(complaint.createdAt)}</div></div>
                <div className="detail-section"><div className="detail-label">Last Updated</div><div className="detail-value">{formatDateTime(complaint.updatedAt)}</div></div>
              </div>
              <div className="detail-section">
                <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Description</div>
                <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.7, fontSize: '0.9rem' }}>{complaint.description}</div>
              </div>
            </div>

            {imgUrl && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: '1rem' }}>📸 Attached Photo</h3>
                <img src={imgUrl} alt="Complaint" style={{ width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', maxHeight: 400, objectFit: 'contain' }} />
              </div>
            )}
          </div>

          {/* Update Panel */}
          <div className="card" style={{ alignSelf: 'flex-start' }}>
            <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>⚙️ Update Complaint</h3>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select id="admin-detail-status" className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign To</label>
              <input id="admin-detail-assign" className="form-control" placeholder="Staff name or dept." value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Comment / Resolution</label>
              <textarea id="admin-detail-comment" className="form-control" rows={4} placeholder="Add a note for the student..." value={form.adminComment} onChange={(e) => setForm({ ...form, adminComment: e.target.value })} />
            </div>

            <button id="admin-save-update-btn" className="btn btn-primary btn-full" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner spinner-sm" /> Saving...</> : '💾 Save Changes'}
            </button>

            {complaint.adminComment && (
              <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--primary)' }}>Current Comment</div>
                <div style={{ color: 'var(--text-secondary)' }}>{complaint.adminComment}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
