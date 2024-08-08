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


   

export default function DestinationDetails() {

  const userisAuthenticated = useSelector((state) => state.userauth.userisAuthenticated);

  const { destId } = useParams();
  const [destination, setDestination] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
 

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      try {
        const response = await axios.get(`/getdestinationdetails/${destId}`, {
          withCredentials: true,
        });

        console.log('Destination Details:', response.data);
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

 

  const handleAddToWishlist = async () => {
    try {
      const response = await axios.post('/addtowishlist', { destinationId: destId }, { withCredentials: true });
      if (response.data.message === 'Added to wishlist') {
        toastify(response.data.message)             
        setIsWishlist(true);
      } else if (response.data.message === 'Removed from wishlist') {
        toastify(response.data.message)             

        setIsWishlist(false);
      }else if(response.data.message === "Access denied. No token provided." ){
        toastify('Pls Login')             

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
  }else{
    toastify('Pls Login') 
  }
  };


  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8" style={{marginTop:'100px'}}>
        {destination ? (
          <div>
            <div className="flex justify-center lg:w-[750px] "><h1 className="text-3xl ms-4 font-semibold mb-3">{destination.name}</h1></div>

            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="flex-1">
                <div className="relative  rounderd shadow-lg shadow-black md:w-[500px] lg:w-[700px] xl:w-[800px] lg:h-[450px]">
                  <img src={mainImage} alt={destination.name} className="w-full h-[250px] lg:h-[450px] object-fill    border-2 border-gray-500 rounded-lg shadow-lg  " />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={handleAddToWishlist} className="text-white px-3 py-2 rounded-full shadow-md ">
                      <FaHeart className={`text-xl ${isWishlist ? 'text-red-600' : 'text-gray-500'}`} />
                    </button>
                    <button onClick={handleShare} className="text-black px-3 py-2 rounded-full shadow-md ">
                      <FaShareAlt className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2 lg:space-x-4 mt-4  ">
                  {destination.images && destination.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index}`}
                      className="w-20 h-16 md:w-24 lg:w-44 lg:h-28 cursor-pointer rounded-lg"
                      onClick={() => setMainImage(image)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 ps-5 pt-2">
                <h1 className=" lg:ms-5 text-2xl font-semibold mb-3">Description</h1>
                <p className=" lg:ms-5 text-lg mb-4">{destination.description}</p>

                <p className="lg:ms-5"><strong>State:</strong>{destination.state}</p>
                <p className="lg:ms-5 mt-2"><strong>Place:</strong>{destination.district}</p>
               
                {/* <div className="flex items-center space-x-4 mb-4">
                  <RatingStars rating={destination.rating} />
                </div> */}

              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {/* <div className="mt-8">
          <Link
            onClick={() => alert('Check out packages')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Check Out Packages
          </Link>
        </div> */}

                {modalOpen && (
                  <BlogForm destinationId={destination._id} onClose={handleModalToggle} />
                )}
        {destination && (
          <div className="mt-8">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold mb-4 ms-3">Blogs</h2>

              <button
                onClick={handleModalToggle}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-emerald-700"
              >
                Add Blog
              </button>
            </div>
            <Blogpost destination={destination} />
          
           
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
