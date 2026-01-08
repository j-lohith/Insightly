import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isPublicRoute = window.location.pathname.startsWith('/survey/') || 
                           window.location.pathname === '/login' || 
                           window.location.pathname === '/register';
      
      if (!isPublicRoute) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
