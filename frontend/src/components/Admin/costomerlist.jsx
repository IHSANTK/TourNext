import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import axios from '../../api';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/allUsers');
        setCustomers(response.data.users);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      const response = await axios.put(`/block/${id}`);
      setCustomers(customers.map(customer =>
        customer._id === id ? { ...customer, blocked: response.data.blocked } : customer
      ));
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Customers List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                    {customer._id}
                  </td>
                  <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                    {customer.name}
                  </td>
                  <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                    {customer.email}
                  </td>
                  <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                    {customer.phoneNumber}
                  </td>
                  <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleToggleBlock(customer._id)}
                      className={`px-4 py-2 rounded ${customer.blocked ? 'bg-green-500' : 'bg-red-500'} text-white`}
                    >
                      {customer.blocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersList;
 