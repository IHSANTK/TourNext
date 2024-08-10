import React, { useEffect, useState } from "react";
import axios from "../../../api";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import Footer from "../Footer";
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import BlogForm from './BlogForm';
import Blogpost from "./Blogpost";
import toastify from "../tostify";
import Map from './Map'; 

export default function DestinationDetails() {
  const userisAuthenticated = useSelector((state) => state.userauth.userisAuthenticated);
  const { destId } = useParams();
  const [destination, setDestination] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [weather, setWeather] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;  
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      try {
        const response = await axios.get(`/getdestinationdetails/${destId}`, { withCredentials: true });
        setDestination(response.data);

        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0]);
        }
        
        const wishlistResponse = await axios.get(`/getwhishlistdata/${destId}`, { withCredentials: true });
        setIsWishlist(wishlistResponse.data.isInWishlist);

        if (response.data.latitude && response.data.longitude) {
          fetchWeather(response.data.latitude, response.data.longitude);
        }

      } catch (err) {
        console.error(err);
      }
    };

    const fetchWeather = async (lat, lon) => {
      try {
        const response = await fetch(`${baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const data = await response.json();

        console.log("weateher data",data);
        if (data.weather && data.weather.length > 0) {
          setWeather({
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
            condition: data.weather[0].main,
          });
        }
      } catch (err) {
        console.error('Error fetching weather data:', err);
      }
    };

    fetchDestinationDetails();
  }, [destId, baseUrl, apiKey]);

  const handleAddToWishlist = async () => {
    try {
      const response = await axios.post('/addtowishlist', { destinationId: destId }, { withCredentials: true });
      if (response.data.message === 'Added to wishlist') {
        toastify(response.data.message);
        setIsWishlist(true);
      } else if (response.data.message === 'Removed from wishlist') {
        toastify(response.data.message);
        setIsWishlist(false);
      } else if(response.data.message === "Access denied. No token provided.") {
        toastify('Pls Login');
      }
    } catch (err) {
      console.error(err);
      alert("Unable to update wishlist. Please try again.");
    }
  };

  const handleShare = () => {
    const shareData = {
      title: destination.name,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      prompt("Copy to clipboard: Ctrl+C, Enter", shareData.url);
    }
  };

  const handleModalToggle = () => {
    if(userisAuthenticated){
      setModalOpen(!modalOpen);
    } else {
      toastify('Pls Login');
    }
  };

  const getWeatherImage = () => {
    if (!weather) return '';

    switch (weather.condition) {
      case 'Clear':
        return 'https://wallpapers.com/images/hd/cloudy-weather-digital-illustration-hi16vkc00cp99uzv.jpg'; 
      case 'Rain':
        return 'https://static.vecteezy.com/system/resources/thumbnails/042/146/565/small_2x/ai-generated-beautiful-rain-day-view-photo.jpg'; 
      case 'mist':
        return 'https://media.istockphoto.com/id/1055906130/photo/foggy-rural-asphalt-highway-perspective-with-white-line-misty-road-road-with-traffic-and.jpg?s=612x612&w=0&k=20&c=NS_1x0gGJQkJ7RfC1J17bzu5PFj2xJGYoLA6L3BCZzg='; 
     case 'Clouds':
        return 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?cs=srgb&dl=pexels-pixabay-209831.jpg&fm=jpg';
      case 'Haze':
        return 'https://img.freepik.com/premium-photo/abstract-background-blue-sunny-sky-with-clouds_1234738-140214.jpg'; 
      default:
        return 'https://e0.pxfuel.com/wallpapers/176/804/desktop-wallpaper-weather-beautiful-weather.jpg'; 
    }
  };

  return (
    <>
      <Navbar />
      <div className=" p-5 " >
        {destination ? (
          <div>
            <div className="flex justify-center lg:w-[750px]">
              <h1 className="text-3xl ms-4 font-semibold mb-3">{destination.name}</h1>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="flex-1">
                <div className="relative rounded shadow-lg shadow-black md:w-[500px] lg:w-[700px] xl:w-[800px] lg:h-[400px]">
                  <img src={mainImage} alt={destination.name} className="w-full border border-gray-300 sm:h-[200px] md:h-[250px] lg:h-[400px] object-fill border-2 border-gray-500 rounded-lg shadow-lg" />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={handleAddToWishlist} className="text-white px-3 py-2 rounded-full shadow-md">
                      <FaHeart className={`text-xl ${isWishlist ? 'text-red-600' : 'text-gray-500'}`} />
                    </button>
                    <button onClick={handleShare} className="text-black px-3 py-2 rounded-full shadow-md">
                      <FaShareAlt className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2 lg:space-x-4 mt-4">
                  {destination.images && destination.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index}`}
                      className="w-1/6 ms-2 lg:w-40 lg:h-24 cursor-pointer rounded-lg"
                      onClick={() => setMainImage(image)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 ps-5 pt-4 lg:pt-2">
                <h1 className="lg:ms-5 text-2xl font-semibold mb-3">Description</h1>
                <p className="lg:ms-5 text-lg mb-4">{destination.description}</p>
                <p className="lg:ms-5"><strong>State:</strong> {destination.state}</p>
                <p className="lg:ms-5 mt-2"><strong>Place:</strong> {destination.district}</p>
              </div>
            </div>
            <div className="p-5 flex justify-center flex-col lg:flex-row gap-4  ">

              <div className="w-full h-[200px]   lg:w-1/3 lg:ps-8 mt-4 lg:mt-0 relative rounded-lg shadow-lg overflow-hidden">

                <img
                  src={getWeatherImage()}
                  alt="Weather Background"
                  className="w-full h-full object-cover absolute inset-0  shadow-2xl shadow-black"
                />
                
                <div className="relative p-4 bg-opacity-75 mb-3 rounded-lg shadow-md ">
                  
                  {weather ? (
                    <div className="flex flex-col items-center">
                    <h2 className="text-2xl  font-semibold mb-4">Weather in {destination.district}</h2>

                      <p className="text-3xl font-bold">{Math.round(weather.temperature)}°C</p>
                      <p className="text-lg font-bold">{weather.description}</p>
                    </div>
                  ) : (
                    <p>Loading weather...</p>
                  )}
                </div>
              </div>
              <div className="w-full h-[200px] lg:w-1/3  mt-4 lg:mt-0 relative rounded-lg shadow-lg overflow-hidden">
                <Map lat={destination.latitude} lng={destination.longitude} />
              </div>
            </div>


            {destination && (
                <div>
              <div className="py-4">
                <button
                  onClick={handleModalToggle}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  Add Blog
                </button>
                {modalOpen && <BlogForm destinationId={destination._id} closeModal={handleModalToggle} />}
              </div>
              <Blogpost destination={destination} />
              </div>
            )}

           
             
           
          </div>
        ) : (
          <p>Loading destination details...</p>
        )}
      </div>
      <Footer />
    </>
  );
}
