import { useEffect } from "react"

export default function Modal({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-2xl",
}) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.()
    if (open) window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-start justify-center overflow-y-auto py-10">
        <div
          className={`w-full ${widthClass} mx-3 rounded-2xl bg-white shadow-xl`}
        >
          <div className="px-6 pt-6 pb-3">
            <h3 className="text-center text-xl font-semibold text-blue-600">
              {title}
            </h3>
          </div>
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
