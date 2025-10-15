import Modal from "../../components/ui/Modal"
import { Input, Label, Radio } from "../../components/ui/Fields"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function RecordPaymentModal({ open, onClose, onSubmit }) {
  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      uid: "",
      phone: "",
      occupation: "",
      department: "",
      totalIncome: "",
      amountDue: "",
      amountReceived: "",
      trxDateTime: "",
      lastTrxId: "",
      receivedDateTime: "",
      sentAmount: "",
      sentDateTime: "",
      sentVia: "Bank",
      refNo: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      uid: Yup.string().required("Required"),
      phone: Yup.string().required("Required"),
      occupation: Yup.string().required("Required"),
      department: Yup.string().required("Required"),
      totalIncome: Yup.number().typeError("Number").required("Required"),
      amountDue: Yup.number().typeError("Number").required("Required"),
      amountReceived: Yup.number().typeError("Number").required("Required"),
      trxDateTime: Yup.string().required("Required"),
      sentAmount: Yup.number().typeError("Number").required("Required"),
      sentDateTime: Yup.string().required("Required"),
      sentVia: Yup.string().oneOf(["Bank", "Bkash"]).required(),
      refNo: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      await onSubmit?.(values)
      setSubmitting(false)
      onClose?.()
    },
  })

  const Error = ({ name }) =>
    f.touched[name] && f.errors[name] ? (
      <p className="mt-1 text-xs text-rose-600">{f.errors[name]}</p>
    ) : null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Payment Details"
      widthClass="max-w-xl"
    >
      <form onSubmit={f.handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="text-center text-sm font-medium text-slate-600">
          Receiver Details
        </div>

        <div>
          <Label>Name</Label>
          <Input {...f.getFieldProps("name")} />
          <Error name="name" />
        </div>
        <div>
          <Label>ID</Label>
          <Input {...f.getFieldProps("uid")} />
          <Error name="uid" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input {...f.getFieldProps("phone")} />
          <Error name="phone" />
        </div>
        <div>
          <Label>Occupation</Label>
          <Input {...f.getFieldProps("occupation")} />
          <Error name="occupation" />
        </div>
        <div>
          <Label>Department</Label>
          <Input {...f.getFieldProps("department")} />
          <Error name="department" />
        </div>

        <div>
          <Label>Total Income</Label>
          <Input {...f.getFieldProps("totalIncome")} />
          <Error name="totalIncome" />
        </div>
        <div>
          <Label>Amount Due</Label>
          <Input {...f.getFieldProps("amountDue")} />
          <Error name="amountDue" />
        </div>
        <div>
          <Label>Amount Received</Label>
          <Input {...f.getFieldProps("amountReceived")} />
          <Error name="amountReceived" />
        </div>

        <div>
          <Label>Trx Date & Time</Label>
          <Input
            placeholder="6th Jun 25, 15:32"
            {...f.getFieldProps("trxDateTime")}
          />
          <Error name="trxDateTime" />
        </div>
        <div>
          <Label>Last Trx ID</Label>
          <Input {...f.getFieldProps("lastTrxId")} />
        </div>
        <div>
          <Label>Amount Received Date & Time</Label>
          <Input {...f.getFieldProps("receivedDateTime")} />
        </div>

        <div className="pt-1 text-center text-sm font-medium text-slate-600">
          Super Admin Details
        </div>
        <div>
          <Label>Amount Sent</Label>
          <Input {...f.getFieldProps("sentAmount")} />
          <Error name="sentAmount" />
        </div>
        <div>
          <Label>Date & Time</Label>
          <Input {...f.getFieldProps("sentDateTime")} />
          <Error name="sentDateTime" />
        </div>

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

        <div>
          <Label>Bkash Trx ID / Bank Account No.</Label>
          <Input {...f.getFieldProps("refNo")} />
          <Error name="refNo" />
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
            {f.isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
