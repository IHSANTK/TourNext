import React, { useState, useRef } from "react";
import axios from "../../../api";
import { useNavigate } from "react-router-dom";

export default function OtpModal({ show, handleClose, email, formData, totalPrice, seats, Id }) {
  console.log('otpmodal', show, handleClose, email, formData, totalPrice, seats, Id);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validate = () => {
    if (otp.includes('')) {
      setOtpError('Please enter the OTP');
      return false;
    }
    return true;
  };

  const handleOtpSubmit = async () => {
    if (validate()) {
      const otpString = otp.join('');
      console.log("Total price in modal component", totalPrice);
      console.log("FormData", formData);
      console.log(otpString);

      try {
        const response = await axios.post(
          "/booking",
          { formData, totalPrice, Id, otp: otpString },
          { withCredentials: true }
        );

        console.log("Response:", response.data);
        if (response.data.message === "Invalid OTP") {
          console.log('Fail');
          setOtpError(response.data.message);
        } else {
          console.log('Success');
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
                  totalPrice,
                  Id,
                  seats
                }, { withCredentials: true });
                console.log("Order saved:", saveOrderResponse.data);
                const message  = saveOrderResponse.data.message
                navigate(`/user/bookingdetiles/${message}`); 
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
              color: '#F37254' 
            }
          };

          const rzp = new Razorpay(options);
          rzp.open();

          handleClose()
        }
      } catch (error) {
        console.error('Error in form submission:', error);
      }
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto">
            <h2 className="text-2xl font-bold mb-4">Enter Confirmation OTP</h2>
            <div className="mb-4 flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength="1"
                  className="w-10 p-2 border border-gray-300 rounded-md text-center"
                />
              ))}
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
