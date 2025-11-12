import React from 'react'
import Modal from './Modal'

export default function ConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Action">
      <div className="p-6">
        <p>Are you sure you want to proceed?</p>
      </div>
      <div className="flex justify-end p-6">
        <button onClick={onClose} className="mr-4 border border-slate-500 ">
          Cancel
        </button>
        <button onClick={onConfirm} className="bg-blue-600 text-white px-4 py-2 rounded">
          Confirm
        </button>
      </div>
    </Modal>
  )
}
