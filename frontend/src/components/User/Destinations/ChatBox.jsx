import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useSelector } from 'react-redux';
import axios from '../../../api';
import socket from '../../socketio';

const ChatBox = ({ user, onClose }) => {
  const exactruser = useSelector((state) => state.userauth.user);

  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});

  // Create references for scrolling
  const chatContainerRef = useRef(null);

  useEffect(() => {
    socket.emit('join', exactruser._id);

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

    const handleUserStatus = (status) => {
      setOnlineUsers((prevOnlineUsers) => {
        const updatedUsers = { ...prevOnlineUsers };
        updatedUsers[status.userId] = status.status;
        return updatedUsers;
      });
    };

    socket.on('private message', handleMessage);
    socket.on('user status', handleUserStatus);

    return () => {
      socket.emit('leave', exactruser._id);
      socket.off('private message', handleMessage);
      socket.off('user status', handleUserStatus);
    };
  }, [exactruser._id, user._id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = { senderId: exactruser._id, receiverId: user._id, message, timestamp: new Date().toISOString() };
      socket.emit('private message', newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    
    const options = {
      weekday: 'short', 
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleString('en-US', options); 
  };

  return (
    <div className="flex flex-col h-screen w-full  lg:h-[550px] lg:rounded-3xl">
      <div className='flex justify-between bg-white text-black lg:rounded-ss-3xl lg:rounded-se-3xl '>
        <button
          onClick={() => {
            onClose();
            socket.emit('leave', exactruser._id);
          }}
          className=" lg:rounded-3xl  ms-2"
        >
          <FaArrowLeft size={'20'} />
        </button>
        <p className="font-semibold text-black p-2 border-b border-gray-300">
          {user.name} {onlineUsers[user._id] === 'online' ? <span className="text-green-500"> Online</span> : <span className="text-gray-500"> Offline</span>}
        </p>
        <div></div>
      </div>
      <div
        className="flex-1 p-2 overflow-y-auto bg-gradient-to-r from-sky-400 to-pink-200 text-white noscrollbar"
        ref={chatContainerRef}
      >
        {chatMessages.length > 0 ? (
          <div>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.senderId === exactruser._id ? 'text-right' : 'text-left'}`}>
                <p className={`inline-block px-3 py-2 rounded-lg ${msg.senderId === exactruser._id ? 'bg-gradient-to-r from-sky-400 to-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.message}
                </p>
                <br />
                <span className={`text-xs ${msg.senderId === exactruser._id ? 'text-gray-700' : 'text-gray-500'}`}>
                  {formatTimestamp(msg.timestamp)}
                </span>
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
          className="text-black p-3 rounded-lg  hover:bg-gray-100 flex items-center"
        >
          <IoSend size={'30'} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
