const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  images: {
    type: [String],
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  },
  blogs: [{
    userId: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    addedAt: {
      type: Date,
      default: Date.now
    },
    rating: { type: Number }
  }]
});


const Destinations = mongoose.model('Destinations',  DestinationSchema);

module.exports = Destinations;
