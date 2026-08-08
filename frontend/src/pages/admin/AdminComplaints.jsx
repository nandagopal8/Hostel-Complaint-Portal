import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { StatusBadge, PriorityBadge } from '../../components/Badges';
import { adminService } from '../../services/adminService';
import { formatDate, getCategoryIcon, getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['Pending','Assigned','In Progress','Resolved','Closed'];
const CATEGORIES = ['Electrical','Plumbing','Water Supply','Wi-Fi / Internet','Furniture','Room Cleaning','Washroom','Mess / Food','Security','Others'];
const BLOCKS = ['A','B','C','D','E','F','G','H','Other'];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '', hostelBlock: '' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({ status: '', assignedTo: '', adminComment: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => { load(); }, [page, filters]);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) };
      const { data } = await adminService.getComplaints(params);
      setComplaints(data.complaints);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load complaints'); }
    finally { setLoading(false); }
  };

  const openStatusModal = (c) => {
    setSelected(c);
    setUpdateForm({ status: c.status, assignedTo: c.assignedTo || '', adminComment: c.adminComment || '' });
    setStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!updateForm.status) { toast.error('Select a status'); return; }
    setUpdating(true);
    try {
      await adminService.updateComplaintStatus(selected._id, updateForm);
      toast.success('Complaint updated! 📋');
      setStatusModal(false);
      load();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    setUpdating(true);
    try {
      await adminService.deleteComplaint(selected._id);
      toast.success('Complaint deleted');
      setDeleteModal(false);
      load();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(false); }
  };

  const setFilter = (key, val) => { setFilters({ ...filters, [key]: val }); setPage(1); };

  return (
    <AppLayout title="Complaint Management">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">📋 Complaint Management</h1>
          <p className="page-subtitle">Total: {pagination.total} complaints</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ minWidth: 250 }}>
          <span className="search-icon">🔍</span>
          <input id="admin-search" type="text" className="form-control search-input" placeholder="Search ID, title, room..." value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
        </div>
        <select id="admin-filter-status" className="filter-select" value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select id="admin-filter-category" className="filter-select" value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select id="admin-filter-priority" className="filter-select" value={filters.priority} onChange={(e) => setFilter('priority', e.target.value)}>
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select id="admin-filter-block" className="filter-select" value={filters.hostelBlock} onChange={(e) => setFilter('hostelBlock', e.target.value)}>
          <option value="">All Blocks</option>
          {BLOCKS.map((b) => <option key={b} value={b}>Block {b}</option>)}
        </select>
        {Object.values(filters).some(Boolean) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilters({ search:'',status:'',category:'',priority:'',hostelBlock:'' }); setPage(1); }}>✕ Clear</button>
        )}
      </div>

      {/* Table */}
      {loading ? <Spinner /> : complaints.length === 0 ? (
        <EmptyState icon="📭" title="No complaints found" description="No complaints match the current filters." />
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Block/Room</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.complaintId}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: 200 }} className="truncate">{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getCategoryIcon(c.category)} {c.category}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.student?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.student?.email}</div>
                    </td>
                    <td>{getCategoryIcon(c.category)} {c.category}</td>
                    <td>Block {c.hostelBlock} · {c.roomNumber}</td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(c.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openStatusModal(c)}
                          title="Update Status"
                          id={`update-btn-${c._id}`}
                        >✏️</button>
                        <Link to={`/admin/complaints/${c._id}`} className="btn btn-secondary btn-sm" title="View Details">👁</Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => { setSelected(c); setDeleteModal(true); }}
                          title="Delete"
                          id={`delete-btn-${c._id}`}
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        title={`Update: ${selected?.title}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setStatusModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={updating} id="confirm-update-btn">
              {updating ? 'Updating...' : '✅ Update'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">New Status</label>
          <select id="modal-status" className="form-control" value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Assign To</label>
          <input id="modal-assign" className="form-control" placeholder="Staff name or department" value={updateForm.assignedTo} onChange={(e) => setUpdateForm({ ...updateForm, assignedTo: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Admin Comment / Resolution</label>
          <textarea id="modal-comment" className="form-control" rows={3} placeholder="Add a note for the student..." value={updateForm.adminComment} onChange={(e) => setUpdateForm({ ...updateForm, adminComment: e.target.value })} />
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Complaint"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={updating}>
              {updating ? 'Deleting...' : '🗑 Delete'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to permanently delete "<strong>{selected?.title}</strong>"?
        </p>
      </Modal>
    </AppLayout>
  );
}
