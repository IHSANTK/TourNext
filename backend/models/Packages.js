const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
  },
  destinations: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  activities: {
    type: [String],
    required: true,
  },
  offer: {
    offerType: {
      type: String,
      enum: ['percentage', 'fixed'], // Optional: restrict to specific offer types
    },
    amount: {
      type: Number,
    },
  },
  reviews: [
    {
      userName: String,
      text: { type: String },
      addedAt: {
        type: Date,
        default: Date.now,
      },
      rating: { type: Number },
    },
  ],
});

const Packages = mongoose.model("Packages", PackageSchema);

module.exports = Packages;
