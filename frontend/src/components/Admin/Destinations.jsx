import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Sidebar from './sidebar';
import axios from '../../api';
import EditDestinationModal from './EditDestinationModal';
import DestinationDetails from './DestinationDetailsModal';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingDestination, setEditingDestination] = useState(null);
  const [viewingDestination, setViewingDestination] = useState(null); // State for viewing details
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/destinations');
        console.log(response.data);
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (id) => {
    const destination = destinations.find(destination => destination._id === id);
    setEditingDestination(destination);
  };

  const handleDelete = async (id) => {
    console.log(`Delete destination with ID: ${id}`);
    try {
      await axios.delete(`/delteDestination/${id}`);
      setDestinations(destinations.filter(dest => dest._id !== id));
    } catch (error) {
      console.error('Error deleting destination:', error);
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      console.log("aftersubmit", data);
      const response = await axios.put(`/editDestinations/${editingDestination._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDestinations(destinations.map(dest => (dest._id === editingDestination._id ? response.data : dest)));
      setEditingDestination(null);
    } catch (error) {
      console.error('Error updating destination:', error);
    }
  };

  const handleImageClick = (id) => {
    const destination = destinations.find(dest => dest._id === id);
    setViewingDestination(destination);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageItems = destinations.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(destinations.length / itemsPerPage);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Destinations</h2>
            <Link to='/admin/destintionAdd' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add Destination
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {currentPageItems.map((destination) => (
              <div key={destination._id} className="bg-white p-4 rounded shadow">
                {destination.images && destination.images.length > 0 ? (
                  <img
                    src={destination.images[0]}
                    alt={destination.name}
                    className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
                    onClick={() => handleImageClick(destination._id)} // Add click handler
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">{destination.name}</h3>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(destination._id)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(destination._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
              previousLinkClassName={'page-link'}
              nextLinkClassName={'page-link'}
              pageLinkClassName={'page-link'}
            />
          </div>
        </div>
      </div>
      {editingDestination && (
        <EditDestinationModal
          isOpen={!!editingDestination}
          onClose={() => setEditingDestination(null)}
          destination={editingDestination}
          onSubmit={handleEditSubmit}
        />
      )}
      {viewingDestination && (
        <DestinationDetails
          destination={viewingDestination}
          onClose={() => setViewingDestination(null)}
        />
      )}
    </div>
  );
};

export default Destinations;
