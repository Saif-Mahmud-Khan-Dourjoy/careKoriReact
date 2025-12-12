import React, { useEffect, useState } from "react"
import { useFormik, FieldArray, FormikProvider } from "formik"
import * as Yup from "yup"
import SelectRS from "react-select"
import Modal from "../ui/Modal"
import { ActionsRow, Input, Label, Radio } from "../ui/Fields"
import deleteIcon from "/images/delete.png"
import editIcon from "/images/edit.png"

import blockIcon from "/images/block.png"
import noImage from "/images/noImage.png"


// days array for availability options
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

// Utils & schema
const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/
const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/

const isAfterHHMM = (end, start) => {
  if (!hhmm.test(end) || !hhmm.test(start)) return false
  const [eh, em] = end.split(":").map(Number)
  const [sh, sm] = start.split(":").map(Number)
  return eh * 60 + em > sh * 60 + sm
}

function FieldError({ error, touched }) {
  if (!touched || !error) return null
  return <div className="mt-1 text-xs text-red-600">{error}</div>
}

export default function ProviderModal({
  open,
  onClose,
  initial = null,
  providerRoles,
  providerSpeciality,
  onSubmit,
  onUpdateDoctor,
  onUpdateLawyer,
  onUpdateCommon,
}) {
  const isEdit = Boolean(initial?.id)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const normalize = (v) => (v == null ? "" : String(v))
  const findIdByLabel = (label) =>
    providerRoles?.find((r) => (r.label || "").toLowerCase() === label)?.value

  const doctorId = findIdByLabel("doctor")
  const lawyerId = findIdByLabel("lawyer")

  const validationSchema = Yup.object({
    name: Yup.string().trim().required("Name is required"),
    phone: Yup.string()
      .matches(phoneRegex, "Invalid BD phone")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email").nullable(),
    dob: Yup.string().nullable(),
    gender: Yup.string().oneOf(["male", "female"]).nullable(),
    division: Yup.string().nullable(),
    district: Yup.string().nullable(),
    identification_no: Yup.string().required("Identification No is required"),
    pricing: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be ≥ 0")
      .nullable(),
    role: Yup.number().required(),

    // Password fields: required when creating, not required when editing
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .when("isEdit", {
        is: false,
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    password2: Yup.string().when("isEdit", {
      is: false,
      then: (schema) =>
        schema
          .required("Confirm password is required")
          .oneOf([Yup.ref("password"), null], "Passwords must match"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // Payment fields
    payment_type: Yup.string().oneOf(["MFS", "BANK"]).nullable(),

    payment_account_bkash: Yup.string().when("payment_type", {
      is: "MFS",
      then: (schema) =>
        schema
          .required("Bkash number required")
          .matches(phoneRegex, "Invalid Bkash number"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    payment_account_bank: Yup.string().when("payment_type", {
      is: "BANK",
      then: (schema) => schema.required("Bank A/C no. required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    bank_name: Yup.string().when("payment_type", {
      is: "BANK",
      then: (schema) => schema.required("Bank name required"),
      otherwise: (schema) => schema.nullable(),
    }),
    account_title: Yup.string().when("payment_type", {
      is: "BANK",
      then: (schema) => schema.required("Account title required"),
      otherwise: (schema) => schema.nullable(),
    }),

    // Avatar
    avatar: Yup.mixed()
      .nullable()
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) return true
        return value && value.type && value.type.startsWith("image/")
      }),

    // All other fields (role-specific, availabilities, etc.) can be nullable or as per your design
    doctor_speciality_id: Yup.number().nullable(),
    lawyer_speciality_id: Yup.number().nullable(),
    common_speciality_id: Yup.number().nullable(),
    registration_no: Yup.string().when("role", (roleVal, schema) => {
      // if roles not ready yet, don't require anything
      if (doctorId == null) return schema.notRequired().nullable()

      return normalize(roleVal) === normalize(doctorId)
        ? schema.required("Registration No is required")
        : schema.notRequired().nullable()
    }),

    bar_registration_no: Yup.string().when("role", (roleVal, schema) => {
      if (lawyerId == null) return schema.notRequired().nullable()

      return normalize(roleVal) === normalize(lawyerId)
        ? schema.required("Bar Registration No is required")
        : schema.notRequired().nullable()
    }),

    unique_identification_no: Yup.string().when("role", (roleVal, schema) => {
      // If we don't know the IDs yet, don't force a requirement
      if (doctorId == null || lawyerId == null) {
        return schema.notRequired().nullable()
      }

      const isDoctor = normalize(roleVal) === normalize(doctorId)
      const isLawyer = normalize(roleVal) === normalize(lawyerId)
      return !isDoctor && !isLawyer
        ? schema.required("Unique Identification No is required")
        : schema.notRequired().nullable()
    }),
    other_data: Yup.string().nullable(),
    practice_area: Yup.string().nullable(),

    // Availabilities
    availabilities: Yup.array()
      .of(
        Yup.object({
          availability_type: Yup.string()
            .oneOf(["appointment", "instant"])
            .required("Type required"),
          day: Yup.string().oneOf(days).required("Day required"),
          slot_duration: Yup.number()
            .typeError("Must be a number")
            .integer("Must be an integer")
            .min(5, "Min 5")
            .max(60, "Max 60")
            .nullable(),
          time_slots: Yup.array()
            .of(
              Yup.object({
                start_time: Yup.string()
                  .matches(hhmm, "Use HH:mm")
                  .required("Start time required"),
                end_time: Yup.string()
                  .matches(hhmm, "Use HH:mm")
                  .required("End time required")
                  .test("after-start", "End must be after start", function (v) {
                    const start = this.parent?.start_time
                    if (!v || !start) return false
                    return isAfterHHMM(v, start)
                  }),
              })
            )
            .min(1, "At least one slot")
            .required("Slots required"),
        })
      )
      .min(1, "At least one availability")
      .required("Availabilities required"),
  })

  useEffect(() => {
    if (initial?.profile?.avatar) {
      setAvatarPreview(initial?.profile?.avatar)
    } else {
      setAvatarPreview(null)
    }
  }, [initial])

  const formik = useFormik({
    initialValues: {
      name: initial?.name || "",
      phone: initial?.phone || "",
      role: initial?.role_id || providerRoles[0]?.value,
      email: initial?.email || "",
      password: "",
      password2: "",
      bio: initial?.profile?.bio || "",
      gender: initial?.profile?.gender || "male",
      doctor_speciality_id: initial?.profile?.doctor_speciality_id ?? "",
      lawyer_speciality_id: initial?.profile?.lawyer_speciality_id ?? "",
      common_speciality_id: initial?.profile?.common_speciality_id ?? "",
      pricing: initial?.profile?.pricing || 0,
      district: initial?.profile?.district || "",
      division: initial?.profile?.thana || "",
      dob: initial?.profile?.dob || "",
      identification_no: initial?.profile?.identification_no || "",
      registration_no:
        initial?.profile_type == "doctor"
          ? initial?.profile?.registration_no || ""
          : "",
      payment_type: initial?.profile?.payment_type || "",

      // Payment fields
      payment_account_bank: initial?.profile?.payment_account || "",
      payment_account_bkash: initial?.profile?.payment_account || "",
      account_title: initial?.profile?.account_title || "",
      bank_name: initial?.profile?.bank_name || "",

      avatar: null,
      practice_area: initial?.profile?.practice_area || "",
      bar_registration_no: initial?.profile?.bar_registration_no || "",
      unique_identification_no:
        initial?.profile?.unique_identification?.unique_identification_no || "",
      other_data: initial?.profile?.unique_identification?.other_data || "",

      // Availabilities
      availabilities: !isEdit
        ? [
            {
              availability_type: "appointment",
              day: "monday",
              // slot_duration: "",
              time_slots: [{ start_time: "09:00", end_time: "09:30" }],
            },
          ]
        : initial?.availabilities?.length > 0
        ? initial?.availabilities
        : [],
      isEdit,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData()
      // Always append payment_account with the correct value
      Object.entries(values).forEach(([key, value]) => {
        if (key === "avatar") {
          if (value != null) {
            formData.append("avatar", value)
          }
        } else if (key === "availabilities") {
          if (!Array.isArray(value)) return
          else if (value.length === 0) return
          formData.append("availabilities", JSON.stringify(value))
        } else if (key !== "payment_account_bkash" && key !== "payment_account_bank") {
          if (!isEdit && key !== "isEdit" && key !== "password2") {
            formData.append(key, value)
          } else if (
            isEdit &&
            key !== "isEdit" &&
            key !== "password" &&
            key !== "password2"
          ) {
            formData.append(key, value)
          }
        }
      })
      // Append payment_account based on payment_type
      if (values?.payment_type === "BANK") {
        formData.append("payment_account", values.payment_account_bank || "")
      } else if (values?.payment_type === "MFS") {
        formData.append("payment_account", values.payment_account_bkash || "")
      }
      if (!isEdit) {
        console.log("Form Data to submit:", formData)
        await onSubmit?.(formData)
      } else {
        formData.append("_method", "PUT")
        if (values?.role == doctorId) {
          await onUpdateDoctor?.(initial?.unique_user_id, formData)
        } else if (values?.role == lawyerId) {
          await onUpdateLawyer?.(initial?.unique_user_id, formData)
        } else if (values?.role != doctorId && values?.role != lawyerId) {
          await onUpdateCommon?.(initial?.unique_user_id, formData)
        }
      }

      onClose?.()
    },
  })

  useEffect(() => {
    setFieldValue("role", providerRoles[0]?.value)
  }, [providerRoles])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    formik.setFieldValue("avatar", file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview(null)
    }
  }

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik

  const isDoctor =
    providerRoles.filter((item) => item.value == values?.role)?.[0]?.label ===
    "doctor"
  const isLawyer =
    providerRoles.filter((item) => item.value == values?.role)?.[0]?.label ===
    "lawyer"
  const isOther =
    providerRoles.filter((item) => item.value == values?.role)?.[0]?.label !=
      "doctor" &&
    providerRoles.filter((item) => item.value == values?.role)?.[0]?.label !=
      "lawyer"

  const providerSpecialityOptions = providerSpeciality?.[values?.role] || []

 

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Service Provider details" : "Add Service Provider"}
      widthClass="max-w-5xl"
    >
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {isEdit && (
            <div className="flex items-center flex-col gap-6 mt-6 mb-6">
              <div>
                <img
                  src={initial?.profile?.avatar || noImage}
                  alt=""
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <img src={deleteIcon} alt="Delete" className="h-4 w-4" />
                <img src={editIcon} alt="Edit" className="h-4 w-4" />
                <img src={blockIcon} alt="Block" className="h-4 w-4" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />
              <FieldError error={errors.name} touched={touched.name} />
            </div>
            <div>
              <Label>Gender</Label>
              <div className="flex items-center gap-6 pt-2">
                <Radio
                  name="gender"
                  value="male"
                  checked={values.gender === "male"}
                  label="Male"
                  onChange={() => setFieldValue("gender", "male")}
                />
                <Radio
                  name="gender"
                  value="female"
                  checked={values.gender === "female"}
                  label="Female"
                  onChange={() => setFieldValue("gender", "female")}
                />
              </div>
              <FieldError error={errors.gender} touched={touched.gender} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
              />
              <FieldError error={errors.phone} touched={touched.phone} />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
              <FieldError error={errors.email} touched={touched.email} />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                value={values.dob}
                onChange={handleChange}
              />
              <FieldError error={errors.dob} touched={touched.dob} />
            </div>
          </div>
          {!isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
                <FieldError
                  error={errors.password}
                  touched={touched.password}
                />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  name="password2"
                  value={values.password2}
                  onChange={handleChange}
                />
                <FieldError
                  error={errors.password2}
                  touched={touched.password2}
                />
              </div>
            </div>
          )}

          <div>
            <Label>About Me</Label>
            <textarea
              name="bio"
              value={values.bio}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Write about yourself"
            />
            <FieldError error={errors.bio} touched={touched.bio} />
          </div>

          {/* Address & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Division</Label>
              <Input
                name="division"
                value={values.division}
                onChange={handleChange}
                placeholder="Division"
              />
              <FieldError error={errors.division} touched={touched.division} />
            </div>
            <div>
              <Label>District</Label>
              <Input
                name="district"
                value={values.district}
                onChange={handleChange}
                placeholder="District"
              />
              <FieldError error={errors.district} touched={touched.district} />
            </div>
            <div>
              <Label>Identification No.</Label>
              <Input
                name="identification_no"
                value={values.identification_no}
                onChange={handleChange}
                placeholder="NID/Passport/etc."
              />
              <FieldError
                error={errors.identification_no}
                touched={touched.identification_no}
              />
            </div>
            <div>
              <Label>Pricing (BDT)</Label>
              <Input
                name="pricing"
                value={values.pricing}
                onChange={handleChange}
                placeholder="e.g. 500"
              />
              <FieldError error={errors.pricing} touched={touched.pricing} />
            </div>
          </div>
          {!isEdit && (
            <div>
              <div>
                <Label>Avatar</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <FieldError error={errors.avatar} touched={touched.avatar} />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="mt-2 h-20 w-20 object-cover rounded-full border"
                  />
                )}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="pt-1 font-medium text-slate-700">Payment Details</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Payment Method</Label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                name="payment_type"
                value={values.payment_type}
                onChange={(e) => {
                  const v = e.target.value
                  setFieldValue("payment_type", v)
                  // clear the other group's fields when switching
                  if (v === "MFS") {
                    setFieldValue("bank_name", "")
                    setFieldValue("account_title", "")
                    setFieldValue("payment_account", "")
                  } else if (v === "BANK") {
                    setFieldValue("payment_account", "")
                  }
                }}
              >
                <option value="">Choose</option>
                <option value="MFS">Bkash</option>
                <option value="BANK">Bank</option>
              </select>
              <FieldError
                error={errors.payment_type}
                touched={touched.payment_type}
              />
            </div>

            {/* Bkash group */}
            {values.payment_type == "MFS" && (
              <>
                <div>
                  <Label>Bkash No.</Label>
                  <Input
                    name="payment_account_bkash"
                    value={values.payment_account_bkash}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                  />
                  <FieldError
                    error={errors.payment_account_bkash}
                    touched={touched.payment_account_bkash}
                  />
                </div>
              </>
            )}

            {/* Bank group */}
            {values.payment_type == "BANK" && (
              <>
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    name="bank_name"
                    value={values.bank_name}
                    onChange={handleChange}
                    placeholder="Bank Name"
                  />
                  <FieldError
                    error={errors.bank_name}
                    touched={touched.bank_name}
                  />
                </div>
                <div>
                  <Label>Account Title</Label>
                  <Input
                    name="account_title"
                    value={values.account_title}
                    onChange={handleChange}
                    placeholder="Account Title"
                  />
                  <FieldError
                    error={errors.account_title}
                    touched={touched.account_title}
                  />
                </div>
                <div>
                  <Label>Bank A/C No.</Label>
                  <Input
                    name="payment_account_bank"
                    value={values.payment_account_bank}
                    onChange={handleChange}
                    placeholder="Bank A/C No."
                  />
                  <FieldError
                    error={errors.payment_account_bank}
                    touched={touched.payment_account_bank}
                  />
                </div>
              </>
            )}
          </div>

          {/* Role selection */}
          <div className="pt-1 font-medium text-slate-700">Select Role</div>
          <div className="flex flex-wrap items-center gap-6">
            {providerRoles.map((r) => (
              <Radio
                key={r.value}
                name="role"
                value={r.value}
                checked={values.role === r.value}
                label={r.label.charAt(0).toUpperCase() + r.label.slice(1)}
                onChange={() => setFieldValue("role", r.value)}
              />
            ))}
          </div>

          {/* Specialities (react-select) */}
          {isDoctor && (
            <div>
              <Label>Doctor Speciality</Label>
              <SelectRS
                options={providerSpecialityOptions}
                value={
                  providerSpecialityOptions?.filter(
                    (item) => item.value === values.doctor_speciality_id
                  ) || null
                }
                onChange={(e) => {
                  setFieldValue("doctor_speciality_id", e?.value)
                }}
                classNamePrefix="rs"
                placeholder="Select Speciality"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
              <FieldError
                error={errors.doctor_speciality_id}
                touched={touched.doctor_speciality_id}
              />
            </div>
          )}
          {isLawyer && (
            <div>
              <Label>Lawyer Speciality</Label>
              <SelectRS
                options={providerSpecialityOptions}
                value={
                  providerSpecialityOptions?.filter(
                    (item) => item.value === values.lawyer_speciality_id
                  ) || null
                }
                onChange={(e) => {
                  setFieldValue("lawyer_speciality_id", e?.value ?? "")
                }}
                placeholder="Select Speciality"
                classNamePrefix="rs"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
              <FieldError
                error={errors.lawyer_speciality_id}
                touched={touched.lawyer_speciality_id}
              />
            </div>
          )}
          {isOther && (
            <div>
              <Label>Common Speciality</Label>
              <SelectRS
                options={providerSpecialityOptions}
                value={
                  providerSpecialityOptions?.filter(
                    (item) => item.value === values.common_speciality_id
                  ) || null
                }
                onChange={(e) => {
                  setFieldValue("common_speciality_id", e?.value ?? "")
                }}
                placeholder="Select Speciality"
                classNamePrefix="rs"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
              <FieldError
                error={errors.common_speciality_id}
                touched={touched.common_speciality_id}
              />
            </div>
          )}

          {/* Role-specific fields */}
          {isDoctor && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Registration Number</Label>
                <Input
                  name="registration_no"
                  value={values.registration_no}
                  onChange={handleChange}
                  placeholder="BMDC / relevant"
                />
                <FieldError
                  error={errors.registration_no}
                  touched={touched.registration_no}
                />
              </div>
            </div>
          )}

          {isLawyer && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Practice Area</Label>
                <Input
                  name="practice_area"
                  value={values.practice_area}
                  onChange={handleChange}
                  placeholder="e.g., Criminal, Civil"
                />
                <FieldError
                  error={errors.practice_area}
                  touched={touched.practice_area}
                />
              </div>
              <div>
                <Label>Bar Registration No.</Label>
                <Input
                  name="bar_registration_no"
                  value={values.bar_registration_no}
                  onChange={handleChange}
                  placeholder="Bar Council No."
                />
                <FieldError
                  error={errors.bar_registration_no}
                  touched={touched.bar_registration_no}
                />
              </div>
            </div>
          )}

          {isOther && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Unique Identification No.</Label>
                <Input
                  name="unique_identification_no"
                  value={values.unique_identification_no}
                  onChange={handleChange}
                  placeholder="Unique ID"
                />
                <FieldError
                  error={errors.unique_identification_no}
                  touched={touched.unique_identification_no}
                />
              </div>
              <div>
                <Label>Other Data</Label>
                <Input
                  name="other_data"
                  value={values.other_data}
                  onChange={handleChange}
                  placeholder="Any other data"
                />
                <FieldError
                  error={errors.other_data}
                  touched={touched.other_data}
                />
              </div>
            </div>
          )}

          {/* AVAILABILITIES */}
          <div className="pt-1 font-medium text-slate-700">Availabilities</div>
          <FieldArray name="availabilities">
            {({ push, remove }) => (
              <div className="space-y-4">
                {values.availabilities.map((av, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-slate-800">
                        Availability #{idx + 1}
                      </div>
                      {values.availabilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <select
                          name={`availabilities[${idx}].availability_type`}
                          value={av.availability_type}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                        >
                          <option value="appointment">appointment</option>
                          <option value="instant">instant</option>
                        </select>
                        <FieldError
                          error={
                            errors.availabilities?.[idx]?.availability_type
                          }
                          touched={
                            touched.availabilities?.[idx]?.availability_type
                          }
                        />
                      </div>

                      <div>
                        <Label>Day</Label>
                        <select
                          name={`availabilities[${idx}].day`}
                          value={av.day}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                        >
                          {days.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <FieldError
                          error={errors.availabilities?.[idx]?.day}
                          touched={touched.availabilities?.[idx]?.day}
                        />
                      </div>
                    </div>

                    {/* Time slots */}
                    <FieldArray name={`availabilities[${idx}].time_slots`}>
                      {({ push: pushSlot, remove: removeSlot }) => (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <Label>Time Slots</Label>
                            <button
                              type="button"
                              onClick={() =>
                                pushSlot({
                                  start_time: "09:00",
                                  end_time: "09:30",
                                })
                              }
                              className="text-sm text-blue-600 hover:underline"
                            >
                              + Add Slot
                            </button>
                          </div>

                          <div className="space-y-2">
                            {av.time_slots.map((ts, tIdx) => (
                              <div
                                key={tIdx}
                                className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
                              >
                                <div className="md:col-span-2">
                                  <Label>Start</Label>
                                  <Input
                                    name={`availabilities[${idx}].time_slots[${tIdx}].start_time`}
                                    value={ts.start_time}
                                    onChange={handleChange}
                                    placeholder="HH:mm"
                                  />
                                  <FieldError
                                    error={
                                      errors.availabilities?.[idx]
                                        ?.time_slots?.[tIdx]?.start_time
                                    }
                                    touched={
                                      touched.availabilities?.[idx]
                                        ?.time_slots?.[tIdx]?.start_time
                                    }
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>End</Label>
                                  <Input
                                    name={`availabilities[${idx}].time_slots[${tIdx}].end_time`}
                                    value={ts.end_time}
                                    onChange={handleChange}
                                    placeholder="HH:mm"
                                  />
                                  <FieldError
                                    error={
                                      errors.availabilities?.[idx]
                                        ?.time_slots?.[tIdx]?.end_time
                                    }
                                    touched={
                                      touched.availabilities?.[idx]
                                        ?.time_slots?.[tIdx]?.end_time
                                    }
                                  />
                                </div>
                                <div className="flex md:justify-end">
                                  {av.time_slots.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeSlot(tIdx)}
                                      className="text-xs text-red-600 hover:underline"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <FieldError
                            error={errors.availabilities?.[idx]?.time_slots}
                            touched={touched.availabilities?.[idx]?.time_slots}
                          />
                        </div>
                      )}
                    </FieldArray>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    push({
                      availability_type: "appointment",
                      day: "monday",
                      time_slots: [{ start_time: "09:00", end_time: "09:30" }],
                    })
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add Availability
                </button>

                <FieldError
                  error={errors.availabilities}
                  touched={touched.availabilities}
                />
              </div>
            )}
          </FieldArray>

          {/* Actions */}
          <ActionsRow
            onCancel={onClose}
            onSave={() => formik.submitForm()}
            saveText="Save Provider"
          />
        </form>
      </FormikProvider>
    </Modal>
  )
}
