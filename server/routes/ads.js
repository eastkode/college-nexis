const express = require('express');
const {
  getAds,      // Admin: Get all ads
  getAd,       // Admin: Get a single ad
  createAd,    // Admin: Create an ad
  updateAd,    // Admin: Update an ad (e.g. toggle active/inactive, change image/code)
  deleteAd     // Admin: Delete an ad
} = require('../controllers/adsController');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// All ad routes are admin-only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAds)
  .post(createAd);

router.route('/:id')
  .get(getAd)
  .put(updateAd)
  .delete(deleteAd);

module.exports = router;
