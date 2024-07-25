import React, { useEffect, useState } from "react";
import axios from "../../../api";
import { useParams, Link } from "react-router-dom";
import Navbar from '../Navbar';
import Footer from "../Footer";

export default function DestinationDetails() {
  const { destId } = useParams();
  const [destination, setDestination] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [chatOpen, setChatOpen] = useState(null);

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
      } catch (err) {
        console.error(err);
      }
    };
    fetchDestinationDetails();
  }, [destId]);

  const handleLocationCheck = async () => {
    try {
      const response = await axios.get(`/getLocation/${location}`);
      const { latitude, longitude } = response.data;

      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`;
      setMapUrl(mapUrl);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch location details. Please try again.");
    }
  };

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleChatToggle = (index) => {
    setChatOpen(chatOpen === index ? null : index);
  };

  if (!destination) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6" style={{ marginTop: '100px' }}>
        <h1 className="text-4xl font-bold mb-6">{destination.name}</h1>
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

        {/* Location Check Section */}
        <div className="mt-8">
          <button
            onClick={handleModalToggle}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Check Location
          </button>

          {/* Modal */}
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4">Check Location</h2>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <button
                  onClick={handleLocationCheck}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
                >
                  Fetch Location
                </button>
                <button
                  onClick={handleModalToggle}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 mt-4"
                >
                  Close
                </button>

                {/* Display Map */}
                {mapUrl && (
                  <div className="mt-4">
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
                <p><strong>Added At:</strong> {new Date(blog.addedAt).toLocaleDateString()}</p>
                <button
                  onClick={() => handleChatToggle(index)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 mt-4"
                >
                  Chat with Blogger
                </button>

                {/* Chat Box */}
                {chatOpen === index && (
                  <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">Chat Box</h4>
                    <textarea
                      rows="4"
                      placeholder="Type your message..."
                      className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                      Send
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
