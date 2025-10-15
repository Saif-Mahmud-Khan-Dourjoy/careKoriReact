import { useEffect, useRef, useState } from "react"

export default function FilterDropdown({ onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    window.addEventListener("mousedown", close)
    return () => window.removeEventListener("mousedown", close)
  }, [])

  const item = (label, icon, value) => (
    <button
      key={label}
      onClick={() => {
        onChange?.(value)
        setOpen(false)
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </button>
  )

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm hover:bg-slate-50"
      >
        <span>⚙️</span> Filter
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-xl z-20">
          <div className="px-3 pb-2 text-xs font-semibold uppercase text-slate-400">
            Sort / Filter
          </div>
          {item("Occupation", "👨‍⚕️", { type: "occupation" })}
          {item("Department", "🏷️", { type: "department" })}
          {item("Latest", "⬆️", { type: "latest" })}
          {item("Oldest", "⬇️", { type: "oldest" })}
        </div>
      )}
    </div>
  )
}
