import api from "./auth"

export const getAllPromoCodeApi = () => {
  return api
    .get("/promocodes")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch promo codes",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching promo codes"]
      }
    })
}

export const getAllRolesForPromoCodeApi = () => {
  return api
    .get("/all-roles-for-promocode")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch promo codes",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching promo codes"]
      }
    })
}

export const getAllUsersApi = () => {
  return api
    .get("/all-user")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch users",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching users"]
      }
    })
}

export const getProviderRolesSpecialityApi = () => {
  return api
    .get("/provider-roles-specialities")
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [false, error.response.data?.message || "Failed to fetch provider roles and specialities"]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching provider roles and specialities"]
      }
    })
}

export const createPromoCodeApi = (payload) => {
  return api
    .post("/promocodes/store-assign", payload)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to create promo code",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error creating promo code"]
      }
    })
}

export const updatePromoCodeApi = (id, payload) => {
  return api
    .post(`/promocodes/${id}`, {...payload, _method: 'PUT'})
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to update promo code",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error updating promo code"]
      }
    })
}

export const deletePromoCodeApi = (id) => {
  return api
    .delete(`/promocodes/${id}`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to delete promo code",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error deleting promo code"]
      }
    })
}
