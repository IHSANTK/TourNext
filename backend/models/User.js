const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





const bookingSchema = new mongoose.Schema({

    bookingDate: { type: Date, default: Date.now },
    username: String,
    phoneNumber:Number,
    email:String,
    seats:Number,
    tripDate:String,
    packageId:String,
    totalprice:Number,
    reviewrate:Number,
    status: { type: String, required: true },
   
});

const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: { type: String, unique: true }, // Ensuring uniqueness for email
    phoneNumber: String,
    password: String,
    image: String,
    blocked: { type: Boolean, default: false },
        
   
    wishlist: [{
        destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        image: [String],
        Name: String,
    
    }],
    bookings: [bookingSchema],
    
});

const User = mongoose.model('User', userSchema);

module.exports = User; 