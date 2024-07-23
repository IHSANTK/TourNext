import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { addStates } from '../../redux/statesSlice';
import Sidebar from './sidebar'; 
import axios from '../../api';

export default function StatesAdd() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigae = useNavigate()

  const onSubmit = async (data) => {
    try {
      const { stateName } = data;
      console.log("Submitting state:", stateName);

      const response = await axios.post('/addstates', { stateName });
      const states = response.data.states;

      console.log("Received states:", states);
      dispatch(addStates(states));
      navigae('/admin/states')
    } catch (error) {
      console.error('Error adding state:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <form onSubmit={handleSubmit(onSubmit)} className=" p-6 rounded  w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Add States</h2>
        
        <div className="mb-4">
          <label htmlFor="stateName" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input 
            type="text"
            id="stateName"
            {...register('stateName', { required: 'State name is required' })}
            className={`shadow appearance-none border ${errors.stateName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
          {errors.stateName && <p className="text-red-500 text-xs italic">{errors.stateName.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add State
          </button>
        </div>
      </form>
    </div>
  );
}
