import { use, useCallback, useEffect, useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import Modal from "../components/ui/Modal"

import {
  ActionsRow,
  Input,
  Label,
  Radio,
  Select,
} from "../components/ui/Fields"
import GetterDetailsModal from "../components/userManagement/GetterDetailsModal"
import ProviderDetailsModal from "../components/userManagement/ProviderDetailsModal"
import ModeratorDetailsModal from "../components/userManagement/ModeratorDetailsModal"
import PopoverConfirm from "../components/ui/PopoverConfirm"



const avatars = [
  "https://i.pravatar.cc/48?img=1",
  "https://i.pravatar.cc/48?img=2",
  "https://i.pravatar.cc/48?img=3",
  "https://i.pravatar.cc/48?img=4",
  "https://i.pravatar.cc/48?img=5",
  "https://i.pravatar.cc/48?img=6",
]
const gettersSeed = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Andy Wilman",
    "Sarah Connor",
    "Jessica Abraham",
    "John Wick",
    "John Wick",
    "John Wick",
    "John Wick",
    "John Wick",
  ][i],
  uid: [
    "123456",
    "456789",
    "789123",
    "987321",
    "987321",
    "987321",
    "987321",
    "987321",
  ][i],
  phone: "01612312300",
  gender: i % 2 === 0 ? "Male" : "Female",
  dob: i % 2 === 0 ? "1st February 2001" : "3rd March 1993",
  address: i % 2 === 0 ? "Dhamrai, Dhaka" : "Fakirhat, Bagerhat",
  avatar: avatars[i % avatars.length],
}))
const providersSeed = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  phone: "01612312300",
  reg: "123456789",
  gender: i % 2 === 0 ? "Male" : "Female",
  address: i % 2 === 0 ? "Dhamrai, Dhaka" : "Fakirhat, Bagerhat",
  fee: [5000, 1000, 3000, 1300, 2500, 3600, 1900][i],
  payMethod: i % 2 ? "Bank" : "Bkash",
}))
const moderatorsSeed = gettersSeed.slice(0, 6)

function Tabs({ value, onChange }) {
  const tabs = ["Getters", "Providers", "Moderators"]
  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            value === t
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}



