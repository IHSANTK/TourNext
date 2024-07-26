import React from 'react';
import { Link } from 'react-router-dom';

export default function LatestPackages({ latestpkgs }) {
  console.log('pkgs', latestpkgs);

  return (
    <div className="mx-auto  px-4 mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ">
        {latestpkgs.map((pkg, index) => (
          <div
            key={index}
            className="card-container  rounded overflow-hidden m-3  transition-transform duration-700 ease-in-out transform hover:scale-105 hover:rotate-3 relative"
          >
            <Link to={`/user/packagedetails/${pkg._id}`}><div className="relative h-64 rounded-2xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={pkg.images[0]}
                alt={`Image for ${pkg.packageName}`}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="font-bold text-white text-xl mb-2">{pkg.packageName}</div>
              </div>
            </div>
            </Link>
          </div>
        ))}
        <div className="col-span-full flex justify-center mt-5">
          <Link to={'/user/Packages'} className="btn bg-yellow-500 text-white px-4 py-2 rounded-md">View More</Link>
        </div>
      </div>
    </div>
  );
}
