import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import RevenueProfitChart from "../components/dashboard/RevenueProfitChart";
import UserGrowthChart from "../components/dashboard/UserGrowthChart";
import KpiCard from "../components/dashboard/KpiCard"
import Panel from "../components/dashboard/Panel"
import PeriodSelect from "../components/dashboard/PeriodSelect"
import YearSelect from "../components/dashboard/YearSelect"




export default function Dashboard() {

  const [revPeriod, setRevPeriod] = useState("Yearly")
  const [revYear, setRevYear] = useState(2025)

  const [growthPeriod, setGrowthPeriod] = useState("Monthly")
    const [growthYear, setGrowthYear] = useState(2025)
  const { setHeader } = useOutletContext()

  useEffect(() => {
    setHeader({
      title: "Welcome to Dashboard",
      subtitle: "Here’s a summary of today.",
    })
  }, [setHeader])

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Total Users"
          total="36,589"
          pills={[
            {
              label: "Customers",
              value: "24,687",
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Providers",
              value: "11,713",
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Moderators",
              value: "1,687",
              color: "bg-fuchsia-50 text-fuchsia-700",
            },
          ]}
        />
        <KpiCard
          title="Total Appointments"
          total="139,687"
          pills={[
            {
              label: "Upcoming",
              value: "68",
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Completed",
              value: "11,713",
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Canceled",
              value: "1,687",
              color: "bg-rose-50 text-rose-700",
            },
          ]}
        />
        <KpiCard
          title="Total Services & Sub Services"
          total="36,589"
          pills={[
            {
              label: "Services",
              value: "24,687",
              color: "bg-indigo-50 text-indigo-700",
            },
            {
              label: "Sub Services",
              value: "11,713",
              color: "bg-teal-50 text-teal-700",
            },
          ]}
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
                <YearSelect value={revYear} onChange={setRevYear} />
              )}
            </div>
          }
        >
          <RevenueProfitChart period={revPeriod} year={revYear} />
        </Panel>

        <Panel
          title="User Growth"
          actions={
            <div className="flex items-center gap-2">
              <PeriodSelect value={growthPeriod} onChange={setGrowthPeriod} />
              {growthPeriod === "Monthly" && (
                <YearSelect value={growthYear} onChange={setGrowthYear} />
              )}
            </div>
          }
        >
          <UserGrowthChart period={growthPeriod} year={growthYear} />
        </Panel>
      </section>

      {/* approvals */}
      <section className="bg-white rounded-xl border">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm font-semibold text-slate-700">
            Approval Requests
          </div>
          <div className="flex items-center gap-2 w-full sm:w-96">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔎
              </span>
              <input
                placeholder="Search Providers"
                className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="relative hidden sm:block">
              <input
                placeholder="Search User Approvals"
                className="w-64 rounded-lg border bg-white py-2 px-3 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
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
            <tbody className="divide-y">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{r.department}</td>
                  <td className="px-4 py-3">{r.phone}</td>
                  <td className="px-4 py-3">{r.reg}</td>
                  <td className="px-4 py-3">{r.gender}</td>
                  <td className="px-4 py-3">{r.address}</td>
                  <td className="px-4 py-3">{r.fee}</td>
                  <td className="px-4 py-3">{r.payment}</td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    <button className="rounded-md bg-emerald-500 text-white px-3 py-1.5 text-xs hover:bg-emerald-600">
                      Accept
                    </button>
                    <button className="rounded-md bg-rose-500 text-white px-3 py-1.5 text-xs hover:bg-rose-600">
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
  )
}


const rows = [
  {
    department: "Cardiologist",
    phone: "01612312300",
    reg: "123456789",
    gender: "Male",
    address: "Dhanmondi, Dhaka",
    fee: "5000",
    payment: "Bkash",
  },
  {
    department: "Family Law",
    phone: "01612312300",
    reg: "123456789",
    gender: "Female",
    address: "Fakirhat, Bagerhat",
    fee: "1000",
    payment: "Bank",
  },
  {
    department: "Physician",
    phone: "01612312300",
    reg: "123456789",
    gender: "Female",
    address: "Dhanmondi, Dhaka",
    fee: "3000",
    payment: "Bank",
  },
  
]
