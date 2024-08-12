import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import axios from '../../../api';
import { Link } from 'react-router-dom';
import { Range, getTrackBackground } from 'react-range';
import RatingStars from '../RatingStars';
import Spinner from '../Spinner';

const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
};

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Loading state


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
      }finally {
        setIsLoading(false); 
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
  if (isLoading) {
    return <Spinner />; 
  }
  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 flex flex-col lg:flex-row" style={{marginTop:'100px'}}>
        <div className="lg:w-1/4 lg:pr-8">
          <div className="sticky top-40 p-4 bg-white shadow-md rounded-md">
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full ps-3 p-2 mb-4 placeholder:text-slate-700 outline-none border-b-2 border-gray-300 rounded-full"
            />
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            <Range
              step={100}
              min={0}
              max={10000}
              values={priceRange}
              onChange={handlePriceChange}
              renderTrack={({ props, children }) => {
                return (
                  <div
                    {...props}
                    className="h-2 pr-2 bg-emerald-500 rounded-lg"
                    style={{
                      background: getTrackBackground({
                        values: priceRange,
                        colors: ['#ccc', 'rgb(16 185 129)', '#ccc'],
                        min: 0,
                        max: 10000,
                      }),
                    }}
                  >
                    {children}
                  </div>
                );
              }}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="h-5 w-5 bg-emerald-500 rounded-full"
                />
              )}
            />
            <div className="flex justify-between mt-2">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div className="lg:w-3/4 mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="rounded overflow-hidden bg-white shadow-md transition-transform duration-500 ease-in-out transform hover:scale-105"
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
                  
                  <p className="text-gray-900 font-bold mt-3">₹{pkg.price}</p>
                  <p className="text-yellow-500 font-semibold mt-3">
                     <RatingStars rating={parseFloat(calculateAverageRating(pkg.reviews))} />
                     </p>
                 
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
