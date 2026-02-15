import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Onboarding
export const submitOnboarding = (data) => api.post('/onboarding/submit', data);
export const getProfile = () => api.get('/onboarding/profile');

// Courses
export const generateCourse = () => api.post('/courses/generate');
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);

// Progress
export const completeModule = (moduleId) => api.post(`/progress/module/${moduleId}/complete`);
export const getProgress = () => api.get('/progress');
export const getStats = () => api.get('/progress/stats');

export default api;
