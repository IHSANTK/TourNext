import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setTokens } from '../../redux/adminauthSlice'
import { useNavigate } from 'react-router-dom';
import axios from '../../api';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errmessage, seterrmessage] = useState();

  const onSubmit = async (data) => {
    try {
        const response = await axios.post('/adminlogin', {
            email: data.email,
            password: data.password
          }, {
            withCredentials: true  
          });
     
      if (response.status === 200) {
        console.log('Login Successful:', response.data);
        dispatch(setTokens({
           adminaccessToken: response.data.adminAccessToken,
            adminrefreshToken: response.data.adminRefreshToken
          }));
        navigate('/admin/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        seterrmessage(error.response.data.message);
      } else {
        console.error('Login failed', error);
      }
    }
  };

  return (
    <div className='maindiv flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='inputdiv p-8 rounded-lg'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <div className='inputWrapper flex items-center mb-2'>
              <FaEnvelope className='icon mr-2' />
              <input
                type="text"
                placeholder='Email'
                className={`inputField w-full p-2 rounded ${errors.email ? 'border-red-500' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
            <div className='inputWrapper flex items-center mb-2 mt-3'>
              <FaLock className='icon mr-2' />
              <input
                type="password"
                placeholder='Password'
                className={`inputField w-full p-2 rounded ${errors.password ? 'border-red-500' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must have at least 6 characters'
                  }
                })}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
          </div>
          {errmessage && <span>{errmessage}</span>}
          <button type='submit' className='w-full py-2 bg-blue-500 text-white rounded mb-4'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
