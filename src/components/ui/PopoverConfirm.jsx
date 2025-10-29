import { useEffect, useRef } from "react"


export default function PopoverConfirm({
  open,
  onClose,
  onYes,
  title = "Delete this entry?",
}) {
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (!open) return
      if (!ref.current?.contains(e.target)) onClose?.()
    }
    window.addEventListener("mousedown", close)
    return () => window.removeEventListener("mousedown", close)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="z-50 w-60 rounded-xl border bg-white p-3 shadow-xl"
    >
      <div className="mb-3 text-center text-sm font-medium text-slate-700">
        {title}
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onClose}
          className="rounded-lg bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
        >
          No
        </button>
        <button
          onClick={() => {
            onYes?.()
            onClose?.()
          }}
          className={`rounded-lg ${
            title.includes("Approve")
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-rose-500 hover:bg-rose-600"
          } px-4 py-1.5 text-xs font-medium text-white `}
        >
          Yes
        </button>
      </div>
    </div>
  )
}
