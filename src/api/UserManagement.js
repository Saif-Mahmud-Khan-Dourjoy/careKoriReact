import api from "./auth"

export const getAllGettersApi = () => {
  return api
    .get("/all-getters")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch getters",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching getters"]
      }
    })
}

export const addApi = (formData) => {
  return api
    .post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        console.log('from',error.response)
        return [false, error.response.data?.details || "Failed to add data"]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error adding data"]
      }
    })
}

export const deleteGetterApi = (uniqueUserId) => {
  return api
    .delete(`/customer/${uniqueUserId}`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to delete getter",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error deleting getter"]
      }
    })
}

export const updateGetterApi = (uniqueUserId, formData) => {
  return api
    .post(`/customer/${uniqueUserId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.details || "Failed to update getter",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating getter"]
      }
    })
}







export const getAllModeratorsApi = () => {
  return api
    .get("/all-moderators")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch moderators",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching moderators"]
      }
    })
}

export const createModeratorApi = (formData) => {
  return api
    .post("/create-moderator", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to add moderator",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error adding moderator"]
      }
    })
}

export const deleteModeratorApi = (uniqueUserId) => {
  return api
    .delete(`/delete-moderator/${uniqueUserId}`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to delete moderator",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error deleting moderator"]
      }
    })
}

export const updateModeratorApi = (uniqueUserId, formData) => {
  return api
    .post(`/update-moderator/${uniqueUserId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.details || "Failed to update moderator",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating moderator"]
      }
    })
}

export const getAllProvidersApi = () => {
  return api
    .get("/all-providers")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch providers",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching providers"]
      }
    })
}

export const getProviderRolesApi = () => {
  return api
    .get("/provider-roles")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch provider roles",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching provider roles"]
      }
    })
}

export const updateDoctorApi = (uniqueUserId, formData) => {
  return api
    .post(`/update/doctor/${uniqueUserId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.details || "Failed to update doctor",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating doctor"]
      }
    })
}

export const updateLawyerApi = (uniqueUserId, formData) => {
  return api
    .post(`/update/lawyer/${uniqueUserId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.details || "Failed to update lawyer",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating lawyer"]
      }
    })
}

export const updateCommonApi = (uniqueUserId, formData) => {
  return api
    .post(`/update/common/${uniqueUserId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.details || "Failed to update common",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating common"]
      }
    })
}





