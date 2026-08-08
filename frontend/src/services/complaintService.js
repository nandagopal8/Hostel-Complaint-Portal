import api from './api';

export const complaintService = {
  create: (data) =>
    api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) =>
    api.put(`/complaints/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/complaints/${id}`),
  getStats: () => api.get('/complaints/stats'),
};
