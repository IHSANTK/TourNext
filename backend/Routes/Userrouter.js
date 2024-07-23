const express = require('express');
const router = express.Router();

const UserController = require('../Controllers/Usercontroller');
const { sendOtp, verifyOtp } = require('../Controllers/otpController');
const { authenticate } = require('../middleware/Userjwt'); 



router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser); 
router.get('/getdashboard',UserController.dashboarddatas)
router.get('/getAllpackages', authenticate,UserController.getallpackages)
router.get('/getPackageById/:id', authenticate,UserController.getpkdbyid)

router.post('/booking',authenticate,UserController.booking)
router.post('/saveorder',authenticate,UserController.saveorder)

router.get('/userBookings',authenticate,UserController.bookingditels)
router.post('/cancelBooking',authenticate,UserController.cancelBooking);
router.post('/updateBookingReview',authenticate,UserController.updateBookingReview);



router.post('/userlogut',authenticate, UserController.logout);


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);


module.exports = router;
