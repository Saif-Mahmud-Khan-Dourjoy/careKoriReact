import { useEffect, useMemo, useState } from "react"
import StatusDot from "../components/ui/StatusDot"
import PopoverConfirm from "../components/ui/PopoverConfirm"
import PromoCodeModal from "../components/promocode/PromoCodeModal"
import { useOutletContext } from "react-router-dom"
import { createPromoCodeApi, deletePromoCodeApi, getAllPromoCodeApi, getAllRolesForPromoCodeApi, getAllUsersApi, getProviderRolesSpecialityApi, updatePromoCodeApi } from "../api/promocode"
import LoaderModal from "../components/ui/LoaderModal"
import StatusModal from "../components/ui/StatusModal"


const formatPromoData = (apiData) => {
  return apiData.map((promo) => {
    // For each assignment, determine the assignedTo string
    let users_multi=[];
    let roles_multi=[];
    let specs_multi=[];
    let assignType=null
    let role_single=null;
    const assignedToArr = promo.assignments.map((a) => {
      // 1. If user_id is not null: assignedTo = user.name + (user_speciality.specialized_at if exists)
      if (a.user_id) {
        users_multi.push(a.user_id)
        assignType="users"
        let str = a.user?.name || ""
        if (a.user_speciality?.specialized_at) {
          str += ` (${a.user_speciality.specialized_at})`
        } else  {
          str += ` (${a.user.role?.name ? a.user.role.name.charAt(0).toUpperCase() + a.user.role.name.slice(1) : ""})`
        }
        return str
      }
      // 2. If only role_id is not null: assignedTo = role.name + " Category"
      if (a.role_id && !a.speciality_id) {
        roles_multi.push(a.role_id)
        assignType="roles"
        return `${
          a.role?.name
            ? a.role.name.charAt(0).toUpperCase() + a.role.name.slice(1)
            : ""
        } Category`
      }
      // 3. If both role_id and speciality_id are not null: assignedTo = speciality.specialized_at (role.name)
      if (a.role_id && a.speciality_id) {
        role_single = a.role_id
        specs_multi.push(a.speciality_id)
        assignType="role-specialities"
        return `${a.speciality?.specialized_at || ""} (${
          a.role?.name
            ? a.role.name.charAt(0).toUpperCase() + a.role.name.slice(1)
            : ""
        })`
      }
      return ""
    })

    // If no assignments, fallback to empty string
    const assignedTo = assignedToArr.length > 0 ? assignedToArr.join(", ") : ""

    // Format dates (e.g., "26th Jun")
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      if (isNaN(date)) return ""
      const day = date.getDate()
      const month = date.toLocaleString("en-US", { month: "short" })
      return `${day}${
        ["th", "st", "nd", "rd"][
          day % 10 > 3 ? 0 : (day % 100) - (day % 10) != 10 ? day % 10 : 0
        ]
      } ${month}`
    }

    return {
      id: promo.id,
      code: promo.code,
      discountType: promo.discount_type === "percent" ? "percentage" : "amount",
      discount_type: promo.discount_type,
      discount: Number(promo.discount),
      assignedTo,
      startDate: formatDate(promo.valid_from),
      valid_from: promo.valid_from,
      endDate: formatDate(promo.valid_to),
      valid_to: promo.valid_to,
      is_active: !!promo.is_active,
      users_multi,
      roles_multi,
      specs_multi,
      role_single,
      assignType,
    }
  })
}

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
  const [rows, setRows] = useState([])
  const [filteredPromo, setFilteredPromo] = useState([])

  const [modal, setModal] = useState({ open: false, initial: null }) 
  const [deleteAnchor, setDeleteAnchor] = useState(null) 
  const [roles, setRoles] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [providerRoleOptions, setProviderRoleOptions] = useState([])
  const [users, setUsers] = useState([])
  const [userOptions, setUserOptions] = useState([])
  const [providerRolesSpecialityOptions, setProviderRolesSpecialityOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [statusModalSuccess, setStatusModalSuccess] = useState(null);


  const getAllPromoCode = async () => {
    const [success, data] = await getAllPromoCodeApi()  
    if (success) {

     setRows(formatPromoData(data?.promocodes || []))
     setFilteredPromo(formatPromoData(data?.promocodes || []))
      // console.log("Fetched promo codes:", data)
      // setRows(data?.promoCodes || [])
    } else {
      console.error("Error fetching promo codes:", data)
    }
  }

  const getAllRoles = async () => {
    const [success, data] = await getAllRolesForPromoCodeApi()
    if (success) {
      console.log("Fetched roles:", data)
      setRoles(data?.roles || [])
      const options = (data?.roles || []).map((r) => ({
        label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
        value: r.id,
      }))
      
      setRoleOptions(options)
      setProviderRoleOptions( options?.filter((role) => role.label.toLowerCase() != "customer"))
    } else {
      console.error("Error fetching roles:", data)
    }
  }

  const getAllUsers = async () => {
    const [success, data] = await getAllUsersApi()
    if (success) {
      console.log("Fetched users:", data)
      setUsers(data?.users || [])
      const options = (data?.users || []).map((r) => ({
        label: `${r.name.charAt(0).toUpperCase() + r.name.slice(1)} (${r?.role?.name ? r.role.name?.charAt(0).toUpperCase() + r.role.name?.slice(1)  : ""})`,
        value: r.id,
      }))
      console.log("User options:", options)
      setUserOptions(options)
    } else {
      console.error("Error fetching users:", data)
    }
  }

  const getProviderRolesSpeciality = async () => {
    const [success, data] = await getProviderRolesSpecialityApi()
    if (success) {
      console.log(
        "Fetched provider roles and specialities:",
        data?.roleSpecialities
      )
      setProviderRolesSpecialityOptions(data?.roleSpecialities || [])
    } else {
      console.error("Error fetching provider roles and specialities:", data)
    }
  }

  const createPromoCode = async (payload) => {
    setLoading(true)
    const [success, data] = await createPromoCodeApi(payload)
    if (success) {
       setLoading(false)
       setStatusModalSuccess(true);
       setStatusModalOpen(true);
      console.log("Promo code created successfully:", data)
      
    } else {
      setLoading(false)
      setStatusModalSuccess(false);
      setStatusModalOpen(true);
      console.error("Error creating promo code:", data)
    }
  }

  const updatePromoCode = async (payload) => {
     setLoading(true)
     const [success, data] = await updatePromoCodeApi(modal.initial.id, payload)
     if (success) {
       setLoading(false)
       setStatusModalSuccess(true)
       setStatusModalOpen(true)
       console.log("Promo code updated successfully:", data)
     } else {
       setLoading(false)
       setStatusModalSuccess(false)
       setStatusModalOpen(true)
       console.error("Error updating promo code:", data)
     }
  }

  const deletePromoCode = async (id) => {
    setLoading(true)
    const [success, data] = await deletePromoCodeApi(id)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
      console.log("Promo code deleted successfully:", data)
    } else {
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
      console.error("Error deleting promo code:", data)
    }
  } 

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getAllPromoCode(),
      getAllRoles(),
      getAllUsers(),
      getProviderRolesSpeciality(),
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  const closeStatusModal = () => {
    setStatusModalOpen(false)
    if (statusModalSuccess) {
    setLoading(true)
    getAllPromoCode().finally(() => setLoading(false))
    }
  }

  // const filtered = useMemo(() => {
  //   if (!q) return rows
  //   const s = q.toLowerCase()
  //   return rows.filter((r) =>
  //     `${r.code} ${r.assignedTo}`.toLowerCase().includes(s)
  //   )
  // }, [q, rows])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!q) {
        setFilteredPromo(rows)
        return
      }
      const s = q.toLowerCase()
      setFilteredPromo(
        rows.filter((r) =>
          `${r.code}`.toLowerCase().includes(s)
        )
      )
    }, 300)
    return () => clearTimeout(handler)
  }, [q, rows])

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
            {filteredPromo.map((r, idx) => (
              <tr key={r?.id} className="border-b last:border-0">
                <Td>{idx + 1}</Td>
                <Td className="font-medium">{r?.code}</Td>
                <Td className={r?.discountType === "amount" ? "" : ""}>
                  {r?.discountType === "amount"
                    ? `${r?.discount}Tk`
                    : `${r?.discount}%`}
                </Td>
                <Td className="max-w-[280px]">
                  <div className="line-clamp-2 text-slate-700">
                    {r?.assignedTo}
                  </div>
                </Td>
                <Td>
                  <div className="leading-tight">
                    {r?.startDate}
                    <br />
                    {r?.endDate}
                  </div>
                </Td>
                <Td>
                  <StatusDot active={r?.is_active} />
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
                          onYes={() => deletePromoCode(r.id)}
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
        onSubmit={modal.initial ? updatePromoCode : createPromoCode}
        roleOptions={roleOptions}
        providerRoleOptions={providerRoleOptions}
        userOptions={userOptions}
        providerRolesSpecialityOptions={providerRolesSpecialityOptions}
      />
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
      />
    </div>
  )
}
