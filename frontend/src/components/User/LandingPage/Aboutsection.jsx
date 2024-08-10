import React from 'react';

export default function Aboutsection() {
  return (
    <div className=" mx-auto p-4 mt-20 flex items-center justify-center min-h-screen mb-5">
      <div
        className="relative bg-cover bg-center w-full max-w-5xl h-96 rounded-lg"
        style={{ backgroundImage: 'url(https://t4.ftcdn.net/jpg/05/05/51/25/360_F_505512599_D6ulJI9hV6aGTP04FPC2XDk5QHGOQtpW.jpg)' }}
      >
        <div className="absolute bottom-20 transform translate-y-1/2 w-11/12 lg:w-3/4 left-1/2 -translate-x-1/2 p-8  bg-gradient-to-r from-gray-100 to-gray-300  bg-opacity-75 shadow-lg rounded-md flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-1/2 p-4">
            <h1 className="text-4xl lg:text-5xl font-bold">INDIA</h1>
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <p className="text-base lg:text-lg font-semibold">
              India, from the snow-capped Himalayas to the tropical beaches of Kerala, India’s landscape is as varied as its people. The country's history, cuisine, and natural beauty make it a must-visit destination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
