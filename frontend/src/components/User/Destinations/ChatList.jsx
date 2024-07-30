
import React, { useState, useEffect } from 'react';
import axios from '../../../api'; 
import { useSelector } from 'react-redux';
import ChatBox from './ChatBox';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const userid = useSelector((state) => state.userauth.userid);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`/chats/${userid}`);

        console.log('allchats',response.data);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [userid]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chat List</h2>
        {chats.map((chat, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-2 cursor-pointer hover:bg-gray-100 rounded-lg"
            onClick={() => handleUserClick(chat.receiver[0])}
          >
            <p className="font-semibold">{chat.receiver[0].name}</p>
            <p className="text-gray-600">{chat.latestMessage.message}</p>
          </div>
        ))}
      </div>
      <div className="w-2/3 bg-gray-100 p-4">
        {selectedUser && (
          <ChatBox user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </div>
    </div>
  );
};

export default ChatList;
