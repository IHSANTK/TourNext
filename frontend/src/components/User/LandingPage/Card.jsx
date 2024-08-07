import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../RatingStars';

export default function Card({ latestdest }) {
  console.log('cardpage', latestdest);

  return (
    <div className="px-5 mt-5 ">
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {latestdest.map((card, index) => (
          <div
            key={index}
            className="card-container bg-white shadow-md hover:shadow-xl hover:shadow-zinc-400 rounded-xl overflow-hidden transition-transform duration-700 ease-in-out transform hover:scale-105 hover:rotate-5"
          >
            <Link to={`/user/destinationDetails/${card._id}`}>
              <div className="relative">
                <img
                  className="w-full h-64 object-cover" 
                  src={card.images[0]}
                  alt={`Image for ${card.name}`}
                />
              </div>
            </Link>
            <div className="p-3">
              <div className="font-bold text-xl mb-2">{card.name}</div>
              <p className="text-gray-700 text-base mb-2">{card.state}</p>
              <div className="mb-3">
                <div className='flex'>
                  <RatingStars rating={card.averageRating} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
