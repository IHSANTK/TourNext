import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api';
import './Signup.css';
import {  FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';



export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is not valid';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post('/signup', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });
      if (response.status === 200) {


        navigate('/user/login');

      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error creating user');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className='maindiv flex justify-center items-center min-h-screen b  bg-gray-200'>
      <div className='inputdiv p-8 rounded-lg   bg-gray-100'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <div className='inputWrapper flex items-center mb-2'>
              <FaUser className='icon mr-2' />
              <input
                type="text"
                name="name"
                placeholder='Name'
                className='inputField w-full p-2 rounded'
                value={formData.name}
                onChange={handleChange}
              
              />
              
            </div>
            {errors.name && <div className='error'>{errors.name}</div>}

            <div className='inputWrapper flex items-center mb-2'>
              <FaPhone className='icon mr-2' />
              <input
                type="text"
                name="phoneNumber"
                placeholder='Phone Number'
                className='inputField w-full p-2 rounded'
                value={formData.phoneNumber}
                onChange={handleChange}
              
              />
            </div>
            {errors.phoneNumber && <div className='error'>{errors.phoneNumber}</div>}

            <div className='inputWrapper flex items-center mb-2'>
              <FaEnvelope className='icon mr-2' />
              <input
                type="email"
                name="email"
                placeholder='Email'
                className='inputField w-full p-2 rounded'
                value={formData.email}
                onChange={handleChange}
            
              />
            </div>
            {errors.email && <div className='error'>{errors.email}</div>}

            <div className='inputWrapper flex items-center mb-2'>
              <FaLock className='icon mr-2' />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder='Password'
                className='inputField w-full p-2 rounded'
                value={formData.password}
                onChange={handleChange}
               
              />
              <span onClick={togglePasswordVisibility} className="cursor-pointer">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <div className='error'>{errors.password}</div>}

            <div className='inputWrapper flex items-center mb-2'>
              <FaLock className='icon mr-2' />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder='Confirm Password'
                className='inputField w-full p-2 rounded'
                value={formData.confirmPassword}
                onChange={handleChange}
          
              />
              <span onClick={toggleConfirmPasswordVisibility} className="cursor-pointer">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && <div className='error'>{errors.confirmPassword}</div>}

          </div>

          <button type="submit" className='w-full py-2 bg-blue-500 text-white rounded mb-4'>Sign Up</button>
        </form>

        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow border-t border-gray-300'></div>
          <span className='mx-2'>or</span>
          <div className='flex-grow border-t border-gray-300'></div>
        </div>
        <button onClick={() => navigate('/user/login')} className='w-full py-2 bg-green-500 text-white rounded'>Login</button>
      </div>
    </div>
  );
}
