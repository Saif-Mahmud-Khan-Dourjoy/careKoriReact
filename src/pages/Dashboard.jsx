import {  useCallback, useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import RevenueProfitChart from "../components/dashboard/RevenueProfitChart";
import UserGrowthChart from "../components/dashboard/UserGrowthChart";
import KpiCard from "../components/dashboard/KpiCard"
import Panel from "../components/dashboard/Panel"
import PeriodSelect from "../components/dashboard/PeriodSelect"
import YearSelect from "../components/dashboard/YearSelect"
import { approveProviderApi, deleteProviderApi, getAppointmentCountApi, getApproveRequestsApi, getGettersProvidersSeriesApi, getRevenueProfitSeriesApi, getServiceSubServiceCountApi, getUserCountApi } from "../api/dashboard"
import LoaderModal from "../components/ui/LoaderModal"
import ConfirmModal from "../components/ui/ConfirmModal"
import StatusModal from "../components/ui/StatusModal"

import user from "/images/profile-2user.png"
import appointment from "/images/appIcon.png"
import service from "/images/serviceIcon.png"
import search from "/images/searchIcon.png"







export default function Dashboard() {

  const [revPeriod, setRevPeriod] = useState("Yearly")
  const [revYear, setRevYear] = useState(new Date().getFullYear())
 
  const [revYears, setRevYears] = useState([new Date().getFullYear()])

  const [monthlyByYearRevenue, setMonthlyByYearRevenue] = useState({})
  const [yearlyRevenue, setYearlyRevenue] = useState([])

  const [growthPeriod, setGrowthPeriod] = useState("Monthly")
  const [growthYear, setGrowthYear] = useState(new Date().getFullYear())

  const [growthYears, setGrowthYears] = useState([new Date().getFullYear()])
  const [monthlyByYearGrowth, setMonthlyByYearGrowth] = useState({})
  const [yearlyGrowth, setYearlyGrowth] = useState([])
  const { setHeader } = useOutletContext()
  const [loading, setLoading] = useState(false)
 
  const [totalUsers, setTotalUsers] = useState(0)
  const [userData, setUserData] = useState([
    {
      label: "Customers",
      value: 0,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Providers",
      value: 0,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Moderators",
      value: 0,
      color: "bg-fuchsia-50 text-fuchsia-700",
    },
  ])

  const [totalAppointments, setTotalAppointments] = useState(0)
  const [appointmentData, setAppointmentData] = useState([
    {
      label: "Upcoming",
      value: 0,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Completed",
      value: 0,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Canceled",
      value: 0,
      color: "bg-rose-50 text-rose-700",
    },
  ])

  const [totalServiceSubService, setTotalServiceSubService] = useState(0)
  const [serviceSubServiceData, setServiceSubServiceData] = useState([
    {
      label: "Services",
      value: 0,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Sub Services",
      value: 0,
      color: "bg-teal-50 text-teal-700",
    },
  ])

  const [approveRequestsData, setApproveRequestsData] = useState([])

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProviders, setFilteredProviders] = useState([])

  const [reload, setReload] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [providerAction, setProviderAction] = useState(null); // 'accept' or 'reject'
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalSuccess, setStatusModalSuccess] = useState(null);

  



  function normalizeProvider(provider) {
    const { profile_type, profile, phone, unique_user_id } = provider


    let department = ""
    if (profile_type === "doctor") {
      department = profile?.doctor_speciality?.specialized_at || ""
    } else if (profile_type === "lawyer") {
      department = profile?.lawyer_speciality?.specialized_at || ""
    } else if (profile_type === "common") {
      department = profile?.common_speciality?.specialized_at || ""
    }

   
    let reg = ""
    if (profile_type === "doctor") {
      reg = profile?.registration_no || ""
    } else if (profile_type === "lawyer") {
      reg = profile?.bar_registration_no || ""
    } else if (profile_type === "common") {
      reg = profile?.unique_identification?.unique_identification_no || ""
    }

    // Address, Gender, Fee, Payment
    const address = profile?.address || ""
    const gender = profile?.gender || ""
    const fee = profile?.pricing || ""
    const payment = profile?.payment_type || ""

    return {
      department,
      phone: phone || "",
      reg,
      gender,
      address,
      fee,
      payment,
      unique_user_id,
    }
  }

 useEffect(() => {
   const handler = setTimeout(() => {
     if (!searchTerm) {
       setFilteredProviders(approveRequestsData)
       return
     }
     const lower = searchTerm.toLowerCase()
     setFilteredProviders(
       approveRequestsData.filter((provider) => {
        
         return Object.values(provider)
           .map((v) => String(v).toLowerCase())
           .some((v) => v.includes(lower))
       })
     )
   }, 300)

   return () => clearTimeout(handler)
 }, [searchTerm, approveRequestsData])


  useEffect(() => {
    setHeader({
      title: "Welcome to Dashboard",
      subtitle: "Here’s a summary of today.",
    })
  }, [setHeader])

  const fetchUserData = async () => {
    const [success, data] = await getUserCountApi()
    if (success) {
      let createData = [
        {
          label: "Getters",
          value: data?.getters,
          color: "bg-blue-50 text-blue-700",
        },
        {
          label: "Providers",
          value: data?.providers,
          color: "bg-emerald-50 text-emerald-700",
        },
        {
          label: "Moderators",
          value: data?.moderators,
          color: "bg-fuchsia-50 text-fuchsia-700",
        },
      ]
        setUserData(createData)
        setTotalUsers(data?.users || 0)
    } else {
        console.error("Error fetching user data:", data)
    }
  }

  const fetchAppointmentData = async () => {
    const [success, data] = await getAppointmentCountApi()
    if (success) {
      let createData = [
        {
          label: "Upcoming",
          value: data?.upcoming || 0,
          color: "bg-blue-50 text-blue-700",
        },
        {
          label: "Completed",
          value: data?.completed || 0,
          color: "bg-emerald-50 text-emerald-700",
        },
        {
          label: "Canceled",
          value: data?.canceled || 0,
          color: "bg-rose-50 text-rose-700",
        },
      ]
      setAppointmentData(createData)
      setTotalAppointments(data?.appointments || 0)
    } else {
      console.error("Error fetching appointment data:", data)
    }
  }

  const fetchServiceSubServiceData = async () => {
    const [success, data] = await getServiceSubServiceCountApi()
    if (success) {
      let createData = [
        {
          label: "Services",
          value: data?.services_count || 0,
          color: "bg-indigo-50 text-indigo-700",
        },
        {
          label: "Sub Services",
          value: data?.sub_services_count || 0,
          color: "bg-teal-50 text-teal-700",
        },
      ]
      setServiceSubServiceData(createData)
      setTotalServiceSubService(data?.total_count || 0)
    } else {
      console.error("Error fetching service and sub-service data:", data)
    }
  }

  const fetchRevenueProfitSeriesData = useCallback(async () => {
    const [success, data] = await getRevenueProfitSeriesApi(revYear)
    if (success) {
       let yearlyData=data?.yearly;
       setRevYears(()=>{
        const years=yearlyData.map(item=>item.label);
        return years;
       })
      
       setYearlyRevenue(yearlyData);
       let monthlyData = data?.monthlyByYear
        setMonthlyByYearRevenue(monthlyData);
      
    } else {
      console.error("Error fetching revenue and profit series data:", data)
    }
  }, [revYear])


  const fetchGettersProvidersSeriesData = useCallback(async () => {
    const [success, data] = await getGettersProvidersSeriesApi(growthYear)
    if (success) {
      let yearlyData = data?.yearly;
      setGrowthYears(() => {
        const years = yearlyData.map(item => item.label);
        return years;
      })

      setYearlyGrowth(yearlyData);
      let monthlyData = data?.monthlyByYear
      setMonthlyByYearGrowth(monthlyData)
      console.log("Getters and Providers Series Data:", data)
    } else {
      console.error("Error fetching getters and providers series data:", data)
    }
  }, [growthYear])

  const fetchApproveRequestsData = async () => {
    const [success, data] = await getApproveRequestsApi()
    if (success) {

      let approvedRequestProviders = [];

      data?.providers.forEach(provider => {
        approvedRequestProviders.push(normalizeProvider(provider));
      })

      setApproveRequestsData(approvedRequestProviders)
     console.log("Approve Requests Data:", data)  
    } else {
      console.error("Error fetching approve requests data:", data)
    }
  }

  const approveProvider = async () => {
    const [success, data] = await approveProviderApi(selectedProvider)
    if (success) {
      setLoading(false)
      setSelectedProvider(null);
      setStatusModalSuccess(true);
      setStatusModalOpen(true);
      // setReload(!reload);
      
    } else {
      setLoading(false)
      setSelectedProvider(null);
      setStatusModalSuccess(false);
      setStatusModalOpen(true);
      console.error("Error approving provider:", data)
    }
  }


   const deleteProvider = async () => {
     const [success, data] = await deleteProviderApi(selectedProvider)
     if (success) {
       setLoading(false)
       setSelectedProvider(null)
       setStatusModalSuccess(true)
       setStatusModalOpen(true)
      //  setReload(!reload)
     } else {
       setLoading(false)
       setSelectedProvider(null)
       setStatusModalSuccess(false)
       setStatusModalOpen(true)
       console.error("Error approving provider:", data)
     }
   }



  // useEffect(() => {
  //   setLoading(true)
  //   fetchUserData()
  //   fetchAppointmentData()
  //   fetchServiceSubServiceData()
  //   fetchApproveRequestsData().finally(() => setLoading(false))

  // }, [])
  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchUserData(),
      fetchAppointmentData(),
      fetchServiceSubServiceData(),
      fetchApproveRequestsData(),
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchRevenueProfitSeriesData()
      .finally(() => setLoading(false))
  }, [revYear, fetchRevenueProfitSeriesData]);

  useEffect(() => {
    setLoading(true)
    fetchGettersProvidersSeriesData()
      .finally(() => setLoading(false))
  }, [growthYear, fetchGettersProvidersSeriesData]);

  // useEffect(() => {
  //   if (statusModalOpen){
  //        setStatusModalOpen(false);
  //   } 
  //   setLoading(true)
  //   fetchApproveRequestsData()
  //     .finally(() => setLoading(false))
  // }, [reload]);

  const handleConfirm = async () => {
    setConfirmModalOpen(false);
    setLoading(true);
    if (providerAction === "accept") {
      await approveProvider();
    } else if (providerAction === "reject") {
      await deleteProvider();
    }
    // setConfirmModalOpen(false);
  }

  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setLoading(true)
    fetchApproveRequestsData().finally(() => setLoading(false))
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
      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirm}
      />
      <StatusModal
        open={statusModalOpen}
        onClose={closeStatusModal}
        success={statusModalSuccess}
      />

      <div className="space-y-6">
        {/* KPI cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            title="Total Users"
            total={totalUsers}
            pills={userData}
            icon={user}
          />
          <KpiCard
            title="Total Appointments"
            total={totalAppointments}
            pills={appointmentData}
            icon={appointment}
          />
          <KpiCard
            title="Total Services & Sub Services"
            total={totalServiceSubService}
            pills={serviceSubServiceData}
            icon={service}
          />
        </section>

        {/* charts row */}
        <section className="grid lg:grid-cols-2 gap-4">
          <Panel
            title="Revenue & Profit Graph"
            actions={
              <div className="flex items-center gap-2">
                <PeriodSelect value={revPeriod} onChange={setRevPeriod} />
                {revPeriod === "Monthly" && (
                  <YearSelect
                    value={revYear}
                    onChange={setRevYear}
                    years={revYears}
                  />
                )}
              </div>
            }
          >
            <RevenueProfitChart
              period={revPeriod}
              year={revYear}
              monthlyByYear={monthlyByYearRevenue}
              yearly={yearlyRevenue}
            />
          </Panel>

          <Panel
            title="User Growth"
            actions={
              <div className="flex items-center gap-2">
                <PeriodSelect value={growthPeriod} onChange={setGrowthPeriod} />
                {growthPeriod === "Monthly" && (
                  <YearSelect
                    value={growthYear}
                    onChange={setGrowthYear}
                    years={growthYears}
                  />
                )}
              </div>
            }
          >
            <UserGrowthChart
              period={growthPeriod}
              year={growthYear}
              monthlyByYear={monthlyByYearGrowth}
              yearly={yearlyGrowth}
            />
          </Panel>
        </section>

        {/* approvals */}
        <section className="bg-white rounded-xl ">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b">
            <div className="text-sm font-semibold  bg-blue-500 py-2 px-3 rounded-full text-white ">
              Approval Requests
            </div>
            <div className="flex items-center gap-2 w-full sm:w-96">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <img src={search} alt="" />
                </span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Providers"
                  className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              {/* <div className="relative hidden sm:block">
                <input
                  placeholder="Search User Approvals"
                  className="w-64 rounded-lg border bg-white py-2 px-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div> */}
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto pt-3">
            <table className="min-w-full text-sm">
              <thead className=" text-slate-600">
                <tr>
                  {[
                    "Department",
                    "Phone",
                    "Registration No.",
                    "Gender",
                    "Address",
                    "Consultation Fee",
                    "Payment Method",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="">
                {filteredProviders.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 text-[#777373]">
                    <td className="px-4 py-3 font-medium text-slate-600">
                      {r.department}
                    </td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3">{r.reg}</td>
                    <td className="px-4 py-3">{r.gender}</td>
                    <td className="px-4 py-3">{r.address}</td>
                    <td className="px-4 py-3">{r.fee}</td>
                    <td className="px-4 py-3">{r.payment}</td>
                    <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                      <button
                        className="rounded-md bg-emerald-500 text-white px-3 py-1.5 text-xs hover:bg-emerald-600"
                        onClick={() => {
                          setSelectedProvider(r?.unique_user_id)
                          setProviderAction("accept")
                          setConfirmModalOpen(true)
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="rounded-md bg-rose-500 text-white px-3 py-1.5 text-xs hover:bg-rose-600"
                        onClick={() => {
                          setSelectedProvider(r?.unique_user_id)
                          setProviderAction("reject")
                          setConfirmModalOpen(true)
                        }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4">
            <div className="h-1 w-24 bg-slate-200 rounded-full mx-auto" />
          </div>
        </section>
      </div>
    </>
  )
}





