
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Topbar from "../shared/Topbar";

export default function AppLayout() {
  const [header, setHeader] = useState({ title: "", subtitle: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky topbar (64px) */}
      <Topbar
        title={header.title}
        subtitle={header.subtitle}
        onMenu={() => setOpen(true)}
      />

      {/* Fixed sidebar (desktop) — now subtract footer height too */}
      <aside
        className="
          hidden md:block
          fixed left-0 top-28
          h-[calc(100vh-6rem-5rem)] w-72  /* 4rem topbar + 3rem footer */
          bg-white rounded-3xl
          overflow-hidden z-20
        "
      >
        <Sidebar />
      </aside>

      {/* Content area (push right by sidebar on md+). 
          Add bottom padding >= footer height to avoid overlap. */}
      <div className="md:ml-72">
        <div className="px-3 sm:px-6 lg:px-8 pb-16"> {/* 16 ~ 64px; >= footer height */}
          <main className="py-4">
            <Outlet context={{ setHeader }} />
          </main>
        </div>
      </div>

      {/* FIXED FOOTER (48px) */}
      <footer
        className="
          fixed bottom-0 left-0 right-0 h-12
          bg-[#E3EDFE]
          text-center text-sm text-slate-500
          flex items-center justify-center
          z-30
          pb-[env(safe-area-inset-bottom)] /* iOS safe area */
          font-semibold
        "
      >
        Developed by Tech Solution Factory {new Date().getFullYear()}
      </footer>

      {/* Mobile drawer stays above footer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold">Menu</span>
              <button
                className="rounded p-1 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

