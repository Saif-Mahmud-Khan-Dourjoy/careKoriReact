export function Label({ children }) {
  return <label className="block text-sm text-slate-600 mb-1">{children}</label>
}
export function Input(props) {
  // Pass through name, value, onChange, type, etc.
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 " +
        (props.className || "")
      }
    />
  )
}
export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
    >
      {children}
    </select>
  )
}
export function Radio({ label, className = "", ...props }) {
  // IMPORTANT: forward `name`, `value`, `checked`, `onChange`
  return (
    <label className={"inline-flex items-center gap-2 " + className}>
      <input type="radio" {...props} className="accent-blue-600" />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
export function ActionsRow({
  onCancelText = "Cancel",
  onSaveText = "Save",
  onCancel,
  onSave,
  disabled,
}) {
  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        {onCancelText}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {onSaveText}
      </button>
    </div>
  )
}
