import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://backend-6pze.onrender.com'

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url
    const method = error.config?.method?.toUpperCase()

    // Detailed error logging
    if (error.response) {
      // Server responded with error status
      console.error(`[API Error] ${method} ${url} - Status ${status}:`, error.response.data)

      // Handle specific error cases
      if (status === 401) {
        console.warn('Authentication failed - token may be expired')
        // Clear invalid token
        localStorage.removeItem('token')
      } else if (status === 403) {
        console.warn('Access forbidden - insufficient permissions')
      } else if (status === 404) {
        console.warn('Resource not found')
      } else if (status >= 500) {
        console.error('Server error - please try again later')
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error(`[Network Error] ${method} ${url} - No response received:`, error.message)
      console.error('Please check your internet connection and that the backend is running')
    } else {
      // Error setting up the request
      console.error(`[Request Error] ${method} ${url}:`, error.message)
    }

    return Promise.reject(error)
  }
)

export default api

