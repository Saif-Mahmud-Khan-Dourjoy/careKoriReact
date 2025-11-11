import React from 'react'
import Modal from './Modal'
import { IoCheckmarkCircleSharp } from "react-icons/io5"
import { FaCircleXmark } from "react-icons/fa6"

export default function StatusModal({ open, onClose, success=null, errorMsg=null }) {
  return (
    <Modal open={open} onClose={onClose} title="Action Status">
      <div className="p-6 ">
        {success ? (
          <div className="flex flex-col items-center gap-4"> 
           
            <IoCheckmarkCircleSharp className="h-16 w-16 text-green-600" />
            <p className="">Your action was successful!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <FaCircleXmark className="h-16 w-16 text-red-600" />
            <p className="">{errorMsg || "There was an error processing your action."}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end p-6">
        <button onClick={onClose} className="mr-4 border border-slate-500">
          Close
        </button>
      </div>
    </Modal>
  )
}
