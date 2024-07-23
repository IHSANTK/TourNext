const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Destinations = require('../models/Destination');
const Packages = require('../models/Packages')
const helpers = require("../helpers/razorpay");


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

    res.status(200).json({ message: 'User signup successful' });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
console.log('fgfgfg');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
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

exports.getallpackages = async (req,res)=>{
   try{
     
    console.log('ook');
    const pakages = await Packages.find()
    console.log(pakages);

    res.status(200).json(pakages)

   }catch(error){
    console.error(error);
    res.status(500).json('internal servel err')
   }
}
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
  const { formData, totalprice, Id } = req.body;

  console.log('userID', userID);
  console.log('formData, totalprice, Id', formData, totalprice, Id);

  try {
      const user = await User.findById(userID);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      console.log("Found user:", user);

      const razorpayResponse = await helpers.generateRazorpay(user._id, totalprice);

      console.log("Razorpay response:", razorpayResponse);

      res.status(200).json({ razorpayResponse });
  } catch (error) {
      console.error("Error in booking:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.saveorder = async (req, res) => {
  const userId = req.user; 
  const { formData,totalprice, seats, Id } = req.body;
  console.log('llllllllllllllllllllllllllllllllllllllllllll');
  try {
      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const newBooking ={
          username: formData.name,
          phoneNumber: formData.phone,
          email: formData.email,
          seats: seats,
          packageId:Id,
          totalprice:totalprice,
          status: 'Pending' 
      };
      console.log('user',user);
      console.log('bookingdda',newBooking);
      

      user.bookings.push(newBooking);
      await user.save();

      res.status(200).json({ message: 'Booking saved successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


exports.bookingditels = async (req,res)=>{
   
  try {
    const userId = req.user; 
    const user = await User.findById(userId).populate('bookings.packageId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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

    user.bookings = user.bookings.filter(
      (booking) => booking._id.toString() !== bookingId
    );

    await user.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateBookingReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;
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

    booking.rating = rating;
    booking.review = review;

    await user.save();
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.logout = (req, res) => {
  res.clearCookie('user_refreshToken')
     .clearCookie('user_accessToken')
     .status(200)
     .json({ message: "User logged out successfully" });
};
