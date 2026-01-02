import api from "./auth"

export const getAllBanner = () => {
  return api
    .get("/banner/all")
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

export const createBannerApi = (formData) => {
  return api
    .post("/banner/store", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        console.log("from", error.response)
        return [
          false,
          error?.response?.data?.message ||
            error.response.data?.details ||
            "Failed to add data",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error adding data"]
      }
    })
}

export const createRoleSpecificBannerApi = (roleId, formData) => {
  return api
    .post(`/role/banner/store/${roleId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        console.log("from", error.response)
        return [
          false,
          error?.response?.data?.message ||
            error.response.data?.details ||
            "Failed to add data",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error adding data"]
      }
    })
}

export const deleteBannerApi = (bannerId) => {
  return api
    .delete(`/banner/delete/${bannerId}`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to delete banner",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error deleting banner"]
      }
    })
}
