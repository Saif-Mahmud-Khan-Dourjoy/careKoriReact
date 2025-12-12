/* eslint-disable */
import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"

import Modal from "../../components/ui/Modal"
import { Input, Label } from "../../components/ui/Fields"
import IconUploadSelector from "./IconUploadSelector" 


const schema = Yup.object({
  name: Yup.string().trim().required("Category name is required"),
  iconFile: Yup.mixed().when("isEdit", {
    is: false,
    then: (s) => s.required("Category icon is required"),
    otherwise: (s) => s.notRequired(),
  }),
})

export default function CategoryModal({ open, onClose, initial, onSubmit }) {
  const isEdit = Boolean(initial?.id)

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: schema,
    initialValues: {
      name: initial?.name || "",
      // this will hold File from IconUploadSelector
      iconFile: null,
      isEdit,
    },
    onSubmit: async (values, { setSubmitting }) => {
      
      try {
      
        const fd = new FormData()
        fd.append("name", values.name)
        if (values.iconFile) fd.append("icon", values.iconFile)
        await onSubmit?.(fd, isEdit ? initial.id : undefined)

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
    handleBlur
  } = formik

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "Add New Category"}
      widthClass="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Category name */}
        <div>
          <Label>Category Name</Label>
          <Input
            placeholder="Enter category name"
            name="name"
            className={touched.name && errors.name ? 'border-rose-600' : ''}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name && (
            <div className="mt-1 text-xs text-rose-600">{errors.name}</div>
          )}
        </div>

        {/* Icon upload / preset selector */}
        <div>
          <Label>Category Icon</Label>
          <IconUploadSelector
            touch={touched.iconFile}
            error={errors.iconFile}
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
            {isEdit ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
