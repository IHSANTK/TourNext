import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useSelector } from 'react-redux';
import axios from '../../../api';

// Initialize socket connection
const socket = io('http://localhost:5001');

const ChatBox = ({ user, onClose }) => {
  const exactruser = useSelector((state) => state.userauth.user);

  console.log('sfdfdf',exactruser);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [room, setRoom] = useState(user._id);

  useEffect(() => {
    // Join the chat room
    socket.emit('join', exactruser._id);

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/messages/${exactruser._id}/${user._id}`);
        setChatMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const handleMessage = (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('private message', handleMessage);

    return () => {
      socket.emit('leave', exactruser._id); 
      socket.off('private message', handleMessage); 
    };
  }, [exactruser._id, user._id]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = { senderId:  exactruser._id, receiverId: user._id, message };
      socket.emit('private message', newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]); // Optimistic UI update
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-80 w-full bg-gray-900 h-screen lg:h-[500px] rounded-lg">
      <div className='flex justify-between bg-black'>
        <button
          onClick={() => {
            onClose();
            socket.emit('leave', exactruser._id); 
          }}
          className="text-white rounded-lg shadow-md ms-2"
        >
          <FaArrowLeft size={'20'} />
        </button>
        <p className="font-semibold text-white p-2 border-b border-gray-300">{user.name}</p>
        <div></div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto noscrollbar">
        {chatMessages.length > 0 ? (
          <div>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.senderId === exactruser._id ? 'text-right' : 'text-left'}`}>
                <p className={`inline-block px-3 py-2 rounded-lg ${msg.senderId === exactruser._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No messages yet</p>
        )}
      </div>
      <div className="p-2 border-t border-gray-300 flex">
        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-11/12"
        />
        <button
          onClick={handleSend}
          className="text-white p-3 rounded-lg shadow-md hover:bg-blue-600 flex items-center"
        >
          <IoSend size={'30'} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
