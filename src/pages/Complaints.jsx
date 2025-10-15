import { useEffect, useMemo, useState } from "react"

import StatusBadge from "../components/ui/StatusBadge"
import ComplaintInfoModal from "../components/complaints/ComplaintInfoModal"
import { useOutletContext } from "react-router-dom"


const seed = [
  {
    id: 1,
    complaintId: "123456",
    from: { phone: "01632132165", name: "Abir" },
    against: {
      name: "Dr. Amal Paul",
      title: "Cardiologist",
      occupation: "Doctor",
      department: "Cardiologist",
    },
    datetime: "15:32\n26th Jun 25",
    datetime_plain: "2025-06-26T15:32:00",
    message:
      "Problem with network connectivity. Call drops frequently, unclear voice.",
    status: "Pending",
  },
  {
    id: 2,
    complaintId: "456789",
    from: { phone: "01632132165", name: "Abir" },
    against: {
      name: "Dr. Amal Paul",
      title: "Cardiologist",
      occupation: "Doctor",
      department: "Cardiologist",
    },
    datetime: "15:32\n26th Jun 25",
    datetime_plain: "2025-06-26T15:32:00",
    message: "Connection issues...",
    status: "Resolved",
  },
  {
    id: 3,
    complaintId: "789123",
    from: { phone: "01632132165", name: "Abir" },
    against: {
      name: "Dr. Amal Paul",
      title: "Cardiologist",
      occupation: "Doctor",
      department: "Cardiologist",
    },
    datetime: "15:32\n26th Jun 25",
    datetime_plain: "2025-06-26T15:32:00",
    message: "App bug",
    status: "Pending",
  },

]

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
    {children}
  </th>
)
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>
    {children}
  </td>
)

export default function Complaints() {
    const { setHeader } = useOutletContext()

    useEffect(() => {
      setHeader({
        title: "Welcome to Complaints Management",
        subtitle: "Here’s a summary of today.",
      })
    }, [setHeader])

  useEffect(() => {
   
    document.title = "Complaints Management"
  }, [])

  const [q, setQ] = useState("")
  const [modal, setModal] = useState({ open: false, data: null })

  const list = useMemo(() => {
    if (!q) return seed
    const s = q.toLowerCase()
    return seed.filter((r) =>
      `${r.complaintId} ${r.from.phone} ${r.from.name} ${r.against.name} ${r.message}`
        .toLowerCase()
        .includes(s)
    )
  }, [q])

  return (
    <div className="space-y-4">
      {/* tabs (single) + search */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm text-white">
            Complaints
          </button>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔎
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Name, ID, Phone"
            className="w-80 rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-white overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <Th>No.</Th>
              <Th>Complaint ID</Th>
              <Th>Phone No. (From)</Th>
              <Th>Complaint Against</Th>
              <Th>Date & Time</Th>
              <Th>Message</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((r, idx) => (
              <tr key={r.id} className="border-b last:border-0">
                <Td>{idx + 1}</Td>
                <Td>
                  <span className="font-medium">{r.complaintId}</span>
                </Td>
                <Td className="font-medium">{r.from.phone}</Td>
                <Td>{`${r.against.name}, ${r.against.title}`}</Td>
                <Td>
                 
                  <div className="whitespace-pre leading-tight">
                    {r.datetime}
                  </div>
                </Td>
                <Td className="max-w-[220px]">
                  <span className="line-clamp-1 text-slate-500">
                    {r.message}
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                      onClick={() => setModal({ open: true, data: r })}
                    >
                      Details
                    </button>
                  
                    <button
                      title="Mark resolved"
                      className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white text-xs hover:bg-emerald-600"
                      onClick={() => {
                      
                        const idx = seed.findIndex((x) => x.id === r.id)
                        if (idx > -1) seed[idx].status = "Resolved"
                        setQ((s) => s + "") 
                      }}
                    >
                      ✓
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      <ComplaintInfoModal
        open={modal.open}
        data={modal.data}
        onClose={() => setModal({ open: false, data: null })}
      />
    </div>
  )
}
