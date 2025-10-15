export default function StatusBadge({ status = "Pending" }) {
  const isResolved = String(status).toLowerCase() === "resolved"
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium " +
        (isResolved
          ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
          : "bg-slate-50 text-slate-500 ring-1 ring-slate-100")
      }
    >
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (isResolved ? "bg-emerald-500" : "bg-rose-400")
        }
      />
      {isResolved ? "Resolved" : "Pending"}
    </span>
  )
}
