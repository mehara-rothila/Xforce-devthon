// /app/utils/api.js
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
    // Add token to headers for requests that need authentication
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // Define public auth routes that should NOT receive the token
      const publicAuthRoutes = [
          '/auth/register',
          '/auth/login',
          '/auth/forgot-password',
          '/auth/reset-password'
      ];
      const isPublicAuthRoute = publicAuthRoutes.some(route => config.url?.includes(route));

      // Always add token if it exists AND it's not a public auth route
      // OR if it's a download or uploads request
      if (token && (!isPublicAuthRoute || config.url?.includes('/download') || config.url?.includes('/uploads/'))) {
         // For normal requests
         if (!(config.data instanceof FormData)) {
           config.headers.Authorization = `Bearer ${token}`;
         } 
         // For FormData requests
         else if (config.url?.includes('/uploads/')) {
           config.headers.Authorization = `Bearer ${token}`;
         }
         // For download requests
         else if (config.responseType === 'blob') {
           config.headers.Authorization = `Bearer ${token}`;
         }
      }
    }
    return config;
  },
  error => Promise.reject(error)
);


api.interceptors.response.use(
  response => response,
  async error => {
    // Special handling for blob responses with errors
    if (error.response && error.response.data instanceof Blob && error.response.data.type === 'application/json') {
      // Convert blob to text to read the error message
      const text = await new Response(error.response.data).text();
      try {
        const json = JSON.parse(text);
        error.response.data = json;
      } catch (e) {
        console.error('Error parsing blob error response', e);
      }
    }
    
    // Handle unauthorized errors (e.g., invalid token)
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      // Define public auth routes where a 401 might be expected (e.g., wrong password) and shouldn't cause a redirect
       const publicAuthRoutes = [
          '/auth/register', // A 401/400 might mean user exists
          '/auth/login', // 401 means wrong credentials
          '/auth/forgot-password', // Shouldn't typically return 401, maybe 404 or 200
          '/auth/reset-password' // 401/400 might mean invalid/expired OTP
      ];
       // Check if the request URL that failed includes any of the public auth routes
      const isPublicAuthRoute = publicAuthRoutes.some(route => error.config.url?.includes(route));

      // Only redirect if it's NOT a public auth route failure
      if (!isPublicAuthRoute) {
          console.error('Unauthorized request (401) - Redirecting to login');
          localStorage.removeItem('token');
          // Optionally clear other user state here (e.g., from context/zustand)
          window.location.href = '/login'; // Force redirect
      }
    }
    // Important: reject the promise so consuming code (.catch block) can handle the error
    return Promise.reject(error);
  }
);


// --- Group API functions ---

const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me')
};

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
  submitAttempt: (id, answers, timeTaken) => api.post(`/quizzes/${id}/attempts`, { answers, timeTaken }),
  getUserAttempts: (userId, params) => api.get(`/quizzes/user/${userId}/attempts`, { params }),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.patch(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  rate: (quizId, data) => api.post(`/quizzes/${quizId}/rate`, data),
  getAttemptById: (attemptId) => api.get(`/quizzes/attempts/${attemptId}`)
};

const users = {
  getDashboardSummary: (userId) => api.get(`/users/${userId}/dashboard-summary`),
  getDetailedProgress: (userId, subjectId) => api.get(`/users/${userId}/progress/${subjectId}`),
  getAchievements: (userId) => api.get(`/users/${userId}/achievements`),
  getRecentActivity: (userId) => api.get(`/users/${userId}/activity`),
  getLeaderboard: () => api.get('/users/leaderboard'),
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  updateUserProfile: (userId, data) => api.patch(`/users/${userId}`, data),
  getUserProgress: (userId) => api.get(`/users/${userId}/progress`)
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
    // General forum endpoints
    getCategories: () => api.get('/forum/categories'),
    getTopicsByCategory: (categoryId, params) => api.get(`/forum/categories/${categoryId}/topics`, { params }),
    getTopicById: (topicId) => api.get(`/forum/topics/${topicId}`),
    createTopic: (data) => api.post('/forum/topics', data),
    deleteTopic: (topicId) => api.delete(`/forum/topics/${topicId}`),
    addReply: (topicId, data) => api.post(`/forum/topics/${topicId}/replies`, data),
    voteReply: (replyId, voteType) => api.post(`/forum/replies/${replyId}/vote`, { vote: voteType }),
    markBestAnswer: (replyId) => api.patch(`/forum/replies/${replyId}/best`),
    
    // Category management endpoints
    createCategory: (data) => api.post('/forum/categories', data),
    updateCategory: (id, data) => api.patch(`/forum/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/forum/categories/${id}`),
    
    // Moderation endpoints - UPDATED to match backend routes
    getPendingTopics: (params) => api.get('/forum/moderation/pending-topics', { params }),
    getPendingReplies: (params) => api.get('/forum/moderation/pending-replies', { params }),
    approveTopic: (id) => api.patch(`/forum/moderation/topics/${id}/approve`),
    rejectTopic: (id, reason) => api.delete(`/forum/moderation/topics/${id}/reject`, { 
        data: { reason } 
    }),
    approveReply: (id) => api.patch(`/forum/moderation/replies/${id}/approve`),
    rejectReply: (id, reason) => api.delete(`/forum/moderation/replies/${id}/reject`, { 
        data: { reason } 
    })
};

const rewards = {
    getAll: (params) => api.get('/rewards', { params }),
    getById: (id) => api.get(`/rewards/${id}`),
    redeem: (id) => api.post(`/rewards/${id}/redeem`),
    create: (data) => api.post('/rewards', data),
    update: (id, data) => api.patch(`/rewards/${id}`, data),
    delete: (id) => api.delete(`/rewards/${id}`),
    getUserRewards: (userId) => api.get(`/users/${userId}/rewards`)
};

const achievements = {
    getAll: () => api.get('/achievements'),
    create: (data) => api.post('/achievements', data),
    update: (id, data) => api.patch(`/achievements/${id}`, data),
    delete: (id) => api.delete(`/achievements/${id}`)
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
  rewards,
  achievements
};