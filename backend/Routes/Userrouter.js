const express = require('express');
const router = express.Router();

const UserController = require('../Controllers/Usercontroller');
const { sendOtp, verifyOtp } = require('../Controllers/otpController');
const { authenticate } = require('../middleware/Userjwt'); 
const upload = require('../config/multer');



router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser); 
router.get('/getdashboard',UserController.dashboarddatas)
router.get('/getAllpackages', authenticate,UserController.getAllpackages)
router.get('/getPackageById/:id', authenticate,UserController.getpkdbyid)

router.post('/booking',authenticate,UserController.booking)
router.post('/saveorder',authenticate,UserController.saveorder)

router.get('/userBookings',authenticate,UserController.bookingditels)
router.post('/sendOtp',UserController.sendOtpforBooking)
router.post('/cancelBooking',authenticate,UserController.cancelBooking);
router.post('/updateBookingReview',authenticate,UserController.updateBookingReview);

router.get('/getAllDestinations',UserController.gellAlldestinatons)
router.get('/getdestinationdetails/:id',UserController.getdestinationdetiles)

router.post('/addToWishlist',authenticate,UserController.addtowishlist)
router.get('/getwhishlistdata/:id',authenticate,UserController.getwhishlistdata)
   
router.post('/addblog',authenticate,upload.array('images'),UserController.addBlog) 

 
router.post('/editprofile/:userid', upload.single('profileImage'), UserController.editProfile);
router.post('/deleteprofileimage/:userId',UserController.deleteprofailimage)

router.post('/changepassword/:userid',UserController.changePassword)

router.post('/userlogut',authenticate, UserController.logout);


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);


module.exports = router;
