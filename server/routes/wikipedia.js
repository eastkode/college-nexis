const express = require('express');
const { getSummary } = require('../controllers/wikipediaController');

const router = express.Router();

// @desc    Get summary of a Wikipedia article
// @route   GET /api/wikipedia/summary/:title
// @access  Public
router.route('/summary/:title').get(getSummary);

module.exports = router;
