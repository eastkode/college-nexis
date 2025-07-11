const express = require('express');
const Setting = require('../models/Setting'); // To get site base URL for sitemap
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// @desc    Generate robots.txt
// @route   GET /robots.txt
// @access  Public
router.get('/robots.txt', asyncHandler(async (req, res, next) => {
  let siteBaseUrlSetting = await Setting.findOne({ key: 'siteBaseUrl' });
  const baseUrl = siteBaseUrlSetting ? siteBaseUrlSetting.value : `${req.protocol}://${req.get('host')}`;

  let content = `User-agent: *\n`;
  content += `Allow: /\n\n`; // Allow all by default

  // Example: Disallow admin areas if they are path-based and not on a subdomain
  // content += `Disallow: /admin/\n`;
  // content += `Disallow: /api/admin/\n`; // Example, if your admin API is under this path

  content += `Sitemap: ${baseUrl}/sitemap.xml\n`;

  res.type('text/plain');
  res.send(content);
}));

module.exports = router;
