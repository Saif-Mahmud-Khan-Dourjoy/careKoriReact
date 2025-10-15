import { useEffect, useMemo, useState } from "react"
import StatusDot from "../components/ui/StatusDot"
import PopoverConfirm from "../components/ui/PopoverConfirm"
import PromoCodeModal from "../components/promocode/PromoCodeModal"
import { useOutletContext } from "react-router-dom"

const seed = [
  {
    id: 1,
    code: "123456",
    discountType: "percentage",
    amount: 8,
    assignedTo: "Dr. Amal Paul, Cardiologist",
    startDate: "26th Jun",
    endDate: "27th Jun",
    active: true,
  },
  {
    id: 2,
    code: "456789",
    discountType: "amount",
    amount: 2000,
    assignedTo: "Doctor Category",
    startDate: "26th Jun",
    endDate: "27th Jun",
    active: true,
  },
  {
    id: 3,
    code: "789123",
    discountType: "percentage",
    amount: 18,
    assignedTo: "Lawyer Category",
    startDate: "26th Jun",
    endDate: "27th Jun",
    active: false,
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

export default function PromoCodes() {
    const { setHeader } = useOutletContext()

    useEffect(() => {
      setHeader({
        title: "Welcome to Promo Codes",
        subtitle: "Here’s a summary of today.",
      })
    }, [setHeader])
  const [q, setQ] = useState("")
  const [rows, setRows] = useState(seed)

  const [modal, setModal] = useState({ open: false, initial: null }) 
  const [deleteAnchor, setDeleteAnchor] = useState(null) 

  const filtered = useMemo(() => {
    if (!q) return rows
    const s = q.toLowerCase()
    return rows.filter((r) =>
      `${r.code} ${r.assignedTo}`.toLowerCase().includes(s)
    )
  }, [q, rows])

  const upsertRow = (values, id) => {
    if (id) {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...values } : r))
      )
    } else {
      const nextId = (rows.at(-1)?.id || 0) + 1
      const payload = {
        id: nextId,
        active: true,
        assignedTo:
          values.providerName || values.department || values.occupation || "—",
        startDate: values.startDate,
        endDate: values.endDate,
        ...values,
      }
      setRows((prev) => [...prev, payload])
    }
  }

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id))

  return (
    <div className="space-y-4">
      {/* header actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔎
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Promo Codes"
            className="w-96 rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={() => setModal({ open: true, initial: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm text-white hover:bg-blue-700"
        >
          👤➕ Create New Code
        </button>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-white overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <Th>No.</Th>
              <Th>Code</Th>
              <Th>Discount</Th>
              <Th>Assigned To</Th>
              <Th>Validity</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.id} className="border-b last:border-0">
                <Td>{idx + 1}</Td>
                <Td className="font-medium">{r.code}</Td>
                <Td className={r.discountType === "amount" ? "" : ""}>
                  {r.discountType === "amount"
                    ? `${r.amount}Tk`
                    : `${r.amount}%`}
                </Td>
                <Td className="max-w-[280px]">
                  <div className="line-clamp-2 text-slate-700">
                    {r.assignedTo}
                  </div>
                </Td>
                <Td>
                  <div className="leading-tight">
                    {r.startDate}
                    <br />
                    {r.endDate}
                  </div>
                </Td>
                <Td>
                  <StatusDot active={r.active} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                      onClick={() => setModal({ open: true, initial: r })}
                    >
                      Edit
                    </button>

                   
                    <div className="relative">
                      <div className="absolute right-0 top-[-190%] z-50">
                        <PopoverConfirm
                          open={deleteAnchor === r.id}
                          onClose={() => setDeleteAnchor(null)}
                          onYes={() => removeRow(r.id)}
                        />
                      </div>
                      <button
                        className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                        onClick={() =>
                          setDeleteAnchor((cur) => (cur === r.id ? null : r.id))
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

      {/* modal */}
      <PromoCodeModal
        open={modal.open}
        initial={modal.initial}
        onClose={() => setModal({ open: false, initial: null })}
        onSubmit={(values, id) => upsertRow(values, id)}
      />
    </div>
  )
}
