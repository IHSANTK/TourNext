import React from 'react';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const iconMap = {
  name: <FaUser />,
  phoneNumber: <FaPhone />,
  email: <FaEnvelope />,
  password: <FaLock />,
  confirmPassword: <FaLock />,
};

const TextInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  showPassword,
  showConfirmPassword,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  error
}) => {
  return (
    <div className=''>
      <div className='inputWrapper flex items-center mb-2'>
        {iconMap[name] && <span className='icon mr-2'>{iconMap[name]}</span>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className='inputField w-full p-2 rounded'
          value={value}
          onChange={onChange}
        />
        {(name === 'password' || name === 'confirmPassword') && (
          <span onClick={name === 'password' ? togglePasswordVisibility : toggleConfirmPasswordVisibility} className="cursor-pointer">
            {name === 'password' ? (showPassword ? <FaEyeSlash /> : <FaEye />) : (showConfirmPassword ? <FaEyeSlash /> : <FaEye />)}
          </span>
        )}
      </div>
      {error && <div className='error mt-1 text-red-600'>{error}</div>}
    </div>
  );
};

export default TextInput;
