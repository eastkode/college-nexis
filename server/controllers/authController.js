const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
// const ErrorResponse = require('../utils/errorResponse'); // If you have a custom error handler

// @desc    Register user (primarily for admin to create other admins/users)
// @route   POST /api/auth/register
// @access  Private/Admin
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    // return next(new ErrorResponse('Please provide username, email, and password', 400));
    return res.status(400).json({ success: false, message: 'Please provide username, email, and password'});
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role: role || 'user' // Default to 'user' if role is not provided
  });

  // Don't send token on register, require login
  res.status(201).json({ success: true, message: 'User registered successfully. Please login.' });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    // return next(new ErrorResponse('Please provide an email and password', 400));
    return res.status(400).json({ success: false, message: 'Please provide an email and password'});
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    // return next(new ErrorResponse('Invalid credentials', 401));
    return res.status(401).json({ success: false, message: 'Invalid credentials (user not found)'});
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // return next(new ErrorResponse('Invalid credentials', 401));
    return res.status(401).json({ success: false, message: 'Invalid credentials (password mismatch)'});
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user is set by the 'protect' middleware
  const user = await User.findById(req.user.id);

  if (!user) {
    // return next(new ErrorResponse('User not found', 404));
     return res.status(404).json({ success: false, message: 'User not found'});
  }

  res.status(200).json({
    success: true,
    data: user
  });
});


// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE_DAYS || 30) * 24 * 60 * 60 * 1000 // Default 30 days
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Send user data without password, even if it was selected for password check
  const userData = { ...user.toObject() };
  delete userData.password;


  res
    .status(statusCode)
    .cookie('token', token, options) // Optional: set token in cookie for web clients
    .json({
      success: true,
      token, // Also send token in response body for mobile/other clients
      user: userData // Send user data (without password)
    });
};

// @desc    Log user out / clear cookie (Example if using cookies for token)
// @route   GET /api/auth/logout
// @access  Private
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.cookie('token', 'none', {
//     expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
//     httpOnly: true
//   });
//   res.status(200).json({
//     success: true,
//     data: {}
//   });
// });
