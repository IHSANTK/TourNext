import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import axios from '../../api'; 

const EditDestinationModal = ({ isOpen, onClose, destination }) => {
    const { register, handleSubmit } = useForm();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stateValue, setStateValue] = useState(null);
    const [districtValue, setDistrictValue] = useState(null);
    const [images, setImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]); 
    const [states, setStates] = useState([]);

    const categories = useSelector((state) => state.category.categories.map(category => ({
        value: category._id,
        label: category.categoryName
    })));

    useEffect(() => {
        if (destination) {
            setName(destination.name);
            setDescription(destination.description);
            setCategory(destination.category);
            setImages([...destination.images]);

            fetchStates(destination.state, destination.district);
        }
    }, [destination]);

    const fetchStates = async (initialState, initialDistrict) => {
        try {
            const response = await axios.get('/states');
            const statesData = response.data.map(state => ({
                value: state._id,
                label: state.stateName,
                districts: state.districts.map(district => ({
                    value: district._id,
                    label: district.districtName
                }))
            }));
            setStates(statesData);

            const selectedState = statesData.find(state => state.label === initialState);
            const selectedDistrict = selectedState?.districts.find(district => district.label === initialDistrict);
            setStateValue(selectedState);
            setDistrictValue(selectedDistrict);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleStateChange = (selectedState) => {
        setStateValue(selectedState);
        setDistrictValue(null); 
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {

            const updatedImages = [...images];
            updatedImages[index] = file;
            setImages(updatedImages);
        }
    };

    const handleRemoveImage = (imageUrl) => {
        setRemovedImages([...removedImages, imageUrl]); 
        setImages(images.filter(img => img !== imageUrl)); 
    };

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file && images.length < 5) {
            setImages([...images, file]);
        }
    };

    const handleFormSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('state', stateValue ? stateValue.label : null);
        formData.append('district', districtValue ? districtValue.label : null);
      
        removedImages.forEach(image => formData.append('removedImages[]', image));
         
        console.log('new images',images);

        images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      
        try {
          const response = await axios.put(`/editDestinations/${destination._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          if (response.data) {
            onClose(); // Close modal on success
          }
        } catch (error) {
          console.error('Error updating destination:', error);
        }
      };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow max-w-3xl w-full">
                <h2 className="text-2xl font-bold mb-3">Edit Destination</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex mb-4 space-x-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
                            <Select
                                options={states}
                                value={stateValue}
                                onChange={handleStateChange}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">District</label>
                            <Select
                                options={stateValue ? stateValue.districts : []}
                                value={districtValue}
                                onChange={(selectedOption) => setDistrictValue(selectedOption)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <Select
                            options={categories}
                            value={categories.find(cat => cat.label === category)}
                            onChange={(selectedOption) => setCategory(selectedOption.label)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                        <div className="flex flex-wrap space-x-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img
                                        src={image instanceof File ? URL.createObjectURL(image) : image}
                                        alt={`destination-${index}`}
                                        className="object-cover w-full h-full rounded mb-2"
                                    />
                                    <input
                                        type="file"
                                        onChange={(e) => handleImageChange(e, index)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                        onClick={() => handleRemoveImage(image)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {images.length < 5 && (
                                <div className="relative w-24 h-24 border-dashed border-2 border-gray-300 rounded flex items-center justify-center">
                                    <input
                                        type="file"
                                        onChange={handleAddImage}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <p className="text-gray-500">Add Image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Save
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDestinationModal;
