import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import axios from '../../../api';

// Initialize socket connection
const socket = io('http://localhost:5001');

const ChatBox = ({ user, onClose }) => {
  const userid = useSelector((state) => state.userauth.userid);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [room, setRoom] = useState(user._id);

  useEffect(() => {
    // Join the chat room
    socket.emit('join', room);

    // Fetch chat messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/messages/${userid}/${user._id}`);

        console.log('messages',response.data);
        setChatMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Handle incoming messages
    socket.on('private message', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('private message');
    };
  }, [room, userid, user._id]);

  const handleSend = () => {
    if (message.trim()) {
      socket.emit('private message', { senderId: userid, receiverId: user._id, message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-80 w-full bg-white border border-gray-300 rounded-lg">
      <p className="font-semibold text-gray-800 p-2 border-b border-gray-300">Chat with {user.name}</p>
      <div className="flex-1 p-2 overflow-y-auto">
        {chatMessages.length > 0 ? (
          <div>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.senderId === userid ? 'text-right' : 'text-left'}`}>
                <p className={`inline-block px-3 py-2 rounded-lg ${msg.senderId === userid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No messages yet</p>
        )}
      </div>
      <div className="p-2 border-t border-gray-300 flex flex-col space-y-2">
        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="3"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full"
        />
        <div className="flex justify-between space-x-2">
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 flex items-center"
          >
            <i className="fa-solid fa-paper-plane mr-1"></i> Send
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
          >
            Close Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
