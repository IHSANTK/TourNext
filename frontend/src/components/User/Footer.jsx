import React from 'react';

export default function Footer() {
  return (
    <div className="w-full bg-sky-950 text-white mt-5">
      <div className="container mx-auto py-10 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-bold text-xl">TourNext</span>
        </div>

  

        <div className="flex space-x-4">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-700">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            <i className="fab fa-facebook-f"></i>
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-sky-950 py-6">
        <div className="container mx-auto px-4 text-right">
          <span className="text-white">Designed by Ihsan</span>
        </div>
      </div>
    </div>
  );
}
