const express = require('express');
const router = express.Router();

const GoogleAuthController = require('../Controllers/GoogleAuthController');
const { authenticateUser } = require('../middleware/Userjwt'); 


  
router.post('/auth/google',GoogleAuthController.verifyIdToken);



module.exports = router;
