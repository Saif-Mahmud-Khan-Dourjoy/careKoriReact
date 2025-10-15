export default function StatusDot({ active }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-rose-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  )
}
