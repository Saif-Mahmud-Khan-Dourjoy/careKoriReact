import api from "./auth"

export const getCategories = () => {
  return api
    .get("/provider-categories")
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

export const getSubCategories = () => {
  return api
    .get("/provider-subcategories")
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


export const createCategory = (payload) => {
  return api
    .post("/create-roles", payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create category",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating category"]
      }
    })
}

export const updateCategory = (payload,roleId) => {
  return api
    .post(`/update-role/${roleId}`, payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create category",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating category"]
      }
    })
}



export const createDoctorSubCategory = (payload) => {
  return api
    .post("/doctor-specialities", payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create subcategory",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating subcategory"]
      }
    })
}

export const createLawyerSubCategory = (payload) => {
  return api
    .post("/lawyer-specialities", payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create subcategory",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating subcategory"]
      }
    })
}

export const createCommonSubCategory = (payload) => {
  return api
    .post("/create-common-provider-speciality", payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create subcategory",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating subcategory"]
      }
    })
}

export const updateDoctorSubCategory = (id, payload) => {
  return api
    .post(`/update/doctor-specialities/${id}`, payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create subcategory",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating subcategory"]
      }
    })
}

export const updateLawyerSubCategory = (id, payload) => {
  return api
    .post(`/update/lawyer-specialities/${id}`, payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create subcategory",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating subcategory"]
      }
    })
}

export const updateCommonSubCategory = (id, payload) => {
  return api
    .post(`/update/common-provider-specialities/${id}`, payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to create subcategory",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating subcategory"]
      }
    })
}

export const deleteCategory = (id) => {
  return api
    .delete(`/delete-role/${id}`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to delete category",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error deleting category"]
      }
    })
}

export const deleteDocSubCat = (id) => {
  return api
    .delete(`/doctor-specialities/${id}`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message ||
            error?.response?.data?.details ||
            "Failed to delete subcategory",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error deleting subcategory"]
      }
    })
  }

  export const deleteLawyerSubCat = (id) => {
    return api
      .delete(`/lawyer-specialities/${id}`)
      .then((res) => [true, res?.data])
      .catch((error) => {
        if (error.response) {
          return [
            false,
            error.response.data?.message ||
              error?.response?.data?.details ||
              "Failed to delete subcategory",
          ]
        } else if (error.request) {
          return [false, "No response from server"]
        } else {
          return [false, error.message || "Error deleting subcategory"]
        }
      })
  }


  export const deleteComSubCat = (id) => {
    return api
      .delete(`/common-provider-specialities/${id}`)
      .then((res) => [true, res?.data])
      .catch((error) => {
        if (error.response) {
          return [
            false,
            error.response.data?.message ||
              error?.response?.data?.details ||
              "Failed to delete subcategory",
          ]
        } else if (error.request) {
          return [false, "No response from server"]
        } else {
          return [false, error.message || "Error deleting subcategory"]
        }
      })
  }

