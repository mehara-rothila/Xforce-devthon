// utils/api.js
import axios from 'axios';

// Create axios instance with base URL
// Export the API_URL so it can be used elsewhere
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Interceptors ---

// Request Interceptor: Adds auth token to headers if found in localStorage
api.interceptors.request.use(
  config => {
    // Check if localStorage is available (important for SSR/server-side context)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor: Handles 401 Unauthorized errors by redirecting to login
api.interceptors.response.use(
  response => response,
  error => {
    // Check if it's a 401 error and if window is defined (client-side)
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      console.error('Unauthorized request - Redirecting to login');
      localStorage.removeItem('token'); // Clear potentially invalid token
      // Redirect to login page
      window.location.href = '/login'; // Or use Next.js router if available/appropriate context
    }
    // Reject the promise for other errors or if not client-side
    return Promise.reject(error);
  }
);

// --- Group API functions ---

const subjects = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  getTopics: (id) => api.get(`/subjects/${id}/topics`),
  // Note: Ensure backend endpoints exist and handle logic correctly
  getProgress: (id) => api.get(`/subjects/${id}/progress`),
  getRecommendations: (id) => api.get(`/subjects/${id}/recommendations`),
  // Admin functions (ensure proper auth checks on backend)
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.patch(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
  addTopic: (id, data) => api.post(`/subjects/${id}/topics`, data),
  updateTopic: (id, topicId, data) => api.patch(`/subjects/${id}/topics/${topicId}`, data),
  deleteTopic: (id, topicId) => api.delete(`/subjects/${id}/topics/${topicId}`)
};

const resources = {
  getAll: (params) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  getBySubject: (subjectId) => api.get(`/resources/subject/${subjectId}`),
  getStudyMaterials: (subjectId) => api.get(`/resources/subject/${subjectId}/materials`),
  // Note: The frontend page currently uses window.location.href for downloads,
  // but this Axios definition is kept for consistency or other potential uses.
  // Set 'responseType: blob' if you intend for Axios to handle the file data.
  download: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
  // --- Function to get category counts ---
  getCategoryCounts: (params) => api.get('/resources/category-counts', { params }), // Accepts params like { subject: 'subjectId' }
  // Admin functions
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.patch(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`)
};

const quizzes = {
  getAll: (params) => api.get('/quizzes', { params }),
  getById: (id) => api.get(`/quizzes/${id}`),
  // This route might be better under subjects API group, ensure backend matches
  getBySubject: (subjectId) => api.get(`/subjects/${subjectId}/quizzes`),
  getPracticeQuizzes: (subjectId, topic) =>
    api.get(`/quizzes/subject/${subjectId}/practice${topic ? `?topic=${topic}` : ''}`),
  submitAttempt: (id, answers) => api.post(`/quizzes/${id}/attempts`, { answers }),
  // Admin functions
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.patch(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`)
};

const users = {
  // Note: Ensure userId is valid before calling these
  getDashboardSummary: (userId) => api.get(`/users/${userId}/dashboard-summary`),
  getDetailedProgress: (userId, subjectId) => api.get(`/users/${userId}/progress/${subjectId}`),
  getAchievements: (userId) => api.get(`/users/${userId}/achievements`),
  // Add other user functions as needed (getProfile, updateProfile, etc.)
};


// Export all API services grouped together
export default {
  subjects,
  resources,
  quizzes,
  users
};

// Also remember API_URL is exported separately as a named export:
// export const API_URL = ...;
