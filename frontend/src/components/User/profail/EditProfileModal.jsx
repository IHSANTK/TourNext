import React, { useState } from 'react';
import { FaTrash, FaCloudUploadAlt, FaEdit, FaPlus } from 'react-icons/fa';
import Toastify from 'toastify-js';
import { useDispatch } from 'react-redux';
import 'toastify-js/src/toastify.css';
import {setuser } from "../../../redux/userauthSlice";
import axios from '../../../api';
import toastify from "../tostify";


const EditProfileModal = ({ show, onClose, user }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhone] = useState(user.phoneNumber || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user.profileImage || '');

  const dispatch = useDispatch()

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    if (image) {
      formData.append('profileImage', image);
    }
 
    console.log(name,email,phoneNumber,image);

    try {
      const response = await axios.post(`/editprofile/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
       if(response.status === 200){

        console.log(response.data);
        toastify(response.data.message)

              dispatch(setuser({user:response.data.user}))
              setImage(null);

              onClose();
        }  
      
      } catch (error) {
      console.error(error);
    }
   
  };

  const handleImageDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile image?')) {
      try {
       const response = await axios.post(`/deleteprofileimage/${user._id}`, {}, { withCredentials: true });

       console.log("afte delte",response.data);
        setImagePreview(''); 
        setImage(null); 
        toastify(response.data.message)

        dispatch(setuser({user:response.data.user}))
        
        onClose();
      } catch (error) {
        console.error('Error deleting profile image:', error);
        alert('Error deleting profile image');
      }
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
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <div className="flex flex-col items-center mb-4 relative">
          <div className="relative">

            {image ?(
              <img
              src={image}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full border-4 border-gray-300"
            />

            ):(
            <img
              src={user.image || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full border-4 border-gray-300"
            />
            )}

            <input
              type="file"
              accept="image/*"
              
              onChange={handleImageChange}
              className="hidden"
              id="imageInput"
            />
            <label
              htmlFor="imageInput"
              className="absolute bottom-0 right-3 bg-gray-600 text-white p-2 rounded-full cursor-pointer hover:bg-gray-800"
            >
             <FaPlus size={10} />
            </label>
          </div>
          <div className="mt-2 flex">
         
            {user.image && (
              <button
                className=""
                onClick={handleImageDelete}
              >
                <FaTrash size={20} className="mr-2" />
              </button>
            )}
          </div>
        </div>
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
              type="number"
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
