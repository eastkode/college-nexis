const Ad = require('../models/Ad');
const asyncHandler = require('../middleware/asyncHandler');
// const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all ads
// @route   GET /api/ads
// @access  Private/Admin
exports.getAds = asyncHandler(async (req, res, next) => {
  const ads = await Ad.find().sort('-createdAt'); // Show newest first
  res.status(200).json({
    success: true,
    count: ads.length,
    data: ads
  });
});

// @desc    Get single ad
// @route   GET /api/ads/:id
// @access  Private/Admin
exports.getAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    // return next(new ErrorResponse(`Ad not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Ad not found with id of ${req.params.id}`});
  }
  res.status(200).json({
    success: true,
    data: ad
  });
});

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private/Admin
exports.createAd = asyncHandler(async (req, res, next) => {
  // Basic validation: if type is 'image', imageUrl should exist (or handle file upload here)
  // if type is 'code', adCode should exist
  if (req.body.type === 'image' && !req.body.imageUrl) {
    // return next(new ErrorResponse('Please provide an image URL for image type ad', 400));
    return res.status(400).json({ success: false, message: 'Please provide an image URL for image type ad'});
  }
  if (req.body.type === 'code' && !req.body.adCode) {
    // return next(new ErrorResponse('Please provide ad code for code type ad', 400));
    return res.status(400).json({ success: false, message: 'Please provide ad code for code type ad'});
  }

  const ad = await Ad.create(req.body);
  res.status(201).json({
    success: true,
    data: ad
  });
});

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private/Admin
exports.updateAd = asyncHandler(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);

  if (!ad) {
    // return next(new ErrorResponse(`Ad not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Ad not found with id of ${req.params.id}`});
  }

  // Add any specific validation for update if needed

  ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: ad
  });
});

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
exports.deleteAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    // return next(new ErrorResponse(`Ad not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Ad not found with id of ${req.params.id}`});
  }

  // Optional: Check if this ad is currently used in any active widget.
  // If so, you might want to prevent deletion or unassign it from widgets.
  // Example:
  // const widgetsUsingAd = await Widget.find({ 'config.adId': req.params.id, type: 'ad_slot' });
  // if (widgetsUsingAd.length > 0) {
  //   return next(new ErrorResponse(`Cannot delete ad. It is currently used in ${widgetsUsingAd.length} widget(s).`, 400));
  // }

  await ad.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
