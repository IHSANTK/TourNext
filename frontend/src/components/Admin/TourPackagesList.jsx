import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./sidebar";
import axios from "../../api";
import Modal from "./TourPackagedetiels";
import OfferModal from "./OfferModal";
import TourPackageEdit from "./TourPackageEdit";

const TourPackagesList = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offermodal, setoffermodal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTourPackages();
  }, []);

  const fetchTourPackages = async () => {
    try {
      const response = await axios.get("/gettourPackages");
      setTourPackages(response.data);
    } catch (error) {
      console.error("Error fetching tour packages:", error);
    }
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setIsEditing(true);
  };

  const handleEditSave = async () => {
   
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deletetourPackages/${id}`);
      setTourPackages(tourPackages.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error("Error deleting tour package:", error);
    }
  };

  const handlePackageClick = (a, pkg) => {
    if (a === 'alldatas') {
      setSelectedPackage(pkg);
      setIsModalOpen(true);
    } else {
      setoffermodal(true);
      setSelectedPackage(pkg);
    }
  };

  const handleModalClose = () => {
    setoffermodal(false);
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tour Packages</h2>
            <Link
              to="/admin/tourPackageAdd"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Tour Package
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {tourPackages.map((tourPackage) => (
              <div
                key={tourPackage._id}
                className="bg-white p-4 rounded shadow"
              >
                {tourPackage.images && tourPackage.images.length > 0 ? (
                  <img
                    src={tourPackage.images[0]}
                    alt={tourPackage.packageName}
                    className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
                    onClick={() => handlePackageClick('alldatas', tourPackage)}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">
                  {tourPackage.packageName}
                </h3>
                <p className="text-gray-700 mb-2">{tourPackage.description}</p>
                <p className="text-gray-700 mb-2">
                  <strong>Price:</strong> {tourPackage.price}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(tourPackage)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePackageClick('foroffers', tourPackage)}
                    className="btn bg-green font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Offers
                  </button>
                  <button
                    onClick={() => handleDelete(tourPackage._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isEditing && (
        <TourPackageEdit
          packageData={selectedPackage}
          onClose={() => setIsEditing(false)}
         
        />
      )}
      {isModalOpen && <Modal onClose={handleModalClose} packageData={selectedPackage} />}
      {offermodal && <OfferModal onClose={handleModalClose}  pkg={selectedPackage} />}
    </div>
  );
};

export default TourPackagesList;
