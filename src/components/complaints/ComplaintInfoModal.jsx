import Modal from "../../components/ui/Modal"
import { Input, Label } from "../../components/ui/Fields"

export default function ComplaintInfoModal({ open, onClose, data }) {
  if (!data) data = {}
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Complaint Info"
      widthClass="max-w-2xl"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Complaint ID</Label>
          <Input value={data.complaintId || ""} readOnly />
        </div>

        <div>
          <Label>Complaint From</Label>
          <Input
            value={`${data.from?.name || ""} (${data.from?.phone || ""})`}
            readOnly
          />
        </div>

        <div>
          <Label>Complaint Against</Label>
          <Input
            value={`${data.against?.name || ""}${
              data.against?.title ? `, ${data.against.title}` : ""
            }`}
            readOnly
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Occupation</Label>
            <Input value={data.against?.occupation || ""} readOnly />
          </div>
          <div>
            <Label>Department</Label>
            <Input value={data.against?.department || ""} readOnly />
          </div>
        </div>

        <div>
          <Label>Date & Time</Label>
          <Input value={data.datetime || ""} readOnly />
        </div>

        <div>
          <Label>Message</Label>
          <textarea
            value={data.message || ""}
            readOnly
            rows={4}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-700 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-500 px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          {/* <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Done
          </button> */}
        </div>
      </div>
    </Modal>
  )
}
