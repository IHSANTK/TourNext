import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api";
import Navbar from "../Navbar";
import Footer from "../Footer";
import BookingModal from "./BookingModal"; // Import the modal component

export default function Packagedetiels() {
  const { pkgId } = useParams();
  const [pkg, setPkg] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [seats, setSeats] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track selected image index
  const [showModal, setShowModal] = useState(false); // Toggle for modal
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function fetchPackageDetails() {
      const response = await axios.get(`/getPackageById/${pkgId}`, {
        withCredentials: true,
      });
      setPkg(response.data);
      setMainImage(response.data.images[0]);
    }
    fetchPackageDetails();
  }, [pkgId]);

  if (!pkg) {
    return <div>Loading...</div>;
  }

  const handleSeatsChange = (e) => {
    setSeats(e.target.value);
  };

  const handleImageClick = (img, index) => {
    setMainImage(img);
    setSelectedImageIndex(index + 1); // Adjust for slice offset
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleformsubmit = async () => {
    const totalprice = pkg.price * seats;
    const Id = pkg._id;

    console.log("total price", totalprice, pkg._id);
    console.log("formData", formData);

    try {
      const response = await axios.post(
        "/booking",
        { formData, totalprice, Id },
        { withCredentials: true }
      );

      console.log("Response:", response.data);

      const { razorpayResponse } = response.data;

      const options = {
        key: 'rzp_test_97NF7SboryYNH9',
        amount: razorpayResponse.amount,
        currency: razorpayResponse.currency,
        order_id: razorpayResponse.id,
        name: 'TourNext',
        description: 'Payment for your order',
        handler: async function (response) {
          console.log("Payment successful");
          try {
            const saveOrderResponse = await axios.post('/saveorder', {
              formData,
              totalprice,
              Id,
              seats
            }, { withCredentials: true });
            console.log("Order saved:", saveOrderResponse.data);
            window.location.href = '/orders'; 
          } catch (error) {
            console.error('Error saving order:', error);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#F37254' // Customize color if needed
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleBookNowClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-16">
        <Navbar />
        <h1 style={{ marginTop: "120px" }} className="text-3xl font-bold ms-4">
          {pkg.packageName}
        </h1>

        <div className="flex flex-col lg:flex-row">
          {/* Left side with images */}
          <div className="lg:w-2/3">
            <div className="relative mt-5 ">
              {/* Main image container */}
              <div className="relative h-90 overflow-hidden rounded-lg shadow-md">
                <img
                  className="w-full lg:h-[500px]  object-fill "
                  src={mainImage}
                  alt={`Main image for ${pkg.packageName}`}
                />
              </div>
              <div className="mt-4 flex gap-4">
                {pkg.images.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className={`w-25 h-17 overflow-hidden rounded-lg shadow-md cursor-pointer ${
                      selectedImageIndex === index + 1
                        ? "border-4 border-yellow-600"
                        : ""
                    }`}
                    onClick={() => handleImageClick(img, index)}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={img}
                      alt={`Gallery image ${index + 1} for ${pkg.packageName}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side with booking section */}
          <div className="lg:w-1/3 lg:pl-8 mt-8 lg:mt-0 mt-5">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-gray-700 mb-4">{pkg.destinations}</p>
              <p className="text-gray-700 mb-4">{pkg.duration}</p>
              <p className="text-2xl font-bold text-emerald-500 mb-4">
                Price: ₹{pkg.price}
              </p>
              <div className="mb-4">
                <label htmlFor="tripDate" className="block text-gray-700 mb-2">
                  Trip Date
                </label>
                <input
                  type="text"
                  id="tripDate"
                  value={pkg.startDate}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="seats" className="block text-gray-700 mb-2">
                  Select Seats
                </label>
                <input
                  type="number"
                  id="seats"
                  value={seats}
                  onChange={handleSeatsChange}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                onClick={handleBookNowClick}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md w-full"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-200 w-1/2 p-6 shadow-md">
          <h3 className="text-xl font-bold mb-2">Description</h3>
          <p>{pkg.description}</p>
        </div>

        
        <div className="mt-8 bg-gray-200 p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Activities</h2>
          <ul className="list-disc pl-5 space-y-2">
            {pkg.activities && pkg.activities.length > 0 ? (
              pkg.activities.map((activity, index) => (
                <li key={index} className="text-gray-700">
                  {activity}
                </li>
              ))
            ) : (
              <li className="text-gray-700">No activities available.</li>
            )}
          </ul>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {pkg.reviews && pkg.reviews.length > 0 ? (
            pkg.reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 mb-4"
              >
                <p className="font-bold text-gray-900">{review.userName}</p>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-yellow-500">Rating: {review.rating} / 5</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No reviews yet.</p>
          )}
        </div>
      </div>
      <Footer />

      {/* Modal Component */}
      <BookingModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        pkg={pkg}
        seats={seats}
        formData={formData}
        handleInputChange={handleInputChange}
        formsubmit={handleformsubmit} // Pass the form submit handler
      />
    </>
  );
}
