const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/Admincontroller');
const { authenticateAdmin } = require('../middleware/Adminjwt');
const upload = require('../config/multer');

router.post('/adminlogin', adminController.adminLogin);
router.get('/adminpanel',adminController.adminpanel)
router.post('/logout', authenticateAdmin, adminController.adminLogout);
router.post('/categoriadd',adminController.categorieadd)
router.put('/editcategories/:id',adminController.categoryedit)
router.delete('/deletecategories/:id',adminController.deltecategory)

router.get('/getstates',adminController.gellallstates)
router.post('/addstates',adminController.addstates)
router.delete('/deltestate/:id',adminController.deletestate)

router.post('/getplaces',adminController.getPlaces)
router.post('/addplaces/:id',adminController.placesAdd)
router.delete('/deleteplace/:stateId/:districtId', adminController.deletePlace);
router.put('/updateplace/:stateId/:districtId', adminController.updatePlace);
router.get('/states',adminController.getallstates);
router.post('/destinationadd',upload.array('images', 5),adminController.addDestinations)
router.get('/destinations',adminController.getAllDestinations)

router.put('/editDestinations/:id', upload.array('images'), adminController.editDestinations);
 
router.delete('/delteDestination/:id',adminController.deleteDestination)
  
router.post('/addTourPackages',upload.array('images', 5),adminController.addTourPackages)

router.post('/editTourPackages/:id',upload.array('images'), adminController.editTourPackage);

router.delete('/deletetourPackages/:id',adminController.delteTourPackage) 

router.get('/getTourPackages',adminController.getAllpackages)

// router.get('/getBanners',adminController.getallbanners)
// router.put('/updateBanners',adminController.editbanners)
// router.delete('/removeBannerImage',adminController.deletebanners)
router.get('/getallbookings',adminController.getallbookings);
router.patch('/updateBookingStatus/:userId/:bookingId',adminController.changebookingstatus);

router.post('/updateoffers/:id',adminController.addoffers)

router.get('/allUsers',adminController.getUsers)
router.put('/block/:id',adminController.blockUser)
 
 
module.exports = router;
