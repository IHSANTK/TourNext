import React from 'react'

export default function Modal({ onClose, children }) {
  return (
    <div> <div className="fixed inset-0  bg-opacity-70 flex justify-center items-center z-50 ">
    <div className="lg:border lg:border-2 border-gray-500 bg-white h-screen lg:h-[557px] lg:rounded-3xl w-full max-w-md p-1 ">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        {/* <i className="fa-solid fa-xmark"></i> */}
      </button>
      {children}
    </div>
  </div>
  </div>
  )
}
