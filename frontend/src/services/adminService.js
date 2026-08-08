import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getComplaints: (params) => api.get('/admin/complaints', { params }),
  updateComplaintStatus: (id, data) => api.put(`/admin/complaints/${id}/status`, data),
  deleteComplaint: (id) => api.delete(`/admin/complaints/${id}`),
  getStudents: (params) => api.get('/admin/students', { params }),
  toggleStudentStatus: (id) => api.put(`/admin/students/${id}/status`),
};
