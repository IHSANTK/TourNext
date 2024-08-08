import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../api';
import { FaHeart } from 'react-icons/fa'; // Import heart icon

const WishlistSidebar = ({ isOpen, onClose }) => {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.userauth.user);

  useEffect(() => {
    const fetchWishlistData = async () => {
      if (!user || !user._id) return; // Ensure user and user._id are defined

      try {
        setLoading(true);
        const response = await axios.get(`/wishlistdatas/${user._id}`);
        setWishlistData(response.data); // Set the fetched data
      } catch (error) {
        console.error('Failed to fetch wishlist data:', error);
        setError('Failed to fetch wishlist data');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [user]); // Include user as a dependency to refetch if user changes

  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 ${isOpen ? 'w-80' : 'w-0'} transition-width duration-300 overflow-auto`}>
      <button
        className="absolute top-4 right-4 text-xl"
        onClick={onClose}
      >
        &times;
      </button>
      <div className='flex p-4'>
          <h2 className="text-xl font-bold ">Wishlist</h2>
      <h2 className='ms-5'> Total items <p className='font-bold'>{wishlistData.length}</p></h2>
    </div>
          <div className="p-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : wishlistData.length > 0 ? (
          <ul className="space-y-4">
            {wishlistData.map(item => (
              <li key={item._id} className="flex items-center border-b border-gray-200 pb-4">
                <img
                  src={item.images[0]} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.state}</p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <FaHeart size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;
