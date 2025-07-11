const express = require('express');
const {
  getCategories,
  getCategory, // Optional: if you need to get a single category by slug or ID
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoriesController'); // We'll create this controller

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public route to get all categories
router.route('/')
  .get(getCategories);

// Example: Get single category (if needed)
// router.route('/:slug').get(getCategory);

// Admin routes for managing categories
router.route('/')
  .post(protect, authorize('admin'), createCategory); // POST /api/categories

router.route('/:id') // Manage by ID
  .put(protect, authorize('admin'), updateCategory)    // PUT /api/categories/:id
  .delete(protect, authorize('admin'), deleteCategory); // DELETE /api/categories/:id

module.exports = router;
