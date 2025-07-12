const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
// const ErrorResponse = require('../utils/errorResponse'); // If you have a custom error handler

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password'); // Exclude passwords from list
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    // return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `User not found with id of ${req.params.id}`});
  }
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    // return next(new ErrorResponse('Please provide username, email, and password', 400));
    return res.status(400).json({ success: false, message: 'Please provide username, email, and password'});
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long'});
  }


  // Check if user already exists (optional, mongoose unique index handles it too but this gives clearer error)
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: `User already exists with email: ${email}`});
  }
  existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ success: false, message: `User already exists with username: ${username}`});
  }


  const user = await User.create({
    username,
    email,
    password, // Password will be hashed by the pre-save hook in User model
    role: role || 'user' // Default to 'user' if role not provided or invalid
  });

  // Don't send back the password in the response
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  res.status(201).json({
    success: true,
    data: userResponse
  });
});

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    // return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `User not found with id of ${req.params.id}`});
  }

  // Fields to update
  const { username, email, role, password } = req.body;

  if (username) user.username = username;
  if (email) user.email = email;
  if (role) user.role = role;

  // Handle password update separately: only if a new password is provided
  if (password) {
    if (password.length < 6) {
         return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long'});
    }
    user.password = password; // The pre-save hook will hash it
  }

  await user.save();

  // Don't send back the password
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  res.status(200).json({
    success: true,
    data: userResponse
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    // return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `User not found with id of ${req.params.id}`});
  }

  // Optional: Prevent deleting the currently logged-in admin user themselves?
  // if (req.user.id === user.id) {
  //   return next(new ErrorResponse('You cannot delete your own account.', 400));
  // }

  // Optional: Prevent deleting the last admin user?
  // if (user.role === 'admin') {
  //   const adminCount = await User.countDocuments({ role: 'admin' });
  //   if (adminCount <= 1) {
  //     return next(new ErrorResponse('Cannot delete the last admin user.', 400));
  //   }
  // }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {} // Or a message: { message: 'User deleted successfully' }
  });
});
