import React, { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearTokens } from "../../../redux/userauthSlice";
import {
  FaUserCircle,
  FaHeart,
  FaUser,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "../../../api";
import Logosvg from "../logosvg";
import WishlistSidebar from "./WishlistSidebar";
import "./Homepage.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isWishlistSidebarOpen, setIsWishlistSidebarOpen] = useState(false);
  const [hasBackground, setHasBackground] = useState(false);

  const userisAuthenticated = useSelector(
    (state) => state.userauth.userisAuthenticated
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasBackground(true);
      } else {
        setHasBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/userlogut",
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 200) {
        dispatch(clearTokens());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistClick = () => {
    setIsWishlistSidebarOpen(!isWishlistSidebarOpen);
    setIsProfileMenuOpen(false);
  };

  return (
    <nav  className={`fixed top-0 left-0 w-full z-10 transition-colors duration-300 ${hasBackground ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 sm:h-24 items-center">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-white bg-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${
                  isMobileMenuOpen ? "hidden" : "block"
                } h-6 w-6 bg-white text-black `}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className={`${
                  isMobileMenuOpen ? "block" : "hidden"
                } h-6 w-6 text-black`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center sm:justify-center w-full sm:w-auto">
            <div className="font-bold text-2xl sm:text-3xl text-slate-800 font-serif ms-5">
              <Logosvg />
            </div>
          </div>
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-4 items-center h-full">
              <Link
                to="#"
                className="rounded-md px-3 py-2 font-bold text-neutral-700 hover:text-emerald-500"
              >
                Home
              </Link>
              <Link
                to="/user/Alldestinations"
                className="rounded-md px-3 py-2 font-bold text-neutral-700 hover:text-emerald-500"
              >
                Destinations
              </Link>
              <Link
                to="/user/Packages"
                className="rounded-md px-3 py-2 font-bold text-neutral-700 hover:text-emerald-500"
              >
                All Packages
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
              {userisAuthenticated ? (
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full mt-3 me-4 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <FaUserCircle className="h-8 w-8 rounded-full bg-gray-400" />
                  </button>
                  {/* Dropdown men */}
                  <div
                    className={`${
                      isProfileMenuOpen ? "block" : "hidden"
                    } absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg`}
                  >
                    <div className="py-1">
                      <Link
                        to="/user/profialpage"
                        className="flex hover:text-emerald-500 items-center font-bold px-4 py-2 text-sm text-gray-700 no-hover-bg"
                      >
                        <FaUser className="mr-2" /> Profile
                      </Link>
                      <Link
                        to="/user/bookingdetiles/:message"
                        className="flex hover:text-emerald-500 font-bold items-center px-4 py-2 text-sm text-gray-700 no-hover-bg"
                      >
                        <FaClipboardList className="mr-2" /> Bookings
                      </Link>
                      <Link
                        to="#"
                        onClick={handleWishlistClick}
                        className="flex hover:text-emerald-500 items-center px-4 py-2 text-sm text-gray-700 font-bold no-hover-bg"
                      >
                        <FaHeart className="mr-2" /> Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex hover:text-emerald-500 font-bold items-center w-full text-left px-4 py-2 text-sm text-gray-700 no-hover-bg"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-900"
                  onClick={() => navigate("/user/login")}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pb-3 pt-2 bg-white w-1/3 text-black rounded-lg">
          <Link
            to="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/user/Alldestinations"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white"
          >
            Destinations
          </Link>
          <Link
            to="/user/Packages"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white"
          >
            Packages
          </Link>
        </div>
      </div>

      {isWishlistSidebarOpen && (
        <WishlistSidebar
          isOpen={isWishlistSidebarOpen}
          onClose={() => setIsWishlistSidebarOpen(false)}
        />
      )}
    </nav>
  );
}
