import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Supabase Auth
export const registerWithEmail = (data) => api.post('/supabase-auth/register', data);
export const loginWithEmail = (data) => api.post('/supabase-auth/login', data);
export const getGoogleLoginUrl = () => api.get('/supabase-auth/google');
export const handleAuthCallback = (token) => api.post('/supabase-auth/callback', { access_token: token });
export const getMe = () => api.get('/supabase-auth/me');

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
