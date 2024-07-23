import React from 'react';

export default function Card({ latestdest }) {
  console.log('cardpage', latestdest);
  return (
    <div className="container mx-auto px-4 mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {latestdest.map((card, index) => (
          <div key={index} className="card-container max-w-xs rounded overflow-hidden m-3 bg-orange-100 transition-transform duration-700 ease-in-out transform hover:scale-105 hover:rotate-3">
            <div className="relative">
              <img
                className="w-full"
                src={card.images[0]}
                alt={`Image for ${card.name}`}
              />
            </div>
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
