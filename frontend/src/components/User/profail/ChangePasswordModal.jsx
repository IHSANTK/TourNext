import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Toastify from 'toastify-js';
import { useDispatch } from 'react-redux';
import {setuser } from "../../../redux/userauthSlice";
import 'toastify-js/src/toastify.css';
import axios from '../../../api'

const ChangePasswordModal = ({show,onClose,user}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [err,seterr] = useState('')

  const handleSave = async () => {
    console.log('Changing password:', { currentPassword, newPassword,confirmNewPassword, });

    try{
        const response = await axios.post(`/changepassword/${user._id}`, { currentPassword, newPassword,confirmNewPassword, }, { withCredentials: true });
             
        console.log(response.data);
        if(response.data==='password update sccesfully'){
              Toastify({
                text: response.data,
                duration: 3000, 
                gravity: 'top', 
                position: 'right',
                backgroundColor: 'green',
              }).showToast();
              onClose();
              setConfirmNewPassword('')
              setCurrentPassword('')
              setNewPassword('')
              seterr('')
        }else{
            seterr(response.data)
            console.log('rerere',err);
        }
    }catch(error){
        console.error(error);
    }
 
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
         X
        </button>
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Current Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <p className='text-red-500  font-bold'>{err}</p>

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

export default ChangePasswordModal;
