import React from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const TextInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  icon,
  showPassword,
  toggleShowPassword
}) => {
  return (
    <div className="mb-4 relative">
      <div className="inputWrapper flex items-center">
        {icon && <span className="icon mr-2">{icon}</span>}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          className="inputField w-full p-2 rounded"
          value={value}
          onChange={onChange}
        />
        {type === 'password' && (
          <div
            className="absolute right-2 top-5 cursor-pointer"
            onClick={toggleShowPassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TextInput;
