import { io } from 'socket.io-client';

const socket = io('https://tournext-backend.onrender.com');

export default socket;
