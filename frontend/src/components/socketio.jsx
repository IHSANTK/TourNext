import { io } from 'socket.io-client';

const socket = io('https://tournext-frontend.onrender.com');

export default socket;
