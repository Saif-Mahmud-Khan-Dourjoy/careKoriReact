import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

import dash from "/images/dashboardIcon.png"
import userMgmt from "/images/userManagementIcon.png"
import complaints from "/images/complaintIcon.png"
import revenue from "/images/managementIcon.png"
import promos from "/images/promoCodeIcon.png"
import settings from "/images/settingIcon.png"
import logoutIcon from "/images/logoutIcon.png"

export default function Sidebar({ onNavigate }) {
  const items = [
    { to: "/dashboard", label: "Dashboard", icon: dash },
    { to: "/user-management", label: "User Management", icon: userMgmt },
    { to: "/complaints", label: "Complaints", icon: complaints },
    { to: "/revenue", label: "Revenue & Transactions", icon: revenue },
    { to: "/promos", label: "Promo Code Management", icon: promos },
    {
      to: "/settings",
      label: "Settings",
      icon: settings,
      children: [
        {
          to: "/categories-subcategories",
          label: "Category and Subcategory Management",
        },
        {
          to: "/banner-management",
          label: "Banner Management",
        }
      ],
    },
  ]
  const { logout } = useAuth()
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  // Keep settings expanded if any child is active
  React.useEffect(() => {
    const settingsItem = items.find((it) => it.label === "Settings")
    if (settingsItem && settingsItem.children) {
      const isChildActive = settingsItem.children.some(
        (child) => location.pathname === child.to
      )
      if (isChildActive) setSettingsOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <nav className="bg-white rounded-2xl  py-7 pl-3">
      <ul className="space-y-1">
        {items.map((it) => {
          if (!it.children) {
            return (
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
                  <img style={{ width: "20px" }} src={it.icon} alt="" />
                  <span className="text-sm font-medium">{it.label}</span>
                </NavLink>
              </li>
            )
          }
          // Settings with children: collapsible, no navigation
          const isAnyChildActive = it.children.some(
            (child) => location.pathname === child.to
          )
          return (
            <li key={it.label}>
              <button
                type="button"
                className={[
                  "flex items-center gap-3 pl-5 pr-3 py-2 rounded-tl-full rounded-bl-full transition w-full text-left border-0 focus:outline-none",
                  settingsOpen || isAnyChildActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                ].join(" ")}
                onClick={() => setSettingsOpen((open) => !open)}
                aria-expanded={settingsOpen || isAnyChildActive}
              >
                <img style={{ width: "20px" }} src={it.icon} alt="" />
                <span className="text-sm font-medium">{it.label}</span>
                <span className="ml-auto text-xs">
                  {settingsOpen || isAnyChildActive ? "▲" : "▼"}
                </span>
              </button>
              {(settingsOpen || isAnyChildActive) && (
                <ul className="pl-10 pt-2">
                  {it.children.map((child) => (
                    <li key={child.to}>
                      <NavLink
                        to={child.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          [
                            "block py-1 text-sm rounded transition pl-4", // left padding for child look
                            isActive
                              ? "text-blue-600 font-semibold"
                              : "text-slate-600 hover:text-blue-600",
                          ].join(" ")
                        }
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}

        <li className="pt-2 mt-2 ">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-2 bg-white text-left text-slate-700 hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <img style={{ width: "20px" }} src={logoutIcon} alt="" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
