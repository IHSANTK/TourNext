import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../api";
import Navbar from "../Navbar";
import Footer from "../Footer";
import BookingModal from "./BookingModal"; 
import OtpModal from "./OtpModal";
import StarRating from './StarRating'


export default function Packagedetails() {
  const { pkgId } = useParams();
  const [pkg, setPkg] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [seats, setSeats] = useState(1);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); 
  const [showModal, setShowModal] = useState(false);
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
    setSelectedImageIndex(index + 1); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleformsubmit = async () => {
    const totalPrice = pkg.price * seats;
    console.log('this is form submit page',formData.email);
    try {
      setShowOtpModal(true);
      await axios.post("/sendOtp", { email: formData.email }, { withCredentials: true });
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  const handleBookNowClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className=" mx-auto px-4 mt-16">
        <Navbar />
        <h1 style={{ marginTop: "120px" }} className="text-3xl font-bold ms-4">
          {pkg.packageName}
        </h1>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <div className="relative mt-5 ">
              <div className="relative h-90 overflow-hidden rounded-lg shadow-md">
                <img
                  className="w-full lg:h-[400px] object-fill"
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
                  readOnly
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

        <div className="mt-8 w-1/2 p-6 shadow-md">
          <h3 className="text-xl font-bold mb-2">Description</h3>
          <p>{pkg.description}</p>
        </div>

        <div className="mt-8  p-6 shadow-lg">
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

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {pkg.reviews && pkg.reviews.length > 0 ? (
            pkg.reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 mb-4"
              >
                <p className="font-bold text-gray-900 mb-2">{review.userName}</p>
                <StarRating rating={review.rating} />
                <p className="text-gray-700 mt-4">{review.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No reviews yet.</p>
          )}
        </div>
      </div>
      <Footer />

      <BookingModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        pkg={pkg}
        seats={seats}
        formData={formData}
        handleInputChange={handleInputChange}
        formsubmit={handleformsubmit} 
      />

      <OtpModal
        show={showOtpModal}
        handleClose={handleCloseOtpModal}
        email={formData.email}
        formData={formData}
        totalPrice={pkg.price * seats}
        seats={seats}
        Id={pkg._id}
      />
    </>
  );
}
