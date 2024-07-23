import React from 'react'
import { Link } from 'react-router-dom';

export default function sidebar() {
  return (
    <div className="w-full md:w-64 h-auto md:h-screen bg-gray-800 text-white flex-shrink-0">
    <div className="p-4 font-bold text-lg">Admin Dashboard</div>
    <nav className="mt-10">
      <Link to='/admin/dashboard' className="block py-2.5 px-4 rounded hover:bg-gray-700">
        Dashboard
      </Link>
      <Link to='/admin/destintions' className="block py-2.5 px-4 rounded hover:bg-gray-700">
        Destinations
      </Link>
      <Link to='/admin/categories'  className="block py-2.5 px-4 rounded hover:bg-gray-700">
        Categories
      </Link>
      <Link to='/admin/states'  className="block py-2.5 px-4 rounded hover:bg-gray-700">
        States
      </Link>
      <Link  to='/admin/tourPackagelist'  className="block py-2.5 px-4 rounded hover:bg-gray-700">
        Packages
      </Link>
      <Link to='/admin/userlist'  className="block py-2.5 px-4 rounded hover:bg-gray-700">
        Customers
      </Link>
      <Link to='/admin/bookings' className="block py-2.5 px-4 rounded hover:bg-gray-700">
        Bookings
      </Link>
      <Link to='/admin/bannerManagement' className="block py-2.5 px-4 rounded hover:bg-gray-700">
       Banners
      </Link>
    </nav>
  </div>
  )
}
