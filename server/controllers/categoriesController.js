const Category = require('../models/Category');
const Post = require('../models/Post'); // To handle cascading deletes or updates if a category is changed/deleted
const asyncHandler = require('../middleware/asyncHandler');
// const ErrorResponse = require('../utils/errorResponse'); // If you have a custom error handler

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name'); // Sort by name
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category (Example: if needed by slug or ID)
// @route   GET /api/categories/:slug  OR /api/categories/:id
// @access  Public
// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const category = await Category.findOne({ slug: req.params.slug }); // Or findById if using ID
//   if (!category) {
//     return next(new ErrorResponse(`Category not found with slug of ${req.params.slug}`, 404));
//   }
//   res.status(200).json({ success: true, data: category });
// });

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    // return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Category not found with id of ${req.params.id}`});
  }

  // Add any specific logic if category name/slug changes, e.g., update related posts (optional)

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    // return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Category not found with id of ${req.params.id}`});
  }

  // Optional: Handle posts associated with this category.
  // For example, set them to a default category or prevent deletion if posts exist.
  const postsInCategory = await Post.countDocuments({ category: req.params.id });
  if (postsInCategory > 0) {
    // return next(new ErrorResponse(`Cannot delete category. It has ${postsInCategory} associated posts.`, 400));
    return res.status(400).json({ success: false, message: `Cannot delete category. It has ${postsInCategory} associated posts.`});
  }

  await category.deleteOne(); // Changed from .remove()

  res.status(200).json({
    success: true,
    data: {}
  });
});
