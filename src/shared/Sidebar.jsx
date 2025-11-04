// src/shared/Sidebar.jsx
import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"



import dash from "/images/dashboardIcon.png"
import userMgmt from "/images/userManagementIcon.png"
import complaints from "/images/complaintIcon.png"
import revenue from "/images/managementIcon.png"
import promos from "/images/promoCodeIcon.png"
import settings from "/images/settingIcon.png"
import logoutIcon from "/images/logoutIcon.png"

const items = [
  { to: "/dashboard", label: "Dashboard", icon: dash },
  { to: "/user-management", label: "User Management", icon: userMgmt },
  { to: "/complaints", label: "Complaints", icon: complaints },
  { to: "/revenue", label: "Revenue & Transactions", icon: revenue },
  { to: "/promos", label: "Promo Code Management", icon: promos },
  { to: "/settings", label: "Settings", icon: settings },
]

export default function Sidebar({ onNavigate }) {
  const { logout } = useAuth()

  return (
    <nav className="bg-white rounded-2xl  py-7 pl-3">
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 pl-5 pr-3 py-2 rounded-tl-full rounded-bl-full transition",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                ].join(" ")
              }
            >
              <img src={it.icon} alt="" />
              <span className="text-sm font-medium">{it.label}</span>
            </NavLink>
          </li>
        ))}

        <li className="pt-2 mt-2 ">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-2 bg-white text-left text-slate-700 hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <img src={logoutIcon} alt="" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
