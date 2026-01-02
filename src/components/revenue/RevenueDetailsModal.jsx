/* eslint-disable */
import Modal from "../../components/ui/Modal"
import { Input, Label, Radio } from "../../components/ui/Fields"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function RevenueDetailsModal({ open, onClose, data, onEdit }) {
  const last = data?.last_payment_record || null

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      // Receiver info (read-only)
      name: data?.name || "",
      uid: data?.unique_user_id || "",
      phone: data?.phone || "",
      occupation: data?.role
        ? data.role.slice(0, 1).toUpperCase() + data.role.slice(1)
        : "",
      department: data?.specialized_at || "",

      // Computed totals (read-only)
      total_income: data?.total_income ?? 0,
      amount_due: data?.amount_due ?? 0,
      amount_received: data?.total_received ?? data?.amount_received ?? 0,

      // Last payment record editable fields
      payment_record_id: last?.id || null, // IMPORTANT
      trx_datetime: last?.trx_datetime || "",
      trx_id: last?.trx_id || "",
      amount_received_datetime: last?.amount_received_datetime || "",

      sent_amount: last?.sent_amount || "",
      sent_datetime: last?.sent_datetime || "",
      sent_via: last?.sent_via || "MFS",
      sent_trx_id: last?.sent_trx_id || "",
      sent_bank_acc: last?.sent_bank_acc || "",
    },

    validationSchema: Yup.object({
      payment_record_id: Yup.number()
        .typeError("Invalid record")
        .required("No record found"),

      trx_datetime: Yup.string().required("Required"),
      trx_id: Yup.string().required("Required"),
      amount_received_datetime: Yup.string().required("Required"),

      sent_amount: Yup.number().typeError("Number").required("Required"),
      sent_datetime: Yup.string().required("Required"),
      sent_via: Yup.string().oneOf(["MFS", "BANK"]).required("Required"),

      sent_trx_id: Yup.string().when("sent_via", {
        is: "MFS",
        then: (s) => s.required("Bkash/MFS Trx ID is required"),
        otherwise: (s) => s.notRequired(),
      }),

      sent_bank_acc: Yup.string().when("sent_via", {
        is: "BANK",
        then: (s) => s.required("Bank account no. is required"),
        otherwise: (s) => s.notRequired(),
      }),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Build payload only for backend update
        const payload = {
          trx_datetime: values.trx_datetime,
          trx_id: values.trx_id,
          amount_received_datetime: values.amount_received_datetime,
          sent_amount: values.sent_amount,
          sent_datetime: values.sent_datetime,
          sent_via: values.sent_via,
          sent_trx_id: values.sent_via === "MFS" ? values.sent_trx_id : null,
          sent_bank_acc:
            values.sent_via === "BANK" ? values.sent_bank_acc : null,
        }

        await onEdit?.(values.payment_record_id, payload)
        setSubmitting(false)
        onClose?.()
      } catch (e) {
        setSubmitting(false)
      }
    },
  })

  const Read = (name, label) => {
    // Get the value from formik, fallback to 'N/A' if null/undefined/empty
    let value = f.values[name];
    if (value === null || value === undefined || value === "") {
      value = "N/A";
    }
    return (
      <div>
        <Label>{label}</Label>
        <Input readOnly value={value} />
      </div>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Revenue & Last Transaction Details"
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

        {Read("total_income", "Total Income")}
        {Read("amount_due", "Amount Due")}
        {Read("amount_received", "Amount Received")}

        <div className="pt-1 text-center text-sm font-medium text-slate-600">
          Last Payment Record (Editable)
        </div>

        <div>
          <Label>Trx Date & Time</Label>
          <Input type="datetime-local" {...f.getFieldProps("trx_datetime")} />
          {f.touched.trx_datetime && f.errors.trx_datetime ? (
            <p className="mt-1 text-xs text-rose-600">
              {f.errors.trx_datetime}
            </p>
          ) : null}
        </div>

        <div>
          <Label>Trx ID</Label>
          <Input {...f.getFieldProps("trx_id")} />
          {f.touched.trx_id && f.errors.trx_id ? (
            <p className="mt-1 text-xs text-rose-600">{f.errors.trx_id}</p>
          ) : null}
        </div>

        <div>
          <Label>Amount Received Date & Time</Label>
          <Input
            type="datetime-local"
            {...f.getFieldProps("amount_received_datetime")}
          />
          {f.touched.amount_received_datetime &&
          f.errors.amount_received_datetime ? (
            <p className="mt-1 text-xs text-rose-600">
              {f.errors.amount_received_datetime}
            </p>
          ) : null}
        </div>

        <div className="pt-1 text-center text-sm font-medium text-slate-600">
          Super Admin Details (Editable)
        </div>

        <div>
          <Label>Amount Sent</Label>
          <Input {...f.getFieldProps("sent_amount")} />
          {f.touched.sent_amount && f.errors.sent_amount ? (
            <p className="mt-1 text-xs text-rose-600">{f.errors.sent_amount}</p>
          ) : null}
        </div>

        <div>
          <Label>Sent Date & Time</Label>
          <Input type="datetime-local" {...f.getFieldProps("sent_datetime")} />
          {f.touched.sent_datetime && f.errors.sent_datetime ? (
            <p className="mt-1 text-xs text-rose-600">
              {f.errors.sent_datetime}
            </p>
          ) : null}
        </div>

        <div>
          <Label>Sent Via</Label>
          <div className="flex items-center gap-6 pt-2">
            <Radio
              name="sent_via"
              label="BANK"
              checked={f.values.sent_via === "BANK"}
              onChange={() => f.setFieldValue("sent_via", "BANK")}
            />
            <Radio
              name="sent_via"
              label="MFS"
              checked={f.values.sent_via === "MFS"}
              onChange={() => f.setFieldValue("sent_via", "MFS")}
            />
          </div>
        </div>

        {f.values.sent_via === "MFS" ? (
          <div>
            <Label>Bkash/MFS Trx ID</Label>
            <Input {...f.getFieldProps("sent_trx_id")} />
            {f.touched.sent_trx_id && f.errors.sent_trx_id ? (
              <p className="mt-1 text-xs text-rose-600">
                {f.errors.sent_trx_id}
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            <Label>Bank Account No.</Label>
            <Input {...f.getFieldProps("sent_bank_acc")} />
            {f.touched.sent_bank_acc && f.errors.sent_bank_acc ? (
              <p className="mt-1 text-xs text-rose-600">
                {f.errors.sent_bank_acc}
              </p>
            ) : null}
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
            {f.isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
