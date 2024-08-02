import React, { useState, useEffect } from 'react';
import axios from '../../api';

export default function OfferModal({ pkg, onClose }) {
  const [offerType, setOfferType] = useState('percentage');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (pkg && pkg.offer) {
     
      setOfferType(pkg.offer.offerType || 'percentage'); 
      setAmount(pkg.offer.amount || '');
    }
  }, []);

  const handleOfferTypeChange = (e) => {
    setOfferType(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log('Offer Type:', offerType);
    console.log('Amount:', amount);

    try {
      const response = await axios.post(`/updateoffers/${pkg._id}`, { offerType, amount });
      console.log('Response:', response.data); 
      onClose();
    } catch (error) {
      console.error('Error:', error); 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md transform translate-y-[-100px] transition-transform duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-4">Add Offer</h2>
        <form onSubmit={handleSubmit}>
          <div className='relative p-8 rounded shadow-lg w-full max-w-xl mt-5'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='offerType'>
              Offer Type
            </label>
            <select
              id='offerType'
              value={offerType}
              onChange={handleOfferTypeChange}
              className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            >
              <option value='percentage'>Percentage</option>
              <option value='fixed'>Fixed Amount</option>
            </select>
          </div>
          <div className="mb-4 mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4 focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
