import React, {  useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Modal from "../ui/Modal"
import { ActionsRow, Input, Label, Radio } from "../ui/Fields"
import deleteIcon from "/images/delete.png"
import editIcon from "/images/edit.png"

import blockIcon from "/images/block.png"
import noImage from "/images/noImage.png"




const validationSchema = Yup.object({
  phone: Yup.string().required("Phone is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").notRequired(),
  password: Yup.string()
    .min(8, "Password must be at least 6 characters")
    .when("isEdit", {
      is: false,
      then: (schema) => schema.required("Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  passwordConfirmation: Yup.string().when("isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Re-enter password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),
  gender: Yup.string().oneOf(["male", "female"]).notRequired(),
  district: Yup.string().notRequired(),
  sub_district: Yup.string().notRequired(),
  address: Yup.string().notRequired(),
  dob: Yup.string().notRequired(),
  avatar: Yup.mixed()
    .nullable()
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true
      return value && value.type && value.type.startsWith("image/")
    }),
})
export default function GetterModal({
  open,
  onClose,
  initial = null,
  getterRole,
  onSubmit,
  onEdit,
}) {
  const isEdit = Boolean(initial?.id)

  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    if (initial?.customer_profile?.avatar) {
      setAvatarPreview(initial?.customer_profile?.avatar)
    } else {
      setAvatarPreview(null)
    }
  }, [initial])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone: initial?.phone || "",
      name: initial?.name || "",
      email: initial?.email || "",
      password: "",
      passwordConfirmation: "",
      gender: initial?.customer_profile?.gender || "male",
      district: initial?.customer_profile?.district || "",
      sub_district: initial?.customer_profile?.sub_district || "",
      address: initial?.customer_profile?.address || "",
      dob: initial?.customer_profile?.dob || "",
      avatar: null,
      isEdit,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values)
      //   Prepare FormData for file upload
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key === "avatar") {
          if (value != null) {
            formData.append("avatar", value)
          }
        } else if (!isEdit && key !== "isEdit" && key !== "passwordConfirmation") {
          formData.append(key, value)
        } else if (isEdit && key !== "isEdit" && key !== "password" && key !== "passwordConfirmation") {
          formData.append(key, value)
        }
      })
      if (!isEdit) {
      formData.append("role", getterRole)
      await onSubmit?.(formData)
      } else {
        formData.append("_method", "PUT")
        await onEdit?.(initial?.unique_user_id, formData)
      }
      setSubmitting(false)
      onClose?.()
    },
  })

  // Avatar preview handler
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

  const Error = ({ name }) =>
    formik.touched[name] && formik.errors[name] ? (
      <div className="mt-1 text-xs text-rose-600">{formik.errors[name]}</div>
    ) : null

  console.log(initial)
  console.log(avatarPreview)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Service Getter Details" : "Add Service Getter"}
      widthClass="max-w-xl"
    >
      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-4">
        {isEdit && (
          <div className="flex items-center flex-col gap-6 mt-6 mb-6">
            <div>
              <img
                src={initial?.customer_profile?.avatar || noImage}
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
        <div>
          <Label>Name</Label>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Name"
          />
          <Error name="name" />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email"
          />
          <Error name="email" />
        </div>

        <div>
          <Label>Gender</Label>
          <div className="flex items-center gap-6">
            <Radio
              name="gender"
              checked={formik.values.gender === "male"}
              label="Male"
              onChange={() => formik.setFieldValue("gender", "male")}
            />
            <Radio
              name="gender"
              checked={formik.values.gender === "female"}
              label="Female"
              onChange={() => formik.setFieldValue("gender", "female")}
            />
          </div>
          <Error name="gender" />
        </div>

        <div>
          <Label>Address</Label>
          <Input
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Address"
          />
          <Error name="address" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>District</Label>
            <Input
              name="district"
              value={formik.values.district}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter District"
            />
            <Error name="district" />
          </div>
          <div>
            <Label>Sub District</Label>
            <Input
              name="sub_district"
              value={formik.values.sub_district}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Sub District"
            />
            <Error name="sub_district" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Number"
            />
            <Error name="phone" />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              name="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <Error name="dob" />
          </div>
        </div>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password"
              />
              <Error name="password" />
            </div>
            <div>
              <Label>Re-Enter Password</Label>
              <Input
                type="password"
                name="passwordConfirmation"
                value={formik.values.passwordConfirmation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password"
              />
              <Error name="passwordConfirmation" />
            </div>
          </div>
        )}
        {!isEdit && (
          <div>
            <Label>Avatar</Label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
            <Error name="avatar" />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="mt-2 h-20 w-20 object-cover rounded-full border"
              />
            )}
          </div>
        )}

        <ActionsRow
          onCancel={onClose}
          onSave={formik.handleSubmit}
          disabled={formik.isSubmitting}
        />
      </form>
    </Modal>
  )
}
