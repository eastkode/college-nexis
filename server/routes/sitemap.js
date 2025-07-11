const express = require('express');
const { createSitemap } = require('xmlbuilder2'); // Using xmlbuilder2
const asyncHandler = require('../middleware/asyncHandler');
const Post = require('../models/Post');
const Category = require('../models/Category');
const Setting = require('../models/Setting'); // To get site base URL if stored

const router = express.Router();

// @desc    Generate Sitemap
// @route   GET /sitemap.xml
// @access  Public
router.get('/sitemap.xml', asyncHandler(async (req, res, next) => {
  // Attempt to get site base URL from settings, fallback to request protocol/host
  let siteBaseUrlSetting = await Setting.findOne({ key: 'siteBaseUrl' });
  const baseUrl = siteBaseUrlSetting ? siteBaseUrlSetting.value : `${req.protocol}://${req.get('host')}`;

  const root = createSitemap({ version: '1.0', encoding: 'UTF-8' })
    .ele('urlset', {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
    });

  // Add homepage
  root.ele('url')
    .ele('loc').txt(`${baseUrl}/`).up()
    .ele('lastmod').txt(new Date().toISOString().split('T')[0]).up() // Today's date
    .ele('changefreq').txt('daily').up()
    .ele('priority').txt('1.0').up()
  .up();

  // Add blog page (if you have a dedicated /blog listing page)
  root.ele('url')
    .ele('loc').txt(`${baseUrl}/blog`).up() // Assuming /blog is the main blog page
    .ele('lastmod').txt(new Date().toISOString().split('T')[0]).up()
    .ele('changefreq').txt('daily').up()
    .ele('priority').txt('0.9').up()
  .up();

  // Add category pages
  const categories = await Category.find().select('slug');
  for (const category of categories) {
    root.ele('url')
      .ele('loc').txt(`${baseUrl}/category/${category.slug}`).up() // Assuming /category/:slug
      .ele('lastmod').txt(new Date().toISOString().split('T')[0]).up() // Or use category update date if available
      .ele('changefreq').txt('weekly').up()
      .ele('priority').txt('0.7').up()
    .up();
  }

  // Add post pages
  const posts = await Post.find().select('slug updatedAt');
  for (const post of posts) {
    root.ele('url')
      .ele('loc').txt(`${baseUrl}/blog/${post.slug}`).up() // Assuming /blog/:slug
      .ele('lastmod').txt(post.updatedAt.toISOString().split('T')[0]).up()
      .ele('changefreq').txt('weekly').up() // Or 'monthly' if posts are not updated often
      .ele('priority').txt('0.8').up()
    .up();
  }

  // Add other static pages if any (e.g., contact, about)
   root.ele('url')
    .ele('loc').txt(`${baseUrl}/contact`).up()
    .ele('lastmod').txt(new Date().toISOString().split('T')[0]).up()
    .ele('changefreq').txt('monthly').up()
    .ele('priority').txt('0.5').up()
  .up();


  const xml = root.end({ prettyPrint: true });

  res.type('application/xml');
  res.send(xml);
}));

module.exports = router;
