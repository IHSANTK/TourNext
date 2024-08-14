import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from '../../../api';
import Navbar from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRating from '../RatingStars';

export default function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message } = useParams();

  const [reviewStates, setReviewStates] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

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

  const handleCancelBooking = async () => {
    try {
      await axios.post(
        '/cancelBooking',
        { bookingId: bookingToCancel },
        { withCredentials: true }
      );
      toast.success('Booking cancelled successfully');
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingToCancel ? { ...booking, status: 'cancelled', showRefundMessage: true } : booking
        )
      );
      setModalOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Error cancelling booking');
    }
  };

  const handleModalToggle = (bookingId) => {
    setBookingToCancel(bookingId);
    setModalOpen(!modalOpen);
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

      <div className="p-10" style={{ marginTop: '70px' }}>
        <ToastContainer />
        <h1 className="text-3xl font-bold text-center text-emerald-500">Your Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-700 text-center">No bookings available.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className={`bg-white shadow-lg mt-3 rounded-lg p-6 mb-4 transition transform hover:scale-105 duration-300 ease-in-out ${booking.showRefundMessage ? 'opacity-70' : ''}`}
            >
              <div className="flex flex-col gap-5 md:flex-row">
                {/* Booking Image */}
                <div className="md:w-1/3 mt-4 object-fill">
                  <Link to={`/user/packagedetails/${booking.packageId}`}>
                    <img src={booking.image} className='w-full h-auto rounded-lg' alt="Package" />
                  </Link>
                </div>
                {/* Booking Details and Review Section */}
                <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{booking.packageName}</h2>
                  <p className="text-gray-700 mb-2">Trip Date: {booking.tripDate}</p>
                  <p className="text-gray-700 mb-2">Seats: {booking.seats}</p>
                  <p className="text-gray-700 mb-2">Total Price: ₹{booking.totalprice}</p>
                  <span className='flex'>
                    <p>Status:</p>
                    <p className={`text-gray-700 ms-2 mb-2 ${booking.status === 'Cancelled' ? 'text-red-500' : ''}`}>
                      {booking.status}
                    </p>
                  </span>
                  {!booking.showRefundMessage && booking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleModalToggle(booking._id)}
                      className="bg-red-500 text-white py-2 px-2 rounded-md transition hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'Cancelled' && (
                    <p className="text-green-600 mt-2">Your refund will be credited within 48 hours.</p>
                  )}
               </div>
                  {/* Review Section */}
                  {!booking.showRefundMessage && booking.status !== "Cancelled" && (
                    <div className="mt-4 me-5">
                      {submittedReviews[booking._id] ? (
                        <div>
                          <h3 className="text-xl font-bold mb-2 me-2 text-gray-800">Review</h3>
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
                                className={`h-6 w-6 cursor-pointer ${star <= reviewStates[booking._id]?.rating ? 'text-yellow-500' : 'text-gray-400'} transition-colors duration-200`}
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
                            className="bg-emerald-500 text-white py-2 px-4 rounded-md mt-2 transition hover:bg-emerald-600"
                          >
                            Submit Review
                          </button>
                        </>
                      )}
                    </div>
                  )}
              
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Cancel Confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md mr-2 transition hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelBooking}
                className="bg-red-500 text-white py-2 px-4 rounded-md transition hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
