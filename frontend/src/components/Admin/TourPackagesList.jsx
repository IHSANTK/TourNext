import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./sidebar";
import axios from "../../api";
import Modal from "./TourPackagedetiels";
import OfferModal from "./OfferModal";


const TourPackagesList = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [offermodal,setoffermodal] =  useState(false);

  const [editFormData, setEditFormData] = useState({
    packageName: "",
    description: "",
    price: "",
    seats: "",
    startDate: "",
    duration: "",
    activities: [],
    images: [],
    destinations: "",
  });

  useEffect(() => {
    fetchTourPackages();
  },[]);

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
    setEditFormData({
      packageName: pkg.packageName,
      description: pkg.description,
      price: pkg.price,
      seats: pkg.seats,
      startDate: pkg.startDate || "",
      duration: pkg.duration || "",
      activities: pkg.activities || [],
      images: pkg.images || [],
      destinations: pkg.destinations || "",
    });
    setIsEditing(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const selectedFiles = Array.from(files).slice(0, 5); 
      const uploadedImages = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setEditFormData({
        ...editFormData,
        [name]: [...editFormData[name], ...uploadedImages],
      });
    } else if (name === "destinations") {
      setEditFormData({
        ...editFormData,
        destinations: value,
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedPackage = {
        packageName: editFormData.packageName,
        description: editFormData.description,
        price: editFormData.price,
        seats: editFormData.seats,
        startDate: editFormData.startDate,
        duration: editFormData.duration,
        activities: editFormData.activities,
        images: editFormData.images,
        destinations: editFormData.destinations,
      };

      await axios.put(
        `/editTourPackages/${selectedPackage._id}`,
        updatedPackage
      );

      const updatedPackages = tourPackages.map((pkg) =>
        pkg._id === selectedPackage._id ? { ...pkg, ...updatedPackage } : pkg
      );
      setTourPackages(updatedPackages);

      setEditFormData({
        packageName: "",
        description: "",
        price: "",
        seats: "",
        startDate: "",
        duration: "",
        activities: [],
        images: [],
        destinations: "",
      });

      setIsEditing(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating tour package:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deletetourPackages/${id}`);
      setTourPackages(tourPackages.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error("Error deleting tour package:", error);
    }
  };

  const handlePackageClick = (a,pkg) => {
    if(a==='alldatas'){
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    }else{

      setoffermodal(true)
      setSelectedPackage(pkg);
    }
  };

  const handleModalClose = () => {
    setoffermodal(false)
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
                    onClick={() => handlePackageClick('alldatas',tourPackage)}
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
                  <button onClick={()=>handlePackageClick('foroffers',tourPackage)} className="btn bg-green font-bold">Add offer</button>
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
        <div className="fixed center inset-0 overflow-y-auto flex items-center  w-full justify-center">
          <div className="absolute inset-0 "></div>
          <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-xl mt-5">
            <h2 className="text-2xl font-bold ">Edit Package</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="packageName"
                >
                  Package Name
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="packageName"
                  type="text"
                  placeholder="Package Name"
                  name="packageName"
                  value={editFormData.packageName}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="mb-4 flex">
                <div className="w-1/2 mr-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="price"
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="seats"
                  >
                    Seats
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="seats"
                    type="number"
                    placeholder="Seats"
                    name="seats"
                    value={editFormData.seats}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="startDate"
                  >
                    Start Date
                  </label>
                  <input
                    className="  ms-1 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="startDate"
                    type="date"
                    placeholder="Start Date"
                    name="startDate"
                    value={editFormData.startDate}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="duration"
                  >
                    Trip Duration
                  </label>
                  <input
                    className="  ms-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="duration"
                    type="text"
                    placeholder="Trip Duration"
                    name="duration"
                    value={editFormData.duration}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="destinations"
                >
                  Destination
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="destinations"
                  type="text"
                  placeholder="Destination"
                  name="destinations"
                  value={editFormData.destinations}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="activities"
                >
                  Activities
                </label>
                {editFormData.activities.map((activity, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder={`Activity ${index + 1}`}
                      value={activity}
                      onChange={(e) => {
                        const updatedActivities = [...editFormData.activities];
                        updatedActivities[index] = e.target.value;
                        setEditFormData({
                          ...editFormData,
                          activities: updatedActivities,
                        });
                      }}
                    />
                    <button
                      type="button"
                      className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        const updatedActivities =
                          editFormData.activities.filter(
                            (_, idx) => idx !== index
                          );
                        setEditFormData({
                          ...editFormData,
                          activities: updatedActivities,
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setEditFormData({
                      ...editFormData,
                      activities: [...editFormData.activities, ""],
                    });
                  }}
                >
                  Add Activity
                </button>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="images"
                >
                  Images
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  name="images"
                  onChange={handleEditFormChange}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {editFormData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt={`Image ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full text-xs"
                        onClick={() =>
                          setEditFormData({
                            ...editFormData,
                            images: editFormData.images.filter(
                              (_, idx) => idx !== index
                            ),
                          })
                        }
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4 focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalOpen && (
        <Modal selectedPackage={selectedPackage} onClose={handleModalClose} />
      )}

                   {offermodal&&(
                        <OfferModal pkg={selectedPackage} onClose={handleModalClose}/>
                   )}
    </div>
  );
};

export default TourPackagesList;
