// ForgotPassword.js
import { useState } from "react";
import axios from "../../../api";
import { IoMdClose } from "react-icons/io";

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/forgot-password", { email });
      if (response.status === 200) {
        alert("Password reset link sent to your email.");
        onClose()
      } else {
        setMessage("Error sending reset link.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      setMessage("Error sending reset link.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-600 hover:text-gray-900"
        >
          <IoMdClose className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition"
          >
            Send Reset Link
          </button>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
}
