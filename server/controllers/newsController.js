const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get trending news from NewsAPI.org
// @route   GET /api/news/trending
// @access  Public
exports.getTrendingNews = asyncHandler(async (req, res, next) => {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;

    if (!NEWS_API_KEY) {
        console.error('NewsAPI key not configured in .env file.');
        return res.status(500).json({ success: false, message: 'News service is not configured.' });
    }

    // Keywords to get niche-relevant news. Using OR ensures we get articles matching any of these.
    // Using parentheses and boolean operators as per NewsAPI documentation.
    const keywords = [
        'education',
        'college admission',
        'university ranking',
        'student loan',
        'campus life',
        'career development',
        'job market trends',
        'tech hiring',
        'internship',
        'startup hiring',
        'exam results'
    ];
    const query = `(${keywords.join(' OR ')})`;

    // Construct the NewsAPI URL
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevancy&pageSize=10`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'X-Api-Key': NEWS_API_KEY
            }
        });

        if (response.data && response.data.articles) {
            // Filter out articles without an image, as they won't look good in a slider
            const articlesWithImages = response.data.articles.filter(article => article.urlToImage);

            // Send back a limited number of articles (e.g., top 5-7 with images)
            res.status(200).json({
                success: true,
                count: articlesWithImages.slice(0, 7).length,
                data: articlesWithImages.slice(0, 7)
            });
        } else {
            res.status(200).json({ success: true, count: 0, data: [] });
        }
    } catch (error) {
        console.error('Error fetching from NewsAPI:', error.response ? error.response.data : error.message);
        // Don't expose the full error to the client
        return res.status(500).json({ success: false, message: 'Could not fetch trending news at this time.' });
    }
});
