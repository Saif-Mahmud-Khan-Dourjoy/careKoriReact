import config from "../../config"

import axios from "axios"
const api = axios.create({
  baseURL: config?.backendUrl,
  // withCredentials: true, // enable only if you need cookies
})

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
