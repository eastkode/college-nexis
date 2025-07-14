const express = require('express');
const { searchImages } = require('../controllers/imagesController');

const router = express.Router();

// This route does not need to be admin protected if it's used by the admin panel
// to search for images. If it were for public use, rate limiting would be wise.
// For now, keeping it open for simplicity of use within the admin panel.

// @desc    Search for images using Pixabay API
// @route   GET /api/images/search
// @access  Public (for now)
router.route('/search').get(searchImages);

module.exports = router;
