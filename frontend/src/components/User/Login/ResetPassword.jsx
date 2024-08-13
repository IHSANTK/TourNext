import { useParams } from "react-router-dom";
import axios from "../../../api";
import { useState, useEffect } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const [validToken, setValidToken] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  console.log('user token',token);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`/verify-token/${token}`);
        setValidToken(true);
      } catch (error) {
        setValidToken(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.put(
        `/reset-password`,
        {
          token:token,
          password: formData.password,
        },
        { 
            
          withCredentials: true

        }
      );
      if (response.status === 200) {
        setResetSuccess(true);
      }
    } catch (error) {
      console.error(
        "Error resetting password:",
        error.response ? error.response.data : error.message
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!validToken) return <p>Invalid or expired token.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      {resetSuccess ? (
        <p className="text-green-500">Password reset successful! You can now log in with your new password.</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-emerald-500 font-bold text-white rounded"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}
