
import React from 'react'

export default function StarRating({ rating }) {
  return (
    <div className="flex">
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`h-6 w-6 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 .587l3.668 7.425 8.207 1.191-5.93 5.788 1.397 8.139L12 18.897l-7.342 3.864 1.397-8.139-5.93-5.788 8.207-1.191L12 .587z" />
      </svg>
    ))}
  </div>
  )
}












