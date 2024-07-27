import React, { useEffect, useState } from "react";
import axios from "../../../api";
import { useParams, Link } from "react-router-dom";
import Navbar from '../Navbar';
import Footer from "../Footer";
import { FaHeart, FaShareAlt } from 'react-icons/fa'; 

export default function DestinationDetails() {
  const { destId } = useParams();
  const [destination, setDestination] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [weather, setWeather] = useState(null);
  const [chatOpen, setChatOpen] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      try {
        const response = await axios.get(`/getdestinationdetails/${destId}`, {
          withCredentials: true,
        });
        setDestination(response.data);

        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0]);
        }
        
        const wishlistResponse = await axios.get(`/getwhishlistdata/${destId}`, {
          withCredentials: true,
        });
        setIsWishlist(wishlistResponse.data.isInWishlist);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDestinationDetails();
  }, [destId]);

  const handleChatToggle = (index) => {
    setChatOpen(chatOpen === index ? null : index);
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await axios.post('/addtowishlist', { destinationId: destId }, { withCredentials: true });
      if (response.data.message === 'Added to wishlist') {
        setIsWishlist(true);
      } else if (response.data.message === 'Removed from wishlist') {
        setIsWishlist(false);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to update wishlist. Please try again.");
    }
  };

  const handleShare = () => {
    const shareData = {
      title: destination.name,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      prompt("Copy to clipboard: Ctrl+C, Enter", shareData.url);
    }
  };

  if (!destination) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6" style={{ marginTop: '100px' }}>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-6">{destination.name}</h1>
          <button
            onClick={handleAddToWishlist}
            className={`absolute top-4 right-16 text-2xl ${isWishlist ? 'text-red-600' : 'text-gray-600'}`}
          >
            <FaHeart />
          </button>
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 text-2xl text-gray-600"
          >
            <FaShareAlt />
          </button>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="flex-1">
            {mainImage && (
              <div className="relative w-full h-64 mb-4">
                <img
                  src={mainImage}
                  alt={destination.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{destination.description}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2">Details</h2>
              <p><strong>State:</strong> {destination.state}</p>
              <p><strong>District:</strong> {destination.district}</p>
            </div>
            
            {/* Weather Information */}
            {weather && (
              <div className="mt-8 bg-blue-100 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-2">Current Weather</h2>
                <div className="flex items-center">
                  <img
                    src={weather.icon}
                    alt={weather.description}
                    className="w-12 h-12"
                  />
                  <div className="ml-4">
                    <p className="text-xl font-bold">{weather.temperature}°C</p>
                    <p className="text-gray-700">{weather.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Gallery Section */}
        <div className="mt-8">
          {destination.images && destination.images.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {destination.images.map((image, index) => (
                <div
                  key={index}
                  className="w-24 h-24 cursor-pointer"
                  onClick={() => setMainImage(image)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Information Section */}
        <div className="mt-8">
          {mapUrl && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Location Map</h2>
              <iframe
                src={mapUrl}
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* Check Packages Button */}
        <div className="mt-8">
          <Link to={'/user/Packages'}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600"
          >
            Check Our Packages
          </Link>
        </div>

        {/* Add Blog Button */}
        <div className="mt-8">
          <Link to={`/addBlog/${destId}`}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            Add Blog
          </Link>
        </div>

        {/* Blogs Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
          {destination.blogs.length > 0 ? (
            destination.blogs.map((blog, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-xl font-semibold mb-2">Blog {index + 1}</h3>
                {blog.images.length > 0 && (
                  <div className="mb-2">
                    <img
                      src={blog.images[0]}
                      alt={`Blog ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-gray-700 mb-2">{blog.description}</p>
                <p><strong>Rating:</strong> {blog.rating ? blog.rating : 'Not rated'}</p>
                <p><strong>Added At:</strong> {new Date(blog.addedDate).toLocaleDateString()}</p>
                <button
                  onClick={() => handleChatToggle(index)}
                  className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600"
                >
                  Chat
                </button>
                {chatOpen === index && (
                  <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <h4 className="font-semibold">Chat with the Blogger</h4>
                    {/* Chat component or chat interface */}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No blogs available for this destination.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
