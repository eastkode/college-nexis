const express = require('express');
const {
  getPosts,
  getPostBySlug,
  getRecentPosts,
  createPost, // Placeholder for admin functionality
  updatePost, // Placeholder for admin functionality
  deletePost  // Placeholder for admin functionality
} = require('../controllers/postsController'); // We'll create this controller next

const router = express.Router();

const { protect, authorize } = require('../middleware/auth'); // Assuming auth middleware is set up

// Public routes
router.route('/')
  .get(getPosts);

router.route('/recent')
  .get(getRecentPosts); // Example: /api/posts/recent?limit=5

router.route('/:slug')
  .get(getPostBySlug);

// Admin routes (example placeholders, to be fully implemented with admin panel)
// These would require authentication and authorization (e.g., admin role)
router.route('/')
  .post(protect, authorize('admin'), createPost); // POST /api/posts

router.route('/:id') // Assuming updates/deletes by ID for admin
  .put(protect, authorize('admin'), updatePost)    // PUT /api/posts/:id
  .delete(protect, authorize('admin'), deletePost); // DELETE /api/posts/:id

module.exports = router;
