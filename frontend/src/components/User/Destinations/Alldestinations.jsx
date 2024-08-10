import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const [searchQuery, setSearchQuery] = useState('');

  const[states,setStates] =useState()
  const[categories,setCategory] = useState()

  const location = useLocation();
  const searchResults = location.state?.results || [];

  // const states = useSelector((state) => state.state.states);

  console.log('states',states);

  // const categories = useSelector((state) => state.category.categories);

  // console.log("all categoris",categories);

  const destinationsPerPage = 9;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesRes, categoriesRes] = await Promise.all([
          axios.get('/getstates'),
          axios.get('/getcategorys'),
        ]);

        setStates(statesRes.data);
        setCategory(categoriesRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/getAllDestinations', {
          params: {
            page: currentPage,
            limit: destinationsPerPage,
            state: selectedState,
            district: selectedDistrict,
            category: selectedCategory,
            search: searchQuery,
          },
          withCredentials: true,
        });
        setDestinations(response.data.destinations);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (error) {
        console.error(error);
      }
    };

    if (searchResults.length>0) {
     
      console.log('serch block');
      setDestinations(searchResults);
      setTotalPages(1);
    } else {
      console.log('fethblock');
      fetchDestinations();
    }
  }, [currentPage, selectedState, selectedDistrict, selectedCategory, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    const state = states.find(state => state.stateName === stateName);
    setFilteredDistricts(state ? state.districts : []);
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
      setShowStateDropdown(!showStateDropdown);
      setShowDistrictDropdown(false);
      setShowCategoryDropdown(false);
    } else if (dropdown === 'district') {
      setShowDistrictDropdown(!showDistrictDropdown);
    } else if (dropdown === 'category') {
      setShowCategoryDropdown(!showCategoryDropdown);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-3 " >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-5" >
          <div className="lg:col-span-1 p-4 shadow-lg rounded-xl h-[330px]">

          <div className="mb-4">
              <input
                type="text"
                placeholder="Search destinations"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                State
              </label>
              <div className="relative">
                <div
                  className="cursor-pointer bg-white border-b-2 rounded p-2 text-black flex items-center justify-between"
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
                  District
                </label>
                <div className="relative">
                  <div
                    className="cursor-pointer bg-white border-b-2 rounded p-2 text-black flex items-center justify-between"
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
                  className="cursor-pointer bg-white border-b-2 rounded p-2 text-black flex items-center justify-between"
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
            {destinations.length > 0 ? (
              <div className="space-y-8">
                {destinations.map((destination, index) => (
                  <div
                    key={index}
                    className={`flex flex-col lg:flex-row ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} items-center bg-white p-4 shadow-lg shadow-black rounded-se-md rounded-es-md rounded-ss-3xl rounded-ee-3xl`}
                  >
                    <div className="lg:w-1/2 mb-4 lg:mb-0">
                      <Link to={`/user/destinationDetails/${destination._id}`}>
                        <img
                          src={destination.images[0]}
                          alt={destination.name}
                          className="w-full border border-white h-auto rounded-lg shadow-xl shadow-black"
                        />
                      </Link>
                    </div>
                    <div className="lg:w-1/2 lg:pl-4 text-center lg:text-left">
                      <h3 className="text-xl font-semibold">{destination.name}</h3>
                      <p>{destination.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-700 mt-10">
                <p>No destinations found</p>
              </div>
            )}
            {destinations.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav>
                  <ul className="flex list-none">
                    {[...Array(totalPages).keys()].map(num => (
                      <li
                        key={num}
                        className={`px-3 py-1 border ${currentPage === num + 1 ? 'bg-gray-300' : ''}`}
                      >
                        <button onClick={() => paginate(num + 1)}>{num + 1}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alldestinations;
