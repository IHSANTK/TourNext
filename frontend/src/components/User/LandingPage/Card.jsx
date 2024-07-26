import React from 'react';
import {Link} from 'react-router-dom'

export default function Card({ latestdest }) {
  console.log('cardpage', latestdest);
  return (
    <div className=" px-5 mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-4 gap-1 ">
        {latestdest.map((card, index) => (
          <div key={index} className="card-container max-w-xs rounded overflow-hidden m-3 bg-orange-100 transition-transform duration-700 ease-in-out transform hover:scale-105 hover:rotate-3">
           <Link to={`/user/destinationDetails/${card._id}`}><div className="relative">
              <img
                className="w-full"
                src={card.images[0]}
                alt={`Image for ${card.name}`}
              />
            </div>
            </Link>
            <div className="px-3 py-4">
              <div className="font-bold text-xl mb-2">{card.name}</div>
              <p className="text-gray-700 text-base">
                {card.state}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
