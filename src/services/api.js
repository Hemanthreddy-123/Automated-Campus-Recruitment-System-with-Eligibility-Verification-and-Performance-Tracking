// src/services/api.js
// Centralised Axios-like fetch wrapper for all backend calls
// Usage: import api from '../services/api';  then  api.get('/student/profile')

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ──────────────────────────────────────────────
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getUser = () => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getRole = () => localStorage.getItem('role');
export const setRole = (role) => localStorage.setItem('role', role);

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/';
};

// ── Core fetch wrapper ──────────────────────────────────────────
async function request(method, endpoint, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body && method !== 'GET') config.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        const err = new Error(data.message || 'API request failed');
        err.status = response.status;
        err.details = data.details;
        throw err;
    }

    return data;
}

// ── HTTP method shortcuts ──────────────────────────────────────
const api = {
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, body) => request('POST', endpoint, body),
    put: (endpoint, body) => request('PUT', endpoint, body),
    delete: (endpoint) => request('DELETE', endpoint),
};

export default api;

// ══════════════════════════════════════════════════════════════
// ── Specific API functions ─────────────────────────────────────
// ══════════════════════════════════════════════════════════════

// Auth
export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);

// Student
export const getStudentProfile = () => api.get('/student/profile');
export const updateStudentProfile = (data) => api.put('/student/update', data);
export const getMyApplications = () => api.get('/student/applications');

// Drives
export const getAllDrives = () => api.get('/drives');
export const getDrives = () => api.get('/drives'); // Alias for consistency
export const getDrive = (id) => api.get(`/drives/${id}`);
export const createDrive = (data) => api.post('/drives/create', data);
export const updateDrive = (id, data) => api.put(`/drives/${id}`, data);
export const deleteDrive = (id) => api.delete(`/drives/${id}`);

// Applications
export const applyForDrive = (drive_id) => api.post('/apply', { drive_id });
export const getApplications = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/applications${qs ? '?' + qs : ''}`);
};
export const updateApplicationStatus = (id, status, notes = '') =>
    api.put(`/applications/${id}/status`, { status, officer_notes: notes });
export const getAllStudents = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/applications/all-students${qs ? '?' + qs : ''}`);
};

// Student Stats (for officer dashboard)
export const getStudentStats = () => api.get('/applications/all-students');

// Quiz
export const startQuiz = () => api.post('/quiz/start', {});
export const submitQuiz = (data) => api.post('/quiz/submit', data);
export const getQuizHistory = () => api.get('/quiz/history');

// Coding
export const startCoding = () => api.post('/coding/start', {});
export const getProblem = (id) => api.get(`/coding/problem/${id}`);
export const submitCode = (data) => api.post('/coding/submit', data);
export const getLeaderboard = () => api.get('/coding/leaderboard');
export const getCodingHistory = () => api.get('/coding/history');

// Reports
export const getAnalytics = () => api.get('/reports/analytics');
export const getPerformanceReport = () => api.get('/reports/performance');
export const getMyPerformance = () => api.get('/reports/my-performance');
