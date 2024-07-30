import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import axios from '../../../api';

const Alldestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const states = useSelector((state) => state.state.states);

  console.log('allstates',states);
  const categories = useSelector((state) => state.category.categories);
  const destinationsPerPage = 9;

  console.log(states);
  useEffect(() => {
    const fetchDestinations = async (page) => {
      try {
        const response = await axios.get('/getAllDestinations', {
          params: { 
            page, 
            limit: destinationsPerPage, 
            state: selectedState, 
            district: selectedDistrict, 
            category: selectedCategory 
          },
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
  }, [currentPage, selectedState, selectedDistrict, selectedCategory]);

  const handleStateChange = (stateName) => {

    console.log('statecnage funtion called',stateName);
    setSelectedState(stateName);
    const state = states.find(state => state.stateName === stateName);
    console.log('handlechnge',state);
    if (state) {
        console.log('districts',state.districts);
      setFilteredDistricts(state.districts);
    } else {
      setFilteredDistricts([]);
    }
    setSelectedDistrict('');
    setShowStateDropdown(false);
    setShowDistrictDropdown(true);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setShowDistrictDropdown(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleDropdownToggle = (dropdown) => {
    if (dropdown === 'state') {
        console.log('handle set dropdown');
      setShowStateDropdown(!showStateDropdown);
      setShowDistrictDropdown(false);
      setShowCategoryDropdown(false);
    } else if (dropdown === 'district') {
      setShowDistrictDropdown(!showDistrictDropdown);
    } else if (dropdown === 'category') {
      setShowCategoryDropdown(!showCategoryDropdown);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto " style={{ marginTop: '100px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ marginTop: '150px' }}>
          <div className=" lg:col-span-1 p-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                State
              </label>
              <div className="relative">
                <div
                  className="cursor-pointer bg-white border border-gray-300 rounded p-2 text-black flex items-center justify-between"
                  onClick={() => handleDropdownToggle('state')}
                >
                  <span>{selectedState || 'Select State'}</span>
                  <span className="ml-2">&#9662;</span>
                </div>
                {showStateDropdown && (
                  <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full z-10">
                    {states.map((state, index) => (
                      <div
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleStateChange(state.stateName)}
                      >
                        {state.stateName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {selectedState && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="district">
                 Places
                </label>
                <div className="relative">
                  <div
                    className="cursor-pointer bg-white border border-gray-300 rounded p-2 text-black flex items-center justify-between"
                    onClick={() => handleDropdownToggle('district')}
                  >
                    <span>{selectedDistrict || 'Select District'}</span>
                    <span className="ml-2">&#9662;</span>
                  </div>
                  {showDistrictDropdown && (
                    <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full z-10">
                      {filteredDistricts.map((district, index) => (
                        <div
                          key={index}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleDistrictChange(district.districtName)}
                        >
                          {district.districtName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <div className="relative">
                <div
                  className="cursor-pointer bg-white border border-gray-300 rounded p-2 text-black flex items-center justify-between"
                  onClick={() => handleDropdownToggle('category')}
                >
                  <span>{selectedCategory || 'Select Category'}</span>
                  <span className="ml-2">&#9662;</span>
                </div>
                {showCategoryDropdown && (
                  <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full z-10">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleCategoryChange(category.categoryName)}
                      >
                        {category.categoryName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {destinations.map((destination, index) => (
                <div key={index} className={`flex flex-col lg:flex-row ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} items-center`}>
                  <div className="lg:w-1/2 mb-4 lg:mb-0">
                    <Link to={`/user/destinationDetails/${destination._id}`}>
                      <img src={destination.images[0]} alt={destination.name} className="w-full border-2 h-auto rounded-lg shadow-xl shadow-black" />
                    </Link>
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
