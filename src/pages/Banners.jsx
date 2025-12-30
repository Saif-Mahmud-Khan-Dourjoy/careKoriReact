/* eslint-disable */
import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import LoaderModal from "../components/ui/LoaderModal"

import BannerModal from "../components/banner/BannerModal"
import { getAllRolesForPromoCodeApi } from "../api/promocode" // you already have roles api
import {
  getAllBanner,
  createBannerApi,
  createRoleSpecificBannerApi,
} from "../api/Banner"
import StatusModal from "../components/ui/StatusModal"

const Th = ({ children, className = "" }) => (
  <th
    className={`px-4 py-3 text-left text-sm font-semibold text-slate-500 ${className}`}
  >
    {children}
  </th>
)
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>
    {children}
  </td>
)

export default function Banners() {
  const { setHeader } = useOutletContext()

  useEffect(() => {
    setHeader({
      title: "Welcome to Banners",
      subtitle: "Manage banner images here.",
    })
  }, [setHeader])

  const [rows, setRows] = useState([])
  const [roles, setRoles] = useState([])
  const [roleOptions, setRoleOptions] = useState([])

  const [loading, setLoading] = useState(false)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [statusModalSuccess, setStatusModalSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")



  const [modal, setModal] = useState({ open: false, initial: null })

  const loadAll = async () => {
    setLoading(true)
    try {
      const [bSuccess, bData] = await getAllBanner()
      if (bSuccess) {
        setRows(bData?.banners || [])
      }

      const [rSuccess, rData] = await getAllRolesForPromoCodeApi()
      if (rSuccess) {
        const rs = rData?.roles || []
        setRoles(rs)
        setRoleOptions(
          rs.map((r) => ({
            label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
            value: r.id,
          }))
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])



  const createBanner = async (formData, isRoleSpecific, roleId=null) => {
    setLoading(true)
    try {
      const [success,data] = isRoleSpecific
        ? await createRoleSpecificBannerApi(roleId, formData)
        : await createBannerApi(formData)

      setStatusModalSuccess(!!success)
      setErrorMsg(success ? "" : data)
      setStatusModalOpen(true)
    } finally {
      setLoading(false)
    }
  }



  const roleNameById = (roleId) => {
    if (!roleId) return "All"
    const r = roles.find((x) => x.id === roleId)
    return r?.name ? r.name.charAt(0).toUpperCase() + r.name.slice(1) : "N/A"
  }

   const closeStatusModal = () => {
     setStatusModalOpen(false)
     if (statusModalSuccess) {
       loadAll()
     }
   }

  return (
    <div className="">
      <div className="rounded-lg shadow-md bg-white overflow-x-auto px-3 pb-2">
        {/* No search; minimal header row */}
        <div className="flex items-center justify-between gap-3 pt-4 px-3 mb-6">
          <div className="text-lg font-bold text-slate-700">Banner List</div>

          {/* If you truly want NO action button, remove this */}
          <button
            onClick={() => setModal({ open: true, initial: null })}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm text-white hover:bg-blue-700"
          >
            Add Banner
          </button>
        </div>

        <table className="min-w-full">
          <thead className=" bg-white">
            <tr className="border-b">
              <Th>Serial</Th>
              <Th>Banner Image</Th>
              <Th>Is Role Specific</Th>
              <Th>Role For</Th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                className={
                  idx !== rows.length - 1
                    ? "border-b border-slate-200"
                    : ""
                }
              >
                <Td>{idx + 1}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={r.add_image}
                      alt="banner"
                      className="h-20 object-cover"
                    />
                  </div>
                </Td>
                <Td>
                  {r.role_id ? (
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">
                      Yes
                    </span>
                  ) : (
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">
                      No
                    </span>
                  )}
                </Td>
                <Td>{roleNameById(r.role_id)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BannerModal
        open={modal.open}
        onClose={() => setModal({ open: false, initial: null })}
        roleOptions={roleOptions}
        onSubmit={createBanner}
      />

      <LoaderModal
        open={loading}
        title="In Progress"
        subtitle="Please wait while loading."
        dimBackdrop
        blurBackdrop
      />
      {/* Status Modal */}
      <StatusModal
        open={statusModalOpen}
        onClose={closeStatusModal}
        success={statusModalSuccess}
        errorMsg={errorMsg}
      />
    </div>
  )
}
