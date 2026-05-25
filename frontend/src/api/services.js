import api from './client';

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const salesApi = {
  getAll: () => api.get('/sales'),
  create: (data) => api.post('/sales', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  remove: (id) => api.delete(`/sales/${id}`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
};

export const mediaApi = {
  upload: (file, folder = 'inventory') => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/media/upload?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
