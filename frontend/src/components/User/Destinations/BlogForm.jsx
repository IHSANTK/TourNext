import React, { useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import axios from '../../../api';

const BlogForm = ({ destinationId, onClose }) => {
  const [newBlog, setNewBlog] = useState({ description: '', rating: '',text:'' });
  const [imageFields, setImageFields] = useState([{ id: Date.now(), file: null, preview: '' }]);

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleImageChange = (id, e) => {
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);

    setImageFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, file: file, preview: preview }
          : field
      )
    );
  };

  const handleAddImageField = () => {
    setImageFields((prevFields) => [
      ...prevFields,
      { id: Date.now(), file: null, preview: '' }
    ]);
  };

  const handleRemoveImageField = (id) => {
    setImageFields((prevFields) =>
      prevFields.filter((field) => field.id !== id)
    );
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('destinationId', destinationId);
    formData.append('description', newBlog.description);
    formData.append('text', newBlog.text);
    formData.append('rating', newBlog.rating);

    imageFields.forEach(field => {
      if (field.file) {
        formData.append('images', field.file);
      }
    });

    console.log('form',formData);
    try {
      await axios.post('/addblog', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Toastify({
        text: 'Blog added successfully!',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'green',
      }).showToast();
      onClose();
      setNewBlog({ description: '', rating: '' });
      setImageFields([{ id: Date.now(), file: null, preview: '' }]);
    } catch (err) {
      console.error(err);
      alert("Unable to add blog. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 sm:mx-0">
        <h2 className="text-2xl font-semibold mb-4">Add a Blog</h2>
        <form onSubmit={handleBlogSubmit}>


        <div className="mb-4">
            <label htmlFor="text" className="block text-lg font-medium mb-2">Text</label>
            <input
              id="text"
              name="text"
              value={newBlog.text}
              onChange={handleBlogChange}
              
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base md:text-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-medium mb-2">Your Blog</label>
            <textarea
              id="description"
              name="description"
              value={newBlog.description}
              onChange={handleBlogChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base md:text-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-lg font-medium mb-2">Rating</label>
            <select
              id="rating"
              name="rating"
              value={newBlog.rating}
              onChange={handleBlogChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base md:text-lg"
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Upload Images</label>
            {imageFields.map((field) => (
              <div key={field.id} className="flex flex-col sm:flex-row items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="file"
                  onChange={(e) => handleImageChange(field.id, e)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {field.preview && (
                  <img
                    src={field.preview}
                    alt={`Preview ${field.id}`}
                    className="w-14 h-14 object-cover rounded-lg mt-2 sm:mt-0 sm:ml-4"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImageField(field.id)}
                  className="text-red-500 mt-2 sm:mt-0"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImageField}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
              Add Another Image
            </button>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
            >
              Submit Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
