import React from 'react';

const Modal = ({ selectedPackage, onClose }) => {


  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid ">
          <div className="col-span-1">
            <div className="mb-4">
              {selectedPackage.images && selectedPackage.images.length > 0 ? (
                <div className="flex mb-4 ml-5">
                  {selectedPackage.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={selectedPackage.name}
                      className=" w-1/6 h-30 object-cover mr-2"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-2">{selectedPackage.packageName}</h3>
            <h6 className="text-lg font-bold">Description</h6>
            <p className="text-gray-700 mb-2">{selectedPackage.description}</p>
            <h6 className="text-lg font-bold">Destinations</h6>
            <p className="text-gray-700 mb-2">{selectedPackage.destinations}</p>
            <h6 className="text-lg font-bold">Total Seats</h6>
            <p className="text-gray-700 mb-2">{selectedPackage.seats}</p>
            <h6 className="text-lg font-bold">Trip Start Date</h6>
            <p className="text-gray-700 mb-2">{selectedPackage.startDate}</p>
            <h6 className="text-lg font-bold">Activities</h6>
            {selectedPackage.activities.map((activity, index) => (
              <p key={index} className="text-gray-700 mb-2">
                {activity}
              </p>
            ))}
            <h6 className="text-lg font-bold">Trip Duration</h6>
            <p className="text-gray-700 mb-2">{selectedPackage.duration}</p>
            <p className="text-gray-700 mb-2">
              <strong>Price:</strong> {selectedPackage.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
