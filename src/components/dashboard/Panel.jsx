import React from 'react'

export default function Panel({ title, actions, children }) {
  return (
    <div className="bg-white rounded-xl  p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  )
}
