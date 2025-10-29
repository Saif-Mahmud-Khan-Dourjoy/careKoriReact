import config from "../../config"

import axios from "axios"
const api = axios.create({
  baseURL: config?.backendUrl,
  // withCredentials: true, // enable only if you need cookies
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const currentToken = localStorage.getItem("token")

      if (!currentToken) {
        processQueue(new Error("No token available"), null)
        isRefreshing = false

        // Clear storage and redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"

        return Promise.reject(error)
      }

      try {
        // Call refresh token endpoint with current token in header
        const response = await axios.post(
          `${config?.backendUrl}/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        )

        const { token: newToken } = response.data

        // Save new token
        localStorage.setItem("token", newToken)

        // Update authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        // Process all queued requests with new token
        processQueue(null, newToken)

        // Retry original request with new token
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        // Clear tokens and redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Login API (phone + password)
 * Returns [true, data] on success, [false, message] on error
 */
export const loginApi = ({ phone, password }) => {
  return api
    .post("/login", { phone, password })
    .then((res) => [true, res?.data]) // { token, user }
    .catch((error) => {
      if (error.response) {
        return [false, error.response.data?.message || "Login failed"]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Login error"]
      }
    })
}

export default api
