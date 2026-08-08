import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { StatusBadge, PriorityBadge } from '../../components/Badges';
import { complaintService } from '../../services/complaintService';
import { formatDate, getCategoryIcon } from '../../utils/helpers';

const STATUSES = ['Pending','Assigned','In Progress','Resolved','Closed'];
const CATEGORIES = ['Electrical','Plumbing','Water Supply','Wi-Fi / Internet','Furniture','Room Cleaning','Washroom','Mess / Food','Security','Others'];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadComplaints();
  }, [page, filters]);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) };
      const { data } = await complaintService.getAll(params);
      setComplaints(data.complaints);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  return (
    <AppLayout title="My Complaints">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">📋 My Complaints</h1>
          <p className="page-subtitle">Total: {pagination.total} complaint{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/student/complaints/new" className="btn btn-primary">➕ New Complaint</Link>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="search-complaints" type="text"
            className="form-control search-input"
            placeholder="Search by title or ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <select id="filter-status" className="filter-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select id="filter-category" className="filter-select" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select id="filter-priority" className="filter-select" value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}>
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {(filters.search || filters.status || filters.category || filters.priority) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilters({ search: '', status: '', category: '', priority: '' }); setPage(1); }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Complaints List */}
      {loading ? (
        <Spinner />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon="📭" title="No complaints found"
          description="No complaints match your current filters."
          action={<Link to="/student/complaints/new" className="btn btn-primary">File First Complaint</Link>}
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {complaints.map((c) => (
              <Link key={c._id} to={`/student/complaints/${c._id}`} style={{ textDecoration: 'none' }}>
                <div className="complaint-card">
                  <div className="complaint-card-header">
                    <div style={{ flex: 1 }}>
                      <div className="complaint-card-id">{c.complaintId}</div>
                      <div className="complaint-card-title">{c.title}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', alignItems: 'flex-end' }}>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                    </div>
                  </div>
                  <div className="complaint-card-meta">
                    <span className="complaint-card-meta-item">{getCategoryIcon(c.category)} {c.category}</span>
                    <span className="complaint-card-meta-item">🏠 Block {c.hostelBlock} · Room {c.roomNumber}</span>
                    <span className="complaint-card-meta-item">📅 {formatDate(c.createdAt)}</span>
                    {c.assignedTo && <span className="complaint-card-meta-item">👤 {c.assignedTo}</span>}
                  </div>
                  {c.adminComment && (
                    <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      💬 Admin: {c.adminComment}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}
    </AppLayout>
  );
}
