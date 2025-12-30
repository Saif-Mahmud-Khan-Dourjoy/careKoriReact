

/* eslint-disable */
import Modal from "../../components/ui/Modal"
import { Input, Label, Radio } from "../../components/ui/Fields"
import { useFormik } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import { useEffect, useMemo, useState } from "react"
import { lastHistory } from "../../api/RecordPayment"

export default function RecordPaymentModal({
  open,
  onClose,
  onSubmit,
  providers = [],
  
}) {
  
  // Build select options: "Name (Role, Department)"
  const providerOptions = useMemo(() => {
    return (providers || []).map((p) => ({
      value: p.id, // user_id
      label: `${p.name || ""} (${
        p.role.slice(0, 1).toUpperCase() + p.role.slice(1) || "N/A"
      }, ${p.specialized_at || "N/A"})`,
      meta: p, // keep whole provider
    }))
  }, [providers])

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      // --- DB columns (migration aligned) ---
      user_id: null,

      trx_datetime: "",
      trx_id: "",
      amount_received_datetime: "",
      sent_amount: "",
      sent_datetime: "",
      sent_via: "MFS", // enum: MFS | BANK
      sent_trx_id: "", // if MFS
      sent_bank_acc: "", // if BANK
      

      // --- UI-only fields (not stored in payment_records table) ---
      provider_display: null, // react-select option object
      provider_uid: "",
      provider_phone: "",
      provider_occupation: "",
      provider_department: "",
      total_income: "",
      amount_due: "",
      amount_received: "",
    },

    validationSchema: Yup.object({
      user_id: Yup.number()
        .typeError("Select a provider")
        .required("Provider is required"),

      // total_income: Yup.number().typeError("Number").required("Required"),
      // amount_due: Yup.number().typeError("Number").required("Required"),
      // amount_received: Yup.number().typeError("Number").required("Required"),

      trx_datetime: Yup.string().required("Required"),
      // trx_id optional (your migration nullable). if you want required, uncomment below:
      trx_id: Yup.string().required("Required"),
      amount_received_datetime: Yup.string().required("Required"),

      sent_amount: Yup.number().typeError("Number").required("Required"),
      sent_datetime: Yup.string().required("Required"),
      sent_via: Yup.string().oneOf(["MFS", "BANK"]).required("Required"),

      // Conditional validation based on sent_via
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
        const payload = {
          ...values,
        }

        delete payload.provider_display
        delete payload.provider_uid
        delete payload.provider_phone
        delete payload.provider_occupation
        delete payload.provider_department
        delete payload.total_income
        delete payload.amount_due
        delete payload.amount_received

        if (payload.sent_via === "MFS") {
          payload.sent_bank_acc = null
        } else if (payload.sent_via === "BANK") {
          payload.sent_trx_id = null
        }

        await onSubmit?.(payload)
        setSubmitting(false)
        onClose?.()
      } catch (e) {
        setSubmitting(false)
      }
    },
  })

  const Error = ({ name }) =>
    f.touched[name] && f.errors[name] ? (
      <p className="mt-1 text-xs text-rose-600">{f.errors[name]}</p>
    ) : null

  const handleProviderChange = (selectedOption) => {
    f.setFieldValue("provider_display", selectedOption)

    if (!selectedOption) {
      // clear everything
      f.setFieldValue("user_id", null)
      f.setFieldValue("provider_uid", "")
      f.setFieldValue("provider_phone", "")
      f.setFieldValue("provider_occupation", "")
      f.setFieldValue("provider_department", "")
      f.setFieldValue("total_income", "")
      f.setFieldValue("amount_due", "")
      f.setFieldValue("amount_received", "")
      return
    }

    const p = selectedOption.meta || {}

    // Set FK user_id for DB
    f.setFieldValue("user_id", p.id)

    // Auto-fill UI-only fields
    f.setFieldValue("provider_uid", p.unique_user_id || "N/A")
    f.setFieldValue("provider_phone", p.phone || "N/A")
    f.setFieldValue(
      "provider_occupation",
      p.role.slice(0, 1).toUpperCase() + p.role.slice(1) || "N/A"
    )
    f.setFieldValue("provider_department", p.specialized_at || "N/A")
    f.setFieldValue("total_income", p.total_income || 0)
    f.setFieldValue("amount_due", p.amount_due || 0)
    f.setFieldValue("amount_received", p.amount_received || 0)

  }
   


  // react-select styling baseline (keeps your UI consistent)
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: 42,
      borderRadius: 8,
      borderColor: "#cbd5e1",
      boxShadow: "none",
    }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  }



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

        {/* Provider select */}
        <div>
          <Label>Provider</Label>
          <Select
            inputId="provider_select"
            placeholder="Search provider..."
            isClearable
            isSearchable
            options={providerOptions}
            value={f.values.provider_display}
            onChange={handleProviderChange}
            styles={selectStyles}
          />
          <Error name="user_id" />
        </div>

        {/* Auto-filled fields (readOnly) */}
        <div>
          <Label>ID</Label>
          <Input value={f.values.provider_uid} readOnly />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={f.values.provider_phone} readOnly />
        </div>
        <div>
          <Label>Occupation</Label>
          <Input value={f.values.provider_occupation} readOnly />
        </div>
        <div>
          <Label>Department</Label>
          <Input value={f.values.provider_department} readOnly />
        </div>

        {/* Money fields (DB aligned) */}
        <div>
          <Label>Total Income</Label>
          <Input {...f.getFieldProps("total_income")} readOnly />
          {/* <Error name="total_income" /> */}
        </div>
        <div>
          <Label>Amount Due</Label>
          <Input {...f.getFieldProps("amount_due")} readOnly />
          {/* <Error name="amount_due" /> */}
        </div>
        <div>
          <Label>Amount Received</Label>
          <Input {...f.getFieldProps("amount_received")} readOnly />
          {/* <Error name="amount_received" /> */}
        </div>

        <div>
          <Label>Trx Date & Time</Label>
          <Input type="datetime-local" {...f.getFieldProps("trx_datetime")} />
          <Error name="trx_datetime" />
        </div>
        <div>
          <Label>Trx ID</Label>
          <Input {...f.getFieldProps("trx_id")} />
          <Error name="trx_id" />
          {/* optional */}
        </div>
        <div>
          <Label>Amount Received Date & Time</Label>
          <Input
            type="datetime-local"
            {...f.getFieldProps("amount_received_datetime")}
          />
          <Error name="amount_received_datetime" />
        </div>

        <div className="pt-1 text-center text-sm font-medium text-slate-600">
          Super Admin Details
        </div>

        <div>
          <Label>Amount Sent</Label>
          <Input {...f.getFieldProps("sent_amount")} />
          <Error name="sent_amount" />
        </div>
        <div>
          <Label>Sent Date & Time</Label>
          <Input type="datetime-local" {...f.getFieldProps("sent_datetime")} />
          <Error name="sent_datetime" />
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
          <Error name="sent_via" />
        </div>

        {f.values.sent_via === "MFS" ? (
          <div>
            <Label>Bkash/MFS Trx ID</Label>
            <Input {...f.getFieldProps("sent_trx_id")} />
            <Error name="sent_trx_id" />
          </div>
        ) : (
          <div>
            <Label>Bank Account No.</Label>
            <Input {...f.getFieldProps("sent_bank_acc")} />
            <Error name="sent_bank_acc" />
          </div>
        )}

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-500 px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
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

