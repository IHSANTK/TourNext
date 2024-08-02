import React, { useState } from 'react';
import { FaEdit, FaLock, FaHeart, FaBook, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

const UserProfile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const user = useSelector((state) => state.userauth.user);

  console.log('ok');
  const handleOpenEditProfile = () => setShowEditProfile(true);
  const handleOpenChangePassword = () => setShowChangePassword(true);
  const handleCloseModals = () => {
    setShowEditProfile(false);
    setShowChangePassword(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-9" style={{ marginTop: '150px' }}>
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6 relative">
          <img
            src={user.image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />
        
          <p className="mt-4 text-xl font-semibold">{user.name}</p>
        </div>

      
        <div className="flex justify-center flex-wrap gap-3 mb-6">
          <button
            className="bg-gray-300 text-black font-bold py-2 px-2 rounded-2xl hover:bg-blue-700 flex items-center"
            onClick={handleOpenEditProfile}
          >
            <FaEdit size={20} className="mr-2" />
            Edit Profile
          </button>
          <button
            className="bg-gray-300 text-black font-bold py-2 px-2 rounded-2xl hover:bg-green-700 flex items-center"
            onClick={handleOpenChangePassword}
          >
            <FaLock size={20} className="mr-2" />
            Change Password
          </button>
          <Link to='/user/'
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded-2xl hover:bg-yellow-700 flex items-center"
          >
            <FaHeart size={20} className="mr-2" />
            Wishlist
          </Link>
          <Link to='/user/bookingdetiles/:message'
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded-2xl hover:bg-purple-700 flex items-center"
          >
            <FaBook size={20} className="mr-2" />
            Bookings
          </Link>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center mx-auto"
          >
            <FaSignOutAlt size={20} className="mr-2" />
            Logout
          </button>
        </div>

        {/* Modals */}
        <EditProfileModal
          show={showEditProfile}
          onClose={handleCloseModals}
          user={user}
        />
        <ChangePasswordModal
          show={showChangePassword}
          onClose={handleCloseModals}
          user={user}
        />
      </div>
    </>
  );
};

export default UserProfile;
