import { useEffect, useState } from "react"

import StatusBadge from "../components/ui/StatusBadge"
import ComplaintInfoModal from "../components/complaints/ComplaintInfoModal"
import { useOutletContext } from "react-router-dom"
import { getAllComplaintsApi, updateComplaintStatusApi } from "../api/complaint"
import LoaderModal from "../components/ui/LoaderModal"
import searchIcon from "/images/searchIcon.png"
import StatusModal from "../components/ui/StatusModal"



 const normalizeComplaint = (complaint) => {
   const { id, provider_type, status, complaint_text, created_at } = complaint

   const provider_specialized_at =
     complaint?.provider_speciality?.specialized_at || ""
   const provider_name = complaint?.provider?.name || ""
   const customerPhone = complaint?.user?.phone || ""
   const customerName = complaint?.user?.name || ""

   const data = {
     complaintId: id,
     from: { phone: customerPhone, name: customerName },
     against: {
       name: provider_name,
       title: provider_specialized_at,
       occupation:
         provider_type.charAt(0).toUpperCase() + provider_type.slice(1),
       department: provider_specialized_at,
     },
     datetime: `${new Date(created_at).toLocaleTimeString([], {
       hour: "2-digit",
       minute: "2-digit",
     })}\n${new Date(created_at).toLocaleDateString([], {
       day: "2-digit",
       month: "short",
       year: "2-digit",
     })}`,
     datetime_plain: created_at,
     message: complaint_text,
     status: status.charAt(0).toUpperCase() + status.slice(1),
   }

   return data
 }



// const seed = [
//   {
//     id: 1,
//     complaintId: "123456",
//     from: { phone: "01632132165", name: "Abir" },
//     against: {
//       name: "Dr. Amal Paul",
//       title: "Cardiologist",
//       occupation: "Doctor",
//       department: "Cardiologist",
//     },
//     datetime: "15:32\n26th Jun 25",
//     datetime_plain: "2025-06-26T15:32:00",
//     message:
//       "Problem with network connectivity. Call drops frequently, unclear voice.",
//     status: "Pending",
//   },
//   {
//     id: 2,
//     complaintId: "456789",
//     from: { phone: "01632132165", name: "Abir" },
//     against: {
//       name: "Dr. Amal Paul",
//       title: "Cardiologist",
//       occupation: "Doctor",
//       department: "Cardiologist",
//     },
//     datetime: "15:32\n26th Jun 25",
//     datetime_plain: "2025-06-26T15:32:00",
//     message: "Connection issues...",
//     status: "Resolved",
//   },
//   {
//     id: 3,
//     complaintId: "789123",
//     from: { phone: "01632132165", name: "Abir" },
//     against: {
//       name: "Dr. Amal Paul",
//       title: "Cardiologist",
//       occupation: "Doctor",
//       department: "Cardiologist",
//     },
//     datetime: "15:32\n26th Jun 25",
//     datetime_plain: "2025-06-26T15:32:00",
//     message: "App bug",
//     status: "Pending",
//   },

// ]

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 ${className}`}>
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
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(false)
    const [filteredComplaints, setFilteredComplaints] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [statusModalSuccess, setStatusModalSuccess] = useState(false)


    useEffect(() => {
      setHeader({
        title: "Welcome to Complaints Management",
        subtitle: "Here’s a summary of today.",
      })
    }, [setHeader])

    const getComplaints = async () => {
      const [success, data] = await getAllComplaintsApi()
      if (success) {
        const normalized = data.complaints.map(normalizeComplaint)
        console.log("Fetched complaints:", normalized)
        setComplaints(normalized)
      } else {
        console.error("Error fetching complaints:", data)
      }
    }

   useEffect(() => {
    setLoading(true)
     getComplaints().finally(() => {
      setLoading(false)
     })
   }, [])


   

  

  const [q, setQ] = useState("")
  const [modal, setModal] = useState({ open: false, data: null })

  // const list = useMemo(() => {
  //   if (!q) return seed
  //   const s = q.toLowerCase()
  //   return seed.filter((r) =>
  //     `${r.complaintId} ${r.from.phone} ${r.from.name} ${r.against.name} ${r.message}`
  //       .toLowerCase()
  //       .includes(s)
  //   )
  // }, [q])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!q) {
        setFilteredComplaints(complaints)
        return
      }
      const lower = q.toLowerCase()
      setFilteredComplaints(
        complaints.filter((r) =>
          [
            r.complaintId,
            r.from?.phone,
            r.from?.name,
            r.against?.name,
            r.against?.title,
            r.message,
            r.status,
          ]
            .map((v) => String(v ?? "").toLowerCase())
            .some((v) => v.includes(lower))
        )
      )
    }, 300)

    return () => clearTimeout(handler)
  }, [q, complaints])

  const updateStatus = async (complaintId) => {
   
    setLoading(true)
    
      const [success, data] = await updateComplaintStatusApi(
        complaintId,
        { status: "resolved", _method: "PUT" }
      )
       if (success) {
         console.log("Updated successfully:", data)
         setLoading(false)
         setStatusModalSuccess(true)
         setStatusModalOpen(true)
       } else {
         console.error("Failed to update getter:", data)
         setErrorMsg(data)
         setLoading(false)
         setStatusModalSuccess(false)
         setStatusModalOpen(true)
       }
    }

    const closeStatusModal = () => {
      setStatusModalOpen(false)
      setErrorMsg(null)
   if (statusModalSuccess) {
        setLoading(true)
        getComplaints().finally(() => setLoading(false))
      }
    }

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
        {/* tabs (single) + search */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-4 py-2 w-full">
            <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm text-white">
              Complaints
            </button>
          </div>
        </div>

        {/* table */}
        <div className="rounded-lg shadow-md bg-white overflow-x-auto pt-4 px-3">
          <div className="relative px-3 mb-6">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <img src={searchIcon} alt="Search" className="pl-2" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Name, ID, Phone"
              className="w-80 rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <table className="min-w-full">
            <thead className=" bg-white">
              <tr>
                <Th>No.</Th>
                <Th>Complaint ID</Th>
                <Th>Phone No. (From)</Th>
                <Th>Complaint Against</Th>
                <Th>Date & Time</Th>
                <Th>Message</Th>
                <Th>Status</Th>
                <Th className="text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((r, idx) => (
                <tr key={r.id} className=" last:border-0">
                  <Td>{idx + 1}</Td>
                  <Td>
                    <span className="font-medium">{r?.complaintId}</span>
                  </Td>
                  <Td className="font-medium">{r?.from?.phone}</Td>
                  <Td>{`${r?.against?.name}, ${r?.against?.title}`}</Td>
                  <Td>
                    <div className="whitespace-pre leading-tight">
                      {r?.datetime}
                    </div>
                  </Td>
                  <Td className="max-w-[220px]">
                    <span className="line-clamp-1 text-slate-500">
                      {r?.message}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={r?.status} />
                  </Td>
                  <Td className="flex justify-center">
                    <div className="flex items-center gap-4">
                      <button
                        className="rounded bg-white border-slate-500 text-blue-400 px-3 py-1.5 text-xs hover:bg-slate-50"
                        onClick={() => setModal({ open: true, data: r })}
                      >
                        Details
                      </button>
                      {r.status !== "Resolved" && (
                        <button
                          title="Mark resolved"
                          className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white text-xs hover:bg-emerald-600 border-none focus:outline-none focus:ring-0"
                          onClick={() => updateStatus(r?.complaintId)}
                        >
                          ✓
                        </button>
                      )}
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
    </>
  )
}
