import { useCallback, useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import GetterDetailsModal from "../components/userManagement/GetterDetailsModal"
import ProviderDetailsModal from "../components/userManagement/ProviderDetailsModal"
import ModeratorDetailsModal from "../components/userManagement/ModeratorDetailsModal"
import PopoverConfirm from "../components/ui/PopoverConfirm"
import ProviderModal from "../components/userManagement/ProviderModal"
import GetterModal from "../components/userManagement/GetterModal"
import ModeratorModal from "../components/userManagement/ModeratorModal"
import { addApi, createModeratorApi, deleteGetterApi, deleteModeratorApi, getAllGettersApi, getAllModeratorsApi, getAllProvidersApi, getProviderRolesApi, updateCommonApi, updateDoctorApi, updateGetterApi, updateLawyerApi, updateModeratorApi } from "../api/UserManagement"
import LoaderModal from "../components/ui/LoaderModal"
import StatusModal from "../components/ui/StatusModal"
import { useAuth } from "../context/AuthContext"
import { approveProviderApi, deleteProviderApi } from "../api/dashboard"
import { getProviderRolesSpecialityApi } from "../api/promocode"
import addIcon from "/images/user-add.png"
import searchIcon from "/images/searchIcon.png"
import noImage from "/images/noImage.png"






function Tabs({ value, onChange }) {
  const tabs = ["Getters", "Providers", "Moderators"]
  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-full px-4 py-1.5 text-sm transition border-none focus:outline-none focus:ring-0 ${
            value === t
              ? "bg-blue-600 text-white "
              : " text-slate-700 bg-white hover:bg-slate-200"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// const TARGET_TZ = "Asia/Dhaka"

// // Map your backend day strings -> day index where 0=Mon..6=Sun
// const dayNameToIdx = {
//   monday: 0,
//   tuesday: 1,
//   wednesday: 2,
//   thursday: 3,
//   friday: 4,
//   saturday: 5,
//   sunday: 6,
// }

// // Reverse: 0=Mon..6=Sun -> day string
// const idxToDayName = [
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
//   "sunday",
// ]

// // A known Monday anchor in UTC (Jan 1, 2024 is Monday)
// const ANCHOR_YEAR = 2024,
//   ANCHOR_MONTH = 0,
//   ANCHOR_MONDAY_DAY = 1

// // ---- HELPERS ----
// const parseHMS = (t) => {
//   const [h, m, s = "0"] = t.split(":")
//   return { h: +h, m: +m, s: +s }
// }

// const fmt = new Intl.DateTimeFormat("en-GB", {
//   timeZone: TARGET_TZ,
//   weekday: "long",
//   hour: "2-digit",
//   minute: "2-digit",
//   hour12: false,
// })

// const toLocalWeekdayAndHM = (date) => {
//   const parts = fmt.formatToParts(date)
//   const weekday = parts.find((p) => p.type === "weekday").value.toLowerCase() // e.g., "tuesday"
//   const hour = parts.find((p) => p.type === "hour").value.padStart(2, "0")
//   const minute = parts.find((p) => p.type === "minute").value.padStart(2, "0")
//   return { weekday, hm: `${hour}:${minute}` }
// }

// // Build a UTC Date by anchoring the weekday and clock time to the anchor week
// const buildUtcDate = (
//   utcDayIdx /* 0=Mon..6=Sun */,
//   timeStr /* HH:mm[:ss] */
// ) => {
//   const { h, m, s } = parseHMS(timeStr)
//   // Jan 1, 2024 (Mon) + utcDayIdx gives the correct weekday in UTC
//   return new Date(
//     Date.UTC(ANCHOR_YEAR, ANCHOR_MONTH, ANCHOR_MONDAY_DAY + utcDayIdx, h, m, s)
//   )
// }

// // Convert one UTC slot to 1–2 local slots (splits if it crosses midnight locally)
// const convertUtcSlotToLocalSlots = (dayStrUTC, startUTC, endUTC) => {
//   const utcDayIdx = dayNameToIdx[dayStrUTC.toLowerCase()]
//   if (utcDayIdx == null) return []

//   const startDateUTC = buildUtcDate(utcDayIdx, startUTC)
//   const endDateUTC = buildUtcDate(utcDayIdx, endUTC)

//   const startLocal = toLocalWeekdayAndHM(startDateUTC) // { weekday, hm }
//   const endLocal = toLocalWeekdayAndHM(endDateUTC) // { weekday, hm }

//   // If the slot stays within the same local day → single slot
//   if (startLocal.weekday === endLocal.weekday) {
//     return [
//       {
//         day: startLocal.weekday, // "monday".."sunday"
//         start_time: startLocal.hm, // "HH:mm"
//         end_time: endLocal.hm, // "HH:mm"
//       },
//     ]
//   }

//   // Otherwise, split across midnight so each piece is on a single day
//   return [
//     {
//       day: startLocal.weekday,
//       start_time: startLocal.hm,
//       end_time: "23:59", // clamp to end of day
//     },
//     {
//       day: endLocal.weekday,
//       start_time: "00:00",
//       end_time: endLocal.hm,
//     },
//   ]
// }
// // ---- Grouping with conversion ----

// // ---- MAIN GROUPING ----
// const groupAvailabilitiesLocal = (availabilities) => {
//   if (!Array.isArray(availabilities)) return [];

//   const grouped = {};

//   for (const curr of availabilities) {
//     const slots = convertUtcSlotToLocalSlots(curr.day, curr.start_time, curr.end_time);

//     for (const s of slots) {
//       const key = `${curr.availability_type}_${s.day}`;
//       if (!grouped[key]) {
//         grouped[key] = {
//           availability_type: curr.availability_type,
//           day: s.day, // already lowercase weekday string
//           time_slots: [],
//         };
//       }
//       grouped[key].time_slots.push({
//         start_time: s.start_time,
//         end_time: s.end_time,
//       });
//     }
//   }

//   // Optional: sort time slots in each group
//   for (const g of Object.values(grouped)) {
//     g.time_slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
//   }

//   return Object.values(grouped);
// };

// const groupAvailabilities = (availabilities) => {
//   if (!Array.isArray(availabilities)) return []
//   return Object.values(
//     availabilities.reduce((acc, curr) => {
//       const key = `${curr.availability_type}_${curr.day}`
//       if (!acc[key]) {
//         acc[key] = {
//           availability_type: curr.availability_type,
//           day: curr.day,
//           time_slots: [],
//         }
//       }
//       acc[key].time_slots.push({
//         start_time: curr.start_time.slice(0, 5),
//         end_time: curr.end_time.slice(0, 5),
//       })
//       return acc
//     }, {})
//   )
// }

// ---- CONFIG ----
const TARGET_TZ = "Asia/Dhaka";

// day strings -> 0=Mon..6=Sun
const dayNameToIdx = {
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6,
};
const idxToDayName = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

// A known Monday anchor in UTC (Jan 1, 2024 is Monday)
const ANCHOR_YEAR = 2024, ANCHOR_MONTH = 0, ANCHOR_MONDAY_DAY = 1;

// ---- HELPERS ----
const parseHMS = (t) => {
  const [h, m, s = "0"] = t.split(":");
  return { h: +h, m: +m, s: +s };
};

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TARGET_TZ,
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const toLocalWeekdayAndHMS = (date) => {
  const parts = fmt.formatToParts(date);
  const weekday = parts.find(p => p.type === "weekday").value.toLowerCase();
  const hh = parts.find(p => p.type === "hour").value.padStart(2, "0");
  const mm = parts.find(p => p.type === "minute").value.padStart(2, "0");
  const ss = parts.find(p => p.type === "second").value.padStart(2, "0");
  return { weekday, hms: `${hh}:${mm}:${ss}` };
};

const buildUtcDate = (utcDayIdx, timeStr /* HH:mm[:ss] */) => {
  const { h, m, s } = parseHMS(timeStr);
  return new Date(Date.UTC(ANCHOR_YEAR, ANCHOR_MONTH, ANCHOR_MONDAY_DAY + utcDayIdx, h, m, s));
};

// Convert one UTC slot to 1–2 local slots (split if crosses midnight locally)
const convertUtcSlotToLocalSlots = (dayStrUTC, startUTC, endUTC) => {
  const utcDayIdx = dayNameToIdx[dayStrUTC.toLowerCase()];
  if (utcDayIdx == null) return [];

  const startDateUTC = buildUtcDate(utcDayIdx, startUTC);
  const endDateUTC   = buildUtcDate(utcDayIdx, endUTC);

  const startLocal = toLocalWeekdayAndHMS(startDateUTC); // { weekday, hms }
  const endLocal   = toLocalWeekdayAndHMS(endDateUTC);   // { weekday, hms }

  if (startLocal.weekday === endLocal.weekday) {
    return [{
      day: startLocal.weekday,
      start_time: startLocal.hms,
      end_time: endLocal.hms,
    }];
  }

  // split across midnight
  return [
    {
      day: startLocal.weekday,
      start_time: startLocal.hms,
      end_time: "23:59:59",
    },
    {
      day: endLocal.weekday,
      start_time: "00:00:00",
      end_time: endLocal.hms,
    },
  ];
};

// sort by HH:mm:ss
const cmpHMS = (a, b) => a.localeCompare(b);

// ---- MAIN GROUPING ----
const groupAvailabilitiesLocal = (availabilities) => {
  if (!Array.isArray(availabilities)) return [];

  const grouped = {};

  for (const curr of availabilities) {
    const slots = convertUtcSlotToLocalSlots(curr.day, curr.start_time, curr.end_time);

    for (const s of slots) {
      const key = `${curr.availability_type}_${s.day}`;
      if (!grouped[key]) {
        grouped[key] = {
          availability_type: curr.availability_type,
          day: s.day,
          time_slots: [],
        };
      }
      grouped[key].time_slots.push({
        start_time: s.start_time.slice(0,5),
        end_time: s.end_time.slice(0,5),
      });
    }
  }

  // sort time slots within each day
  for (const g of Object.values(grouped)) {
    g.time_slots.sort((a, b) => cmpHMS(a.start_time, b.start_time));
  }

  return Object.values(grouped);
};

export default function UserManagement() {
  const { user } = useAuth()
  console.log(user)
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

  const [getters, setGetters] = useState([]);
  const [filteredGetters, setFilteredGetters] = useState([]);
  const [providers, setProviders] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [filteredModerators, setFilteredModerators] = useState([]);
  const [getterRole, setGetterRole] = useState(null);
  const [moderatorRole, setModeratorRole] = useState(null);

  const [getterInitial, setGetterInitial] = useState(null);
  const [providerInitial, setProviderInitial] = useState(null);
  const [moderatorInitial, setModeratorInitial] = useState(null);

  const [loading, setLoading] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalSuccess, setStatusModalSuccess] = useState(null);
  const [providerRoles, setProviderRoles] = useState([]);
  const [providerSpeciality,setProviderSpeciality]=useState([])
  const [errorMsg,setErrorMsg]=useState(null)

   const getAllGetters = async () => {
     const [success, data] = await getAllGettersApi()
     if (success) {
       console.log("Getters data:", data)
       setGetters(data?.customers)
       setFilteredGetters(data?.customers)
       setGetterRole(
         data?.customers?.length > 0 ? data?.customers[0]?.role_id : null
       )
     } else {
       console.error("Failed to fetch getters:", data)
     }
   }

   const deleteGetter = async (uniqueUserId) => {
    setLoading(true)
     const [success, data] = await deleteGetterApi(uniqueUserId)
     if (success) {
       console.log("Deleted successfully:", data)
        setLoading(false)
       setStatusModalSuccess(true)
       setStatusModalOpen(true)
     } else {
       console.error("Failed to delete getter:", data)
        setLoading(false)
       setStatusModalSuccess(false)
       setStatusModalOpen(true)
     }
   }  

     const addData = async (formData) => {
       setLoading(true)
       const [success, data] = await addApi(formData)
       if (success) {
         console.log("Added successfully:", data)
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

   const updateGetter = async (uniqueUserId, formData) => {
     setLoading(true)
     const [success, data] = await updateGetterApi(uniqueUserId, formData)
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

  const getAllModerators= async () => {
    const [success, data] = await getAllModeratorsApi()
    if (success) {
      console.log("Moderators data:", data)
      let filteredData = data?.moderators?.filter(item => item?.unique_user_id != user?.unique_user_id)

      setModerators(filteredData)
      setFilteredModerators(filteredData)
      setModeratorRole(
        filteredData?.length > 0 ? filteredData[0]?.role_id : null
      )
    } else {
      console.error("Failed to fetch moderators:", data)
    }
  }



  const addModerator = async (formData) => {
    setLoading(true)
    const [success, data] = await createModeratorApi(formData)
    if (success) {
      console.log("Added successfully:", data)
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

  const updateModerator = async (uniqueUserId, formData) => {
    setLoading(true)
    const [success, data] = await updateModeratorApi(uniqueUserId, formData)
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

  const deleteModerator = async (uniqueUserId) => {
    setLoading(true)
    const [success, data] = await deleteModeratorApi(uniqueUserId)
    if (success) {
      console.log("Deleted successfully:", data)
      setLoading(false)
      setStatusModalSuccess(true)
      setStatusModalOpen(true)
    } else {
      console.error("Failed to delete moderator:", data)
      setLoading(false)
      setStatusModalSuccess(false)
      setStatusModalOpen(true)
    }
  }  

 const getAllProviders = async () => {
   const [success, data] = await getAllProvidersApi()
   if (success) {
    console.log("Raw Providers data:", data)
      const transformedProviders = (data?.providers || []).map((provider) => ({
        ...provider,
        availabilities: groupAvailabilitiesLocal(
          provider.availabilities
        ),
      }))
     console.log("Providers data:", transformedProviders)
     setProviders(transformedProviders)
     setFilteredProviders(transformedProviders)
   } else {
     console.error("Failed to fetch providers:", data)
   }
 }

   const approveProvider = async (uniqueUserId) => {
    setLoading(true)
      const [success, data] = await approveProviderApi(uniqueUserId)
       if (success) {
         console.log("Approved successfully:", data)
         setLoading(false)
         setStatusModalSuccess(true)
         setStatusModalOpen(true)
       } else {
         console.error("Failed to approve provider:", data)
         setLoading(false)
         setStatusModalSuccess(false)
         setStatusModalOpen(true)
       }
    }

    const deleteProvider = async (uniqueUserId) => {
     setLoading(true)
     const [success, data] = await deleteProviderApi(uniqueUserId)
     if (success) {
       console.log("Deleted successfully:", data)
       setLoading(false)
       setStatusModalSuccess(true)
       setStatusModalOpen(true)
     } else {
       console.error("Failed to delete provider:", data)
       setLoading(false)
       setStatusModalSuccess(false)
       setStatusModalOpen(true)
     }
    }

    const getProviderRoles = async () => {
      setLoading(true)
      const [success, data] = await getProviderRolesApi()
      if (success) {
        let makeOptions = data?.roles?.map((role) => ({
          value: role.id,
          label: role.name,
        }))
        console.log("Provider roles data:", makeOptions)
        setProviderRoles(makeOptions)
      } else {
        console.error("Failed to fetch provider roles:", data)
      }
      setLoading(false)
    }

     const getProviderRolesSpeciality = async () => {
       const [success, data] = await getProviderRolesSpecialityApi()
       if (success) {
         console.log(
           "Fetched provider role's specialities:",
           data?.roleSpecialities
         )
         setProviderSpeciality(data?.roleSpecialities || [])
       } else {
         console.error("Error fetching provider role's specialities:", data)
       }
     }

     const updateDoctor = async (uniqueUserId, formData) => {
       setLoading(true)
       const [success, data] = await updateDoctorApi(uniqueUserId, formData)
       if (success) {
         console.log("Updated successfully:", data)
         setLoading(false)
         setStatusModalSuccess(true)
         setStatusModalOpen(true)
       } else {
         console.error("Failed to update doctor:", data)
         setLoading(false)
         setStatusModalSuccess(false)
         setStatusModalOpen(true)
       }
     }

     const updateLawyer = async (uniqueUserId, formData) => {
       setLoading(true)
       const [success, data] = await updateLawyerApi(uniqueUserId, formData)
       if (success) {
         console.log("Updated successfully:", data)
         setLoading(false)
         setStatusModalSuccess(true)
         setStatusModalOpen(true)
       } else {
         console.error("Failed to update lawyer:", data)
         setLoading(false)
         setStatusModalSuccess(false)
         setStatusModalOpen(true)
       }
     }

     const updateCommon = async (uniqueUserId, formData) => { 
        setLoading(true)
        const [success, data] = await updateCommonApi(uniqueUserId, formData)
        if (success) {
          console.log("Updated successfully:", data)
          setLoading(false)
          setStatusModalSuccess(true)
          setStatusModalOpen(true)
        } else {
          console.error("Failed to update common:", data)
          setLoading(false)
          setStatusModalSuccess(false)
          setStatusModalOpen(true)
        }
      }

useEffect(() => {
  const handler = setTimeout(() => {
    const s = q.toLowerCase()
    if (tab === "Getters") {
      setFilteredGetters(
        !q
          ? getters
          : getters.filter((r) =>
              `${r.name} ${r.unique_user_id} ${r.phone}`.toLowerCase().includes(s)
            )
      )
    } else if (tab === "Providers") {
      setFilteredProviders(
        !q
          ? providers
          : providers.filter((r) =>
              `${r.phone} ${r.name} ${r?.profile?.registration_no || r?.profile?.bar_registration_no || r?.profile?.unique_identification?.unique_identification_no
                 }`
                .toLowerCase()
                .includes(s)
            )
      )
    } else if (tab === "Moderators") {
      setFilteredModerators(
        !q
          ? moderators
          : moderators.filter((r) =>
              `${r.name} ${r.unique_user_id} ${r.phone}`
                .toLowerCase()
                .includes(s)
            )
      )
    }
  }, 300)
  return () => clearTimeout(handler)
}, [q, tab, getters, providers, moderators])

  const removeGetter = useCallback(async (uniqueUserId) => {
    await deleteGetter(uniqueUserId);
  }, [])
  const removeProvider = useCallback(async (id) => {
    console.log("Remove provider with id:", id)
  }, [])
  const removeModerator = useCallback(async (uniqueUserId) => {
    await deleteModerator(uniqueUserId)
  }, [])





  useEffect(() => {
    
    if(tab==="Getters"){
      setLoading(true)
      getAllGetters().finally(() => setLoading(false))
    }
    else if (tab === "Moderators") {
      setLoading(true)
      getAllModerators().finally(() => setLoading(false))
    }
    else if (tab === "Providers") {
      setLoading(true)
      Promise.all([
        getAllProviders(),
        getProviderRoles(),
        getProviderRolesSpeciality(),
      ]).finally(() => setLoading(false))
    }
  }, [tab]);


  const closeStatusModal = () => {
    setStatusModalOpen(false)
    setErrorMsg(null)
    if (statusModalSuccess && tab === "Getters") {
      setLoading(true)
      getAllGetters().finally(() => setLoading(false))
    }
    else if (statusModalSuccess && tab === "Providers") {
      setLoading(true)
      getAllProviders().finally(()=> setLoading(false))
    }
    else if (statusModalSuccess && tab === "Moderators") {
      setLoading(true)
      getAllModerators().finally(() => setLoading(false))
    }
  }


console.log("Filtered Providers:", filteredProviders)

  
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

      <div className="py-3 px-5 mb-8 bg-white ">
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
      </div>
      <div>
        <div className="flex justify-between items-center bg-white px-2 pt-4 ">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <img src={searchIcon} alt="Search" />
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
              onClick={() => {setAddGetterOpen(true); setGetterInitial(null)}}
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2.5 border-none focus:outline-none focus:ring-0"
            >
              <div className="flex gap-2">
                <img src={addIcon} alt="" /> Add Getter
              </div>
            </button>
          )}
          {tab === "Providers" && (
            <button
              onClick={() => {setAddProviderOpen(true); setProviderInitial(null)}}
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2.5 border-none focus:outline-none focus:ring-0"
            >
              <div className="flex gap-2">
                <img src={addIcon} alt="" /> Add Provider
              </div>
            </button>
          )}
          {tab === "Moderators" && (
            <button
              onClick={() => {setAddModeratorOpen(true); setModeratorInitial(null)}}
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2.5 border-none focus:outline-none focus:ring-0"
            >
              <div className="flex gap-2">
                <img src={addIcon} alt="" /> Add Moderator
              </div>
            </button>
          )}
        </div>

        {/* table card */}
        <div className=" bg-white pt-6 pb-2 shadow-md">
          {tab === "Getters" && (
            <GetterTable
              rows={filteredGetters}
              setGetterInitial={setGetterInitial}
              setAddGetterOpen={setAddGetterOpen}
              removeGetter={removeGetter}
            />
          )}
          {tab === "Providers" && (
            <ProviderTable
              rows={filteredProviders}
              setProviderInitial={setProviderInitial}
              setAddProviderOpen={setAddProviderOpen}
              removeProvider={removeProvider}
              approveProvider={approveProvider}
              deleteProvider={deleteProvider}
            />
          )}
          {tab === "Moderators" && (
            <ModeratorTable
              rows={filteredModerators}
              setModeratorInitial={setModeratorInitial}
              setAddModeratorOpen={setAddModeratorOpen}
              removeModerator={removeModerator}
            />
          )}
        </div>

        {/* MODALS */}
        <GetterModal
          open={addGetterOpen}
          onClose={() => {
            setAddGetterOpen(false)
            setGetterInitial(null)
          }}
          initial={getterInitial}
          onSubmit={addData}
          onEdit={updateGetter}
          getterRole={getterRole}
        />
        <ProviderModal
          key={
            addProviderOpen && !providerInitial
              ? "add"
              : providerInitial?.id || "edit"
          }
          open={addProviderOpen}
          onClose={() => {
            setAddProviderOpen(false), setProviderInitial(null)
          }}
          initial={providerInitial}
          providerRoles={providerRoles}
          providerSpeciality={providerSpeciality}
          onSubmit={addData}
          onUpdateDoctor={updateDoctor}
          onUpdateLawyer={updateLawyer}
          onUpdateCommon={updateCommon}
        />
        <ModeratorModal
          open={addModeratorOpen}
          onClose={() => {
            setModeratorInitial(null)
            setAddModeratorOpen(false)
          }}
          initial={moderatorInitial}
          onSubmit={addModerator}
          onEdit={updateModerator}
          moderatorRole={moderatorRole}
        />
        {/* <GetterDetailsModal
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
      /> */}
      </div>
    </>
  )
}

/* ------------ TABLES ------------- */

function Th({ className=null, children }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 ${className}`}>
      {children}
    </th>
  )
}
function Td({ className=null, children }) {
  return <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>
}

function GetterTable({ rows, setGetterInitial, setAddGetterOpen, removeGetter }) {
  const [deleteGetterAnchor, setDeleteGetterAnchor] = useState(null) 

  const removeRow = async (uniqueUserId) => {
    await removeGetter(uniqueUserId)
  }
  const handleClick = (record) => {
    
    // setRecordToEdit(record);
    // setAddGetterDetailsOpen(true)
    setGetterInitial(record);
    setAddGetterOpen(true);
    
    
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full ">
        <thead className=" bg-white">
          <tr>
            <Th>No.</Th>
            <Th>Name & ID</Th>
            <Th>Phone</Th>
            <Th>Gender</Th>
            <Th>Date of Birth</Th>
            <Th>Address</Th>
            <Th className="text-center">Action</Th>
          </tr>
        </thead>
        <tbody className="">
          {rows.map((r, i) => (
            <tr key={r.id} className=" last:border-0">
              <Td>{i + 1}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  {r?.customer_profile?.avatar ? (
                    <img
                      src={r.customer_profile.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <img
                      src={noImage}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div>
                    <span className="font-medium">{r.name}</span>
                    <span className="text-xs text-slate-400">{` (${r.unique_user_id})`}</span>
                  </div>
                </div>
              </Td>
              <Td className="font-medium">{r.phone}</Td>
              <Td>{r.customer_profile?.gender}</Td>
              <Td>{r.customer_profile?.dob}</Td>
              <Td>{r.customer_profile?.address}</Td>
              <Td className="flex justify-center ">
                <div className="flex gap-2">
                  <button
                    className="rounded border border-slate-500 px-3 py-1.5 text-xs hover:bg-slate-50"
                    onClick={() => handleClick(r)}
                  >
                    Edit
                  </button>
                  <div className="relative">
                    <div className="absolute right-0 top-[-190%] z-50">
                      <PopoverConfirm
                        open={deleteGetterAnchor === r.id}
                        onClose={() => setDeleteGetterAnchor(null)}
                        onYes={() => removeRow(r.unique_user_id)}
                      />
                    </div>
                    <button
                      className="rounded border border-slate-500 px-3 py-1.5 text-xs hover:border-red-400   hover:bg-red-50 "
                      onClick={() =>
                        setDeleteGetterAnchor((cur) =>
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

function ProviderTable({ rows, setProviderInitial, setAddProviderOpen, removeProvider , approveProvider, deleteProvider }) {
  const [deleteProviderAnchor, setDeleteProviderAnchor] = useState(null)
  const [acceptProviderAnchor, setAcceptProviderAnchor] = useState(null)
  const [rejectProviderAnchor, setRejectProviderAnchor] = useState(null)

  const removeRow = async (uniqueUserId) => {
    await deleteProvider(uniqueUserId)
  }
  const approveRow = async (uniqueUserId) => {
    await approveProvider(uniqueUserId)
  }
  const handleClick = (record) => {
    setProviderInitial(record)
    setAddProviderOpen(true)
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full">
        <thead className="bg-white">
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Unique ID</Th>
            <Th>Phone</Th>
            <Th>Pricing</Th>
            <Th>Gender</Th>
            <Th>Date of Birth</Th>
            <Th>District</Th>
            <Th>Thana</Th>
            <Th>Identification No.</Th>
            <Th>Registration No.</Th>
            <Th>Address</Th>
            <Th>Payment Type</Th>
            <Th>Payment Account</Th>
            <Th>Bank Name</Th>
            <Th>Account Title</Th>
            <Th>Speciality</Th>
            <Th className="text-center">Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="last:border-0">
              <Td>{r?.name || null}</Td>
              <Td>{r?.email || null}</Td>
              <Td>{r?.unique_user_id || null}</Td>
              <Td>{r?.phone || null}</Td>
              <Td>{r?.profile?.pricing || null}</Td>
              <Td>{r?.profile?.gender || null}</Td>
              <Td>{r?.profile?.dob || null}</Td>
              <Td>{r?.profile?.district || null}</Td>
              <Td>{r?.profile?.thana || null}</Td>
              <Td>{r?.profile?.identification_no || null}</Td>
              <Td>
                {r?.profile_type == "doctor"
                  ? r?.profile?.registration_no
                  : r?.profile_type == "lawyer"
                  ? r?.profile?.bar_registration_no
                  : r?.profile?.unique_identification?.unique_identification_no}
              </Td>
              <Td>{r?.profile?.address || null}</Td>
              <Td>{r?.profile?.payment_type || null}</Td>
              <Td>{r?.profile?.payment_account || null}</Td>
              <Td>{r?.profile?.bank_name || null}</Td>
              <Td>{r?.profile?.account_title || null}</Td>
              <Td>
                {r?.profile_type == "doctor"
                  ? r?.profile?.doctor_speciality?.specialized_at
                  : r?.profile_type == "lawyer"
                  ? r?.profile?.lawyer_speciality?.specialized_at
                  : r?.profile?.common_speciality?.specialized_at}
              </Td>
             
              <Td>
                <div className="flex gap-2 justify-center">
                  {(r?.profile?.active_status == 0 ||
                    r?.profile?.active_status == null ||
                    r?.profile?.active_status == false) && (
                    <>
                      <div className="relative">
                        <div className="absolute right-0 top-[-190%] z-50">
                          <PopoverConfirm
                            open={acceptProviderAnchor === r.id}
                            onClose={() => setAcceptProviderAnchor(null)}
                            onYes={() => approveRow(r.unique_user_id)}
                            title="Approve this entry?"
                          />
                        </div>
                        <button
                          className="rounded bg-emerald-500/90 text-white px-3 py-2 text-xs hover:bg-emerald-600"
                          onClick={() =>
                            setAcceptProviderAnchor((cur) =>
                              cur === r.id ? null : r.id
                            )
                          }
                        >
                          Accept
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute right-0 top-[-190%] z-50">
                          <PopoverConfirm
                            open={rejectProviderAnchor === r.id}
                            onClose={() => setRejectProviderAnchor(null)}
                            onYes={() => removeRow(r.unique_user_id)}
                            title="Reject this entry?"
                          />
                        </div>
                        <button
                          className="rounded bg-rose-500/90 text-white px-3 py-2 text-xs hover:bg-rose-600"
                          onClick={() =>
                            setRejectProviderAnchor((cur) =>
                              cur === r.id ? null : r.id
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                  {r?.profile?.active_status == 1 && (
                    <>
                      <button
                        className="rounded border border-slate-500 px-3 py-1.5 text-xs hover:bg-slate-50"
                        onClick={() => handleClick(r)}
                      >
                        Edit
                      </button>
                      <div className="relative">
                        <div className="absolute right-0 top-[-190%] z-50">
                          <PopoverConfirm
                            open={deleteProviderAnchor === r.id}
                            onClose={() => setDeleteProviderAnchor(null)}
                            onYes={() => removeRow(r.unique_user_id)}
                          />
                        </div>
                        <button
                          className="rounded border px-3 py-1.5 text-xs hover:bg-red-50 hover:border-red-500 border-slate-500"
                          onClick={() =>
                            setDeleteProviderAnchor((cur) =>
                              cur === r.id ? null : r.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ModeratorTable({ rows, setModeratorInitial, setAddModeratorOpen, removeModerator }) {
  const [deleteModeratorAnchor, setDeleteModeratorAnchor] = useState(null)
  const removeRow = (uniqueUserId) => {
    removeModerator(uniqueUserId)
  }
  const handleClick = (record) => {
    setModeratorInitial(record)
    setAddModeratorOpen(true)
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-white">
          <tr>
            <Th>No.</Th>
            <Th>ID</Th>
            <Th>Phone</Th>
            <Th>Gender</Th>
            <Th>Date of Birth</Th>
            <Th>Name</Th>
            <Th className="text-center">Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className=" last:border-0">
              <Td>{i + 1}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  {r?.moderator_profile?.avatar ? (
                    <img
                      src={r?.moderator_profile?.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  ): (
                    <img
                      src={noImage}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <div>
                    <div className="text-xs text-slate-400">
                      {r?.unique_user_id}
                    </div>
                  </div>
                </div>
              </Td>
              <Td className="font-medium">{r?.phone}</Td>
              <Td>{r?.moderator_profile?.gender}</Td>
              <Td>{r?.moderator_profile?.dob}</Td>
              <Td>{r?.name}</Td>
              <Td>
                <div className="flex gap-2 justify-center">
                  <button
                    className="rounded border border-slate-500 px-3 py-1.5 text-xs hover:bg-slate-50"
                    onClick={() => handleClick(r)}
                  >
                    Edit
                  </button>
                  <div className="relative">
                    <div className="absolute right-0 top-[-190%] z-50">
                      <PopoverConfirm
                        open={deleteModeratorAnchor === r.unique_user_id}
                        onClose={() => setDeleteModeratorAnchor(null)}
                        onYes={() => removeRow(r.unique_user_id)}
                      />
                    </div>
                    <button
                      className="rounded border px-3 py-1.5 text-xs hover:bg-red-50  border-slate-500 hover:border-red-500"
                      onClick={() =>
                        setDeleteModeratorAnchor((cur) =>
                          cur === r.unique_user_id ? null : r.unique_user_id
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




