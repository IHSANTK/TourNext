import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from '../../api';
import { ClipLoader } from 'react-spinners';  

const TourPackageAddForm = () => {
  const [packageName, setPackageName] = useState('');
  const [destinations, setDestinations] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState('');
  const [activities, setActivities] = useState(['']);
  const [tripDuration, setTripDuration] = useState('');
  const [tripStartDate, setTripStartDate] = useState('');
  const [images, setImages] = useState(Array(5).fill(null));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();

  const handleImageChange = (index, e) => {
    const updatedImages = images.map((image, i) =>
      i === index ? e.target.files[0] : image
    );
    setImages(updatedImages);
  };

  const handleActivityChange = (index, value) => {
    const updatedActivities = activities.map((activity, i) =>
      i === index ? value : activity
    );
    setActivities(updatedActivities);
  };

  const handleAddActivity = () => {
    setActivities([...activities, '']);
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  const validateForm = () => {
    const errors = {};

    if (!packageName) errors.packageName = 'Package Name is required';
    if (!destinations) errors.destinations = 'Destinations are required';
    if (!price || isNaN(price)) errors.price = 'Price must be a valid number';
    if (!description) errors.description = 'Description is required';
    if (!seats || isNaN(seats)) errors.seats = 'Seats must be a valid number';
    if (!tripDuration) errors.tripDuration = 'Trip Duration is required';
    if (!tripStartDate) errors.tripStartDate = 'Trip Start Date is required';
    if (activities.some(activity => !activity)) errors.activities = 'All Activities are required';
    if (images.some(image => !image)) errors.images = 'All 5 images are required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!validateForm()) {
      return;
    }
  setLoading(true); 
    const formData = new FormData();
    formData.append('packageName', packageName);
    formData.append('destinations', destinations);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('seats', seats);
    formData.append('duration', tripDuration);
    formData.append('startDate', tripStartDate);
    activities.forEach((activity, index) => {
      formData.append(`activities[${index}]`, activity);
    });
    images.forEach((image, index) => {
      if (image) {
        formData.append(`images`, image);
      }
    });

    try {
      await axios.post('/addTourPackages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/admin/tourPackagelist'); 
    } catch (error) {
      console.error('Error adding tour package:', error);
    }finally {
        setLoading(false);  
      }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex  bg-gray-100">
      <Sidebar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Add Tour Package</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Package Name</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
          
              />
              {errors.packageName && <span className="text-red-500">{errors.packageName}</span>}
            </div>
            <div>
              <label className="block text-gray-700">Destinations</label>
              <input
                type="text"
                value={destinations}
                onChange={(e) => setDestinations(e.target.value)}
                className="w-full px-3 py-2 border rounded"
            
              />
              {errors.destinations && <span className="text-red-500">{errors.destinations}</span>}
            </div>
            <div className="flex space-x-4">
              <div className="w-1/4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                 
                />
                {errors.price && <span className="text-red-500">{errors.price}</span>}
              </div>
              <div className="w-1/4">
                <label className="block text-gray-700">Seats</label>
                <input
                  type="number" 
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
            
                />
                {errors.seats && <span className="text-red-500">{errors.seats}</span>}
              </div>
              <div className="w-1/4">
                <label className="block text-gray-700">Duration</label>
                <input
                  type="text"
                  value={tripDuration}
                  onChange={(e) => setTripDuration(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
             
                />
                {errors.tripDuration && <span className="text-red-500">{errors.tripDuration}</span>}
              </div>
              <div className="w-1/4">
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={tripStartDate}
                  onChange={(e) => setTripStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  min={today}
                
                />
                {errors.tripStartDate && <span className="text-red-500">{errors.tripStartDate}</span>}
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded"
         
              ></textarea>
              {errors.description && <span className="text-red-500">{errors.description}</span>}
            </div>
            <div>
              <label className="block text-gray-700">Activities</label>
              {activities.map((activity, index) => (
                <div key={index} className="flex space-x-4 mb-2">
                  <input
                    value={activity}
                    onChange={(e) => handleActivityChange(index, e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                   
                  ></input>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {errors.activities && <span className="text-red-500">{errors.activities}</span>}
              <button
                type="button"
                onClick={handleAddActivity}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Activity
              </button>
            </div>
            <div>
              <label className="block text-gray-700">Images</label>
              {images.map((image, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(index, e)}
                    className="w-full px-3 py-2 border rounded"
                  
                  />
                </div>
              ))}
              {errors.images && <span className="text-red-500">{errors.images}</span>}
            </div>
        
          <div className="flex items-center justify-between">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="submit"
              disabled={loading}  
            >
              {loading ? <ClipLoader size={24} color="#fff" /> : 'Add Packages'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourPackageAddForm;
