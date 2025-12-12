import React from "react"
import { createPortal } from "react-dom"

export default function ConfirmPopover({
  open,
  anchorRect,
  title,
  onConfirm,
  onClose,
}) {
  if (!open || !anchorRect) return null
  const style = {
    position: "fixed",
    top: anchorRect.top + window.scrollY + anchorRect.height + 8,
    left: Math.min(anchorRect.left + window.scrollX, window.innerWidth - 260),
    zIndex: 60,
    width: 240,
  }

  return createPortal(
    <div style={style} className="rounded-xl border bg-white p-3 shadow-xl">
      <div className="mb-3 text-sm text-slate-700">
        {title || "Are you sure?"}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="rounded-lg border px-4 py-1.5 text-sm hover:bg-slate-50"
        >
          No
        </button>
        <button
          onClick={() => {
            onConfirm?.()
            onClose?.()
          }}
          className="rounded-lg bg-rose-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
        >
          Yes
        </button>
      </div>
    </div>,
    document.body
  )
}
