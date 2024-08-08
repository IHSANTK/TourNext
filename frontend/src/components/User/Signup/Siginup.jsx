// src/pages/Signup.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api';
import './Signup.css';
import TextInput from './TextInput';

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
    <div className='maindiv flex justify-center items-center min-h-screen bg-gray-200'>
      <div className='inputdiv p-8 rounded-lg bg-gray-100'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <TextInput
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
          />
          <TextInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <TextInput
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            error={errors.password}
          />
          <TextInput
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            showConfirmPassword={showConfirmPassword}
            toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
            error={errors.confirmPassword}
          />
          <button type="submit" className='w-full py-2 bg-emerald-500 text-white rounded mb-4'>Sign Up</button>
        </form>

        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow border-t border-gray-300'></div>
          <span className='mx-2'>or</span>
          <div className='flex-grow border-t border-gray-300'></div>
        </div>
        <button onClick={() => navigate('/user/login')} className='w-full py-2 bg-white shadow-lg text-black rounded'>Login</button>
      </div>
    </div>
  );
}
