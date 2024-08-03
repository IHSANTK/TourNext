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
    images: [], // For displaying images
    newImages: [], // For new images to upload
    removedImages: [], // For removed images
    destinations: "",
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
        newImages: [], // Clear new images on load
        removedImages: [], // Clear removed images on load
        destinations: packageData.destinations || "",
      });
    }
  }, [packageData]);

  const handleEditFormChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const selectedFiles = Array.from(files).slice(0, 5);
      const uploadedImages = selectedFiles.map((file) => URL.createObjectURL(file));
      setEditFormData((prevData) => ({
        ...prevData,
        newImages: [...prevData.newImages, ...files],
        images: [...prevData.images, ...uploadedImages],
      }));
    } else if (name === "destinations") {
      setEditFormData({
        ...editFormData,
        destinations: value,
      });
    } else if (name === "activities") {
      setEditFormData({
        ...editFormData,
        activities: value.split(',').map(activity => activity.trim()),
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

  const handleImageRemove = (index, url) => {
    setEditFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
      removedImages: [...prevData.removedImages, url],
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
    formData.append('removedImages', JSON.stringify(editFormData.removedImages));
    editFormData.newImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post(
        `/editTourPackages/${packageData._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Handle successful response
      console.log(response.data);
      onClose(); // Close modal or perform any other action
    } catch (error) {
      console.error("Error updating tour package:", error);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-xl mt-5">
        <h2 className="text-2xl font-bold mb-4">Edit Package</h2>
        <form onSubmit={handleEditSubmit}>
          {/* Form fields (same as your original code) */}
          {/* Add your form fields here... */}
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
                    onClick={() => handleImageRemove(index, image)}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Other form fields */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
