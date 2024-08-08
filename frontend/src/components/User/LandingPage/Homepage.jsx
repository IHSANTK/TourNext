import React, { useState, useEffect } from 'react';
import Navbar from './NavbarHome';
import './Homepage.css';
import Footer from '../Footer';
import axios from '../../../api';
import LazyLoadComponent from './LazyLoadComponent';
import { useNavigate } from 'react-router-dom';
import Alldestinations from '../Destinations/Alldestinations';

export default function Homepage() {
  const [populardest, setPopularDest] = useState([]);
  const [latestPkgs, setLatestPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const response = await axios.get('/getdashboard');
        console.log(response.data);
        setPopularDest(response.data.lastAddedDestinations);
        setLatestPackages(response.data.latestpackages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDatas();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {

      console.log(searchQuery,'fdfdf');
   
      const response = await axios.get(`/searchdestinations?query=${searchQuery}`);
      setSearchResults(response.data);
      navigate('/user/Alldestinations', { state: { results: response.data } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      {/* Carousel */}
      <div id="carouselExampleControls" className="carousel slide relative" data-bs-ride="carousel">
        <div className="carousel-inner h-[250px] lg:h-[450px]">
          <div className="carousel-item active">
            <img
              src="https://mrwallpaper.com/images/hd/travel-4k-volcano-ynlmn2hmts0n7gsw.jpg"
              className="d-block w-100 h-full object-cover"
              alt="First slide"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://cdn.pixabay.com/photo/2021/12/05/10/28/nature-6847175_640.jpg"
              className="d-block w-100 h-1/2 lg:h-full object-cover"
              alt="Second slide"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/3940085/pexels-photo-3940085.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              className="d-block w-100 h-full object-cover"
              alt="Third slide"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

        {/* Search Bar */}
        <div className="absolute bottom-0 transform translate-y-1/2 w-3/4 left-1/2 -translate-x-1/2 p-3 bg-white shadow-2xl shadow-black flex justify-center rounded-se-3xl rounded-es-3xl rounded-ee-lg rounded-ss-lg">
          <input
            type="text"
            className="w-2/3 outline-none rounded-2xl ps-3 border border-gray-300 p-2  text-gray-500"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery &&
          <button
            className="ms-3 p-2  bg-emerald-500 text-white rounded-3xl w-24"
            onClick={handleSearch}
          >
            Search
          </button>
          }
        </div>
      </div>

      <div className="h1div mt-5">
        <h1 className="font-bold firsth1 mt-5">Top-Rated Travel Places</h1>
      </div>

      <LazyLoadComponent importFunc={() => import('./Card')} latestdest={populardest} />

      <LazyLoadComponent importFunc={() => import('./Aboutsection')} />

      <div className="h1div">
        <h1 className="font-bold firsth1">Latest Packages</h1>
      </div>
      <LazyLoadComponent importFunc={() => import('./LatestPackages')} latestpkgs={latestPkgs} />

  

      <Footer />
    </>
  );
}
