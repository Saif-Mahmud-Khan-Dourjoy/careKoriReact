export default function YearSelect({
  value,
  onChange,
  years=[new Date().getFullYear()] ,
}) {
  console.log("YearSelect years:", years);
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="text-xs bg-slate-100 text-slate-700 rounded px-2 py-1 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}
