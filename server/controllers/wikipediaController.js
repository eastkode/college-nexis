const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get summary of a Wikipedia article
// @route   GET /api/wikipedia/summary/:title
// @access  Public
exports.getSummary = asyncHandler(async (req, res, next) => {
    const title = req.params.title;
    if (!title) {
        return res.status(400).json({ success: false, message: 'Please provide a title to search.' });
    }

    // The Wikimedia REST API is generally open, but it's good practice to set a custom User-Agent.
    const headers = {
        'User-Agent': 'CollegeNexis/1.0 (https://your-app-url.com; your-email@example.com)'
    };

    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    try {
        const response = await axios.get(apiUrl, { headers });

        if (response.data) {
            // Extract the relevant fields
            const summary = {
                title: response.data.title,
                displaytitle: response.data.displaytitle,
                extract: response.data.extract,
                thumbnail: response.data.thumbnail ? response.data.thumbnail.source : null,
                pageUrl: response.data.content_urls ? response.data.content_urls.desktop.page : '#'
            };

            res.status(200).json({
                success: true,
                data: summary
            });
        } else {
            res.status(404).json({ success: false, message: 'No summary found for this title.' });
        }
    } catch (error) {
        // The API returns a 404 if the page doesn't exist, which axios will throw as an error.
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ success: false, message: `No Wikipedia page found for title: ${title}` });
        }
        console.error('Error fetching from Wikipedia API:', error.message);
        return res.status(500).json({ success: false, message: 'Could not fetch Wikipedia summary at this time.' });
    }
});
