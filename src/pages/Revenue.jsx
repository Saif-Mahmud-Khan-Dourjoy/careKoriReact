import { useEffect, useMemo, useState } from "react"
import FilterDropdown from "../components/revenue/FilterDropdown"
import RecordPaymentModal from "../components/revenue/RecordPaymentModal"
import RevenueDetailsModal from "../components/revenue/RevenueDetailsModal"
import { useOutletContext } from "react-router-dom"
import searchIcon from "/images/searchIcon.png"

import addIcon from "/images/user-add.png"

const avatars = [
  "https://i.pravatar.cc/64?img=1",
  "https://i.pravatar.cc/64?img=2",
  "https://i.pravatar.cc/64?img=3",
  "https://i.pravatar.cc/64?img=4",
]

const seed = Array.from({ length: 8 }).map((_, i) => ({
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
  avatar: avatars[i % avatars.length],
  phone: "01612312300",
  occupation: i % 2 ? "Lawyer" : "Doctor",
  department: i % 2 ? "Family Lawyer" : "Cardiologist",
  totalIncome: 160658,
  amountDue: -1568,
  amountReceived: +1358,
  lastTrxDate: "15:32\n26th Jun 25",
  sentAmount: 3000,
  sentDateTime: "6th Jun 25, 15:32",
  sentVia: "Bkash",
  trxDateTime: "6th Jun 25, 15:32",
  lastTrxId: "TRX216569872ADS",
  receivedDateTime: "6th Jun 25, 15:32",
  refNo: "0163216549878",
}))

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

export default function RevenueTransactions() {

    const { setHeader } = useOutletContext()

    useEffect(() => {
      setHeader({
        title: "Welcome to Revenue & Transaction",
        subtitle: "Here’s a summary of today.",
      })
    }, [setHeader])
  useEffect(() => {
    document.title = "Revenue & Transaction"
  }, [])

  const [q, setQ] = useState("")
  const [filter, setFilter] = useState(null)

  const [showRecord, setShowRecord] = useState(false)
  const [details, setDetails] = useState({ open: false, data: null })

  const metrics = useMemo(() => {
    const today = 36589 
    const due = 139687
    const collected = 36589
    return { today, due, collected }
  }, [])

  const list = useMemo(() => {
    let out = [...seed]
    if (q) {
      const s = q.toLowerCase()
      out = out.filter((r) =>
        `${r.name} ${r.uid} ${r.phone} ${r.occupation} ${r.department}`
          .toLowerCase()
          .includes(s)
      )
    }
    if (filter?.type === "occupation") {
      out.sort((a, b) => a.occupation.localeCompare(b.occupation))
    } else if (filter?.type === "department") {
      out.sort((a, b) => a.department.localeCompare(b.department))
    } else if (filter?.type === "latest") {
      out.reverse()
    } else if (filter?.type === "oldest") {
      // already oldest
    }
    return out
  }, [q, filter])

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card color="emerald" title="Today's Earnings" value={metrics.today} />
        <Card color="rose" title="Pending Due" value={metrics.due} />
        <Card
          color="indigo"
          title="Total Collected"
          value={metrics.collected}
        />
      </div>

      {/* table */}
      <div className="rounded-lg  bg-white overflow-x-auto shadow-md">
        {/* search + actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap mt-5 px-3 mb-8">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <img src={searchIcon} alt="Search" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Name, Phone Number or ID"
              className="w-auto sm:w-96 rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <FilterDropdown onChange={setFilter} />
            <button
              onClick={() => setShowRecord(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm text-white hover:bg-blue-700"
            >
              <div className="flex gap-2">
                <img src={addIcon} alt="Add Record" />  Record Payment
              </div>
            </button>
          </div>
        </div>
        <table className="min-w-full ">
          <thead className=" bg-white">
            <tr>
              <Th>No.</Th>
              <Th>Name & ID</Th>
              <Th>Phone</Th>
              <Th>Occupation</Th>
              <Th>Department</Th>
              <Th>Total Income</Th>
              <Th>Amount Due</Th>
              <Th>Amount Received</Th>
              <Th>Last Trx Date</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={r.id} className=" last:border-0">
                <Td>{i + 1}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-slate-400">{r.uid}</div>
                    </div>
                  </div>
                </Td>
                <Td className="font-medium">{r.phone}</Td>
                <Td>{r.occupation}</Td>
                <Td>{r.department}</Td>
                <Td className="text-emerald-600 font-medium">
                  {r.totalIncome.toLocaleString()}
                </Td>
                <Td className="text-rose-500 font-medium">{r.amountDue}</Td>
                <Td className="text-emerald-600 font-medium">
                  {r.amountReceived}
                </Td>
                <Td>
                  <div className="whitespace-pre leading-tight">
                    {r.lastTrxDate}
                  </div>
                </Td>
                <Td>
                  <button
                    className="rounded border px-3 py-1.5 text-xs hover:bg-slate-50"
                    onClick={() => setDetails({ open: true, data: r })}
                  >
                    Details
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modals */}
      <RecordPaymentModal
        open={showRecord}
        onClose={() => setShowRecord(false)}
        onSubmit={(payload) => console.log("RECORD PAYMENT ->", payload)}
      />

      <RevenueDetailsModal
        open={details.open}
        data={details.data}
        onClose={() => setDetails({ open: false, data: null })}
        onEdit={(payload) => console.log("EDIT DETAILS ->", payload)}
      />
    </div>
  )
}

function Card({ color = "emerald", title, value }) {
  const tone = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  }[color]

  return (
    <div className={`rounded-2xl ${tone} ring-1 p-5`}>
      <div className="text-sm opacity-70 text-black">{title}</div>
      <div className="mt-2 text-3xl font-bold text-black">{value.toLocaleString()}</div>
    </div>
  )
}
