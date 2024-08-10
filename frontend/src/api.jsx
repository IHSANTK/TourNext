import axios from 'axios';

const BASE_URL = 'https://tournext-backend.onrender.com';

const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;
