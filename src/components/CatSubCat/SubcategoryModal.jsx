/* eslint-disable */
import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"

import Modal from "../../components/ui/Modal"
import { Input, Label } from "../../components/ui/Fields"
import IconUploadSelector from "./IconUploadSelector" // adjust path

// parentCategories: [{ value: 1, label: "Home Services" }, ...]
const schema = Yup.object({
  name: Yup.string().trim().required("Subcategory name is required"),
  parentCategoryId: Yup.number()
    .typeError("Select parent category")
    .required("Parent category is required"),
  iconFile: Yup.mixed().when("isEdit", {
    is: false,
    then: (s) => s.required("Subcategory icon is required"),
    otherwise: (s) => s.notRequired(),
  }),
})

export default function SubcategoryModal({
  open,
  onClose,
  initial,
  onSubmit,
  providerRoles,
}) {
  const isEdit = Boolean(initial?.id)

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: schema,
    initialValues: {
      name: initial?.name || "",
      parentCategoryId: initial?.parent_category_id || "",
      type: initial?.type || "",
      iconFile: null,
      isEdit,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const fd = new FormData()
        fd.append("specialized_at", values.name)
        fd.append("category_id", values.parentCategoryId)

        if (values.iconFile) fd.append("icon", values.iconFile)
        await onSubmit?.(fd, values.type, isEdit ? initial.id : undefined)
        onClose?.()
      } finally {
        setSubmitting(false)
      }
    },
  })

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isSubmitting,
    setFieldValue,
  } = formik

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Subcategory" : "Add New Subcategory"}
      widthClass="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Subcategory name */}
        <div>
          <Label>Subcategory Name</Label>
          <Input
            placeholder="Enter subcategory name"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
          {touched.name && errors.name && (
            <div className="mt-1 text-xs text-rose-600">{errors.name}</div>
          )}
        </div>

        {/* Parent category select */}
        <div>
          <Label>Parent Category</Label>
          <select
            disabled={isEdit}
            name="parentCategoryId"
            value={values.parentCategoryId}
            onChange={(event)=> {setFieldValue("parentCategoryId", event.target.value)
              setFieldValue("type", providerRoles.find(r=>r.value.toString()===event.target.value.toString())?.label || "")
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select parent category</option>
            {providerRoles?.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label.split(" ")
                                .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1)
                                )
                                .join(" ")}
              </option>
            ))}
          </select>
          {touched.parentCategoryId && errors.parentCategoryId && (
            <div className="mt-1 text-xs text-rose-600">
              {errors.parentCategoryId}
            </div>
          )}
        </div>

        {/* Icon upload / preset selector */}
        <div>
          <Label>Subcategory Icon</Label>
          <IconUploadSelector
            initialPreview={initial?.icon || null}
            onChange={(file) => setFieldValue("iconFile", file)}
          />
          {touched.iconFile && errors.iconFile && (
            <div className="mt-1 text-xs text-rose-600">{errors.iconFile}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isEdit ? "Update Subcategory" : "Create Subcategory"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
