import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addStates } from '../../redux/statesSlice';
import { useDispatch } from 'react-redux';
import axios from '../../api';
import Sidebar from './sidebar';

const PlacesAdd = () => {
  const { stateId } = useParams();
  const [districts, setDistricts] = useState([{ name: '' }]);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleAddDistrict = () => {
    setDistricts([...districts, { name: '' }]);
  };

  const handleDistrictChange = (index, event) => {
    const newDistricts = districts.map((district, i) => {
      if (i === index) {
        return { ...district, name: event.target.value };
      }
      return district;
    });
    setDistricts(newDistricts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/addplaces/${stateId}`, { districts });

      dispatch(addStates(response.data.states))
      navigate(`/admin/states/${stateId}/places`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-6 bg-white rounded shadow-md w-full max-w-md mx-auto my-auto">
        <h2 className="text-lg font-bold mb-4">Add Districts</h2>
        <form onSubmit={handleSubmit}>
          {districts.map((district, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`district-${index}`} className="block text-gray-700 font-bold mb-2">
                District Name
              </label>
              <input
                type="text"
                id={`district-${index}`}
                value={district.name}
                onChange={(e) => handleDistrictChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDistrict}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Add Another District
          </button>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlacesAdd;
