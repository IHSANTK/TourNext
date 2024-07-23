const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    categories: [{
        categoryName: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    States: [{
        stateName: String,
        districts: [{
            districtName: String
        }]
    }],
    banners: [{
       maincoresel:{ 
        bannerText: String,
        images: {
            type: [String],
            required: true
        }
    },
     mainaboutimage:{
        bannerText: String,
        description: String,
        image:String
     },
     aboutpageimage:{
        bannerText: String,
        image:String
     }
    }]
}, { collection: 'admin' });

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;
