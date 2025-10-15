import Modal from "../../components/ui/Modal"
import AvatarHeader from "../../components/ui/AvatarHeader"
import {
  ActionsRow,
  Input,
  Label,
  Radio,
  Select,
} from "../../components/ui/Fields"
import { useEffect, useState } from "react"

export default function ProviderDetailsModal({
  open,
  onClose,
  record,
  onSave,
}) {
  const [form, setForm] = useState({
    name: "Happy Gilmore",
    gender: "Female",
    district: "Dhaka",
    subdistrict: "Dhamrai",
    phone: "01632142133",
    dob: "2025-02-01",
    pass: "123ABC",
    pass2: "123ABC",
    about: "",
    payMethod: "Bkash",
    bkashNo: "0163215547",
    bkashName: "Happy Gilmore",
    bank: "",
    bankAcc: "",
    accTitle: "Happy Gilmore",
    occupation: "Doctor",
    department: "Cardiologist",
    regNo: "010101",
  })

  useEffect(() => {
    if (record) {
      setForm({
        name: record.name || "Happy Gilmore",
        gender: record.gender || "Female",
        district: "Dhaka",
        subdistrict: "Dhamrai",
        phone: record.phone || "01632142133",
        dob: "2025-02-01",
        pass: "123ABC",
        pass2: "123ABC",
        about: "",
        payMethod: "Bkash",
        bkashNo: "0163215547",
        bkashName: record.name || "Happy Gilmore",
        bank: "",
        bankAcc: "",
        accTitle: record.name || "Happy Gilmore",
        occupation: "Doctor",
        department: "Cardiologist",
        regNo: "010101",
      })
    }
  }, [record])
  const change = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Service Provider Details"
      widthClass="max-w-3xl"
    >
      <AvatarHeader src={record?.avatar} />
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <div className="flex items-center gap-6 pt-2">
              <Radio
                name="gP"
                label="Male"
                checked={form.gender === "Male"}
                onChange={() => change("gender", "Male")}
              />
              <Radio
                name="gP"
                label="Female"
                checked={form.gender === "Female"}
                onChange={() => change("gender", "Female")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Address</Label>
            <Select
              value={form.district}
              onChange={(e) => change("district", e.target.value)}
            >
              <option>Dhaka</option>
              <option>Sylhet</option>
              <option>Chittagong</option>
            </Select>
          </div>
          <div className="mt-6 md:mt-0">
            <Select
              value={form.subdistrict}
              onChange={(e) => change("subdistrict", e.target.value)}
            >
              <option>Dhamrai</option>
              <option>Habiganj</option>
              <option>Fakirhat</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.pass}
              onChange={(e) => change("pass", e.target.value)}
            />
          </div>
          <div>
            <Label>Re-Enter Password</Label>
            <Input
              type="password"
              value={form.pass2}
              onChange={(e) => change("pass2", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>About Me</Label>
          <textarea
            rows={4}
            value={form.about}
            onChange={(e) => change("about", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Write about yourself"
          />
        </div>

        <div className="pt-1 font-medium text-slate-700">Payment Details</div>
        <div className="flex items-center gap-6">
          <Radio
            name="pm"
            label="Bank"
            checked={form.payMethod === "Bank"}
            onChange={() => change("payMethod", "Bank")}
          />
          <Radio
            name="pm"
            label="Bkash"
            checked={form.payMethod === "Bkash"}
            onChange={() => change("payMethod", "Bkash")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Bkash No.</Label>
            <Input
              value={form.bkashNo}
              onChange={(e) => change("bkashNo", e.target.value)}
            />
          </div>
          <div>
            <Label>Bkash Name</Label>
            <Input
              value={form.bkashName}
              onChange={(e) => change("bkashName", e.target.value)}
            />
          </div>
          <div>
            <Label>Bank Name</Label>
            <Input
              value={form.bank}
              onChange={(e) => change("bank", e.target.value)}
            />
          </div>
          <div>
            <Label>Bank A/C No.</Label>
            <Input
              value={form.bankAcc}
              onChange={(e) => change("bankAcc", e.target.value)}
            />
          </div>
          <div>
            <Label>Account Title</Label>
            <Input
              value={form.accTitle}
              onChange={(e) => change("accTitle", e.target.value)}
            />
          </div>
        </div>

        <div className="pt-1 font-medium text-slate-700">Select Role</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Occupation</Label>
            <Input
              value={form.occupation}
              onChange={(e) => change("occupation", e.target.value)}
            />
          </div>
          <div>
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) => change("department", e.target.value)}
            />
          </div>
          <div>
            <Label>Registration Number</Label>
            <Input
              value={form.regNo}
              onChange={(e) => change("regNo", e.target.value)}
            />
          </div>
        </div>

        <ActionsRow onCancel={onClose} onSave={() => onSave?.(form)} />
      </div>
    </Modal>
  )
}
