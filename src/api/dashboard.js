import api from "./auth"

export const getUserCountApi = () => {
  return api
    .get("/user-count")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch user count",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching user count"]
      }
    })
}

export const getAppointmentCountApi = () => {
  return api
    .get("/appointment-status-count")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch appointment count",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching appointment count"]
      }
    })
}

export const getServiceSubServiceCountApi = () => {
  return api
    .get("/service-and-sub-service-count")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            "Failed to fetch service and sub-service count",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [
          false,
          error.message || "Error fetching service and sub-service count",
        ]
      }
    })
}

export const getRevenueProfitSeriesApi = (year) => {
  return api
    .get("/revenue-profit-series", { params: { year: year } })

    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            "Failed to fetch service and sub-service count",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [
          false,
          error.message || "Error fetching service and sub-service count",
        ]
      }
    })
}

export const getGettersProvidersSeriesApi = (year) => {
  return api
    .get("/getters-providers-series", { params: { year: year } })

    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            "Failed to fetch service and sub-service count",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [
          false,
          error.message || "Error fetching service and sub-service count",
        ]
      }
    })
}

export const getApproveRequestsApi = () => {
  return api
    .get("/approve-requests")

    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch approve requests",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching approve requests"]
      }
    })
}

export const approveProviderApi = (providerUniqueId) => {
  return api
    .post(`/approve-provider/${providerUniqueId}`, {
      _method: "PUT",
    })

    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to Update approve requests",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating approve requests"]
      }
    })
}

export const deleteProviderApi = (providerUniqueId) => {
  return api
    .delete(`/delete-provider/${providerUniqueId}`)

    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to delete provider",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error deleting provider"]
      }
    })
}
