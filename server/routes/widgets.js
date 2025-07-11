const express = require('express');
const {
  getSidebarWidgets,
  createWidget, // Admin
  updateWidget, // Admin
  deleteWidget  // Admin
} = require('../controllers/widgetsController');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Public route to get sidebar configuration
router.route('/sidebar')
  .get(getSidebarWidgets);

// Admin routes for managing widgets
router.route('/') // Base route for creating widgets
  .post(protect, authorize('admin'), createWidget); // POST /api/widgets

router.route('/:id') // Manage by ID
  .put(protect, authorize('admin'), updateWidget)    // PUT /api/widgets/:id
  .delete(protect, authorize('admin'), deleteWidget); // DELETE /api/widgets/:id

module.exports = router;
