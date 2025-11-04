import { useEffect, useRef, useState } from "react"
import filterIcon from "/images/filterIcon.png"
import filterOc from "/images/filterOc.png"
import filterDep from "/images/filterDep.png"
import filterLatest from "/images/filterLatest.png"
import filterOldest from "/images/filterOldest.png"


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
      <img src={icon} alt="" />
      {label}
    </button>
  )

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50  bg-white border-slate-500 focus:outline-none focus:ring-0"
      >
        <span>
          <img src={filterIcon} alt="Filter" />
        </span>{" "}
        Filter
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-xl z-20">
          <div className="px-3 pb-2 text-xs font-semibold uppercase text-slate-400">
            Sort / Filter
          </div>
          {item("Occupation", filterOc, { type: "occupation" })}
          {item("Department", filterDep, { type: "department" })}
          {item("Latest", filterLatest, { type: "latest" })}
          {item("Oldest", filterOldest, { type: "oldest" })}
        </div>
      )}
    </div>
  )
}
