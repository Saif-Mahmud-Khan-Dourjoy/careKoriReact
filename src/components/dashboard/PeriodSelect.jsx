import React from 'react'

export default function PeriodSelect({
  value,
  onChange,
  options = ["Monthly", "Yearly"],
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        text-xs bg-slate-100 text-slate-700 rounded px-2 py-1
        border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200
      "
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}