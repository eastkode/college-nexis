const Post = require('../models/Post');
const Category = require('../models/Category'); // Needed for category filtering
const asyncHandler = require('../middleware/asyncHandler'); // We'll create this utility

// @desc    Get all posts (supports filtering by category slug)
// @route   GET /api/posts
// @route   GET /api/posts?category=category-slug
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'page', 'limit', 'category_slug'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Post.find(JSON.parse(queryStr)).populate('category', 'name slug');

  // Filter by category slug if provided
  if (req.query.category_slug) {
    const category = await Category.findOne({ slug: req.query.category_slug });
    if (category) {
      query = query.where('category').equals(category._id);
    } else {
      // If category slug is provided but not found, return empty array or error
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default sort by newest
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10; // Default 10 per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments(JSON.parse(queryStr)); // Count documents matching query

  query = query.skip(startIndex).limit(limit);

  const posts = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    pagination,
    data: posts
  });
});

// @desc    Get recent posts (for hero slider)
// @route   GET /api/posts/recent
// @access  Public
exports.getRecentPosts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 5; // Default to 5 recent posts
  let query = Post.find();

  // If a specific category slug is requested (for the hero slider news)
  if (req.query.category_slug) {
    const category = await Category.findOne({ slug: req.query.category_slug });
    if (category) {
      query = query.where('category').equals(category._id);
    } else {
      // If the requested category doesn't exist, return no posts.
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
  }

  const posts = await query
    .sort('-createdAt')
    .limit(limit)
    .populate('category', 'name slug');

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
exports.getPostBySlug = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate('category', 'name slug')
    .populate('author', 'username'); // Assuming you want to show author username

  if (!post) {
    // return next(new ErrorResponse(`Post not found with slug of ${req.params.slug}`, 404));
    return res.status(404).json({ success: false, message: `Post not found with slug of ${req.params.slug}`});
  }

  res.status(200).json({
    success: true,
    data: post
  });
});


// --- Admin functionalities (Placeholders - to be expanded) ---

// @desc    Create new post
// @route   POST /api/posts
// @access  Private/Admin
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add user to req.body (assuming req.user is set by auth middleware)
  // req.body.author = req.user.id;

  const post = await Post.create(req.body);
  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private/Admin
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    // return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    return res.status(404).json({ success: false, message: `Post not found with id of ${req.params.id}`});
  }

  // Make sure user is post owner or admin (add more sophisticated checks if needed)
  // if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
  // }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    // return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
     return res.status(404).json({ success: false, message: `Post not found with id of ${req.params.id}`});
  }

  // Make sure user is post owner or admin
  // if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
  // }

  await post.deleteOne(); // Changed from .remove() which is deprecated

  res.status(200).json({
    success: true,
    data: {}
  });
});
