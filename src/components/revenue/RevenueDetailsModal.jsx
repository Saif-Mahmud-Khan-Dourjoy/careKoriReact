import Modal from "../../components/ui/Modal"
import { Input, Label, Radio } from "../../components/ui/Fields"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function RevenueDetailsModal({ open, onClose, data, onEdit }) {
  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || "",
      uid: data?.uid || "",
      phone: data?.phone || "",
      occupation: data?.occupation || "",
      department: data?.department || "",
      totalIncome: data?.totalIncome || "",
      amountDue: data?.amountDue || "",
      amountReceived: data?.amountReceived || "",
      trxDateTime: data?.trxDateTime || "",
      lastTrxId: data?.lastTrxId || "",
      receivedDateTime: data?.receivedDateTime || "",

      sentAmount: data?.sentAmount || "",
      sentDateTime: data?.sentDateTime || "",
      sentVia: data?.sentVia || "Bkash",
      refNo: data?.refNo || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      uid: Yup.string().required(),
      phone: Yup.string().required(),
      occupation: Yup.string().required(),
      department: Yup.string().required(),
      totalIncome: Yup.string().required(),
      amountDue: Yup.string().required(),
      amountReceived: Yup.string().required(),
      trxDateTime: Yup.string().required(),
      sentAmount: Yup.string().required(),
      sentDateTime: Yup.string().required(),
      sentVia: Yup.string().oneOf(["Bank", "Bkash"]).required(),
      refNo: Yup.string().required(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      await onEdit?.(values)
      setSubmitting(false)
      onClose?.()
    },
  })

  const Read = (name, label) => (
    <div>
      <Label>{label}</Label>
      <Input readOnly {...f.getFieldProps(name)} />
    </div>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Revenue & Transaction Details"
      widthClass="max-w-xl"
    >
      <form onSubmit={f.handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="text-center text-sm font-medium text-slate-600">
          Receiver Details
        </div>

        {Read("name", "Name")}
        {Read("uid", "ID")}
        {Read("phone", "Phone")}
        {Read("occupation", "Occupation")}
        {Read("department", "Department")}
        {Read("totalIncome", "Total Income")}
        {Read("amountDue", "Amount Due")}
        {Read("amountReceived", "Amount Received")}
        {Read("trxDateTime", "Trx Date & Time")}
        {Read("lastTrxId", "Last Trx ID")}
        {Read("receivedDateTime", "Amount Received Date & Time")}

        <div className="pt-1 text-center text-sm font-medium text-slate-600">
          Super Admin Details
        </div>
        {Read("sentAmount", "Amount Sent")}
        {Read("sentDateTime", "Date & Time")}

        <div>
          <Label>Sent Via</Label>
          <div className="flex items-center gap-6 pt-2">
            <Radio
              name="sentVia"
              label="Bank"
              checked={f.values.sentVia === "Bank"}
              onChange={() => f.setFieldValue("sentVia", "Bank")}
            />
            <Radio
              name="sentVia"
              label="Bkash"
              checked={f.values.sentVia === "Bkash"}
              onChange={() => f.setFieldValue("sentVia", "Bkash")}
            />
          </div>
        </div>

        {Read("refNo", "Bkash Trx ID / Bank Account No.")}

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
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </form>
    </Modal>
  )
}
