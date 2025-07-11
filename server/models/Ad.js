const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  name: { // e.g., "Sidebar Ad 1", "Header Banner Ad"
    type: String,
    required: [true, 'Please add an ad name'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['image', 'code'] // 'image' for direct upload, 'code' for AdSense/embed codes
  },
  imageUrl: { // For type 'image'
    type: String
  },
  adCode: { // For type 'code'
    type: String
  },
  linkUrl: { // Optional: URL the ad image links to
    type: String
  },
  isActive: {
    type: Boolean,
    default: false // Ads are inactive by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

AdSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ad', AdSchema);
