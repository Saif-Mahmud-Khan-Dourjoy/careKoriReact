import React from 'react'

export default function KpiCard({ title, total, pills = [] }) {
   return (
     <div className="bg-white rounded-xl border p-4 sm:p-6">
       <div className="text-slate-500 text-sm">{title}</div>
       <div className="text-3xl font-bold mt-1">{total}</div>
       <div className="mt-3 flex flex-wrap gap-2">
         {pills.map((p, i) => (
           <span
             key={i}
             className={`text-xs px-2.5 py-1 rounded-full ${p.color}`}
           >
             <span className="font-semibold">{p.value}</span> {p.label}
           </span>
         ))}
       </div>
     </div>
   )
}
