import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending/receiving httpOnly cookies
});

// Attach Bearer token from localStorage as fallback if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tsh_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for consistent error extraction while preserving response details
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    const customErr = new Error(message);
    customErr.response = error.response;
    customErr.code = error.response?.data?.code;
    return Promise.reject(customErr);
  }
);

// Auth Services
export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
};

// Problem Statements & Hold Services
export const psService = {
  getAll: () => API.get('/ps'),
  getAllCapacity: () => API.get('/ps/capacity/all'),
  getById: (id) => API.get(`/ps/${id}`),
  acquireHold: (id) => API.post(`/ps/${id}/hold`),
  getActiveHold: (id) => API.get(`/ps/${id}/hold`),
  getUserActiveHolds: () => API.get('/ps/user/holds'),
};

// Team Registration & Payment Services
export const teamService = {
  registerTeam: (data) => API.post('/team/register', data),
  submitManualPayment: (formData) =>
    API.post('/team/payment/manual', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyStatus: () => API.get('/team/my-status'),
  getMyRegistrations: () => API.get('/team/my-registrations'),
};

// Admin Services
export const adminService = {
  getRegistrations: (params) => API.get('/admin/registrations', { params }),
  approveRegistration: (id, data) => API.post(`/admin/registrations/${id}/approve`, data),
  rejectRegistration: (id, data) => API.post(`/admin/registrations/${id}/reject`, data),
  resetPS: () => API.post('/admin/ps/reset'),
  getQueries: () => API.get('/admin/queries'),
  getPSTeams: (id) => API.get(`/admin/ps/${id}/teams`),
  deleteTeam: (id) => API.delete(`/admin/teams/${id}`),
};

// Contact Services
export const contactService = {
  submitQuery: (data) => API.post('/contact', data),
};

export default API;
