import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import axios from '../../api';
import { Link, useParams } from 'react-router-dom';

const Places = () => {
  const { stateId } = useParams();
  const [districts, setDistricts] = useState([]);
  const [stateName, setStateName] = useState('');
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [newDistrictName, setNewDistrictName] = useState('');

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.post('/getplaces', { stateId });
        setDistricts(response.data.districts);
        setStateName(response.data.stateName);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    fetchDistricts();
  }, [stateId]);

  const handleDelete = async (districtId) => {
    try {
      await axios.delete(`/deleteplace/${stateId}/${districtId}`);
      setDistricts(districts.filter(district => district._id !== districtId));
    } catch (error) {
      console.error('Error deleting district:', error);
    }
  };

  const handleEdit = (district) => {
    setEditingDistrict(district);
    setNewDistrictName(district.districtName);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/updateplace/${stateId}/${editingDistrict._id}`, { districtName: newDistrictName });
      setDistricts(districts.map(district => district._id === editingDistrict._id ? { ...district, districtName: newDistrictName } : district));
      setEditingDistrict(null);
      setNewDistrictName('');
    } catch (error) {
      console.error('Error updating district:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />

      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Places of State {stateName}</h2>
          <Link
            to={`/admin/placesAdd/${stateId}`}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Add District
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 border-b-2 border-blue-800 text-left leading-4 tracking-wider">Number</th>
                <th className="px-4 py-3 border-b-2 border-blue-800 text-left leading-4 tracking-wider">Name</th>
                <th className="px-4 py-3 border-b-2 border-blue-800 text-left leading-4 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {districts.map((district, index) => (
                <tr key={district._id} className="hover:bg-gray-100">
                  <td className="px-4 py-4 whitespace-no-wrap">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-no-wrap">{district.districtName}</td>
                  <td className="px-4 py-4 whitespace-no-wrap">
                    <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => handleEdit(district)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(district._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingDistrict && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Edit District</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">District Name</label>
                <input
                  type="text"
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded mr-2">
                  Save
                </button>
                <button type="button" onClick={() => setEditingDistrict(null)} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
