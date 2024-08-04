import React, { useState, useEffect } from 'react';
import axios from "../../api";

const TourPackageEdit = ({ packageData, onClose }) => {
  const [editFormData, setEditFormData] = useState({
    packageName: "",
    description: "",
    price: "",
    seats: "",
    startDate: "",
    duration: "",
    activities: [],
    destinations: "",
    removedImages: [], // Track removed images
  });

  const [newImages, setNewImages] = useState([]); 
  const [images, setImages] = useState([]); // Separate state for package images

  useEffect(() => {
    if (packageData) {
      setEditFormData({
        packageName: packageData.packageName || "",
        description: packageData.description || "",
        price: packageData.price || "",
        seats: packageData.seats || "",
        startDate: packageData.startDate || "",
        duration: packageData.duration || "",
        activities: packageData.activities || [],
        destinations: packageData.destinations || "",
        removedImages: [], 
      });
      setNewImages([]); 
      setImages(packageData.images || []); // Initialize images state
    }
  }, [packageData]);

  const handleEditFormChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const selectedFiles = Array.from(files).slice(0, 5 - (images.length + newImages.length)); // Adjust limit
      setNewImages((prevImages) => [...prevImages, ...selectedFiles]);
    } else if (name === "destinations") {
      setEditFormData({
        ...editFormData,
        destinations: value,
      });
    } else if (name === "activities") {
      setEditFormData({
        ...editFormData,
        activities: value.split(',').map(activity => activity.trim()), // Splitting comma-separated values
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleActivityAdd = () => {
    const activity = document.getElementById('newActivity').value.trim();
    if (activity) {
      setEditFormData((prevData) => ({
        ...prevData,
        activities: [...prevData.activities, activity],
      }));
      document.getElementById('newActivity').value = '';
    }
  };

  const handleActivityRemove = (index) => {
    setEditFormData((prevData) => ({
      ...prevData,
      activities: prevData.activities.filter((_, i) => i !== index),
    }));
  };

  const handleImageRemove = (index) => {
    const imageToRemove = images[index];
    setEditFormData((prevState) => ({
      ...prevState,
      removedImages: [...prevState.removedImages, imageToRemove], // Add removed image to the list
    }));
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('packageName', editFormData.packageName);
    formData.append('description', editFormData.description);
    formData.append('price', editFormData.price);
    formData.append('seats', editFormData.seats);
    formData.append('startDate', editFormData.startDate);
    formData.append('duration', editFormData.duration);
    formData.append('destinations', editFormData.destinations);
    formData.append('activities', JSON.stringify(editFormData.activities));
    formData.append('removedImages', JSON.stringify(editFormData.removedImages)); // Append removed images

    newImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.put(`/editTourPackages/${packageData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onClose(); 
    } catch (error) {
      console.error("Error updating tour package:", error);
    }
  };

  const createObjectURL = (image) => {
    return image instanceof File ? URL.createObjectURL(image) : image;
  };

  const canAddMoreImages = images.length + newImages.length < 5;

  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-screen-md mt-5">
        <h2 className="text-2xl font-bold mb-4">Edit Package</h2>
        <form onSubmit={handleEditSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="packageName">Package Name</label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="packageName"
              type="text"
              placeholder="Package Name"
              name="packageName"
              value={editFormData.packageName}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Description"
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="flex mb-4 space-x-4">
            <div className="w-1/3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="text"
                placeholder="Price"
                name="price"
                value={editFormData.price}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seats">Seats</label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="seats"
                type="number"
                placeholder="Seats"
                name="seats"
                value={editFormData.seats}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">Start Date</label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startDate"
                type="date"
                name="startDate"
                value={editFormData.startDate}
                onChange={handleEditFormChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">Duration</label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="duration"
              type="text"
              placeholder="Duration"
              name="duration"
              value={editFormData.duration}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="activities">Activities</label>
            <div className="flex flex-col gap-2">
              {editFormData.activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-700">{activity}</span>
                  <button
                    type="button"
                    onClick={() => handleActivityRemove(index)}
                    className="bg-red-500 text-white rounded px-2 py-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  id="newActivity"
                  type="text"
                  placeholder="Add new activity"
                  className="border rounded px-2 py-1 w-full"
                />
                <button
                  type="button"
                  onClick={handleActivityAdd}
                  className="bg-blue-500 text-white rounded px-4 py-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destinations">Destinations</label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="destinations"
              type="text"
              placeholder="Destinations"
              name="destinations"
              value={editFormData.destinations}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">Images</label>
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={createObjectURL(image)} alt={`Package image ${index + 1}`} className="h-16 lg:h-24 rounded"/>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {newImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(image)} alt={`New image ${index + 1}`} className="h-16 lg:h-24  rounded"/>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(images.length + index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}

            {canAddMoreImages && (
      <div className="relative  border-dashed border-2 border-gray-300 rounded flex items-center justify-center">

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleEditFormChange}
                className="absolute inset-0 h-16 lg:h-24 opacity-0 cursor-pointer"
                />
                <p className="text-gray-500">Add Image</p>
            </div>
            )}

            </div>
            
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white rounded px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourPackageEdit;
