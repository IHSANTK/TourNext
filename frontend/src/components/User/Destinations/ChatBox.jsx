import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:5001');

const ChatBox = ({ user, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [room, setRoom] = useState(user);

  useEffect(() => {
    socket.emit('join', room);

    socket.on('message', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [room]);

  const handleSend = () => {
    if (message.trim()) {
      socket.emit('message', { room, message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-80">
                <p className="font-semibold">Chat with {user.name}</p>

      <div className="flex-1 p-2 border border-gray-300 rounded-lg overflow-y-scroll">
        <div>
          {chatMessages.map((msg, index) => (
            <div key={index} className="mb-2">
              <p>{msg}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="3"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          <i className="fa-solid fa-paper-plane"></i> Send
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
        >
          Close Chat
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
