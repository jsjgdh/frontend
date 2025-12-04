import api from './api'

/**
 * Check backend health and connectivity
 * @returns {Promise<Object>} Health check response
 */
export async function checkBackendHealth() {
    try {
        const response = await api.get('/health')
        console.log('✓ Backend health check passed:', response.data)
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('✗ Backend health check failed:', error.message)
        return {
            success: false,
            error: error.message,
            details: error.response?.data
        }
    }
}

/**
 * Check API health (authenticated endpoint)
 * @returns {Promise<Object>} API health check response
 */
export async function checkAPIHealth() {
    try {
        const response = await api.get('/api/health')
        console.log('✓ API health check passed:', response.data)
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('✗ API health check failed:', error.message)
        return {
            success: false,
            error: error.message,
            details: error.response?.data
        }
    }
}

/**
 * Verify backend connectivity on app initialization
 * @returns {Promise<boolean>} True if backend is reachable
 */
export async function verifyBackendConnection() {
    const result = await checkBackendHealth()

    if (result.success) {
        console.log('Backend connection verified successfully')
        console.log('- Environment:', result.data.env)
        console.log('- CORS Origins:', result.data.cors_allowed_origins)
        console.log('- Database:', result.data.database)
        return true
    } else {
        console.error('Failed to connect to backend')
        console.error('Please ensure the backend server is running')
        return false
    }
}
