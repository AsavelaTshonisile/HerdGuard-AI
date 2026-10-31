import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('herdguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('herdguard_token');
      localStorage.removeItem('herdguard_user');
      // If we are not already on the login or public page, redirect
      if (!window.location.pathname.startsWith('/login') && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const farmsAPI = {
  getAll: (params) => api.get('/farms', { params }),
  getById: (id) => api.get(`/farms/${id}`),
  create: (data) => api.post('/farms', data),
  update: (id, data) => api.put(`/farms/${id}`, data),
  delete: (id) => api.delete(`/farms/${id}`),
};

export const animalsAPI = {
  getAll: (params) => api.get('/animals', { params }),
  getProfile: (id) => api.get(`/animals/${id}`),
  create: (data) => api.post('/animals', data),
  update: (id, data) => api.put(`/animals/${id}`, data),
  delete: (id) => api.delete(`/animals/${id}`),
};

export const healthReportsAPI = {
  getAll: (params) => api.get('/health-reports', { params }),
  getById: (id) => api.get(`/health-reports/${id}`),
  create: (data) => api.post('/health-reports', data),
  update: (id, data) => api.put(`/health-reports/${id}`, data),
  review: (id, reviewData) => api.post(`/health-reports/${id}/review`, reviewData),
};

export const vaccinationsAPI = {
  getAll: (params) => api.get('/vaccinations', { params }),
  create: (data) => api.post('/vaccinations', data),
  update: (id, data) => api.put(`/vaccinations/${id}`, data),
  delete: (id) => api.delete(`/vaccinations/${id}`),
};

export const diseaseIncidentsAPI = {
  getAll: (params) => api.get('/disease-incidents', { params }),
  getMapData: (params) => api.get('/disease-incidents/map', { params }),
  create: (data) => api.post('/disease-incidents', data),
  update: (id, data) => api.put(`/disease-incidents/${id}`, data),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const aiAPI = {
  assessHealth: (data) => api.post('/ai/health-assessment', data),
  askAssistant: (data) => api.post('/ai/assistant', data),
};

export const dashboardAPI = {
  getFarmerStats: () => api.get('/dashboard/farmer'),
  getProfessionalStats: () => api.get('/dashboard/professional'),
  getAdminStats: () => api.get('/dashboard/admin'),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  createProfessional: (data) => api.post('/users/professional', data),
};

export const knowledgeAPI = {
  getAll: (params) => api.get('/knowledge-resources', { params }),
  create: (data) => api.post('/knowledge-resources', data),
  update: (id, data) => api.put(`/knowledge-resources/${id}`, data),
  delete: (id) => api.delete(`/knowledge-resources/${id}`),
};

export const activityLogsAPI = {
  getAll: (params) => api.get('/activity-logs', { params }),
};

export default api;
