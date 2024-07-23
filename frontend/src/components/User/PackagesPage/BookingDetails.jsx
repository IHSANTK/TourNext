// frontend/src/components/BookingDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../../api'; 
import Navbar from '../Navbar'

export default function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axios.get('/userBookings', {
          withCredentials: true,
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post(
        '/cancelBooking',
        { bookingId },
        { withCredentials: true }
      );
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
       <Navbar/>

    <div className="container mx-auto px-4 mt-16">
     
      <h1 className="text-3xl font-bold  mt-5">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-700">No bookings available.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white shadow-lg rounded-lg p-6 mb-4"
          >
            <h2 className="text-2xl font-bold mb-2">
              {booking.packageId.packageName}
            </h2>
            <p className="text-gray-700 mb-2">Trip Date: {booking.tripDate}</p>
            <p className="text-gray-700 mb-2">Seats: {booking.seats}</p>
            <p className="text-gray-700 mb-2">Total Price: ₹{booking.totalprice}</p>
            <p className="text-gray-700 mb-2">Status: {booking.status}</p>
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>

    </>
  );
}
