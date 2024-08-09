import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api';
import { ClipLoader } from 'react-spinners';

const DestinationsAdd = () => {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories.map(category => ({ value: category._id, label: category.categoryName })));
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);  

  const selectedState = watch("state");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get('/states');
        const statesData = response.data.map(state => ({ value: state._id, label: state.stateName, districts: state.districts }));
        setStates(statesData);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const selectedStateData = states.find(state => state.value === selectedState.value);
      if (selectedStateData) {
        setDistricts(selectedStateData.districts.map(district => ({ value: district._id, label: district.districtName })));
      }
    }
  }, [selectedState, states]);

  const onSubmit = async (data) => {
    setLoading(true);  
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category.label);
    formData.append('district', data.district.label);
    formData.append('state', data.state.label);
    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);

    for (let i = 0; i < data.images.length; i++) {
      formData.append('images', data.images[i][0]);
    }
 
    try {
      const response = await axios.post('/destinationadd', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data.destinations);
      navigate('/admin/destintions');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-6 bg-white rounded shadow max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add Destination</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input 
              {...register('name', { required: 'Name is required' })}
              className={`shadow appearance-none border ${errors.name ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="text"
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea 
              {...register('description', { required: 'Description is required' })}
              className={`shadow appearance-none border ${errors.description ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => <Select {...field} options={states} />}
              rules={{ required: 'State is required' }}
            />
            {errors.state && <p className="text-red-500 text-xs italic">{errors.state.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">District</label>
            <Controller
              name="district"
              control={control}
              render={({ field }) => <Select {...field} options={districts} />}
              rules={{ required: 'District is required' }}
            />
            {errors.district && <p className="text-red-500 text-xs italic">{errors.district.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => <Select {...field} options={categories} />}
              rules={{ required: 'Category is required' }}
            />
            {errors.category && <p className="text-red-500 text-xs italic">{errors.category.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
            <input 
              {...register('latitude', { required: 'Latitude is required' })}
              className={`shadow appearance-none border ${errors.latitude ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="text"
            />
            {errors.latitude && <p className="text-red-500 text-xs italic">{errors.latitude.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
            <input 
              {...register('longitude', { required: 'Longitude is required' })}
              className={`shadow appearance-none border ${errors.longitude ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="text"
            />
            {errors.longitude && <p className="text-red-500 text-xs italic">{errors.longitude.message}</p>}
          </div>

          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Image {index + 1}</label>
              <input 
                {...register(`images[${index}]`, { required: `Image ${index + 1} is required` })}
                className={`shadow appearance-none border ${errors.images && errors.images[index] ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                type="file"
              />
              {errors.images && errors.images[index] && <p className="text-red-500 text-xs italic">{errors.images[index].message}</p>}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="submit"
              disabled={loading}  
            >
              {loading ? <ClipLoader size={24} color="#fff" /> : 'Add Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationsAdd;
