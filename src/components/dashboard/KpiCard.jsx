import React from 'react'

export default function KpiCard({ title, total, pills = [],icon }) {
   return (
     <div className="bg-white rounded-xl  p-4 sm:p-6">
       <div className='flex justify-between'> 
         <div>
           <div className="text-slate-500 text-sm font-semibold">{title}</div>
           <div className="text-3xl font-bold mt-1">{total}</div>
         </div>
         <div>
           <img src={icon} alt="" className="w-10 h-10" />
         </div>
       </div>
       <div className="mt-3 flex flex-wrap gap-2">
         {pills.map((p, i) => (
           <div
             key={i}
             className={`text-xs px-5 py-2 rounded-lg ${p.color} flex flex-col items-center`}
           >
             <div className='font-semibold text-black'>{p.label}</div>

             <div><span className="font-bold text-black">{p.value}</span></div>
           </div>
         ))}
       </div>
     </div>
   )
}
