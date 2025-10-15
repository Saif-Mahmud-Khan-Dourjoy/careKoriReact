import { useEffect, useLayoutEffect, useRef, useState } from "react"

export default function PopConfirm({
  open,
  anchorRef, 
  onClose,
  title = "Are you sure?",
  okText = "Yes",
  cancelText = "No",
  onOk,
  danger = false,
}) {
  const boxRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    if (open && anchorRef?.current) {
      const r = anchorRef.current.getBoundingClientRect()
      setPos({
        x: Math.min(r.right + 8, window.innerWidth - 280),
        y: r.top - 8,
      })
    }
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === "Escape" && onClose?.()
    const clickAway = (e) => {
      if (
        !boxRef.current?.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      ) {
        onClose?.()
      }
    }
    window.addEventListener("keydown", onEsc)
    window.addEventListener("mousedown", clickAway)
    return () => {
      window.removeEventListener("keydown", onEsc)
      window.removeEventListener("mousedown", clickAway)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      <div
        ref={boxRef}
        className="pointer-events-auto w-[260px] rounded-xl bg-white shadow-xl border"
        style={{ position: "fixed", left: pos.x, top: pos.y }}
      >
        <div className="px-4 pt-3 pb-2 font-medium text-slate-700">{title}</div>
        <div className="flex items-center justify-center gap-2 px-4 pb-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-500 text-white text-sm px-4 py-2 hover:bg-emerald-600"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onOk?.()
              onClose?.()
            }}
            className={`rounded-lg text-white text-sm px-4 py-2 ${
              danger
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  )
}
