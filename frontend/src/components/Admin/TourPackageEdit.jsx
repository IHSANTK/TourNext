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
    images: [],
    destinations: "",
    removedImages: [], // Track removed images
  });

  useEffect(() => {
    if (packageData) {
      setEditFormData({
        packageName: packageData.packageName,
        description: packageData.description,
        price: packageData.price,
        seats: packageData.seats,
        startDate: packageData.startDate || "",
        duration: packageData.duration || "",
        activities: packageData.activities || [],
        images: packageData.images || [],
        destinations: packageData.destinations || "",
        removedImages: [], // Initialize empty
      });
    }
  }, [packageData]);

  const handleEditFormChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const selectedFiles = Array.from(files).slice(0, 5 - editFormData.images.length);
      const uploadedImages = selectedFiles.map((file) => URL.createObjectURL(file));
      setEditFormData({
        ...editFormData,
        images: [...editFormData.images, ...uploadedImages],
      });
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
      setEditFormData({
        ...editFormData,
        activities: [...editFormData.activities, activity],
      });
      document.getElementById('newActivity').value = '';
    }
  };

  const handleActivityRemove = (index) => {
    setEditFormData({
      ...editFormData,
      activities: editFormData.activities.filter((_, i) => i !== index),
    });
  };

  const handleImageRemove = (index) => {
    setEditFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
      removedImages: [...prevState.removedImages, packageData.images[index]], // Add removed image to the list
    }));
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
    editFormData.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post(
        `/editTourPackages/${packageData._id}`,
        formData,
      );
      // Handle response and close modal
      onClose();
    } catch (error) {
      console.error("Error updating tour package:", error);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-screen-md mt-5"> {/* Adjusted width */}
        <h2 className="text-2xl font-bold mb-4">Edit Package</h2>
        <form onSubmit={handleEditSubmit}>
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
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex mt-2">
                <input
                  id="newActivity"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="New Activity"
                />
                <button
                  type="button"
                  onClick={handleActivityAdd}
                  className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">Images (select up to 5)</label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="images"
              type="file"
              name="images"
              multiple
              onChange={handleEditFormChange}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {editFormData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Image ${index}`} className="w-24 h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourPackageEdit;