export default function UserManagement() {
  const { setHeader } = useOutletContext?.() || { setHeader: () => {} }
  useEffect(() => {
    setHeader({
      title: "Service Getter Management",
      subtitle: "Here’s a summary of today.",
    })
  }, [setHeader])

  const [tab, setTab] = useState("Getters")
  const [q, setQ] = useState("")
  const [addGetterOpen, setAddGetterOpen] = useState(false)
  const [addProviderOpen, setAddProviderOpen] = useState(false)
  const [addModeratorOpen, setAddModeratorOpen] = useState(false)
  const [addGetterDetailsOpen, setAddGetterDetailsOpen] = useState(false)
  const [addProviderDetailsOpen, setAddProviderDetailsOpen] = useState(false)
  const [addModeratorDetailsOpen, setAddModeratorDetailsOpen] = useState(false)
  const [recordToEdit, setRecordToEdit] = useState({})
  
  const [deleteProviderAnchor, setDeleteProviderAnchor] = useState(null)
  const [deleteModeratorAnchor, setDeleteModeratorAnchor] = useState(null)

  const getters = useMemo(
    () =>
      gettersSeed.filter((r) =>
        q
          ? (r.name + r.uid + r.phone).toLowerCase().includes(q.toLowerCase())
          : true
      ),
    [q]
  )
  const providers = useMemo(
    () =>
      providersSeed.filter((r) =>
        q
          ? (r.phone + r.reg + r.address)
              .toLowerCase()
              .includes(q.toLowerCase())
          : true
      ),
    [q]
  )
  const moderators = useMemo(
    () =>
      moderatorsSeed.filter((r) =>
        q
          ? (r.name + r.uid + r.phone).toLowerCase().includes(q.toLowerCase())
          : true
      ),
    [q]
  )

  const removeGetter = useCallback((id) => {  
    console.log("Remove getter with id:", id)
  }, [])
  const removeProvider = useCallback((id) => {
    console.log("Remove provider with id:", id)
  }, [])
  const removeModerator = useCallback((id) => {
    console.log("Remove moderator with id:", id)
  }, [])

  return (
    <div className="space-y-4">
      {/* tabs row + search + add button */}
      <div className="flex items-center flex-wrap justify-between gap-3">
        <Tabs
          value={tab}
          onChange={(t) => {
            setTab(t)
            setQ("")
            setHeader({
              title:
                t === "Getters"
                  ? "Service Getter Management"
                  : t === "Providers"
                  ? "Service Provider Management"
                  : "Moderator Management",
              subtitle: "Here’s a summary of today.",
            })
          }}
        />
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔎
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${tab}`}
              className="w-auto sm:w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {tab === "Getters" && (
            <button
              onClick={() => setAddGetterOpen(true)}
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2.5"
            >
              ⊕ Add Getter
            </button>
          )}
          {tab === "Providers" && (
            <button
              onClick={() => setAddProviderOpen(true)}
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2.5"
            >
              ⊕ Add Provider
            </button>
          )}
          {tab === "Moderators" && (
            <button
              onClick={() => setAddModeratorOpen(true)}
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2.5"
            >
              ⊕ Add Moderator
            </button>
          )}
        </div>
      </div>

      {/* table card */}
      <div className="rounded-xl border bg-white">
        {tab === "Getters" && (
          <GetterTable
            rows={getters}
            setAddGetterDetailsOpen={setAddGetterDetailsOpen}
            setRecordToEdit={setRecordToEdit}
            removeGetter={removeGetter}
          />
        )}
        {tab === "Providers" && (
          <ProviderTable
            rows={providers}
            setAddProviderDetailsOpen={setAddProviderDetailsOpen}
            setRecordToEdit={setRecordToEdit}
            removeProvider={removeProvider}
          />
        )}
        {tab === "Moderators" && (
          <ModeratorTable
            rows={moderators}
            setAddModeratorDetailsOpen={setAddModeratorDetailsOpen}
            setRecordToEdit={setRecordToEdit}
            removeModerator={removeModerator}
          />
        )}
      </div>

      {/* MODALS */}
      <GetterModal
        open={addGetterOpen}
        onClose={() => setAddGetterOpen(false)}
      />
      <ProviderModal
        open={addProviderOpen}
        onClose={() => setAddProviderOpen(false)}
      />
      <ModeratorModal
        open={addModeratorOpen}
        onClose={() => setAddModeratorOpen(false)}
      />
      <GetterDetailsModal
        open={addGetterDetailsOpen}
        onClose={() => setAddGetterDetailsOpen(false)}
        record={recordToEdit}
      />
      <ProviderDetailsModal
        open={addProviderDetailsOpen}
        onClose={() => setAddProviderDetailsOpen(false)}
        record={recordToEdit}
      />
      <ModeratorDetailsModal
        open={addModeratorDetailsOpen}
        onClose={() => setAddModeratorDetailsOpen(false)}
        record={recordToEdit}
      />
    </div>
  )
}

/* ------------ TABLES ------------- */

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
      {children}
    </th>
  )
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-slate-700">{children}</td>
}

function GetterTable({ rows, setAddGetterDetailsOpen, setRecordToEdit, removeGetter }) {
  const [deleteGetterAnchor, setDeleteGetterAnchor] = useState(null) 

  const removeRow = (id) => {
   removeGetter(id);
  }
  const handleClick = (record) => {
    
    setRecordToEdit(record);
    setAddGetterDetailsOpen(true);
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <Th>No.</Th>
            <Th>Name & ID</Th>
            <Th>Phone</Th>
            <Th>Gender</Th>
            <Th>Date of Birth</Th>
            <Th>Address</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className="border-b last:border-0">
              <Td>{i + 1}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt="" className="h-8 w-8 rounded-full" />
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.uid}</div>
                  </div>
                </div>
              </Td>
              <Td className="font-medium">{r.phone}</Td>
              <Td>{r.gender}</Td>
              <Td>{r.dob}</Td>
              <Td>{r.address}</Td>
              <Td>
                <div className="flex gap-2">
                  <button
                    className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                    onClick={() => handleClick(r)}
                  >
                    Edit
                  </button>
                  <div className="relative">
                    <div className="absolute right-0 top-[-190%] z-50">
                      <PopoverConfirm
                        open={deleteGetterAnchor === r.id}
                        onClose={() => setDeleteGetterAnchor(null)}
                        onYes={() => removeRow(r.id)}
                      />
                    </div>
                    <button className="rounded border px-3 py-1.5 text-xs hover:bg-red-50 text-red-600 border-red-200" onClick={() => setDeleteGetterAnchor((cur) => (cur === r.id ? null : r.id))}>
                      Delete
                    </button>
                  </div>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProviderTable({ rows, setAddProviderDetailsOpen,setRecordToEdit, removeProvider }) {
  const [deleteProviderAnchor, setDeleteProviderAnchor] = useState(null)

  const removeRow = (id) => {
    removeProvider(id)
  }
    const handleClick = (record) => {
      setRecordToEdit(record);
      setAddProviderDetailsOpen(true);
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <Th>Phone</Th>
            <Th>Registration No.</Th>
            <Th>Gender</Th>
            <Th>Address</Th>
            <Th>Consultation Fee</Th>
            <Th>Payment Method</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              <Td className="font-medium">{r.phone}</Td>
              <Td>{r.reg}</Td>
              <Td>{r.gender}</Td>
              <Td>{r.address}</Td>
              <Td>{r.fee}</Td>
              <Td>{r.payMethod}</Td>
              <Td>
                <div className="flex gap-2">
                  <button className="rounded bg-emerald-500/90 text-white px-3 py-1.5 text-xs hover:bg-emerald-600">
                    Accept
                  </button>
                  <button className="rounded bg-rose-500/90 text-white px-3 py-1.5 text-xs hover:bg-rose-600">
                    Reject
                  </button>
                  <button
                    className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                    onClick={() => handleClick(r)}
                  >
                    Edit
                  </button>
                  <div className="relative">
                    <div className="absolute right-0 top-[-190%] z-50">
                      <PopoverConfirm
                        open={deleteProviderAnchor === r.id}
                        onClose={() => setDeleteProviderAnchor(null)}
                        onYes={() => removeRow(r.id)}
                      />
                    </div>
                    <button
                      className="rounded border px-3 py-1.5 text-xs hover:bg-red-50 text-red-600 border-red-200"
                      onClick={() =>
                        setDeleteProviderAnchor((cur) =>
                          cur === r.id ? null : r.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ModeratorTable({ rows, setAddModeratorDetailsOpen,setRecordToEdit, removeModerator }) {
  const [deleteModeratorAnchor, setDeleteModeratorAnchor] = useState(null)
  const removeRow = (id) => {
    removeModerator(id)
  }
  const handleClick = (record) => {
    setRecordToEdit(record);
    setAddModeratorDetailsOpen(true);
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <Th>No.</Th>
            <Th>ID</Th>
            <Th>Phone</Th>
            <Th>Gender</Th>
            <Th>Date of Birth</Th>
            <Th>Address</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              <Td>{i + 1}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt="" className="h-8 w-8 rounded-full" />
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.uid}</div>
                  </div>
                </div>
              </Td>
              <Td className="font-medium">{r.phone}</Td>
              <Td>{r.gender}</Td>
              <Td>{r.dob}</Td>
              <Td>{r.address}</Td>
              <Td>
                <div className="flex gap-2">
                  <button
                    className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                    onClick={() => handleClick(r)}
                  >
                    Edit
                  </button>
                  <div className="relative">
                    <div className="absolute right-0 top-[-190%] z-50">
                      <PopoverConfirm
                        open={deleteModeratorAnchor === r.id}
                        onClose={() => setDeleteModeratorAnchor(null)}
                        onYes={() => removeRow(r.id)}
                      />
                    </div>
                    <button
                      className="rounded border px-3 py-1.5 text-xs hover:bg-red-50 text-red-600 border-red-200"
                      onClick={() =>
                        setDeleteModeratorAnchor((cur) =>
                          cur === r.id ? null : r.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------ MODALS ------------- */

function GetterModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    district: "",
    subdistrict: "",
    phone: "",
    dob: "",
    pass: "",
    pass2: "",
  })
  const change = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Service Getter"
      widthClass="max-w-xl"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="Enter Name"
          />
        </div>

        <div>
          <Label>Gender</Label>
          <div className="flex items-center gap-6">
            <Radio
              name="g1"
              checked={form.gender === "Male"}
              label="Male"
              onChange={() => change("gender", "Male")}
            />
            <Radio
              name="g1"
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
              <option value="">District</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </Select>
          </div>
          <div className="mt-6 md:mt-0">
            <Select
              value={form.subdistrict}
              onChange={(e) => change("subdistrict", e.target.value)}
            >
              <option value="">Sub District</option>
              <option>Dhamrai</option>
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
              placeholder="Number"
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
              placeholder="Password"
            />
          </div>
          <div>
            <Label>Re-Enter Password</Label>
            <Input
              type="password"
              value={form.pass2}
              onChange={(e) => change("pass2", e.target.value)}
              placeholder="Password"
            />
          </div>
        </div>

        <ActionsRow onCancel={onClose} onSave={() => onClose()} />
      </div>
    </Modal>
  )
}

function ProviderModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    district: "",
    subdistrict: "",
    phone: "",
    dob: "",
    pass: "",
    pass2: "",
    about: "",
    payMethod: "",
    bkashNo: "",
    bkashName: "",
    bank: "",
    bankAcc: "",
    accTitle: "",
    occupation: "",
    department: "",
    regNo: "",
  })
  const change = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Service Provider"
      widthClass="max-w-3xl"
    >
      <div className="grid grid-cols-1 gap-4">
        {/* top identity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              placeholder="Enter Name"
            />
          </div>
          <div>
            <Label>Gender</Label>
            <div className="flex items-center gap-6 pt-2">
              <Radio
                name="g2"
                checked={form.gender === "Male"}
                label="Male"
                onChange={() => change("gender", "Male")}
              />
              <Radio
                name="g2"
                checked={form.gender === "Female"}
                label="Female"
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
              <option value="">District</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </Select>
          </div>
          <div className="mt-6 md:mt-0">
            <Select
              value={form.subdistrict}
              onChange={(e) => change("subdistrict", e.target.value)}
            >
              <option value="">Sub District</option>
              <option>Dhamrai</option>
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
              placeholder="Number"
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
            value={form.about}
            onChange={(e) => change("about", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Write about yourself"
          />
        </div>

        <div className="pt-1 font-medium text-slate-700">Payment Details</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Payment Method</Label>
            <Select
              value={form.payMethod}
              onChange={(e) => change("payMethod", e.target.value)}
            >
              <option value="">Choose Payment Method</option>
              <option>Bkash</option>
              <option>Bank</option>
            </Select>
          </div>
          <div>
            <Label>Bkash No.</Label>
            <Input
              value={form.bkashNo}
              onChange={(e) => change("bkashNo", e.target.value)}
              placeholder="Bkash No."
            />
          </div>
          <div>
            <Label>Bkash Name</Label>
            <Input
              value={form.bkashName}
              onChange={(e) => change("bkashName", e.target.value)}
              placeholder="Bkash Name"
            />
          </div>
          <div>
            <Label>Bank Name</Label>
            <Input
              value={form.bank}
              onChange={(e) => change("bank", e.target.value)}
              placeholder="Bank Name"
            />
          </div>
          <div>
            <Label>Bank A/C No.</Label>
            <Input
              value={form.bankAcc}
              onChange={(e) => change("bankAcc", e.target.value)}
              placeholder="Bank A/C No."
            />
          </div>
          <div>
            <Label>Account Title</Label>
            <Input
              value={form.accTitle}
              onChange={(e) => change("accTitle", e.target.value)}
              placeholder="Account Title"
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
              placeholder="Occupation"
            />
          </div>
          <div>
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) => change("department", e.target.value)}
              placeholder="Department"
            />
          </div>
          <div>
            <Label>Registration Number</Label>
            <Input
              value={form.regNo}
              onChange={(e) => change("regNo", e.target.value)}
              placeholder="Registration Number"
            />
          </div>
        </div>

        <ActionsRow onCancel={onClose} onSave={() => onClose()} />
      </div>
    </Modal>
  )
}

function ModeratorModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    district: "",
    subdistrict: "",
    phone: "",
    dob: "",
    pass: "",
    pass2: "",
  })
  const change = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Moderator Info"
      widthClass="max-w-xl"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="Enter Name"
          />
        </div>
        <div>
          <Label>Gender</Label>
          <div className="flex items-center gap-6">
            <Radio
              name="g3"
              checked={form.gender === "Male"}
              label="Male"
              onChange={() => change("gender", "Male")}
            />
            <Radio
              name="g3"
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
              <option value="">District</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </Select>
          </div>
          <div className="mt-6 md:mt-0">
            <Select
              value={form.subdistrict}
              onChange={(e) => change("subdistrict", e.target.value)}
            >
              <option value="">Sub District</option>
              <option>Dhamrai</option>
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
              placeholder="Number"
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
        <ActionsRow onCancel={onClose} onSave={() => onClose()} />
      </div>
    </Modal>
  )
}
