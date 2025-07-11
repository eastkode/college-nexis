const mongoose = require('mongoose');

const WidgetSchema = new mongoose.Schema({
  name: { // e.g., "Latest Posts", "Popular Posts", "Ad Block 1", "Custom HTML About Us"
    type: String,
    required: [true, 'Please add a widget name'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['latest_posts', 'popular_posts', 'custom_html', 'ad_slot'] // Define possible widget types
  },
  config: { // Store type-specific configurations
    type: mongoose.Schema.Types.Mixed // Allows for flexible configuration
    // Examples:
    // For 'latest_posts': { limit: 5 }
    // For 'custom_html': { htmlContent: '<p>About Us...</p>' }
    // For 'ad_slot': { adId: 'mongoose.Schema.ObjectId (ref: Ad)' }
  },
  order: { // To control the display order in the sidebar
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Widget', WidgetSchema);
