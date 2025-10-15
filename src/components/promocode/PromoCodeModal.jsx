import Modal from "../../components/ui/Modal"
import { Input, Label, Radio } from "../../components/ui/Fields"
import { useFormik } from "formik"
import * as Yup from "yup"

const schema = Yup.object({
  code: Yup.string().required("Promo code is required"),
  discountType: Yup.string().oneOf(["percentage", "amount"]).required(),
  amount: Yup.number()
    .typeError("Must be a number")
    .positive()
    .required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  occupation: Yup.string().nullable(),
  department: Yup.string().nullable(),
  providerName: Yup.string().nullable(),
})

export default function PromoCodeModal({ open, onClose, initial, onSubmit }) {
  const isEdit = Boolean(initial?.id)

  const f = useFormik({
    enableReinitialize: true,
    validationSchema: schema,
    initialValues: {
      code: initial?.code || "",
      discountType: initial?.discountType || "percentage", // 'percentage' | 'amount'
      amount: initial?.amount ?? "",
      startDate: initial?.startDate || "",
      endDate: initial?.endDate || "",
      occupation: initial?.occupation || "",
      department: initial?.department || "",
      providerName: initial?.providerName || "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      await onSubmit?.(values, isEdit ? initial.id : undefined)
      setSubmitting(false)
      onClose?.()
    },
  })

  const Error = ({ name }) =>
    f.touched[name] && f.errors[name] ? (
      <div className="mt-1 text-xs text-rose-600">{f.errors[name]}</div>
    ) : null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${isEdit ? "Edit" : "Create"} Promo Code`}
      widthClass="max-w-xl"
    >
      <form onSubmit={f.handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <Label>Promo Code</Label>
          <Input placeholder="Enter Code" {...f.getFieldProps("code")} />
          <Error name="code" />
        </div>

        <div>
          <Label>Discount Type (Percentage or Amount)</Label>
          <div className="flex items-center gap-6 pt-2">
            <Radio
              name="discountType"
              label="Percentage (%)"
              checked={f.values.discountType === "percentage"}
              onChange={() => f.setFieldValue("discountType", "percentage")}
            />
            <Radio
              name="discountType"
              label="Amount (Tk)"
              checked={f.values.discountType === "amount"}
              onChange={() => f.setFieldValue("discountType", "amount")}
            />
          </div>
        </div>

        <div>
          <Label>Discount Amount (% or Tk)</Label>
          <Input placeholder="% or Tk" {...f.getFieldProps("amount")} />
          <Error name="amount" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input
              placeholder="Select Date"
              {...f.getFieldProps("startDate")}
            />
            <Error name="startDate" />
          </div>
          <div>
            <Label>End Date</Label>
            <Input placeholder="Select Date" {...f.getFieldProps("endDate")} />
            <Error name="endDate" />
          </div>
        </div>

        <div>
          <Label>Occupation</Label>
          <Input placeholder="Occupation" {...f.getFieldProps("occupation")} />
        </div>

        <div>
          <Label>Department</Label>
          <Input placeholder="Department" {...f.getFieldProps("department")} />
        </div>

        <div>
          <Label>Provider Name</Label>
          <Input placeholder="Name" {...f.getFieldProps("providerName")} />
        </div>

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
            {isEdit ? "Apply" : "Apply"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
