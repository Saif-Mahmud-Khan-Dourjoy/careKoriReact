import Modal from "../../components/ui/Modal"
import AvatarHeader from "../../components/ui/AvatarHeader"
import {
  ActionsRow,
  Input,
  Label,
  Radio,
  Select,
} from "../../components/ui/Fields"
import { useEffect, useRef, useState } from "react"
import PopConfirm from "../../components/ui/PopConfirm"

export default function GetterDetailsModal({
  open,
  onClose,
  record,
  onSave,
  onBlock,
}) {

const [form, setForm] = useState({
  name: "",
  gender: "Male",
  district: "Sylhet",
  subdistrict: "Habiganj",
  phone: "",
  dob: "2003-07-15",
})


useEffect(() => {
  if (record) {
    setForm({
      name: record.name || "",
      gender: record.gender || "Male",
      district: "Sylhet",
      subdistrict: "Habiganj",
      phone: record.phone || "",
      dob: "2003-07-15",
    })
  }
}, [record])
  const change = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const [showBlock, setShowBlock] = useState(false)
  const blockBtnRef = useRef(null)

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Service Getter Details"
        widthClass="max-w-xl"
      >
        <AvatarHeader src={record?.avatar} />
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <div className="flex items-center gap-6">
              <Radio
                name="gG"
                checked={form.gender === "Male"}
                label="Male"
                onChange={() => change("gender", "Male")}
              />
              <Radio
                name="gG"
                checked={form.gender === "Female"}
                label="Female"
                onChange={() => change("gender", "Female")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Address</Label>
              <Select
                value={form.district}
                onChange={(e) => change("district", e.target.value)}
              >
                <option>Sylhet</option>
                <option>Dhaka</option>
                <option>Chittagong</option>
              </Select>
            </div>
            <div className="mt-6 md:mt-0">
              <Select
                value={form.subdistrict}
                onChange={(e) => change("subdistrict", e.target.value)}
              >
                <option>Habiganj</option>
                <option>Dhamrai</option>
                <option>Fakirhat</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => change("phone", e.target.value)}
            />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => change("dob", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              ref={blockBtnRef}
              type="button"
              onClick={() => setShowBlock(true)}
              className="rounded-lg border px-4 py-2.5 text-sm text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Block
            </button>
            <ActionsRow onCancel={onClose} onSave={() => onSave?.(form)} />
          </div>
        </div>
      </Modal>

      <PopConfirm
        open={showBlock}
        anchorRef={blockBtnRef}
        onClose={() => setShowBlock(false)}
        title="Block this Service Getter?"
        okText="Yes"
        cancelText="No"
        danger
        onOk={() => onBlock?.(record)}
      />
    </>
  )
}
