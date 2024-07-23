import React,{useEffect} from 'react';
import Sidebar from './sidebar';
import axios from '../../api';
import { useSelector, useDispatch } from 'react-redux';
import { deleteState } from '../../redux/statesSlice';
import { Link } from 'react-router-dom';

const States = () => {
  const states = useSelector((state) => state.state.states);

  const dispatch = useDispatch();

  const handleDelete = async (state) => {
    try {
      await axios.delete(`/deltestate/${state._id}`);
      dispatch(deleteState(state._id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />

      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">States List</h2>
          <Link
            to="/admin/statesAdd"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Add State
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="px-4 py-3 border-b-2 border-blue-800 text-left leading-4 tracking-wider">ID</th>
                <th className="px-4 py-3 border-b-2 border-blue-800 text-left leading-4 tracking-wider">Name</th>
                <th className="px-4 py-3 border-b-2 border-blue-800 text-left leading-4 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {states.map((state) => (
                <tr key={state._id} className="hover:bg-gray-100">
                  <td className="px-4 py-4 whitespace-no-wrap">{state._id}</td>
                  <td className="px-4 py-4 whitespace-no-wrap">{state.stateName}</td>
                  <td className="px-4 py-4 whitespace-no-wrap flex items-center">
                    <Link
                      to={`/admin/states/${state._id}/places`}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      View Places
                    </Link>
                    <button
                      onClick={() => handleDelete(state)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default States;
