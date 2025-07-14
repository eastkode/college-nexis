const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Search for images on Pixabay
// @route   GET /api/images/search?q=query
// @access  Public (for admin panel use)
exports.searchImages = asyncHandler(async (req, res, next) => {
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

    if (!PIXABAY_API_KEY) {
        console.error('Pixabay API key not configured in .env file.');
        return res.status(500).json({ success: false, message: 'Image search service is not configured.' });
    }

    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ success: false, message: 'Please provide a search query.' });
    }

    const apiUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=50`;

    try {
        const response = await axios.get(apiUrl);

        if (response.data && response.data.hits) {
            // We only need a few properties for the frontend to display and use
            const images = response.data.hits.map(hit => ({
                id: hit.id,
                previewURL: hit.previewURL,
                webformatURL: hit.webformatURL,
                largeImageURL: hit.largeImageURL,
                tags: hit.tags
            }));

            res.status(200).json({
                success: true,
                count: images.length,
                data: images
            });
        } else {
            res.status(200).json({ success: true, count: 0, data: [] });
        }
    } catch (error) {
        console.error('Error fetching from Pixabay API:', error.response ? error.response.data : error.message);
        return res.status(500).json({ success: false, message: 'Could not perform image search at this time.' });
    }
});
