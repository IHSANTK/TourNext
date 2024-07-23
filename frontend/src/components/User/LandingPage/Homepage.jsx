import React, { useState, useEffect } from 'react';
import Navbar from './NavbarHome';
import './Homepage.css';
import Card from './Card';
import Aboutsection from './Aboutsection';
import LatestPackages from './LatestPackages';
import Footer from '../Footer'
import axios from '../../../api';

export default function Homepage() {
  const [populardest, setPopularDest] = useState([]);
  const [latestPkgs, setLatestPackages] = useState([]);

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

  return (
    <>
      <Navbar />

      {/* Carousel */}
      <div id="carouselExampleControls" className="carousel slide relative" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://i.ytimg.com/vi/FOvOxeb2TCg/maxresdefault.jpg" className="d-block w-100 img-fluid" alt="First slide" />
          </div>
          <div className="carousel-item">
            <img src="https://cdn.pixabay.com/photo/2021/12/05/10/28/nature-6847175_640.jpg" className="d-block w-100 img-fluid" alt="Second slide" />
          </div>
          <div className="carousel-item">
            <img src="https://images.pexels.com/photos/3940085/pexels-photo-3940085.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" className="d-block w-100 img-fluid" alt="Third slide" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

        {/* Search Bar */}
        <div className="absolute bottom-0 transform translate-y-1/2 w-3/4 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-gray-200 to-gray-400 flex justify-center rounded-md">
          <input type="text" className="w-2/3 outline-none rounded-2xl ps-3 border border-gray-300" placeholder="Search destinations..." />
          <button className="ms-3 p-2 bg-yellow-500 text-white rounded-3xl w-24">Search</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 mt-5">
        <div className="h1div">
          <h1 className="font-bold firsth1">Most popular destinations</h1>
        </div>
        <Card latestdest={populardest} />
      </div>

   
        <Aboutsection />
     

      <div className="container mx-auto p-4 mt-20">
        <div className="h1div">
          <h1 className="font-bold firsth1">Latest Packages</h1>
        </div>
        <LatestPackages latestpkgs={latestPkgs} />
      </div>

      <Footer />
    </>
  );
}
