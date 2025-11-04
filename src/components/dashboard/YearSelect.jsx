import date from "/images/dateIcon.png"
export default function YearSelect({
  value,
  onChange,
  years = [new Date().getFullYear()],
}) {
  console.log("YearSelect years:", years)
  return (
     <div className='relative'>
          <img src={date} alt="" className='absolute left-1 top-1/2 transform -translate-y-1/2' />
          
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="text-xs  text-slate-700 rounded px-4 py-1 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
    </div>
  )
}
