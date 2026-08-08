import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import { StatusBadge, PriorityBadge } from '../../components/Badges';
import { complaintService } from '../../services/complaintService';
import { formatDateTime, getCategoryIcon, getImageUrl, getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    complaintService.getById(id)
      .then(({ data }) => setComplaint(data.complaint))
      .catch(() => { toast.error('Complaint not found'); navigate('/student/complaints'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await complaintService.delete(id);
      toast.success('Complaint deleted');
      navigate('/student/complaints');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) return <AppLayout title="Complaint Details"><Spinner /></AppLayout>;
  if (!complaint) return null;

  const canEdit = complaint.status === 'Pending';
  const imgUrl = getImageUrl(complaint.complaintImage);

  const timeline = [
    { status: 'Pending', icon: '📝', done: true, date: complaint.createdAt },
    { status: 'Assigned', icon: '👤', done: ['Assigned','In Progress','Resolved','Closed'].includes(complaint.status) },
    { status: 'In Progress', icon: '🔄', done: ['In Progress','Resolved','Closed'].includes(complaint.status) },
    { status: 'Resolved', icon: '✅', done: ['Resolved','Closed'].includes(complaint.status) },
    { status: 'Closed', icon: '🔒', done: complaint.status === 'Closed', date: complaint.updatedAt },
  ];

  return (
    <AppLayout title="Complaint Details">
      <div style={{ maxWidth: 800 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem' }}>← Back</button>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{complaint.complaintId}</div>
            <h1 className="page-title">{complaint.title}</h1>
          </div>
          {canEdit && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal(true)}>🗑 Delete</button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main Info */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 className="card-title">📋 Complaint Details</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-section"><div className="detail-label">Category</div><div className="detail-value">{getCategoryIcon(complaint.category)} {complaint.category}</div></div>
                <div className="detail-section"><div className="detail-label">Hostel Block</div><div className="detail-value">Block {complaint.hostelBlock}</div></div>
                <div className="detail-section"><div className="detail-label">Room Number</div><div className="detail-value">{complaint.roomNumber}</div></div>
                <div className="detail-section"><div className="detail-label">Filed On</div><div className="detail-value">{formatDateTime(complaint.createdAt)}</div></div>
                {complaint.assignedTo && <div className="detail-section"><div className="detail-label">Assigned To</div><div className="detail-value">👤 {complaint.assignedTo}</div></div>}
              </div>

              <div className="detail-section">
                <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Description</div>
                <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.7, fontSize: '0.9rem' }}>{complaint.description}</div>
              </div>

              {complaint.adminComment && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                  <div className="detail-label" style={{ marginBottom: '0.25rem' }}>💬 Admin Response</div>
                  <div style={{ fontSize: '0.9rem' }}>{complaint.adminComment}</div>
                </div>
              )}
            </div>

            {/* Image */}
            {imgUrl && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: '1rem' }}>📸 Attached Photo</h3>
                <img src={imgUrl} alt="Complaint" style={{ width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', maxHeight: 400, objectFit: 'contain' }} />
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card" style={{ alignSelf: 'flex-start' }}>
            <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>📍 Status Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {timeline.map((step, i) => (
                <div key={step.status} style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: step.done ? 'var(--primary)' : 'var(--border)',
                      color: step.done ? 'white' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', flexShrink: 0,
                      transition: 'all 0.3s',
                    }}>
                      {step.done ? step.icon : '○'}
                    </div>
                    {i < timeline.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 32, background: step.done ? 'var(--primary)' : 'var(--border)', margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? '1rem' : 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: step.done ? 600 : 400, color: step.done ? 'var(--text)' : 'var(--text-muted)' }}>{step.status}</div>
                    {step.date && step.done && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{formatDateTime(step.date)}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Complaint"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : '🗑 Yes, Delete'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Are you sure you want to delete this complaint? This action cannot be undone.
        </p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--danger)', fontWeight: 500 }}>
          ⚠ "{complaint.title}"
        </div>
      </Modal>
    </AppLayout>
  );
}
