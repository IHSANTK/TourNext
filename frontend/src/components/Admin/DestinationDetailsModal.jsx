import React from 'react';

const DestinationDetails = ({ destination, onClose }) => {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{destination.name}</h2>
          <button 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {destination.images && destination.images.length > 0 ? (
            destination.images.map((image, index) => (
              <img key={index} src={image} alt={`${destination.name} ${index}`} className="w-full h-32 object-cover rounded mb-2" />
            ))
          ) : (
            <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center col-span-3">
              <span>No Images</span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2"><strong>Description:</strong> {destination.description}</p>
          <p className="text-gray-700 mb-2"><strong>State:</strong> {destination.state}</p>
          <p className="text-gray-700 mb-2"><strong>District:</strong> {destination.district}</p>
          <p className="text-gray-700 mb-2"><strong>Category:</strong> {destination.category}</p>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
