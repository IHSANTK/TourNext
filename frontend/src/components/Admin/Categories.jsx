import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './sidebar';
import axios from '../../api';
import { updateCategory, deleteCategory } from '../../redux/categorySlice';

export default function Categories() {
  const categories = useSelector((state) => state.category.categories);
  
  const [editData, setEditData] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const dispatch = useDispatch();

  const handleEdit = (category) => {
    setEditData(category);
    setNewCategoryName(category.categoryName);
  };

  const handleDelete = async (category) => {
    try {
      await axios.delete(`/deletecategories/${category._id}`);
      dispatch(deleteCategory(category._id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedCategory = { ...editData, categoryName: newCategoryName };
      const response = await axios.put(`/editcategories/${editData._id}`, updatedCategory);

      dispatch(updateCategory(response.data.category));
      setEditData(null);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />

      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Category List</h2>
          <Link to="/admin/categorieAdd" className="btn bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded">
            Add
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left leading-4 tracking-wider">ID</th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left leading-4 tracking-wider">Name</th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left leading-4 tracking-wider">Date</th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left leading-4 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-4 py-4 whitespace-no-wrap">{category._id}</td>
                  <td className="px-4 py-4 whitespace-no-wrap">
                    {editData && editData._id === category._id ? (
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      category.categoryName
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-no-wrap">{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 whitespace-no-wrap">
                    {editData && editData._id === category._id ? (
                      <button onClick={handleSave} className="text-green-600 hover:text-green-700 mr-2">
                        Save
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-700 mr-2">
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => handleDelete(category)} className="text-red-600 hover:text-red-700">
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
