const express = require('express');
const {
  getSettings,    // Get all settings (Admin)
  getSetting,     // Get a specific setting by key (Can be public for some, admin for others)
  createOrUpdateSetting, // Create or Update a setting (Admin)
  deleteSetting   // Delete a setting (Admin)
} = require('../controllers/settingsController');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Route to get a specific public setting (e.g., Google Analytics ID for frontend)
// This could be a separate public controller or logic within getSetting to differentiate
router.get('/public/:key', getSetting); // Example: /api/settings/public/googleAnalyticsId

// Admin routes for managing all settings
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getSettings) // Get all settings
  .post(createOrUpdateSetting); // Create or update (upsert) a setting

router.route('/:key')
  .get(getSetting) // Get a specific setting by key (admin)
  .put(createOrUpdateSetting) // Explicitly update a setting by key
  .delete(deleteSetting); // Delete a setting by key

module.exports = router;
