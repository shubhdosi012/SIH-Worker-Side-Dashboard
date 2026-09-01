import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sevasangam_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not on login/register page, optionally clean up
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        localStorage.getItem('sevasangam_token')
      ) {
        localStorage.removeItem('sevasangam_token');
        localStorage.removeItem('sevasangam_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
