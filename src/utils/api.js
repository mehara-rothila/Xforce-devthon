// utils/api.js
import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor (adds auth token later)
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add cache-control headers to all GET requests during testing?
    // if (config.method === 'get') {
    //   config.headers['Cache-Control'] = 'no-cache';
    //   config.headers['Pragma'] = 'no-cache';
    //   config.headers['Expires'] = '0';
    // }
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor (handles 401 etc.)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request - Redirecting to login');
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Group API functions ---

const subjects = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  getTopics: (id) => api.get(`/subjects/${id}/topics`),
  getProgress: (id) => api.get(`/subjects/${id}/progress`), // Note: Backend uses mock data currently
  getRecommendations: (id) => api.get(`/subjects/${id}/recommendations`), // Note: Backend uses mock data currently
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
  download: (id) => api.get(`/resources/${id}/download`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.patch(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`)
};

const quizzes = {
  getAll: (params) => api.get('/quizzes', { params }),
  getById: (id) => api.get(`/quizzes/${id}`),
  getBySubject: (subjectId) => api.get(`/subjects/${subjectId}/quizzes`), // Consider moving this under subjects?
  getPracticeQuizzes: (subjectId, topic) =>
    api.get(`/quizzes/subject/${subjectId}/practice${topic ? `?topic=${topic}` : ''}`),
  submitAttempt: (id, answers) => api.post(`/quizzes/${id}/attempts`, { answers }),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.patch(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`)
};

const users = {
  getDashboardSummary: (userId) => {
     if (!userId || userId === 'YOUR_TEST_USER_ID_HERE') {
        console.error('Attempted to fetch dashboard summary without a valid User ID.');
        return Promise.reject(new Error('Valid User ID required for getDashboardSummary'));
      }
     // Using cache-control headers from previous step
     return api.get(`/users/${userId}/dashboard-summary`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'Expires': '0' }
     });
  },
  getDetailedProgress: (userId, subjectId) => {
    if (!userId || !subjectId) {
        console.error('User ID and Subject ID are required for getDetailedProgress');
        return Promise.reject(new Error('User ID and Subject ID required'));
    }
    // Add cache control here too for consistency during testing
    return api.get(`/users/${userId}/progress/${subjectId}`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'Expires': '0' }
     });
  },
  getAchievements: (userId) => {
    if (!userId) {
        console.error('User ID is required for getAchievements');
        return Promise.reject(new Error('User ID required'));
    }
    // Add cache control here too
    return api.get(`/users/${userId}/achievements`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'Expires': '0' }
     });
  }
  // Add other user functions later (e.g., getProfile, updateProfile, getActivity)
};


// Export all API services
export default {
  subjects,
  resources,
  quizzes,
  users // Ensure users group is exported
};
