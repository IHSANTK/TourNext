import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import axios from '../../api';
import ConfirmationModal from './ConfirmationModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [bookingToChange, setBookingToChange] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const bookingsPerPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/getallbookings");
        console.log("response data", response.data);
        setBookings(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = (userId, bookingId, status) => {
    if (status === "Cancelled") {
      setBookingToChange({ userId, bookingId });
      setNewStatus(status);
      setShowModal(true);
    } else {
      updateBookingStatus(userId, bookingId, status);
    }
  };

  const updateBookingStatus = async (userId, bookingId, status) => {
    try {
      await axios.patch(`/updateBookingStatus/${userId}/${bookingId}`, { status });
      setBookings(prevBookings =>
        prevBookings.map(book =>
          book.booking._id === bookingId ? { ...book, booking: { ...book.booking, status } } : book
        )
      );
      setShowModal(false);
    } catch (error) {
      console.log('Error updating status:', error);
    }
  };

  const confirmStatusChange = () => {
    if (bookingToChange) {
      updateBookingStatus(bookingToChange.userId, bookingToChange.bookingId, newStatus);
      setBookingToChange(null);
    }
  };

  // Get current bookings
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className='flex justify-between'>
          <h2 className="text-lg font-bold mb-4">Bookings</h2>
          <button className='btn bg-gray-700 text-white h-9'>Download</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden bg-white">
            <thead>
              <tr className="bg-blue-300">
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Package Name
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Seats
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((book, ind) => (
                <tr key={ind} className="border-b border-gray-200">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {book.booking._id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {book.booking.packageName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {book.booking.username}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {book.booking.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {book.booking.phoneNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(book.booking.tripDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {book.booking.seats}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {book.booking.status === "Cancelled" ? (
                      <span>{book.booking.status}</span>
                    ) : (
                      <select 
                        value={book.booking.status} 
                        onChange={(e) => handleStatusChange(book.userId, book.booking._id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="Booked">Booked</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <nav>
            <ul className="flex justify-center">
              {[...Array(Math.ceil(bookings.length / bookingsPerPage)).keys()].map(num => (
                <li key={num} className={`px-3 py-1 border ${currentPage === num + 1 ? 'bg-gray-300' : ''}`}>
                  <button onClick={() => paginate(num + 1)}>{num + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <ConfirmationModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmStatusChange}
          message="Are you sure you want to cancel this booking?"
        />
      </div>
    </div>
  );
};

export default Bookings;
