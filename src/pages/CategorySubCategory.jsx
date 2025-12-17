import React, { useEffect, useMemo, useState } from "react"
import CategoryModal from "../components/CatSubCat/CategoryModal"
import SubcategoryModal from "../components/CatSubCat/SubcategoryModal"
import ConfirmPopover from "../components/ui/ConfirmPopover"
import { useOutletContext } from "react-router-dom"
import {
  createCategory,
  createCommonSubCategory,
  createDoctorSubCategory,
  createLawyerSubCategory,
  deleteCategory,
  deleteComSubCat,
  deleteDocSubCat,
  deleteLawyerSubCat,
  getCategories,
  getSubCategories,
  updateCategory,
  updateCommonSubCategory,
  updateDoctorSubCategory,
  updateLawyerSubCategory,
} from "../api/category"
import LoaderModal from "../components/ui/LoaderModal"
import noImage from "/images/noImage.png"
import { FaRegFolder } from "react-icons/fa6"
import searchIcon from "/images/searchIcon.png"
import { getProviderRolesApi } from "../api/UserManagement"
import StatusModal from "../components/ui/StatusModal"
import PopoverConfirm from "../components/ui/PopoverConfirm"

const fmtDate = (d = new Date()) =>
  d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

export default function CategorySubcategory() {
  // ------- seed (mock) data -------
  const [categories, setCategories] = useState([])

  const [subcategories, setSubcategories] = useState([])
  const [providerRoles, setProviderRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [openCat, setOpenCat] = useState(false)
  const [openSub, setOpenSub] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [editingSub, setEditingSub] = useState(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [statusModalSuccess, setStatusModalSuccess] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const { setHeader } = useOutletContext()

  useEffect(() => {
    setHeader({
      title: "Category & Subcategory Management",
      subtitle: "Manage your service categories and subcategories",
    })
  }, [setHeader])

  // popover state
  const [confirm, setConfirm] = useState({
    open: false,
    anchorRect: null,
    onYes: null,
    title: "",
  })

  const [deleteAnchor, setDeleteAnchor] = useState(null)
  const [deleteType, setDeleteType] = useState(null)

  const filteredCats = useMemo(() => {
    if (!query.trim()) return categories
    return categories.filter((c) =>
      `${c.name}`.toLowerCase().includes(query.trim().toLowerCase())
    )
  }, [categories, query])

  const filteredSubs = useMemo(() => {
    if (!query.trim()) return subcategories
    return subcategories.filter(
      (s) =>
        `${s.name}`.toLowerCase().includes(query.trim().toLowerCase()) ||
        categories
          .find((c) => c.id === s.parent_category_id)
          ?.name.toLowerCase()
          .includes(query.trim().toLowerCase())
    )
  }, [subcategories, categories, query])

  // ------- handlers: Category -------
  const handleCreateCat = async (payload) => {
    setLoading(true)
    const [success, data] = await createCategory(payload)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to create category.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const handleUpdateCat = async (payload, id) => {
    setLoading(true)
    const [success, data] = await updateCategory(payload, id)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to update category.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const handleCreateDocSub = async (payload) => {
    setLoading(true)
    const [success, data] = await createDoctorSubCategory(payload)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to create subcategory.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const handleCreateLawyerSub = async (payload) => {
    setLoading(true)
    const [success, data] = await createLawyerSubCategory(payload)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to create subcategory.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const handleCreateComSub = async (payload) => {
    setLoading(true)
    const [success, data] = await createCommonSubCategory(payload)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to create subcategory.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const handleUpdateDocSub = async (id, payload) => {
    setLoading(true)
    const [success, data] = await updateDoctorSubCategory(id, payload)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to create subcategory.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const handleUpdateLawyerSub = async (id, payload) => {
    setLoading(true)
    const [success, data] = await updateLawyerSubCategory(id, payload)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to create subcategory.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const handleUpdateComSub = async (id, payload) => {
    setLoading(true)
    const [success, data] = await updateCommonSubCategory(id, payload)
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      setErrorMsg(data || "Failed to create subcategory.")
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const askDeleteCat = async (id) => {
     setLoading(true)
        const [success, data] = await deleteCategory(id)
        if (success) {
          setLoading(false)
          setStatusModalSuccess(true)
          setStatusModalOpen(true)
          
        } else {
          setLoading(false)
          setStatusModalSuccess(false)
          setStatusModalOpen(true)
          
        }
  }

  const askDeleteSub = async (id, type) => {
    setLoading(true)
    let success, data
    if (type === "doctor") {
      [success, data] = await deleteDocSubCat(id)
    } else if (type === "lawyer") {
      [success, data] = await deleteLawyerSubCat(id)
    } else {
      [success, data] = await deleteComSubCat(id)
    }
    if (success) {
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }

  const getAllCategory = async () => {
    const [success, data] = await getCategories()
    if (success) {
      setCategories(data.data || [])
    } else {
      console.error("Error fetching promo codes:", data)
    }
  }

  const getAllSubCategory = async () => {
    const [success, data] = await getSubCategories()
    if (success) {
      setSubcategories(data.data || [])
    } else {
      console.error("Error fetching promo codes:", data)
    }
  }

  const getProviderRoles = async () => {
    const [success, data] = await getProviderRolesApi()
    if (success) {
      let makeOptions = data?.roles?.map((role) => ({
        value: role.id,
        label: role.name,
      }))
      console.log("Provider roles data:", makeOptions)
      setProviderRoles(makeOptions)
    } else {
      console.error("Error fetching promo codes:", data)
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getAllCategory(),
      getAllSubCategory(),
      getProviderRoles(),
    ]).finally(() => setLoading(false))
  }, [])

  function formatFancyDate(dateInput) {
    const dateObj = new Date(dateInput)
    const day = dateObj.getDate()
    const month = dateObj.toLocaleString("en-US", { month: "long" })
    const year = dateObj.getFullYear()

    // Ordinal logic
    let suffix = "th"
    if (day % 10 === 1 && day !== 11) suffix = "st"
    else if (day % 10 === 2 && day !== 12) suffix = "nd"
    else if (day % 10 === 3 && day !== 13) suffix = "rd"

    return `${day}${suffix} ${month} ${year}`
  }

  const closeStatusModal = () => {
    setStatusModalOpen(false)
    setErrorMsg(null)

    setLoading(true)
    Promise.all([
      getAllCategory(),
      getAllSubCategory(),
      getProviderRoles(),
    ]).finally(() => setLoading(false))
  }


  console.log("Subcategories:", subcategories)

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
      <div className="p-6 ">
        {/* header + search */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <img src={searchIcon} alt="Search" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Category or Subcategory Name"
              className="w-auto sm:w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingCat(null)
                setOpenCat(true)
              }}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Category
            </button>
            <button
              onClick={() => {
                setEditingSub(null)
                setOpenSub(true)
              }}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Subcategory
            </button>
          </div>
        </div>

        {/* Categories table */}
        <div className="rounded-lg shadow-md bg-white overflow-x-auto px-3 pb-2">
          <div className="flex items-center gap-2  px-5 py-3">
            <span className="text-blue-600">
              <FaRegFolder />
            </span>
            <span className="font-medium text-slate-800">Categories</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr className="[&>th]:py-3 [&>th]:px-5 text-slate-500">
                  <th>No.</th>
                  <th>Category Icon</th>
                  <th>Category Name</th>
                  <th>Total Subcategories</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCats.map((c, i) => (
                  <tr key={c.id} className="[&>td]:py-3 [&>td]:px-5">
                    <td>{i + 1}</td>
                    <td className=" ">
                      {c?.icon ? (
                        <div className="p-2 w-fit bg-slate-100">
                          <img src={c.icon} alt={c.name} className="h-6 w-6 " />
                        </div>
                      ) : (
                        <div className="p-2 w-fit bg-slate-100">
                          <img src={noImage} alt={c.name} className="h-6 w-6" />
                        </div>
                      )}
                    </td>
                    <td className="text-slate-800">
                      {c.name
                        ? c.name
                            .split(" ")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")
                        : ""}
                    </td>
                    <td>
                      <span className="rounded-md border-none bg-blue-50 px-3 py-2 text-xs text-blue-600 border">
                        {c.subCount} subcategories
                      </span>
                    </td>
                    <td className="text-slate-500">
                      {formatFancyDate(c.createdAt)}
                    </td>
                    <td className="space-x-2 flex">
                      <button
                        className="rounded border px-3 py-1 text-xs"
                        onClick={() => {
                          setEditingCat(c)
                          setOpenCat(true)
                        }}
                      >
                        Edit
                      </button>
                      <div className="relative">
                        <div className="absolute right-0 top-[-190%] z-50">
                          <PopoverConfirm
                            open={deleteAnchor === c.id}
                            onClose={() => setDeleteAnchor(null)}
                            onYes={() => askDeleteCat(c.id)}
                          />
                        </div>
                        <button
                          className="rounded border bg-white px-3 py-1.5 text-xs  hover:border-red-400 hover:bg-red-50"
                          onClick={() =>
                            setDeleteAnchor((cur) =>
                              cur === c.id ? null : c.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredCats.length && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subcategories table */}
        <div className="mt-6 rounded-lg shadow-md bg-white overflow-x-auto px-3 pb-2">
          <div className="flex items-center gap-2 x px-5 py-3">
            <span className="text-indigo-600">
              <FaRegFolder />
            </span>
            <span className="font-medium text-slate-800">Subcategories</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr className="[&>th]:py-3 [&>th]:px-5 text-slate-500">
                  <th>No.</th>
                  <th>Subcategory Icon</th>
                  <th>Subcategory Name</th>
                  <th>Parent Category</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSubs.map((s, i) => (
                  <tr key={`${s.id}-${s.type}`} className="[&>td]:py-3 [&>td]:px-5">
                    <td>{i + 1}</td>
                    <td className=" ">
                      {s?.icon ? (
                        <div className="p-2 w-fit bg-slate-100">
                          <img src={s.icon} alt={s.name} className="h-6 w-6 " />
                        </div>
                      ) : (
                        <div className="p-2 w-fit bg-slate-100">
                          <img src={noImage} alt={s.name} className="h-6 w-6" />
                        </div>
                      )}
                    </td>
                    <td className="text-slate-800">{s.name}</td>
                    <td className="">
                      <div className="w-fit flex  items-center rounded-md border-none bg-blue-50 px-3 py-2 text-xs text-blue-600 border">
                        <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                        <span className="">
                          {s.parent_category_name
                            ? s.parent_category_name
                                .split(" ")
                                .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1)
                                )
                                .join(" ")
                            : ""}
                        </span>
                      </div>
                    </td>
                    <td className="text-slate-500">
                      {" "}
                      {formatFancyDate(s.createdAt)}
                    </td>
                    <td className="space-x-2 flex">
                      <button
                        className="rounded border px-3 py-1 text-xs"
                        onClick={() => {
                          setEditingSub(s)
                          setOpenSub(true)
                        }}
                      >
                        Edit
                      </button>
                      <div className="relative">
                        <div className="absolute right-0 top-[-190%] z-50">
                          <PopoverConfirm
                            open={deleteAnchor === s.id && deleteType === s.type}
                            onClose={() => {setDeleteAnchor(null) ; setDeleteType(null)}}
                            onYes={() => askDeleteSub(s.id, s.type)}
                          />
                        </div>
                        <button
                          className="rounded border bg-white px-3 py-1.5 text-xs  hover:border-red-400 hover:bg-red-50"
                          onClick={() =>{
                            setDeleteAnchor((cur) =>
                              cur === s.id ? null : s.id
                            );
                            setDeleteType((cur) => (cur === s.type ? null : s.type))
                          }
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredSubs.length && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No subcategories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {openCat && (
          <CategoryModal
            open={openCat}
            onClose={() => {
              setOpenCat(false)
              setEditingCat(null)
            }}
            initial={editingCat}
            onSubmit={(payload, editingId) => {
              if (editingId) handleUpdateCat(payload, editingId)
              else handleCreateCat(payload)
            }}
          />
        )}
        {openSub && (
          <SubcategoryModal
            providerRoles={providerRoles}
            open={openSub}
            onClose={() => {
              setOpenSub(false)
              setEditingSub(null)
            }}
            initial={editingSub}
            onSubmit={(fd, type, editingId) => {
              if (editingId) {
                if (type === "doctor") {
                  handleUpdateDocSub(editingId, fd)
                } else if (type === "lawyer") {
                  handleUpdateLawyerSub(editingId, fd)
                } else {
                  handleUpdateComSub(editingId, fd)
                }
              } else {
                if (type === "doctor") {
                  handleCreateDocSub(fd)
                } else if (type === "lawyer") {
                  handleCreateLawyerSub(fd)
                } else {
                  handleCreateComSub(fd)
                }
              }
            }}
          />
        )}

        {/* Delete popover */}
        <ConfirmPopover
          open={confirm.open}
          anchorRect={confirm.anchorRect}
          title={confirm.title}
          onClose={() => setConfirm({ open: false })}
          onConfirm={() => confirm.onYes?.()}
        />
      </div>
    </>
  )
}
