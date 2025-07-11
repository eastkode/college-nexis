const Widget = require('../models/Widget');
const Post = require('../models/Post'); // For 'latest_posts', 'popular_posts'
const Ad = require('../models/Ad');     // For 'ad_slot'
const asyncHandler = require('../middleware/asyncHandler');
// const ErrorResponse = require('../utils/errorResponse');

// @desc    Get active sidebar widgets and their content
// @route   GET /api/widgets/sidebar
// @access  Public
exports.getSidebarWidgets = asyncHandler(async (req, res, next) => {
  const activeWidgets = await Widget.find({ isActive: true }).sort('order');

  const populatedWidgets = await Promise.all(
    activeWidgets.map(async (widget) => {
      let content = null;
      switch (widget.type) {
        case 'latest_posts':
          content = await Post.find()
            .sort('-createdAt')
            .limit(widget.config && widget.config.limit ? parseInt(widget.config.limit, 10) : 5)
            .select('title slug featuredImage createdAt'); // Select fields needed for display
          break;
        case 'popular_posts':
          // Popularity logic can be simple (e.g., most comments, views - requires tracking)
          // For now, let's use recent posts as a placeholder for popular
          content = await Post.find()
            .sort('-createdAt') // Placeholder: Replace with actual popularity metric if implemented
            .limit(widget.config && widget.config.limit ? parseInt(widget.config.limit, 10) : 5)
            .select('title slug featuredImage createdAt');
          break;
        case 'custom_html':
          content = widget.config && widget.config.htmlContent ? widget.config.htmlContent : '';
          break;
        case 'ad_slot':
          if (widget.config && widget.config.adId) {
            const ad = await Ad.findById(widget.config.adId);
            if (ad && ad.isActive) {
              content = ad; // Send the whole ad object (or specific fields)
            } else {
              content = null; // Ad is not active or not found
            }
          }
          break;
        default:
          content = null;
      }
      return {
        _id: widget._id,
        name: widget.name,
        type: widget.type,
        order: widget.order,
        content: content // This will hold the dynamically fetched content
      };
    })
  );

  res.status(200).json({
    success: true,
    count: populatedWidgets.length,
    data: populatedWidgets.filter(w => w.content !== null) // Filter out widgets with no content (e.g. inactive ad)
  });
});


// --- Admin functionalities ---

// @desc    Create a new widget
// @route   POST /api/widgets
// @access  Private/Admin
exports.createWidget = asyncHandler(async (req, res, next) => {
  const widget = await Widget.create(req.body);
  res.status(201).json({
    success: true,
    data: widget
  });
});

// @desc    Update a widget
// @route   PUT /api/widgets/:id
// @access  Private/Admin
exports.updateWidget = asyncHandler(async (req, res, next) => {
  let widget = await Widget.findById(req.params.id);

  if (!widget) {
    // return next(new ErrorResponse(`Widget not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Widget not found with id of ${req.params.id}`});
  }

  widget = await Widget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: widget
  });
});

// @desc    Delete a widget
// @route   DELETE /api/widgets/:id
// @access  Private/Admin
exports.deleteWidget = asyncHandler(async (req, res, next) => {
  const widget = await Widget.findById(req.params.id);

  if (!widget) {
    // return next(new ErrorResponse(`Widget not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Widget not found with id of ${req.params.id}`});
  }

  await widget.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
