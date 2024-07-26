const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Destinations = require('../models/Destination');
const Packages = require('../models/Packages')
const helpers = require("../helpers/razorpay");
const otpService = require("../services/otpService");


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
  const { formData, totalPrice, Id,otp } = req.body;

  console.log('userID', userID);
  console.log('email, totalprice, Id', formData.email, totalPrice, Id);
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

      const razorpayResponse = await helpers.generateRazorpay(user._id, totalPrice);

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
  const { formData, totalPrice, seats, Id } = req.body;
  console.log('Order Details:', formData, totalPrice, seats, Id);

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
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    package.seats -= seats; 

    console.log(package);

    const newBooking = {
      username: formData.name,
      phoneNumber: formData.phone,
      email: formData.email,
      seats: seats,
      packageId: Id,
      totalprice: totalPrice,
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

  // Extract filter criteria from the request query
  const { state, district, category } = req.query;

  // Build the filter object based on the provided criteria
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


exports.getdestinationdetiles = async (req,res)=>{
   
  const destId = req.params.id
  try{  
            console.log('ok',destId);

            const pakage = await Destinations.findById(destId)
            console.log(pakage);

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
