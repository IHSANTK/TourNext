import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import axios from '../../api';

const BannerManagement = () => {
  const [banners, setBanners] = useState({
    mainHome: ['', '', ''],
    homeAbout: '',
    aboutPage: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    mainHome: ['', '', ''],
    homeAbout: '',
    aboutPage: '',
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/getBanners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleEdit = () => {
    setEditFormData(banners);
    setIsEditing(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      const uploadedImage = URL.createObjectURL(files[0]);
      if (name.startsWith('mainHome')) {
        const index = parseInt(name.split('.')[1]);
        const updatedMainHome = [...editFormData.mainHome];
        updatedMainHome[index] = uploadedImage;
        setEditFormData({ ...editFormData, mainHome: updatedMainHome });
      } else {
        setEditFormData({ ...editFormData, [name]: uploadedImage });
      }
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/editBanners', editFormData);
      setBanners(editFormData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating banners:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      mainHome: ['', '', ''],
      homeAbout: '',
      aboutPage: '',
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Banner Management</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Banners
              </button>
            )}
          </div>
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Main Home Carousel</label>
                {editFormData.mainHome.map((image, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      name={`mainHome.${index}`}
                      onChange={handleEditFormChange}
                    />
                    {image && (
                      <img
                        src={image}
                        alt={`Main Home ${index + 1}`}
                        className="w-24 h-24 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Home About Section</label>
                <input
                  type="file"
                  accept="image/*"
                  name="homeAbout"
                  onChange={handleEditFormChange}
                />
                {editFormData.homeAbout && (
                  <img
                    src={editFormData.homeAbout}
                    alt="Home About"
                    className="w-24 h-24 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">About Page</label>
                <input
                  type="file"
                  accept="image/*"
                  name="aboutPage"
                  onChange={handleEditFormChange}
                />
                {editFormData.aboutPage && (
                  <img
                    src={editFormData.aboutPage}
                    alt="About Page"
                    className="w-24 h-24 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4 focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Main Home Carousel</h3>
                <div className="flex space-x-2">
                  {banners.mainHome.map((image, index) => (
                    <div key={index} className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                      {image ? (
                        <img src={image} alt={`Main Home ${index + 1}`} className="w-full h-full object-cover rounded" />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Home About Section</h3>
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  {banners.homeAbout ? (
                    <img src={banners.homeAbout} alt="Home About" className="w-full h-full object-cover rounded" />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">About Page</h3>
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  {banners.aboutPage ? (
                    <img src={banners.aboutPage} alt="About Page" className="w-full h-full object-cover rounded" />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;
