import React from 'react'

export default function Tabs({ value, onChange }) {
   const tabs = ["Getters", "Providers", "Moderators"]
   return (
     <div className="flex items-center gap-2">
       {tabs.map((t) => (
         <button
           key={t}
           onClick={() => onChange(t)}
           className={`rounded-full px-4 py-1.5 text-sm transition ${
             value === t
               ? "bg-blue-600 text-white"
               : "bg-slate-100 text-slate-700 hover:bg-slate-200"
           }`}
         >
           {t}
         </button>
       ))}
     </div>
   )
}
