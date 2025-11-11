

import logo from "/images/logo.png"
import { useAuth } from "../context/AuthContext";
import avatar from "/images/avatar.png"

export default function Topbar({ title, subtitle, onMenu }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-[#F7FAFC]">
      <div className="h-24 px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden rounded p-2 hover:bg-slate-100"
            onClick={onMenu}
            aria-label="Open menu"
          >
            ☰
          </button>

          <img
            src={logo}
            alt="CareKori"
            className="h-10 w-auto ml-16 hidden  md:block"
          />

          {/* dynamic header */}
          <div className="md:ml-[120px]">
            <div className="text-sm sm:text-lg font-semibold text-blue-500">
              {title || "Welcome"}
            </div>
            {subtitle ? (
              <div className="text-xs text-slate-500 -mt-0.5 font-semibold">
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full">
          {user?.role?.name === "super admin" ? (
            <img
              src={avatar}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
              alt="avatar"
            />
          ) : (
            <img
              src={user?.moderator_profile?.avatar || avatar}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
              alt="avatar"
            />
          )}

          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-[#5686F5]">
              {user?.name || "Emma Wilson"}
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              {user?.role?.name || "Account Admin"}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

