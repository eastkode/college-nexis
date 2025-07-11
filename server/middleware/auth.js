const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as necessary

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route (no token)' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route (user not found)' });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route (token invalid)' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route` });
    }
    next();
  };
};
