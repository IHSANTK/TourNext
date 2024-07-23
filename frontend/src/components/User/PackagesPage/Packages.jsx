import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import axios from '../../../api';
import { Link } from 'react-router-dom';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    async function fetchPackages() {
      const response = await axios.get('/getAllpackages',{ withCredentials: true }); 
      setPackages(response.data);
    }
    fetchPackages();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle price filter change
  const handlePriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  // Filter packages based on search term and price
  const filteredPackages = packages.filter((pkg) => {
    return (
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (maxPrice === '' || pkg.price <= maxPrice)
    );
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mt-16 flex flex-col lg:flex-row">
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
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={handlePriceChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="lg:w-3/4 mt-8 lg:mt-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => (
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
        </div>
      </div>
    </div>
  );
}
