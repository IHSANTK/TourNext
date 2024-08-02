const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Destinations = require('../models/Destination');
const Packages = require('../models/Packages')
const cloudinary = require('../config/cloudinery');
const helpers = require("../helpers/razorpay");
const otpService = require("../services/otpService");
const { response } = require('express');


const jwtSecret = process.env.USER_JWT_SECRET;

const generateAccessToken = (user) => { 
  return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phoneNumber, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: 'User signup successful', });
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: 'Invalid email or password' });
    } 

    const userAccessToken = generateAccessToken(user); 
    const userRefreshToken = generateRefreshToken(user);

    res.cookie('user_refreshToken', userRefreshToken, { httpOnly: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
       .cookie('user_accessToken', userAccessToken, { httpOnly: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 })
       .json({ userAccessToken, user });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.dashboarddatas = async (req,res)=>{
  try {
    console.log('datasbackend ok');
    
    
    const lastAddedDestinations = await Destinations.find().sort({ date: -1 }).limit(4);

    const latestpackages = await Packages.find().sort({date:-1}).limit(4)
    
    console.log(latestpackages);
    
    res.status(200).json({lastAddedDestinations,latestpackages});
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }

}


exports.editProfile = async (req, res) => {
  const userId = req.params.userid;
  const { name, email, phoneNumber } = req.body;
  const image = req.file; 

  try {
    const updateData = { name, email, phoneNumber,image };

    if (image) {
      const result = await cloudinary.uploader.upload(image.path);

      updateData.image = result.secure_url;
      }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteprofailimage = async (req,res)=>{
  
  const userId = req.params.userId
  console.log(userId);

    try{
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $unset: {image: "" } }, 
        { new: true, runValidators: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('updaeeuser',updatedUser);
      res.status(200).json({ message: 'Profile image deleted successfully', user:updatedUser });

    }catch(error){
      console.error(error);
      response.status(500).json('internal server error')
  }
}


exports.chanagepassword = async (req, res) => {
  const userId = req.params.userid;
  const { currentPassword, newPassword,confirmNewPassword } = req.body;

  console.log('userid',userId);
  console.log(currentPassword, newPassword,confirmNewPassword);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.json(
        "current password is not match"
      );  
    }

    if (newPassword !== confirmNewPassword) {
      return res.json('conform password is not match'); 
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json("password update sccesfully");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
};





exports.getAllpackages = async (req, res) => {
  try {
    const {
      searchTerm = '',
      minPrice = 0,
      maxPrice = 10000,
      page = 1,
      limit = 9
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const query = {
      packageName: { $regex: searchTerm, $options: 'i' },
      price: { $gte: minPrice, $lte: maxPrice }
    };

    const packages = await Packages.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalPackages = await Packages.countDocuments(query);

    res.status(200).json({
      packages,
      totalPages: Math.ceil(totalPackages / limitNumber),
      currentPage: pageNumber
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getpkdbyid = async (req,res)=>{
  const pkgID = req.params.id
      const userId = req.user;
  try{

     const exactpkg = await Packages.findById(pkgID)

     
     
     res.status(200).json(exactpkg)

  }catch(error){
    console.error(error);
    res.status(500).json('internal servel err')
  }
}

exports.booking = async (req, res) => {
  const userID = req.user;
  const { formData, finalAmount, Id,otp } = req.body;

  console.log('userID', userID);
  console.log('email, totalprice, Id', formData.email, finalAmount, Id);
  console.log('OTP', otp);


  try {
      const user = await User.findById(userID);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      console.log("Found user:", user);
      const isOTPValid = otpService.verifyOTP(formData.email, otp);
 
      if (!isOTPValid) {
        console.log('otperrrr');
         return res.json({ message: "Invalid OTP" });
      }

      const razorpayResponse = await helpers.generateRazorpay(user._id,finalAmount);

      console.log("Razorpay response:", razorpayResponse);

      res.status(200).json({ razorpayResponse });
  } catch (error) {
      console.error("Error in booking:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}
exports.sendOtpforBooking = async (req, res) => {
  const { email } = req.body;
  console.log("email:", email);
  try{

    const otp = otpService.generateOTP();
    console.log(otp);
    otpService.otpMap.set(email, otp.toString());
    await otpService.sendOTP(email, otp);

    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: error.message });
  }
};







exports.saveorder = async (req, res) => {
  const userId = req.user; 
  const { formData, finalAmount, seats, Id } = req.body;
  console.log('Order Details:', formData, finalAmount, seats, Id);

  try {
    const user = await User.findById(userId);
    console.log('User:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const package = await Packages.findById(Id);
   

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (package.seats < seats) {
      return res.json({ message: 'Not enough seats available' });
    }

    package.seats -= seats; 

    console.log(package);

    const newBooking = {
      username: formData.name,
      phoneNumber: formData.phone,
      email: formData.email,
      seats: seats,
      packageId: Id,
      totalprice: finalAmount,
      packageName:package.packageName,
      image:package.images[0],
      tripDate:package.startDate,
      status: 'Booked'
    };
    console.log('New Booking:', newBooking);

    user.bookings.push(newBooking);

    await package.save(); 
    await user.save();

    res.status(200).json({ message: 'Booking successfull' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.bookingditels = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId)
 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    res.json(user.bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booking = user.bookings.find(
      (booking) => booking._id.toString() === bookingId
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';

    await user.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateBookingReview = async (req, res) => {
  try {
    const { bookingId, packageid, rating, review } = req.body;
    const userId = req.user;

    console.log(packageid, rating, review, 'userid', userId);

    const user = await User.findById(userId);
    const username = user.name;

    const package = await Packages.findById(packageid);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.reviews.push({ rating, text: review, userName: username });

    const booking = user.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.reviewrate = rating;

    await user.save();
    await package.save();

    res.json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.gellAlldestinatons = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const { state, district, category } = req.query;

  const filter = {};
  if (state) filter.state = state;
  if (district) filter.district = district;
  if (category) filter.category = category;

  console.log('Filter criteria:', filter);

  try {
    const destinations = await Destinations.find(filter)
      .skip(startIndex)
      .limit(limit)
      .exec();

    const count = await Destinations.countDocuments(filter);

    console.log('Filtered destinations:', destinations);
    res.json({
      destinations,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: error.message });
  }
};


exports.addtowishlist = async (req, res) => {
  const { destinationId } = req.body;

  console.log('get called', destinationId);
  try {
    const userId = req.user; 
    const user = await User.findById(userId);

    console.log('dsdfdfdf',userId,user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // const isInWishlist = user.wishlist.includes(destinationId);
    const isInWishlist = user.wishlist.some(item => item._id.toString() === destinationId.toString());


    console.log(isInWishlist);

    if (isInWishlist) {
       user.wishlist = user.wishlist.filter(item => item._id.toString() !== destinationId.toString());
      await user.save();
      res.status(200).json({ message: 'Removed from wishlist' });
    } else {
      user.wishlist.push(destinationId);
      await user.save();
      res.status(200).json({ message: 'Added to wishlist' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getwhishlistdata = async (req, res) => {
  const destId = req.params.id; 
  const userID = req.user; 

  try {
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isInWishlist = user.wishlist.some(item => item._id.toString() === destId.toString());

    res.status(200).json({ isInWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.addBlog = async (req,res)=>{

  console.log(req.body.formData);
  const { destinationId, description, images, rating,text } = req.body;

  const imageFiles = req.files;
  console.log("iamges",imageFiles);
   
  const imageUrls  =[]
  const userId = req.user
  console.log('userid',userId);

  console.log(destinationId, description, images, rating);

  try {


    for (const file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }
    const destination = await Destinations.findById(destinationId);

    const user = await User.findById(userId)

    console.log('username',user);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    destination.blogs.push({user,description, text,images:imageUrls, rating });

    await destination.save();

    res.status(200).json({ message: 'Blog added successfully', destination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getdestinationdetiles = async (req,res)=>{
   
  const destId = req.params.id
  try{  
            console.log('ok',destId);

            const pakage = await Destinations.findById(destId)
           

       res.status(200).json(pakage)

  }catch(error){
    console.error(error);
    res.status(500).json({message:'internal server error'})
  }
}




exports.logout = (req, res) => {
  res.clearCookie('user_refreshToken')
     .clearCookie('user_accessToken')
     .status(200)
     .json({ message: "User logged out successfully" });
};
