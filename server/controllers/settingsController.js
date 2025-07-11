const Setting = require('../models/Setting');
const asyncHandler = require('../middleware/asyncHandler');
// const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await Setting.find();
  // Convert array of settings to a key-value object for easier use in admin panel
  const settingsObj = settings.reduce((obj, item) => {
    obj[item.key] = item.value;
    return obj;
  }, {});
  res.status(200).json({
    success: true,
    count: settings.length,
    data: settingsObj // Or send as array: settings
  });
});

// @desc    Get a single setting by key
// @route   GET /api/settings/:key
// @route   GET /api/settings/public/:key
// @access  Public (for specific keys like GA ID) or Private/Admin
exports.getSetting = asyncHandler(async (req, res, next) => {
  const setting = await Setting.findOne({ key: req.params.key });

  if (!setting) {
    // For public keys, we might not want to send a 404 if it's simply not set yet.
    // For admin, a 404 is appropriate.
    if (req.path.includes('/public/')) {
        return res.status(200).json({ success: true, data: null }); // Or a default value
    }
    // return next(new ErrorResponse(`Setting with key '${req.params.key}' not found`, 404));
    return res.status(404).json({ success: false, message: `Setting with key '${req.params.key}' not found`});
  }

  // Example: Restrict access to non-public settings if not admin
  // const publicKeys = ['googleAnalyticsId', 'siteName']; // Define keys that can be public
  // if (!publicKeys.includes(req.params.key) && (!req.user || req.user.role !== 'admin') && !req.path.includes('/public/')) {
  //    return next(new ErrorResponse('Not authorized to access this setting', 403));
  // }
  // Simplified for now: public/:key path implies public access intent

  res.status(200).json({
    success: true,
    data: { key: setting.key, value: setting.value }
  });
});

// @desc    Create or Update a setting (Upsert)
// @route   POST /api/settings
// @route   PUT /api/settings/:key
// @access  Private/Admin
exports.createOrUpdateSetting = asyncHandler(async (req, res, next) => {
  const key = req.params.key || req.body.key;
  const value = req.body.value;
  const description = req.body.description;

  if (!key || value === undefined) {
    // return next(new ErrorResponse('Please provide a key and value for the setting', 400));
    return res.status(400).json({ success: false, message: 'Please provide a key and value for the setting'});
  }

  const setting = await Setting.findOneAndUpdate(
    { key: key },
    { value: value, description: description, updatedAt: Date.now() },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: setting
  });
});


// @desc    Delete a setting by key
// @route   DELETE /api/settings/:key
// @access  Private/Admin
exports.deleteSetting = asyncHandler(async (req, res, next) => {
  const setting = await Setting.findOne({ key: req.params.key });

  if (!setting) {
    // return next(new ErrorResponse(`Setting with key '${req.params.key}' not found`, 404));
    return res.status(404).json({ success: false, message: `Setting with key '${req.params.key}' not found`});
  }

  await setting.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
