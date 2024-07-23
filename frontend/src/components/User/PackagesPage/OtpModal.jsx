// OtpModal.jsx
import React, { useState } from "react";
import axios from "../../../api";
import { useNavigate } from "react-router-dom";

export default function OtpModal({ show, handleClose, email, formData, totalPrice, seats, Id }) {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("/verifyOtp", { email, otp }, { withCredentials: true });

      if (response.data.message === "OTP verified successfully") {
        setOtpError("");
        // Proceed to save the order and open Razorpay
        const orderResponse = await axios.post(
          "/saveOrder",
          { formData, totalPrice, seats, Id },
          { withCredentials: true }
        );
        const options = {
          key: "rzp_test_TPQY5ImiSwC8ZK",
          amount: totalPrice * 100,
          currency: "INR",
          name: "YourAppName",
          description: "Test Transaction",
          image: "/your_logo.png",
          order_id: orderResponse.data.id,
          handler: function (response) {
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature);
            navigate("/success");
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: "Your address",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("An error occurred. Please try again.");
      console.error("Error in OTP submission:", error);
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {otpError && <p className="text-red-500 mb-4">{otpError}</p>}
            <button
              onClick={handleOtpSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded-md w-full"
            >
              Submit
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-500 text-white py-2 px-4 rounded-md w-full mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
