import api from "./auth"

export const getAllComplaintsApi = () => {
  return api
    .get("/all/complain")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch complaints",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching complaints"]
      }
    })
}

export const updateComplaintStatusApi = (complaintId, data) => {
  return api
    .put(`/change-complaint-status/${complaintId}`, data)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to update complaint status",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating complaint status"]
      }
    })
}
