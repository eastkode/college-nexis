const express = require('express');
const { getTrendingNews } = require('../controllers/newsController');

const router = express.Router();

// @desc    Get trending news relevant to the niche
// @route   GET /api/news/trending
// @access  Public
router.route('/trending').get(getTrendingNews);

module.exports = router;
