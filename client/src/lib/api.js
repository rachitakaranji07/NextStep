import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on auth pages
      const publicPaths = ['/login', '/register', '/', '/about', '/features', '/how-it-works', '/contact']
      const currentPath = window.location.pathname
      if (!publicPaths.includes(currentPath)) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
