import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api";
import { useDispatch } from "react-redux";
import { setTokens } from "../../../redux/userauthSlice";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Login.css";
import OtpModal from "./OtpModal";

export default function Login() {
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        "/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.message) {
        setErr(response.data.message);
      } else if (response.status === 200) {
        navigate("/");
        dispatch(
          setTokens({
            useraccessToken: response.data.userAccessToken,
            userrefreshToken: response.data.userRefreshToken,
          })
        );
      }
    } catch (error) {
      console.error(
        "Error logging in:",
        error.response ? error.response.data : error.message
      );
      
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(
        "/auth/google",
        {
          tokenId: response.credential,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        dispatch(
          setTokens({
            useraccessToken: res.data.userAccessToken,
            userrefreshToken: res.data.userRefreshToken,
          })
        );
        navigate("/");
      } else {
        console.error("Error during Google login:", res.data);
      }
    } catch (error) {
      console.error(
        "Error during Google login:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
  };

  const handleOtpEmailSubmit = async (email) => {
    try {
      const response = await axios.post("/send-otp", { email });
      if (response.status === 200) {
        console.log("OTP sent successfully",response.data);
      } else {
        console.log("Error sending OTP:", response.data);
       
      
      }
    } catch (error) {
      console.error(
        "Error sending OTP:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleOtpVerify = async (otp, email) => {
    try {
      const response = await axios.post(
        "/verify-otp",
        { otp, email },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("sucess ok");
        navigate("/");
        dispatch(
          setTokens({
            useraccessToken: response.data.userAccessToken,
            userrefreshToken: response.data.userRefreshToken,
          })
        );
      } else {
        console.error("Error verifying OTP:", response.data);
      }
    } catch (error) {
      console.error(
        "Error verifying OTP:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="maindiv flex justify-center items-center min-h-screen bg-gray-300">
      <div className="inputdiv p-8 rounded-lg bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="inputWrapper flex items-center mb-2">
              <FaEnvelope className="icon mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="inputField w-full p-2 rounded"
                value={formData.email}
                onChange={handleChange}
                
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
            <div className="inputWrapper flex items-center mt-3 relative">
              <FaLock className="icon mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="inputField w-full p-2 rounded"
                value={formData.password}
                onChange={handleChange}
             
              />
              <div
                className="absolute right-2 top-2 mt-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <span className="ml-5 text-red-600 font-bold">{err}</span>
          <div className="flex justify-between items-center mb-3">
            <span
              className="text-sm text-blue-500 cursor-pointer"
              onClick={() => setIsOtpModalOpen(true)}
            >
              Login with OTP
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded mb-4"
          >
            Login
          </button>
        </form>
        <div className="flex justify-center w-full ">
          <GoogleLogin
            size="9"
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            cookiePolicy={"single_host_origin"}
            text="Sign in with Google"
            width="340px"
            theme="outline"
          />
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="flex-grow border-t border-gray-300 mt-2"></div>
          <span className="mx-2  mt-2">or</span>
          <div className="flex-grow border-t border-gray-300  mt-2"></div>
        </div>
        <button
          onClick={() => navigate("/user/signup")}
          className="w-full py-2 bg-green-500 text-white rounded"
        >
          Sign Up
        </button>
      </div>
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSubmitEmail={handleOtpEmailSubmit}
        onSubmitOtp={handleOtpVerify}
      />
    </div>
  );
}
