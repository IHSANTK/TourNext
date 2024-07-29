import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { clearTokens } from '../../redux/userauthSlice';
import { FaUserCircle } from 'react-icons/fa';
import Logosvg from './logosvg';
import axios from '../../api';


export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State for dropdown menu
  const userisAuthenticated = useSelector((state) => state.userauth.userisAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.post('/userlogut', {}, { withCredentials: true });
      console.log(response.data);
      if (response.status === 200) {
        dispatch(clearTokens());
        navigate('/')
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="absolute top-0 left-0 z-10  bg-gray-100  w-full bg-inherit shadow-xl shadow-neutral-500 " >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 sm:h-24 items-center">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center  rounded-md p-2 bg-white hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6 bg-white text-black`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6 bg-white text-black`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center sm:justify-center w-full sm:w-auto">
          <Link to='/'><div className="text-bold ms-5">
            <Logosvg className="w-12 h-12 bg-black" /> 
          </div></Link>
          
          </div>
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-4 items-center h-full  z-10">
            <Link to="/" className="rounded-md px-3 py-2  font-bold text-neutral-500">
                Home
              </Link>
              <Link to="/user/Alldestinations" className="rounded-md px-3 py-2  font-bold text-neutral-500">
               Destinations
              </Link>
              <Link to="/user/Packages" className="rounded-md px-3 py-2  font-bold text-neutral-500">
                All Packages
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
            
                <div>
                <div className="relative ml-3">
              {userisAuthenticated ? (
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full mt-1 me-4 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <FaUserCircle className="h-8 w-8 rounded-full bg-gray-400 " />
                  </button>
                
                  <div className={`${isProfileMenuOpen ? 'block' : 'hidden'} absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg`}>
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                      <Link to="/user/bookingdetiles/:message" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bookings</Link>

                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-900"
                  onClick={() => navigate('/user/login')}
                >
                  Login
                </button>
              )}
            </div>
                 
                </div>
       
      
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden absolute left-0 z-10  w-40 bg-white   rounded-md shadow-lg`} id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2 bg-white w-1/3 text-black">
          <Link to={'/'} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700  ">
            Home
          </Link>
          <Link to="/user/Alldestinations" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700  ">
           Destinations
          </Link>
          <Link to="/user/Packages" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700  ">
           Packages
          </Link>
        </div>
      </div>
    </nav>
  );
}
