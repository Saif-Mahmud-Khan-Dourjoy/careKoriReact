// src/shared/Sidebar.jsx
import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const items = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/user-management", label: "User Management", icon: "👥" },
  { to: "/complaints", label: "Complaints", icon: "🧾" },
  { to: "/revenue", label: "Revenue & Transactions", icon: "📈" },
  { to: "/promos", label: "Promo Code Management", icon: "🏷️" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
]

export default function Sidebar({ onNavigate }) {
  const { logout } = useAuth()

  return (
    <nav className="bg-white rounded-3xl  p-3">
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                ].join(" ")
              }
            >
              <span className="text-lg">{it.icon}</span>
              <span className="text-sm font-medium">{it.label}</span>
            </NavLink>
          </li>
        ))}

        <li className="pt-2 mt-2 ">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-700 hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <span className="text-lg">↪</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
