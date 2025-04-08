// utils/api.js
import axios from 'axios';

// Create axios instance with base URL
// This line reads the environment variable set in Netlify.
// For your deployed site, API_URL should be 'https://xforce-backend.fly.dev/api'
// The fallback 'http://localhost:5000/api' is only used during local development if the env var isn't set.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('[api.js] Using baseURL:', API_URL); // Add this line for debugging

const api = axios.create({
  baseURL: API_URL, // Correctly sets the base URL for all requests made with this instance
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Interceptors ---
// These modify requests (adding token) and responses (handling 401 errors)
api.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const publicAuthRoutes = [
          '/auth/register',
          '/auth/login',
          '/auth/forgot-password',
          '/auth/reset-password'
      ];
      // Check if the RELATIVE URL part includes a public route
      const isPublicAuthRoute = publicAuthRoutes.some(route => config.url?.includes(route));

      if (token && !isPublicAuthRoute && !(config.data instanceof FormData)) {
         config.headers.Authorization = `Bearer ${token}`;
      } else if (token && config.url?.includes('/uploads/') && config.data instanceof FormData) {
          config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
       const publicAuthRoutes = [
          '/auth/register',
          '/auth/login',
          '/auth/forgot-password',
          '/auth/reset-password'
      ];
      // Check the ORIGINAL request config URL
      const isPublicAuthRoute = publicAuthRoutes.some(route => error.config.url?.includes(route));

      if (!isPublicAuthRoute) {
          console.error('Unauthorized request (401) - Redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


// --- Group API functions ---
// Each function here uses a RELATIVE path, which gets appended to the baseURL

const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me')
};

const subjects = {
  getAll: () => api.get('/subjects'), // Request goes to baseURL + '/subjects'
  getById: (id) => api.get(`/subjects/${id}`),
  getTopics: (id) => api.get(`/subjects/${id}/topics`),
  getProgress: (id) => api.get(`/subjects/${id}/progress`),
  getRecommendations: (id) => api.get(`/subjects/${id}/recommendations`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.patch(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
  addTopic: (id, data) => api.post(`/subjects/${id}/topics`, data),
  updateTopic: (id, topicId, data) => api.patch(`/subjects/${id}/topics/${topicId}`, data),
  deleteTopic: (id, topicId) => api.delete(`/subjects/${id}/topics/${topicId}`)
};

const resources = {
  getAll: (params) => api.get('/resources', { params }), // Request goes to baseURL + '/resources'
  getById: (id) => api.get(`/resources/${id}`),
  getBySubject: (subjectId) => api.get(`/resources/subject/${subjectId}`),
  getStudyMaterials: (subjectId) => api.get(`/resources/subject/${subjectId}/materials`),
  download: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
  getCategoryCounts: (params) => api.get('/resources/category-counts', { params }), // Request goes to baseURL + '/resources/category-counts'
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.patch(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`)
};

const quizzes = {
  getAll: (params) => api.get('/quizzes', { params }), // Request goes to baseURL + '/quizzes'
  getById: (id) => api.get(`/quizzes/${id}`),
  getBySubject: (subjectId) => api.get(`/subjects/${subjectId}/quizzes`), // Note: Path starts with /subjects/ here
  getPracticeQuizzes: (subjectId, topic) => api.get(`/quizzes/subject/${subjectId}/practice${topic ? `?topic=${topic}` : ''}`),
  submitAttempt: (id, answers, timeTaken) => api.post(`/quizzes/${id}/attempts`, { answers, timeTaken }),
  getUserAttempts: (userId) => api.get(`/quizzes/user/${userId}/attempts`),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.patch(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`)
};

const users = {
  getDashboardSummary: (userId) => api.get(`/users/${userId}/dashboard-summary`),
  getDetailedProgress: (userId, subjectId) => api.get(`/users/${userId}/progress/${subjectId}`),
  getAchievements: (userId) => api.get(`/users/${userId}/achievements`),
  getRecentActivity: (userId) => api.get(`/users/${userId}/activity`),
  getLeaderboard: () => api.get('/users/leaderboard'),
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  updateUserProfile: (userId, data) => api.patch(`/users/${userId}`, data),
  getUserProgress: (userId) => api.get(`/users/${userId}/progress`),
};

const uploads = {
    uploadResource: (file) => {
        const formData = new FormData();
        formData.append('resourceFile', file);
        return api.post('/uploads/resource', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

const forum = {
    getCategories: () => api.get('/forum/categories'), // Request goes to baseURL + '/forum/categories'
    getTopicsByCategory: (categoryId, params) => api.get(`/forum/categories/${categoryId}/topics`, { params }),
    getTopicById: (topicId) => api.get(`/forum/topics/${topicId}`),
    createTopic: (data) => api.post('/forum/topics', data),
    deleteTopic: (topicId) => api.delete(`/forum/topics/${topicId}`),
    addReply: (topicId, data) => api.post(`/forum/topics/${topicId}/replies`, data),
    voteReply: (replyId, voteType) => api.post(`/forum/replies/${replyId}/vote`, { vote: voteType }),
    markBestAnswer: (replyId) => api.patch(`/forum/replies/${replyId}/best`),
    createCategory: (data) => api.post('/forum/categories', data),
    updateCategory: (id, data) => api.patch(`/forum/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/forum/categories/${id}`),
};

const rewards = {
    getAll: (params) => api.get('/rewards', { params }),
    getById: (id) => api.get(`/rewards/${id}`),
    redeem: (id) => api.post(`/rewards/${id}/redeem`),
    create: (data) => api.post('/rewards', data),
    update: (id, data) => api.patch(`/rewards/${id}`, data),
    delete: (id) => api.delete(`/rewards/${id}`),
    getUserRewards: (userId) => api.get(`/users/${userId}/rewards`),
};

// Export all API services grouped together
export default {
  auth,
  subjects,
  resources,
  quizzes,
  users,
  uploads,
  forum,
  rewards
};