import React from 'react'
import date from "/images/dateIcon.png"

export default function PeriodSelect({
  value,
  onChange,
  options = ["Monthly", "Yearly"],
}) {
  return (
    <div className='relative'>
      <img src={date} alt="" className='absolute left-1 top-1/2 transform -translate-y-1/2' />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
        text-xs  text-slate-700 rounded px-4 py-1
        border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200
      "
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}