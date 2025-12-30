import { useEffect, useMemo, useState } from "react"
import FilterDropdown from "../components/revenue/FilterDropdown"
import RecordPaymentModal from "../components/revenue/RecordPaymentModal"
import RevenueDetailsModal from "../components/revenue/RevenueDetailsModal"
import { useOutletContext } from "react-router-dom"
import searchIcon from "/images/searchIcon.png"

import addIcon from "/images/user-add.png"

import { paymentSummary, recordPayment, updatePaymentRecord } from "../api/RecordPayment"
import LoaderModal from "../components/ui/LoaderModal"
import StatusModal from "../components/ui/StatusModal"
import avatar from "/images/avatar.png"





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

function ordinal(n) {
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod10 === 1 && mod100 !== 11) return `${n}st`
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`
  return `${n}th`
}

function formatPaymentDateTime(input) {
  // input: "YYYY-MM-DD HH:mm:ss"
  const d = new Date(input.replace(" ", "T"))

  const time =
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")

  const date =
    `${ordinal(d.getDate())} ` +
    d.toLocaleString("en-US", { month: "short" }) +
    " " +
    String(d.getFullYear()).slice(-2)

  return {
    time, // "11:15"
    date, // "11th Dec 25"
    result: `${time}, ${date}`, // "11:15, 11th Dec 25"
  }
}

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

  const [providers, setProviders] = useState([])
  const [showProvidersWithEarningsOnly, setShowProvidersWithEarningsOnly] = useState(
    []
  )

    const [loading, setLoading] = useState(false)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [statusModalSuccess, setStatusModalSuccess] = useState(null)
    const [errorMsg, setErrorMsg] = useState("")
    const [metrics, setMetrics] = useState({ income: 0, due: 0, collected: 0 })



 


  
   const getPaymentSummary = async () => {
     const [success, data] = await paymentSummary()
     if (success) {
       setProviders(data.providers)
       setShowProvidersWithEarningsOnly(data.providers.filter((p) => p.total_income > 0))
       setMetrics({
         income: data.summary.total_income || 0,
         due: data.summary.total_due || 0,
         collected: data.summary.total_received || 0,
       })
     } else {
       console.error("Failed to fetch providers:", data)
     }
   }

  

  

    const addRecord = async (payload) => {

      setLoading(true)
      
       const fd = new FormData()

       fd.append("user_id", String(payload.user_id ?? ""))

     

       fd.append("trx_datetime", payload.trx_datetime || "")
       fd.append("trx_id", payload.trx_id || "")
       fd.append(
         "amount_received_datetime",
         payload.amount_received_datetime || ""
       )

       fd.append("sent_amount", String(payload.sent_amount ?? "0"))
       fd.append("sent_datetime", payload.sent_datetime || "")
       fd.append("sent_via", payload.sent_via || "MFS")

       // conditional fields
       if (payload.sent_via === "MFS") {
         fd.append("sent_trx_id", payload.sent_trx_id || "")
         fd.append("sent_bank_acc", "") 
       } else if (payload.sent_via === "BANK") {
         fd.append("sent_bank_acc", payload.sent_bank_acc || "")
         fd.append("sent_trx_id", "")
       }

      

      // setLoading(true)
      const [success, data] = await recordPayment(fd)
      if (success) {
        
        setLoading(false)
        setStatusModalSuccess(true)
        setStatusModalOpen(true)
      } else {
        setErrorMsg(data)
        setLoading(false)
        setStatusModalSuccess(false)
        setStatusModalOpen(true)
      }
    }

    const updateRecord = async (paymentRecordId, payload) => {
      setLoading(true)
      const [success, data] = await updatePaymentRecord(paymentRecordId, payload)
      if (success) {
        setLoading(false)
        setStatusModalSuccess(true)
        setStatusModalOpen(true)
      } else {
        setErrorMsg(data)
        setLoading(false)
        setStatusModalSuccess(false)
        setStatusModalOpen(true)
      }
    }

    



     
   

   useEffect(() => {
    setLoading(true)
     getPaymentSummary().finally(() => setLoading(false))
   }, [])


   const closeStatusModal = () => {
     setStatusModalOpen(false)
     setErrorMsg(null)

     setLoading(true)
     getPaymentSummary().finally(() => setLoading(false))
   }


    const list = useMemo(() => {
      let out = [...showProvidersWithEarningsOnly]
      if (q) {
        const s = q.toLowerCase()
        out = out.filter((r) =>
          `${r.name} ${r.unique_user_id} ${r.phone} ${r.role} ${r.specialized_at}`
            .toLowerCase()
            .includes(s)
        )
      }
      if (filter?.type === "occupation") {
        out.sort((a, b) => a.role.localeCompare(b.role))
      } else if (filter?.type === "department") {
        out.sort((a, b) => a.specialized_at.localeCompare(b.specialized_at))
      } else if (filter?.type === "latest") {
        out.reverse()
      } else if (filter?.type === "oldest") {
        // already oldest
      }
      return out
    }, [q, filter, showProvidersWithEarningsOnly])

   
  return (
    <>
      <LoaderModal
        open={loading}
        title="In Progress"
        subtitle="Please wait while loading."
        dimBackdrop
        blurBackdrop
      />
      <StatusModal
        open={statusModalOpen}
        onClose={closeStatusModal}
        success={statusModalSuccess}
        errorMsg={errorMsg}
      />
      <div className="space-y-4">
        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            color="emerald"
            title="Total Earnings"
            value={metrics.income}
          />
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
                  <img src={addIcon} alt="Add Record" /> Record Payment
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
                      {r?.avatar ? (
                        <img
                          src={r.avatar}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <img
                          src={avatar}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-slate-400">
                          {r.unique_user_id}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-medium">{r.phone}</Td>
                  <Td>{r.role}</Td>
                  <Td>{r.specialized_at ? r.specialized_at : "N/A"}</Td>
                  <Td className="text-emerald-600 font-medium">
                    {r.total_income.toLocaleString()}
                  </Td>
                  <Td className="text-rose-500 font-medium">{r.amount_due ? r.amount_due.toLocaleString() : "N/A"}</Td>
                  <Td className="text-emerald-600 font-medium">
                    {r.total_received ? r.total_received.toLocaleString() : "N/A"}
                  </Td>
                  <Td>
                    <div className="whitespace-pre leading-tight">
                      {r.last_trx_datetime?formatPaymentDateTime(r.last_trx_datetime).result:"N/A"}
                    </div>
                  </Td>
                  <Td>
                    <button
                      className="rounded border border-slate-500 px-3 py-1.5 text-xs hover:bg-slate-50"
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
          onSubmit={(payload) => addRecord(payload)}
          providers={providers}
        />

        <RevenueDetailsModal
          open={details.open}
          data={details.data}
          onClose={() => setDetails({ open: false, data: null })}
          onEdit={(paymentRecordId, payload) => updateRecord(paymentRecordId, payload)}
        />
      </div>
    </>
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
