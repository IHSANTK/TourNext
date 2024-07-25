import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from '../../../api';
import Navbar from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRating from './StarRating'


export default function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message } = useParams();
  const [reviewStates, setReviewStates] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  useEffect(() => {
    if (message === "Booking successful") {
      toast.success(message);
    }
  }, [message]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axios.get('/userBookings', {
          withCredentials: true,
        });
        setBookings(response.data);
        setLoading(false);
        initializeReviewStates(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const initializeReviewStates = (bookings) => {
    const initialState = {};
    const initialSubmittedReviews = {};
    bookings.forEach((booking) => {
      initialState[booking._id] = {
        rating: booking.reviewrate || 0,
        reviewText: "",
      };
      initialSubmittedReviews[booking._id] = !!booking.reviewrate;
    });
    setReviewStates(initialState);
    setSubmittedReviews(initialSubmittedReviews);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post(
        '/cancelBooking',
        { bookingId },
        { withCredentials: true }
      );
      toast.success('Booking cancelled successfully');
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Error cancelling booking');
    }
  };

  const handleStarClick = (bookingId, rating) => {
    setReviewStates((prevState) => ({
      ...prevState,
      [bookingId]: {
        ...prevState[bookingId],
        rating,
      },
    }));
  };

  const handleReviewTextChange = (bookingId, text) => {
    setReviewStates((prevState) => ({
      ...prevState,
      [bookingId]: {
        ...prevState[bookingId],
        reviewText: text,
      },
    }));
  };

  const handleReviewSubmit = async (bookingId, packageid) => {
    const { rating, reviewText } = reviewStates[bookingId];

    try {
      await axios.post(
        '/updateBookingReview',
        {
          bookingId,
          packageid,
          rating,
          review: reviewText,
        },
        { withCredentials: true }
      );
      toast.success('Review submitted successfully');
      setReviewStates((prevState) => ({
        ...prevState,
        [bookingId]: {
          ...prevState[bookingId],
          reviewText: "",
        },
      }));
      setSubmittedReviews((prevState) => ({
        ...prevState,
        [bookingId]: true,
      }));
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Error submitting review');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 mt-24">
        <ToastContainer />
        <h1 className="text-3xl font-bold mt-5 text-center text-blue-700">Your Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-700 text-center mt-4">No bookings available.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-lg rounded-lg p-6 mb-4 transition transform hover:scale-105 duration-300 ease-in-out flex flex-col md:flex-row"
            >
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {booking.packageName}
                </h2>
               <Link to={`/user/packagedetails/${booking.packageId}`} ><img src={booking.image} className='w-2/4 mt-2'/></Link>
                <p className="text-gray-700 mb-2 mt-3">Trip Date: {booking.tripDate}</p>
                <p className="text-gray-700 mb-2">Seats: {booking.seats}</p>
                <p className="text-gray-700 mb-2">Total Price: ₹{booking.totalprice}</p>
                <p className="text-gray-700 mb-2">Status: {booking.status}</p>
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md transition hover:bg-red-600"
                  disabled={booking.status === 'cancelled'}
                >
                  Cancel Booking
                </button>
              </div>
              <div className="mt-4 md:mt-0 md:w-2/3 md:ml-6">
                {submittedReviews[booking._id] ? (
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Your Review</h3>
                    <StarRating rating={reviewStates[booking._id].rating} />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Add Review</h3>
                    <div className="flex space-x-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          onClick={() => handleStarClick(booking._id, star)}
                          className={`h-6 w-6 cursor-pointer ${
                            star <= reviewStates[booking._id]?.rating ? 'text-yellow-500' : 'text-gray-400'
                          } transition-colors duration-200`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 .587l3.668 7.425 8.207 1.191-5.93 5.788 1.397 8.139L12 18.897l-7.342 3.864 1.397-8.139-5.93-5.788 8.207-1.191L12 .587z" />
                        </svg>
                      ))}
                    </div>
                    <textarea
                      value={reviewStates[booking._id]?.reviewText}
                      onChange={(e) => handleReviewTextChange(booking._id, e.target.value)}
                      placeholder="Write your review..."
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={() => handleReviewSubmit(booking._id, booking.packageId)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2 transition hover:bg-blue-600"
                    >
                      Submit Review
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
