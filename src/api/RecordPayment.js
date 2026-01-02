import api from "./auth"

export const recordPayment = (formData) => {
  return api
    .post("/payment-records", formData, {
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


export const lastHistory = (user) => {
  return api
    .get(`/payment-records/last/${user}`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch last history",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching last history"]
      }
    })
}


export const paymentSummary = () => {
  return api
    .get(`/providers/payment-summary`)
    .then((res) => [true, res?.data])
    .catch((error) => {
      if (error.response) {
        return [
          false,
          error.response.data?.message || "Failed to fetch last history",
        ]
      } else if (error.request) {
        return [false, "No response from server"]
      } else {
        return [false, error.message || "Error fetching last history"]
      }
    })
}



export const updatePaymentRecord = (paymentRecordId, data) => {
  return api
    .put(`/payment-records/${paymentRecordId}`, data)
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



