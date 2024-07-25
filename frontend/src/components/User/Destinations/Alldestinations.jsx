import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import axios from '../../../api';

const Alldestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const destinationsPerPage = 10;

  useEffect(() => {
    const fetchDestinations = async (page) => {
      try {
        const response = await axios.get('/getAllDestinations', {
          params: { page, limit: destinationsPerPage },
          withCredentials: true
        });
        setDestinations(response.data.destinations);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDestinations(currentPage);
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8" style={{ marginTop: '100px' }}>
        <h2 className="text-2xl font-bold mb-4">All Destinations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 p-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                State
              </label>
              <select
                id="state"
                // value={selectedState}
                // onChange={handleStateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select State</option>
                {/* {states.map((state, index) => (
                  <option key={index} value={state.name}>
                    {state.name}
                  </option>
                ))} */}
                {'demos'}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                // value={selectedCategory}
                // onChange={handleCategoryChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Category</option>
                {/* {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))} */}
                {'demos'}
              </select>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {destinations.map((destination, index) => (
                <div key={index} className={`flex flex-col lg:flex-row ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} items-center`}>
                  <div className="lg:w-1/2 mb-4 lg:mb-0">
                    <img src={destination.images[0]} alt={destination.name} className="w-full h-auto rounded-lg" />
                  </div>
                  <div className="lg:w-1/2 lg:pl-4 text-center lg:text-left">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <p>{destination.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <nav>
                <ul className="flex list-none">
                  {[...Array(totalPages).keys()].map(num => (
                    <li key={num} className={`px-3 py-1 border ${currentPage === num + 1 ? 'bg-gray-300' : ''}`}>
                      <button onClick={() => paginate(num + 1)}>{num + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alldestinations;
