import { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { adminService } from '../../services/adminService';
import { formatDate, getInitials, getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { load(); }, [page, search]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getStudents({ page, limit: 10, search: search || undefined });
      setStudents(data.students);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  const handleToggleStatus = async (id, name, isActive) => {
    try {
      await adminService.toggleStudentStatus(id);
      toast.success(`${name}'s account ${isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <AppLayout title="Student Management">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">👥 Student Management</h1>
          <p className="page-subtitle">Total: {pagination.total} registered students</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ maxWidth: 350 }}>
          <span className="search-icon">🔍</span>
          <input
            id="student-search" type="text" className="form-control search-input"
            placeholder="Search by name, email or room..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? <Spinner /> : students.length === 0 ? (
        <EmptyState icon="👥" title="No students found" description="No students match your search." />
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Block</th>
                  <th>Room</th>
                  <th>Complaints</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar avatar-sm" style={{ background: 'var(--primary)', fontSize: '0.75rem' }}>
                          {getInitials(s.name)}
                        </div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{s.email}</td>
                    <td style={{ fontSize: '0.85rem' }}>{s.phone || '—'}</td>
                    <td>{s.hostelBlock ? `Block ${s.hostelBlock}` : '—'}</td>
                    <td>{s.roomNumber || '—'}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.complaintCount}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(s.createdAt)}</td>
                    <td>
                      <span className={`badge ${s.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                        {s.isActive ? '✅ Active' : '🚫 Disabled'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${s.isActive ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(s._id, s.name, s.isActive)}
                        id={`toggle-student-${s._id}`}
                      >
                        {s.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}
    </AppLayout>
  );
}
