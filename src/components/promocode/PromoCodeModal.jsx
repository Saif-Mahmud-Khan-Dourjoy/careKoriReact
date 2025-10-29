

import Modal from "../../components/ui/Modal"
import { Input, Label, Radio } from "../../components/ui/Fields"
import { useFormik } from "formik"
import * as Yup from "yup"
import { use, useEffect, useMemo, useState } from "react"
import Select from "react-select" // react-select




function toMysqlDatetime(dtLocal) {
  if (!dtLocal) return ""
  const d = new Date(dtLocal)
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/* ---- validation ---- */

/**
 * Props:
 * - open, onClose
 * - initial (optional) -> if present, treated as "edit" (assignment only if no update endpoint)
 * - onCreate: async (payloadStore) => createdPromocode | { id, ... }
 * - onAssign: async (payloadAssign) => void
 */
export default function PromoCodeUpsertModal({
  open,
  onClose,
  initial,
  onSubmit,
  roleOptions,
  providerRoleOptions,
  userOptions,
  providerRolesSpecialityOptions,
}) {
  const isEdit = Boolean(initial?.id)

  // which assignment mode to show
  // "users" | "roles" | "role-specialities"
  const [assignType, setAssignType] = useState("users")

  // react-select options derived from static
  const roleOption = roleOptions
  const userOption = userOptions

  // react-select controlled state for role(single) -> specialities
  // const [roleSingle, setRoleSingle] = useState(null)

  // ---------- validation ----------
  const schema = Yup.object({
    code: Yup.string().required("Required"),
    discount: Yup.number().typeError("Must be a number").required("Required"),
    discount_type: Yup.string()
      .oneOf(["amount", "percent"])
      .required("Required"),
    valid_from: Yup.string().required("Required"),
    valid_to: Yup.string().required("Required"),
    is_active: Yup.boolean().nullable(),

    // For selects we’ll rely on UI and build payload; Yup left relaxed
    users_multi:
      assignType === "users"
        ? Yup.array().required("Required")
        : Yup.array().notRequired(),
    roles_multi:
      assignType === "roles"
        ? Yup.array().required("Required")
        : Yup.array().notRequired(),
    specs_multi:
      assignType === "role-specialities"
        ? Yup.array().required("Required")
        : Yup.array().notRequired(),
    role_single:
      assignType === "role-specialities"
        ? Yup.number().required("Required")
        : Yup.number().notRequired(),
  })

  const f = useFormik({
    enableReinitialize: true,
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      code: initial?.code || "",
      discount: initial?.discount ?? "",
      discount_type: initial?.discount_type || "percent",
      valid_from: initial?.valid_from ? initial.valid_from : "",
      valid_to: initial?.valid_to ? initial.valid_to : "",
      is_active: initial?.is_active ?? true,

      users_multi: initial?.users_multi || [],
      roles_multi: initial?.roles_multi || [],
      specs_multi: initial?.specs_multi || [], // will depend on roleSingle
      role_single: initial?.role_single || null,
    },
    onSubmit: async (vals, { setSubmitting, setStatus }) => {
      console.log("Form values on submit:", vals)
      setStatus(null)
      try {
        const payload = {
          // promo core
          ...(isEdit ? { id: initial.id } : {}),
          code: vals.code,
          discount: vals.discount !== "" ? Number(vals.discount) : undefined,
          discount_type: vals.discount_type,
          valid_from: vals.valid_from ? toMysqlDatetime(vals.valid_from) : null,
          valid_to: vals.valid_to ? toMysqlDatetime(vals.valid_to) : null,
          is_active: !!vals.is_active,

          user_id: vals.users_multi || [],
          role_id: vals?.specs_multi ? vals.role_single : vals.roles_multi,
          speciality_id: vals.specs_multi || [],
        }

      await onSubmit?.(payload)
        onClose?.()
        console.log("Prepared payload for submission:", payload)
      } catch (e) {
        setStatus(e?.message || "Something went wrong")
      } finally {
        setSubmitting(false)
      }
    },
  })

  const specialityOptions = useMemo(() => {
    const rid = f?.values.role_single
    return rid ? providerRolesSpecialityOptions[rid] || [] : []
  }, [f?.values.role_single, providerRolesSpecialityOptions])

  // sync initial role-specialities on opening (if editing with some defaults)
  useEffect(() => {
    if (!open) return
    // reset on open to a clean state; adapt if you want to prefill
    if (!isEdit) {
      setAssignType("users")
      // setRoleSingle(null)

      f.setFieldValue("role_single", null)
    }
  }, [open])

  useEffect(() => {
    if (isEdit) {
      setAssignType(initial?.assignType || "users")
    }
  }, [isEdit, initial])

  const Error = ({ name }) =>
    f.touched[name] && f.errors[name] ? (
      <div className="mt-1 text-xs text-rose-600">{f.errors[name]}</div>
    ) : null

  console.log("initial values", assignType)
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Save / Assign Promocode" : "Create / Assign Promocode"}
      widthClass="max-w-3xl"
    >
      <form onSubmit={f.handleSubmit} className="grid grid-cols-1 gap-6">
        {/* ===== Promocode fields ===== */}
        <div className="text-center text-sm font-medium text-slate-600">
          Promocode
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Code</Label>
            <Input
              placeholder="Unique code"
              {...f.getFieldProps("code")}
              disabled={isEdit}
            />
            <Error name="code" />
          </div>

          <div>
            <Label>Discount Type</Label>
            <div className="flex items-center gap-6 pt-2">
              <Radio
                name="discount_type"
                label="Percent (%)"
                checked={f.values.discount_type === "percent"}
                onChange={() => f.setFieldValue("discount_type", "percent")}
                // disabled={isEdit}
              />
              <Radio
                name="discount_type"
                label="Amount (Tk)"
                checked={f.values.discount_type === "amount"}
                onChange={() => f.setFieldValue("discount_type", "amount")}
                // disabled={isEdit}
              />
            </div>
            <Error name="discount_type" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>
              Discount ({f.values.discount_type === "percent" ? "%" : "Tk"})
            </Label>
            <Input
              placeholder={
                f.values.discount_type === "percent" ? "e.g. 10" : "e.g. 200"
              }
              {...f.getFieldProps("discount")}
              // disabled={isEdit}
            />
            <Error name="discount" />
          </div>

          <div>
            <Label>Valid From</Label>
            <Input
              type="datetime-local"
              {...f.getFieldProps("valid_from")}
              // disabled={isEdit}
            />
            <Error name="valid_from" />
          </div>
          <div>
            <Label>Valid To</Label>
            <Input
              type="datetime-local"
              {...f.getFieldProps("valid_to")}
              // disabled={isEdit}
            />
            <Error name="valid_to" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="is_active"
            type="checkbox"
            checked={!!f.values.is_active}
            onChange={(e) => f.setFieldValue("is_active", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
            // disabled={isEdit}
          />
          <label htmlFor="is_active" className="text-sm text-slate-700">
            Active
          </label>
        </div>

        {/* ===== Assignment with radio to choose what to show ===== */}
        <div className="text-center text-sm font-medium text-slate-600">
          Assignment
        </div>

        <div className="flex flex-wrap gap-6">
          <Radio
            name="assignType"
            label="Users"
            checked={assignType === "users"}
            onChange={() => setAssignType("users")}
          />
          <Radio
            name="assignType"
            label="Roles"
            checked={assignType === "roles"}
            onChange={() => setAssignType("roles")}
          />
          <Radio
            name="assignType"
            label="Role + Specialities"
            checked={assignType === "role-specialities"}
            onChange={() => setAssignType("role-specialities")}
          />
        </div>

        {assignType === "users" && (
          <div>
            <Label>Users (multi)</Label>
            <Select
              isMulti
              options={userOption}
              value={userOption.filter((o) =>
                f.values.users_multi.includes(o.value)
              )}
              onChange={(newValue) => {
                const values = (newValue ?? []).map((o) => o.value)
                f.setFieldValue("users_multi", values)
                f.setFieldValue("roles_multi", [])
                f.setFieldValue("role_single", null)
                f.setFieldValue("specs_multi", [])
              }}
              classNamePrefix="rs"
              placeholder="Select users…"
            />

            <Error name="users_multi" />
          </div>
        )}

        {assignType === "roles" && (
          <div>
            <Label>Roles (multi)</Label>
            <Select
              isMulti
              options={roleOption}
              value={roleOption.filter((o) =>
                f.values.roles_multi.includes(o.value)
              )}
              onChange={(newValue) => {
                const values = (newValue ?? []).map((o) => o.value)
                f.setFieldValue("roles_multi", values)
                f.setFieldValue("users_multi", [])
                f.setFieldValue("role_single", null)
                f.setFieldValue("specs_multi", [])
              }}
              classNamePrefix="rs"
              placeholder="Select roles…"
            />
            <Error name="roles_multi" />

          </div>
        )}

        {assignType === "role-specialities" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Role (single)</Label>
              <Select
                options={providerRoleOptions}
                
                value={providerRoleOptions?.filter(
                  (item) => item.value === f.values.role_single
                )}
                onChange={(e) => {
                  f.setFieldValue("role_single", e?.value)
                  f.setFieldValue("specs_multi", [])
                  f.setFieldValue("users_multi", [])
                  f.setFieldValue("roles_multi", [])
                }}
                classNamePrefix="rs"
                placeholder="Select role…"
              />
              <Error name="role_single" />
            </div>

            <div>
              <Label>Specialities (multi)</Label>
              <Select
                isMulti
                options={specialityOptions}
                value={specialityOptions.filter((o) =>
                  f.values.specs_multi.includes(o.value)
                )}
                onChange={(newValue) => {
                  const values = (newValue ?? []).map((o) => o.value)
                  f.setFieldValue("specs_multi", values)
                  f.setFieldValue("users_multi", [])
                  f.setFieldValue("roles_multi", [])
                  
                }}
                classNamePrefix="rs"
                isDisabled={!f.values.role_single}
                placeholder={
                  f.values.role_single
                    ? "Select specialities…"
                    : "Select role first"
                }
              />
              <Error name="specs_multi" />
            </div>
          </div>
        )}

        {/* status */}
        {f.status && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {f.status}
          </div>
        )}

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={f.isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {f.isSubmitting ? "Saving..." : isEdit ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
