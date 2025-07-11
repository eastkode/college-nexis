const express = require('express');
const {
  register,
  login,
  getMe, // Optional: To get current logged-in user details
  // logout, // If using session-based auth or token blacklisting
  // forgotPassword, // Optional
  // resetPassword   // Optional
} = require('../controllers/authController'); // We'll create this controller

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Route for admin registration (could be restricted or used for initial setup)
// For a public site, typical user registration might be different or not present
// For this project, we assume 'register' is for creating admin/user accounts by an existing admin.
// Or, it could be an initial setup route.
router.post('/register', protect, authorize('admin'), register); // Only admin can register new users/admins

router.post('/login', login);
router.get('/me', protect, getMe); // Get current user details

// router.get('/logout', logout); // Example for logout
// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
