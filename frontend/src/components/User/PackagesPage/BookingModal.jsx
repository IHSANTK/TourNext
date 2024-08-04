import React, { useState, useEffect } from "react";

export default function BookingModal({
  showModal,
  handleCloseModal,
  pkg,
  seats,
  formData,
  handleInputChange,
  formsubmit,
}) {
  const [errors, setErrors] = useState({});
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState(""); 

  useEffect(() => {
    const calculateAmounts = () => {
      let totalAmount = pkg.price * seats;
      let discount = 0;

      if (pkg.offer) {
        if (pkg.offer.offerType === "percentage") {
          discount = (pkg.offer.amount / 100) * totalAmount;
          setDiscountType("%");
        } else if (pkg.offer.offerType === "fixed") {
          discount = pkg.offer.amount;
         
        }
        setDiscountAmount(pkg.offer.amount);
        setDiscountMessage(`Discount Applied: ₹${discount}`);
      } else {
        setDiscountAmount(0);
        setDiscountType("");
        setDiscountMessage("No discount available");
      }

      const discountedAmount = totalAmount - Math.round(discount);
      setFinalAmount(discountedAmount > 0 ? discountedAmount : totalAmount);
    };

    calculateAmounts();
  }, [pkg, seats]);

  if (!showModal) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      formsubmit();
      handleCloseModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
          <button onClick={handleCloseModal} className="text-red-500 font-bold">
            &times;
          </button>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 mb-4 lg:mb-0  shadow-lg shadow-black rounded m-3 p-3">
            <h3 className="text-xl font-bold mb-2">{pkg.packageName}</h3>
            <p className="text-gray-700 mb-3 mt-3">Start Date: {pkg.startDate}</p>

            <div className="flex flex-col mb-4">
              <p className="text-xl font-bold text-blue-400 mb-1">
                Price: ₹{pkg.price * seats}
              </p>

              {pkg.offer ? (
                <div className="flex flex-col mb-1 ">
                  <div className="flex items-center mb-1">
                    <p className="text-lg font-bold text-gray-700 mt-3">Discount:</p>
                    <span className="text-lg  text-red-500 mt-3 ms-2">{discountAmount}</span>
                    <span className="text-md text-gray-700  mt-3">{discountType}</span>
                  </div>
                  {/* <p className="text-lg text-gray-700 mt-3">{discountMessage}</p> */}
                </div>
              ) : (
                <p className="text-lg text-gray-700"></p>
              )}

              <p className="text-2xl mt-3 font-bold text-emerald-500">
                Total Price: ₹{finalAmount}
              </p>
            </div>
          </div>

          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-yellow-500 text-white py-2 px-4 rounded-md w-full"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
