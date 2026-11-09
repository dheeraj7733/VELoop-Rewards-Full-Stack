import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('veloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginApi = (data) => api.post('/auth/login', data);
export const registerApi = (data) => api.post('/auth/register', data);
export const getMeApi = () => api.get('/auth/me');
export const getDemoCredentialsApi = () => api.get('/auth/demo-credentials');

export const getProfileApi = () => api.get('/profile/me');
export const updateProfileApi = (data) => api.patch('/profile/me', data);
export const getRewardsApi = () => api.get('/profile/rewards');
export const getLevelProgressApi = () => api.get('/profile/level-progress');
export const getAchievementsApi = () => api.get('/profile/achievements');
export const getWithdrawalSummaryApi = () => api.get('/profile/withdrawal-summary');
export const requestWithdrawalApi = (data) => api.post('/profile/withdraw', data);
export const getReferralsApi = () => api.get('/profile/referrals');
export const getActivityApi = () => api.get('/profile/activity');

export const getAdminDashboardApi = () => api.get('/admin/dashboard');
export const getAdminUsersApi = (params) => api.get('/admin/users', { params });
export const updateAdminUserStatusApi = (id, data) => api.patch(`/admin/users/${id}/status`, data);
export const adjustAdminWalletApi = (data) => api.post('/admin/adjust-balance', data);
export const getAdminWithdrawalsApi = (params) => api.get('/admin/withdrawals', { params });
export const updateAdminWithdrawalStatusApi = (id, data) => api.patch(`/admin/withdrawals/${id}`, data);
export const getAdminAuditLogsApi = () => api.get('/admin/audit-logs');
export const resetDemoDataApi = () => api.post('/admin/reset-demo');

export default api;
