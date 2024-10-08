import React, { useState } from 'react';
import { format } from 'date-fns';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useSelector } from 'react-redux';
import RatingStars from '../RatingStars';
import ChatBox from './ChatBox';
import Modal from './Modal';

export default function Blogpost({ destination }) {
  const userisAuthenticated = useSelector((state) => state.userauth.userisAuthenticated);
  const exactruser = useSelector((state) => state.userauth.user);

  console.log('ljkjkj',exactruser);

  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [chatOpen, setChatOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user

  const handleChatToggle = (index) => {
    setChatOpen(chatOpen === index ? null : index);
  };

  const handleViewMore = () => {
    setShowAllBlogs(true);
  };

  const handleModalOpen = (user) => {
    if (userisAuthenticated) {
      setSelectedUser(user); // Set the selected user for the chat
      setIsModalOpen(true);
    } else {
      Toastify({
        text: 'Please login',
        duration: 2000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'red',
      }).showToast();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Clear the selected user when closing the modal
  };

  const calculateAverageRating = (blogs) => {
    if (blogs.length === 0) return 0;

    const totalRating = blogs.reduce((acc, blog) => acc + blog.rating, 0);
    return totalRating / blogs.length;
  };

  const averageRating = calculateAverageRating(destination.blogs);

  return (
    <>
      <div className="ms-3 mb-1">
        <h2 className="text-3xl font-bold mb-5 mt-3">Blogs</h2>
        <h2 className="text-xl font-semibold mb-2">Total Rating:</h2>
        <div className='flex'>
          <RatingStars rating={averageRating} />
        </div>
        <p className="text-gray-600">{averageRating.toFixed(1)} out of 5</p>
      </div>

      <div>
        {destination.blogs.slice(0, showAllBlogs ? destination.blogs.length : 3).map((blog, index) => (
          <div key={index} className="bg-white p-5 border border-gray-700 mb-2 flex flex-col justify-between lg:flex-row items-start">
            <div className='flex'>
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center lg:mr-4">
                {blog.user.image ? (
                  <img
                    src={blog.user.image}
                    alt={`Profile of ${blog.user.name}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl text-gray-500 shadow-lg shadow-black">
                    <i className="fa-solid fa-user"></i>
                  </span>
                )}
              </div>
              <div className="flex-1 lg:mr-4 ms-3">
                <p className="font-semibold mb-1">{blog.user.name}</p>
                <div className="mb-1 flex">
                  <RatingStars rating={blog.rating} />
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(blog.addedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div>
              <h1 className='text-xl font-bold mt-3'>{blog.text}</h1>
              <p className="text-lg mb-4 mt-2">{blog.description}</p>
              <div className="flex gap-2 flex-wrap">
                {blog.images.map((img, ind) => (
                  <img
                    key={ind}
                    src={img}
                    alt={`Blog image ${ind}`}
                    className="w-14 lg:w-28 h-auto object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center lg:ml-4 mt-4 lg:mt-0">
                {blog.user._id !== exactruser._id && (
                  <button
                    onClick={() => handleModalOpen(blog.user)}
                    className="bg-gray-100 text-Black font-bold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-500"
                  >
                    <i className="bi bi-chat-left-dots w-[50px] h-[50px]"></i>
                  </button>
                )}
              </div>
            </div>

            {isModalOpen && selectedUser && (
              <Modal onClose={handleModalClose}>
                <ChatBox user={selectedUser} onClose={handleModalClose} />
              </Modal>
            )}
          </div>
        ))}
      </div>
      {!showAllBlogs && destination.blogs.length > 3 && (
        <button
          onClick={handleViewMore}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          View More
        </button>
      )}
    </>
  );
}
