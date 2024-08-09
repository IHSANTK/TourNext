const Admin = require('../models/Admin');
const Destination = require('../models/Destination');
const User = require('../models/User')
const Packages = require('../models/Packages')
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinery');
const jwt = require('jsonwebtoken');
const adminJwtSecret = process.env.ADMIN_JWT_SECRET;

const generateAdminAccessToken = (admin) => { 
  return jwt.sign({ userId: admin._id }, adminJwtSecret, { expiresIn: '15m' });
};

const generateAdminRefreshToken = (admin) => {
  return jwt.sign({ userId: admin._id }, adminJwtSecret, { expiresIn: '7d' });
};

exports.adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password, "set");
  
      const admin = await Admin.findOne({ email });
      console.log(admin);
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = password === admin.password;
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const adminAccessToken = generateAdminAccessToken(admin);
      const adminRefreshToken = generateAdminRefreshToken(admin);
  
      console.log(adminAccessToken);
  
      
      res.cookie('admin_refreshToken', adminRefreshToken, { httpOnly: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
      .cookie('admin_accessToken', adminAccessToken, { httpOnly: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 })
      .status(200).json({ message: 'Admin login successful', adminAccessToken });
        
      
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  exports.adminpanel = async (req, res) => {
    try {
        console.log('admin panel');
        const [usersResult, bookingsResult, destinationCount, monthlyBookingCounts] = await Promise.all([
            User.aggregate([
                { $group: { _id: null, totalUsers: { $sum: 1 } } }
            ]),
            User.aggregate([
                { 
                    $project: { 
                        bookingsSize: { 
                            $size: { 
                                $filter: { 
                                    input: "$bookings", 
                                    as: "booking", 
                                    cond: { $ne: ["$$booking.status", "cancelled"] } 
                                } 
                            } 
                        } 
                    } 
                },
                { 
                    $group: { 
                        _id: null, 
                        totalBookings: { $sum: '$bookingsSize' } 
                    } 
                }
            ]),
            Destination.countDocuments(),
            User.aggregate([
                {
                    $match: {
                        bookings: { $exists: true, $ne: [] }
                    }
                },
                {
                    $unwind: "$bookings"
                },
                {
                    $match: {
                        "bookings.status": { $ne: "cancelled" }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$bookings.bookingDate" },
                            month: { $month: "$bookings.bookingDate" }
                        },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const monthlyBookingCountsData = {};
        monthlyBookingCounts.forEach(count => {
            const year = count._id.year;
            const month = count._id.month;
            const monthName = new Date(Date.UTC(2000, month - 1, 1)).toLocaleDateString('en-US', { month: 'long' });
            if (!monthlyBookingCountsData[year]) {
                monthlyBookingCountsData[year] = {};
            }
            monthlyBookingCountsData[year][monthName] = count.count;
        });

        const totalUsers = usersResult.length > 0 ? usersResult[0].totalUsers : 0;
        const totalBookings = bookingsResult.length > 0 ? bookingsResult[0].totalBookings : 0;

        console.log("Total Users:", totalUsers);
        console.log("Total Bookings:", totalBookings);
        console.log("Total Destinations:", destinationCount);
        console.log("Monthly Booking Counts:", monthlyBookingCountsData);

        res.json({ totalUsers, totalBookings, destinationCount, monthlyBookingCounts: monthlyBookingCountsData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

  

  exports.categorieadd = async (req, res) => {
    try {
      const  categoryName  = req.body;
      
      const admin = await Admin.findOne();
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  

      admin.categories.push(categoryName);  
      await admin.save();
      categories = admin.categories
  
      res.status(201).json({ message: 'Category added successfully', category: categories });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).send(error.message);
    }
  };

  exports.categoryedit = async (req, res) => {
    try {
      const { id } = req.params; 
      const { categoryName } = req.body; 
  
      const admin = await Admin.findOne(); 
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      const categoryToUpdate = admin.categories.find(category => category._id.toString() === id);
      if (!categoryToUpdate) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      categoryToUpdate.categoryName = categoryName; 
  
      await admin.save(); 
  
      res.status(200).json({ message: 'Category updated successfully', category: categoryToUpdate });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).send(error.message);
    }
  };

  exports.deltecategory = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const admin = await Admin.findOne(); 
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      await Admin.updateOne(
        { _id: admin._id }, 
        { $pull: { categories: { _id: id } } } 
      );
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).send(error.message);
    }
  };

  exports.gellallstates = async (req,res)=>{
     try{
        console.log('ccalled');
      const admin  = await Admin.findOne()
      
      const states = admin.States
      console.log(states);
      res.status(200).json(states)    
    }catch(error){

     console.error(error);
      res.status(500).json('internal server error')
    }
  }

  exports.addstates = async (req, res) => {
    try {
      const { stateName } = req.body;
  
      const admin = await Admin.findOne();
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      admin.States.push({ stateName: stateName });
  
      await admin.save();

      const states = admin.States
  
      res.status(200).json({ message: 'State added successfully',states });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
 
  exports.deletestate = async (req,res)=>{
         
    try {
      const { id } = req.params; 
      console.log(id);
  
      const admin = await Admin.findOne(); 
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      await Admin.updateOne(
        { _id: admin._id }, 
        { $pull: { States: { _id: id } } } 
      );
  
      res.status(200).json({ message: 'Category deleted successfully' });

    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).send(error.message);
    }
 

  }


  exports.getPlaces = async (req, res) => {
    try {
      const { stateId } = req.body;
  
      const admin = await Admin.findOne({ 'States._id': stateId });
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin or State not found' });
      }
    
      const allStates = admin.States
      const state = admin.States.id(stateId);
      console.log('exactsateadding state',allStates);

        const stateName = state.stateName;
  
      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }
  
      const districts = state.districts;
  
      res.status(200).json({ districts,stateName ,States:allStates});
    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.placesAdd = async (req, res) => {
    try {
      const stateId = req.params.id; 
      const { districts } = req.body; 
  
      const admin = await Admin.findOne();
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      const state = admin.States.id(stateId);

      const states = admin.States
  
      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }
  
      const formattedDistricts = districts.map(district => ({ districtName: district.name }));
   console.log(formattedDistricts);
      state.districts.push(...formattedDistricts);
  
      await admin.save();
  
      res.status(200).json({ message: 'Districts added successfully', state,states:states });
    } catch (error) {
      console.error(error);

      res.status(500).json({ message: 'Internal server error' });
    }
  };



  exports.deletePlace = async (req, res) => {
    try {
      const { stateId, districtId } = req.params;
  
      const result = await Admin.findOneAndUpdate(
        { 'States._id': stateId },
        { $pull: { 'States.$.districts': { _id: districtId } } },
        { new: true, useFindAndModify: false }
      );
  
      if (!result) {
        return res.status(404).json({ message: 'State or District not found' });
      }
  
      const admin = await Admin.findOne();

      const  allStates = admin.States

      console.log('while delting',allStates);

  
      res.status(200).json({ message: 'District deleted successfully',states: allStates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


exports.updatePlace = async (req, res) => {
  try {
    const { stateId, districtId } = req.params;
    const { districtName } = req.body;

    console.log("update");

    const result = await Admin.findOneAndUpdate(
      { 'States._id': stateId, 'States.districts._id': districtId },
      { $set: { 'States.$.districts.$[elem].districtName': districtName } },
      {
        arrayFilters: [{ 'elem._id': districtId }],
        new: true,
        useFindAndModify: false
      }
    );

    if (!result) {
      return res.status(404).json({ message: 'State or District not found' });
    }

    res.status(200).json({ message: 'District updated successfully', state: result });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getallstates = async (Req,res)=>{
  try {
    const adminData = await Admin.findOne(); 
   
    const states = adminData.States; 


    res.status(200).json(states);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.addDestinations = async (req, res) => {
  const { name, description, state, district, category,latitude,longitude } = req.body;

  console.log("fordatabody from",name, description, state, district, category,latitude,longitude);
  const imageFiles = req.files;
  const imageUrls = [];
  
  
  try {
    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    const newDestination = new Destination({
      name,
      description,
      state,
      district,
      latitude,
      longitude,
      category,
      images: imageUrls,
      blogs: [] 
    });

    await newDestination.save();

    res.json({
      message: 'Destination added successfully!',
      destination: newDestination
    });
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error);
    res.status(500).json({ error: 'Error uploading images' });
  }
};

exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.editDestinations = async (req, res) => {
  try {
 
      const { id } = req.params;
      const { name, state, district, description, category, latitude,longitude, removedImages = [] } = req.body;
      const images = req.files;

      console.log(name, state, district, description, category, removedImages);
      console.log('new images', images);

      let destination = await Destination.findById(id);
      if (!destination) {
          return res.status(404).json({ message: 'Destination not found' });
      }

      const removedImagesArray = Array.isArray(removedImages) ? removedImages : JSON.parse(removedImages);

      for (const imageUrl of removedImagesArray) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
      }

      let imageUrls = [...destination.images]; 
      if (Array.isArray(images)) {
          for (const image of images) {
              const result = await cloudinary.uploader.upload(image.path);
              imageUrls.push(result.secure_url);
          }
      } else if (images && images.path) {
          const result = await cloudinary.uploader.upload(images.path);
          imageUrls.push(result.secure_url);
      }

      imageUrls = imageUrls.filter(url => !removedImagesArray.includes(url));

     
      destination.name = name || destination.name;
      destination.state = state || destination.state;
      destination.district = district || destination.district;
      destination.description = description || destination.description;
      destination.category = category || destination.category;
      destination.images = imageUrls;
      destination.latitude   = latitude||destination.latitude 
      destination.longitude = longitude||destination.longitude

      await destination.save();

      res.status(200).json({ message: 'Destination updated successfully', destination });
  } catch (error) {
      console.error('Error updating destination:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

exports.deleteDestination = async (req, res) => {
  console.log("delete");

  const { id } = req.params;

  try {
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const imageDeletionPromises = destination.images.map(imageUrl => {
      const publicId = imageUrl.split('/').pop().split('.')[0]; 
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(imageDeletionPromises);

    const result = await Destination.findByIdAndDelete(id);

    res.status(200).json({ message: 'Destination deleted successfully', destination: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUsers = async (req,res)=>{
try{
  const users = await User.find() 
  console.log(users);

  res.status(200).json({ users });

}catch(error){
console.error(error);
res.status(500).json({ message: 'Internal server error' });
   }
}

exports.blockUser = async (req,res)=>{
  try {
    const user = await User.findById(req.params.id);
   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.blocked = !user.blocked;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling block status', error });
  }
}

exports.addTourPackages = async (req, res) => {
  const { packageName, destinations, price, description, seats, duration, startDate, activities } = req.body;
  const imageFiles = req.files; 

  try {
    let imageUrls = [];
 console.log("ok");
    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }
    
    console.log("yes");
    const newPackage = new Packages({
      packageName,
      destinations,
      price,
      description,
      seats,
      duration,
      startDate,
      images: imageUrls, 
      activities: activities 
    });

    const savedPackage = await newPackage.save();

    res.status(200).json({ message: 'Tour package added successfully', package: savedPackage });
  } catch (error) {
    console.error('Error adding tour package:', error);
    res.status(500).json({ error: 'Failed to add tour package' });
  }
};

exports.delteTourPackage = async (req,res)=>{
  const {id} = req.params


  try {
    const package = await Packages.findById(id);
    console.log(package);

    if (!package ) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const imageDeletionPromises = package.images.map(imageUrl => {
      const publicId = imageUrl.split('/').pop().split('.')[0]; 
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(imageDeletionPromises);

    const result = await Packages.findByIdAndDelete(id);

    res.status(200).json({ message: 'Destination deleted successfully', package : result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.editTourPackage = async (req, res) => {
  try {
    const pkgid = req.params.id;
    const { packageName, destinations, price, description, seats, duration, startDate, activities, removedImages = [] } = req.body;
    const imageFiles = req.files;

    console.log(pkgid, packageName, destinations, price, description, seats, duration, startDate, activities, removedImages);
    console.log('image files:', imageFiles);

    const existingPackage = await Packages.findById(pkgid);
    if (!existingPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const removedImagesArray = Array.isArray(removedImages) ? removedImages : JSON.parse(removedImages);
    for (const imageUrl of removedImagesArray) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    let imageUrls = [...existingPackage.images];
    if (Array.isArray(imageFiles)) {
      for (const image of imageFiles) {
        const result = await cloudinary.uploader.upload(image.path);
        imageUrls.push(result.secure_url);
      }
    } else if (imageFiles && imageFiles.path) {
      const result = await cloudinary.uploader.upload(imageFiles.path);
      imageUrls.push(result.secure_url); 
    }
    imageUrls = imageUrls.filter(url => !removedImagesArray.includes(url));

    const activitiesArray = Array.isArray(activities) ? activities : JSON.parse(activities);

    const updatedPackage = await Packages.findByIdAndUpdate(
      pkgid,
      {
        packageName,
        description,
        price,
        seats,
        startDate,
        duration,
        destinations,
        activities: activitiesArray, // Update activities as an array
        images: imageUrls // Update images to include only the remaining and newly added images
      },
      { new: true }
    );

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error('Error updating tour package:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAllpackages = async (req,res)=>{
  try {
    const packages = await Packages.find();
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
}

exports.getallbookings = async (req, res) => {
  try {
    const allBookings = await User.aggregate([
      { $unwind: '$bookings' }, // Unwind the bookings array
      { 
        $project: { 
          userId: '$_id', // Include the userId in the results
          booking: '$bookings' // Include the bookings in the results
        } 
      }
    ]);

    console.log('allllboookkkiiinnnfggg',allBookings);

    res.status(200).json(allBookings); // Send the aggregated results to the client
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.changebookingstatus = async (req,res)=>{


  try {
    const { userId, bookingId } = req.params;
    const { status } = req.body;

    console.log(userId, bookingId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booking = user.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;

    await user.save();

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }

}


exports.addoffers = async (req, res) => {
  const pkgId = req.params.id;
  const { offerType, amount } = req.body;

  console.log('Received:', pkgId, offerType, amount);

  try {
    const package = await Packages.findById(pkgId);

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.offer = { offerType, amount };

    const updatedPackage = await package.save();

    res.status(200).json(updatedPackage.offer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// exports.getallbanners = async (req,res)=>{

//   try {
//     const admin = await Admin.findOne(); 
//     res.json(admin.banners);
//   } catch (error) {
//     res.status(500).send('Error fetching banners');
//   }

// }



// exports.editbanners = async (req,res)=>{
   
//   try {
//     const { banners } = req.body;
//     const admin = await Admin.findOne();

//     admin.banners = banners;
//     await admin.save();
//     res.json(admin.banners);
//   } catch (error) {
//     res.status(500).send('Error updating banners');
//   }
// }

// exports.deletebanners = async (req,res)=>{
//    try {
//     const { type, index } = req.body;
//     const admin = await Admin.findOne();

//     if (type === 'mainHome') {
//       admin.banners.mainHome.splice(index, 1);
//     } else if (type === 'homeAbout') {
//       admin.banners.homeAbout.images.splice(index, 1);
//     } else if (type === 'aboutPage') {
//       admin.banners.aboutPage.images.splice(index, 1);
//     } else {
//       return res.status(400).send('Invalid banner type');
//     }

//     await admin.save();
//     res.json(admin.banners);
//   } catch (error) {
//     res.status(500).send('Error removing banner image');
//   }
// }


  exports.adminLogout = async (req, res) => { 
    console.log("Logging out..."); 
    console.log(req.cookies); 
  
    res
      .clearCookie("admin_refreshToken")
      .clearCookie("admin_accessToken")
      .status(200)
      .json({ message: "Admin logged out successfully" });
  };