// utils/api.js
import axios from 'axios';

// Create axios instance with base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- Interceptors ---
api.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        // Add token if it exists, EXCEPT for FormData requests unless specifically needed
        // Check if the backend upload route requires authentication
        if (token && !(config.data instanceof FormData)) {
          config.headers.Authorization = `Bearer ${token}`;
        } else if (token && config.url?.includes('/uploads/') && config.data instanceof FormData) {
            // Example: If your /uploads/resource specifically needs auth even with FormData
            config.headers.Authorization = `Bearer ${token}`;
        } else if (token && config.url?.includes('/forum/')) {
             // Assuming forum actions require token
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
      console.error('Unauthorized request - Redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Group API functions ---

const subjects = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  getTopics: (id) => api.get(`/subjects/${id}/topics`),
  getProgress: (id) => api.get(`/subjects/${id}/progress`),
  getRecommendations: (id) => api.get(`/subjects/${id}/recommendations`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.patch(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`), // Soft delete
  addTopic: (id, data) => api.post(`/subjects/${id}/topics`, data),
  updateTopic: (id, topicId, data) => api.patch(`/subjects/${id}/topics/${topicId}`, data),
  deleteTopic: (id, topicId) => api.delete(`/subjects/${id}/topics/${topicId}`)
};

const resources = {
  getAll: (params) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  getBySubject: (subjectId) => api.get(`/resources/subject/${subjectId}`),
  getStudyMaterials: (subjectId) => api.get(`/resources/subject/${subjectId}/materials`),
  download: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
  getCategoryCounts: (params) => api.get('/resources/category-counts', { params }),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.patch(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`)
};

const quizzes = {
  getAll: (params) => api.get('/quizzes', { params }),
  getById: (id) => api.get(`/quizzes/${id}`),
  getBySubject: (subjectId) => api.get(`/subjects/${subjectId}/quizzes`),
  getPracticeQuizzes: (subjectId, topic) => api.get(`/quizzes/subject/${subjectId}/practice${topic ? `?topic=${topic}` : ''}`),
  submitAttempt: (id, answers) => api.post(`/quizzes/${id}/attempts`, { answers }),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.patch(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`)
};

const users = {
  getDashboardSummary: (userId) => api.get(`/users/${userId}/dashboard-summary`),
  getDetailedProgress: (userId, subjectId) => api.get(`/users/${userId}/progress/${subjectId}`),
  getAchievements: (userId) => api.get(`/users/${userId}/achievements`),
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

// --- NEW: Forum Service ---
const forum = {
    getCategories: () => api.get('/forum/categories'),
    // getCategoryById: (id) => api.get(`/forum/categories/${id}`), // Backend endpoint might not exist
    getTopicsByCategory: (categoryId, params) => api.get(`/forum/categories/${categoryId}/topics`, { params }),
    getTopicById: (topicId) => api.get(`/forum/topics/${topicId}`), // Includes replies
    createTopic: (data) => api.post('/forum/topics', data),
    deleteTopic: (topicId) => api.delete(`/forum/topics/${topicId}`), // Assumes admin has rights
    addReply: (topicId, data) => api.post(`/forum/topics/${topicId}/replies`, data),
    voteReply: (replyId, voteType) => api.post(`/forum/replies/${replyId}/vote`, { vote: voteType }),
    markBestAnswer: (replyId) => api.patch(`/forum/replies/${replyId}/best`),

    // --- Admin Functions (Backend May Be Missing!) ---
    // createCategory: (data) => api.post('/forum/categories', data), // Needs backend endpoint
    // updateCategory: (id, data) => api.patch(`/forum/categories/${id}`, data), // Needs backend endpoint
    // deleteCategory: (id) => api.delete(`/forum/categories/${id}`), // Needs backend endpoint
    // updateTopicAdmin: (id, data) => api.patch(`/forum/topics/${id}/admin`, data), // Needs backend endpoint for pin/lock etc.
};
// -------------------------


// Export all API services grouped together
export default {
  subjects,
  resources,
  quizzes,
  users,
  uploads,
  forum // <-- Export new service
};
