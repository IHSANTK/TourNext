import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import axios from '../../../api';
import { Link } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await axios.get('/getAllpackages', {
          params: {
            page: currentPage,
            limit: 9,
            searchTerm,
            minPrice: priceRange[0],
            maxPrice: priceRange[1]
          },
          withCredentials: true
        });
        setPackages(response.data.packages);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    }
    fetchPackages();
  }, [currentPage, searchTerm, priceRange]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
    setCurrentPage(1); 
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Navbar />
      <div className=" mx-auto px-4 mt-16 flex flex-col lg:flex-row ">
        <div className="lg:w-1/4 lg:pr-8">
          <div className="sticky top-0 p-4 bg-white shadow-md rounded-md mt-5">
            <h2 className="text-xl font-bold mb-4">Filter Packages</h2>
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-full"
            />
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            <Range
              step={100}
              min={0}
              max={10000}
              values={priceRange}
              onChange={handlePriceChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="h-2 pr-2 bg-gray-200 rounded-lg"
                  style={{
                    background: getTrackBackground({
                      values: priceRange,
                      colors: ['#ccc', '#548BF4', '#ccc'],
                      min: 0,
                      max: 10000,
                    }),
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="h-5 w-5 bg-blue-500 rounded-full"
                />
              )}
            />
            <div className="flex justify-between mt-2">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div className="lg:w-4/4 mt-8 lg:mt-9 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="max-w-xs mt-5 rounded overflow-hidden bg-white shadow-md transition-transform duration-500 ease-in-out transform hover:scale-105"
              >
                <div className="relative h-64 rounded-t overflow-hidden">
                  <Link to={`/user/packagedetails/${pkg._id}`}>
                    <img
                      className="w-full h-full object-cover"
                      src={pkg.images[0]}
                      alt={`Image for ${pkg.packageName}`}
                    />
                  </Link>
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-xl mb-2">{pkg.packageName}</h2>
                  <p className="text-gray-700 text-base">{pkg.description}</p>
                  <p className="text-gray-900 font-bold mt-2">₹{pkg.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                {[...Array(totalPages).keys()].map((page) => (
                  <li
                    key={page + 1}
                    className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      className="page-link"
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
