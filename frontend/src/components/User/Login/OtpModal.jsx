import { useState } from 'react';

export default function OtpModal({ isOpen, onClose, onSubmit, onSubmitOtp }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');

  const validateEmail = (email) => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };

  const handleEmailSubmit = () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }
    setEmailError('');
    if(onSubmit(email)){
        setStep(2);
    };
   
  };

  const handleOtpSubmit = () => {
    if (!otp) {
      setOtpError('Enter OTP');
      return;
    }
    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }
    setOtpError('');
    onSubmitOtp(otp, email);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        {step === 1 ? (
          <>
            <h2 className="text-xl font-bold mb-4">Enter your Email</h2>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded mb-2 outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <button onClick={handleEmailSubmit} className="w-full py-2 bg-emerald-500 text-white rounded">
              Get OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 outline-none rounded mb-2"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
            <button onClick={handleOtpSubmit} className="w-full py-2 bg-emerald-500 text-white rounded">
              Verify OTP
            </button>
          </>
        )}
        <button onClick={onClose} className="w-full py-2 mt-4 font-bold text-black rounded">
          Close
        </button>
      </div>
    </div>
  );
}
