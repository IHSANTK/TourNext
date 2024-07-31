import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Toastify from 'toastify-js';
import { useDispatch } from 'react-redux';
import 'toastify-js/src/toastify.css';
import {setuser } from "../../../redux/userauthSlice";
import axios from '../../../api'

const EditProfileModal = ({ show, onClose, user }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhone] = useState(user.phoneNumber || '');

  const dispatch = useDispatch()

  const handleSave =  async () => {
    console.log('Saving changes:', { name, email, phoneNumber });

    try{

        const response = await axios.post(`/editprofile/${user._id}`, { name, email, phoneNumber }, { withCredentials: true });
        if(response.status === 200){
            Toastify({
                text: response.data.message,
                duration: 3000, 
                gravity: 'top', 
                position: 'right',
                backgroundColor: 'green',
              }).showToast();

              dispatch(setuser({user:response.data.user}))

        }
           
    }catch(error){
        console.error(error);
    }
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTrash size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={phoneNumber}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
