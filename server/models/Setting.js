const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  key: { // e.g., 'googleAnalyticsId', 'webmasterMeta', 'globalTitle', 'globalDescription', 'footerText', 'faviconUrl'
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can store strings, objects, etc.
    required: true
  },
  description: { // Optional description for clarity in admin panel
    type: String,
    trim: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

SettingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Setting', SettingSchema);
