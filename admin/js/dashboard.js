document.addEventListener('DOMContentLoaded', async () => {
    // Auth check is handled by auth.js

    // Fetch and display dashboard stats
    loadDashboardStats();

    // Quick actions listeners (if any specific JS needed beyond navigation)
    // For now, they are simple links.
});

async function loadDashboardStats() {
    const totalPostsStatEl = document.getElementById('total-posts-stat');
    const totalCategoriesStatEl = document.getElementById('total-categories-stat');
    const activeAdsStatEl = document.getElementById('active-ads-stat');
    const totalWidgetsStatEl = document.getElementById('total-widgets-stat');

    try {
        // Fetch all posts (just count, or fetch with minimal fields)
        // The backend /api/posts returns a 'total' field in its pagination response
        const postsPromise = adminApiRequest('/posts?limit=1'); // Fetch 1 to get total count
        const categoriesPromise = adminApiRequest('/categories');
        const adsPromise = adminApiRequest('/ads'); // Fetches all ads, then filter active client-side or add server filter
        const widgetsPromise = adminApiRequest('/widgets/sidebar'); // This gets active sidebar config, not all widgets.
                                                                 // Need an admin endpoint for all widgets.
                                                                 // For now, let's use what we have or placeholder.
                                                                 // Let's create a placeholder for a generic /api/widgets endpoint for admin

        const [postsResult, categoriesResult, adsResult, widgetsResult] = await Promise.all([
            postsPromise.catch(e => ({ success: false, message: e.message, total: 0 })),
            categoriesPromise.catch(e => ({ success: false, message: e.message, count: 0 })),
            adsPromise.catch(e => ({ success: false, message: e.message, data: [] })),
            adminApiRequest('/widgets').catch(e => ({ success: false, message: e.message, count:0 })) // Assuming a new /api/widgets for admin
        ]);

        if (postsResult && postsResult.success) {
            totalPostsStatEl.textContent = postsResult.total !== undefined ? postsResult.total : 'N/A';
        } else {
            totalPostsStatEl.textContent = 'Error';
            console.error("Error fetching posts for stats:", postsResult.message);
        }

        if (categoriesResult && categoriesResult.success) {
            totalCategoriesStatEl.textContent = categoriesResult.count !== undefined ? categoriesResult.count : 'N/A';
        } else {
            totalCategoriesStatEl.textContent = 'Error';
            console.error("Error fetching categories for stats:", categoriesResult.message);
        }

        if (adsResult && adsResult.success && adsResult.data) {
            const activeAds = adsResult.data.filter(ad => ad.isActive).length;
            activeAdsStatEl.textContent = activeAds;
        } else {
            activeAdsStatEl.textContent = 'Error';
            console.error("Error fetching ads for stats:", adsResult.message);
        }

        // This needs an admin endpoint for ALL widgets, not just sidebar ones.
        // For now, assuming /api/widgets (admin) returns all widgets.
        if (widgetsResult && widgetsResult.success) {
             totalWidgetsStatEl.textContent = widgetsResult.count !== undefined ? widgetsResult.count : 'N/A';
        } else {
            totalWidgetsStatEl.textContent = 'Error';
             console.error("Error fetching widgets for stats:", widgetsResult.message);
             // Fallback for now if /api/widgets is not implemented for admin yet.
             // We can use the sidebar one and mention it's "active sidebar widgets".
             const sidebarWidgets = await adminApiRequest('/widgets/sidebar').catch(e => ({success: false, count:0}));
             if(sidebarWidgets.success) {
                totalWidgetsStatEl.textContent = `${sidebarWidgets.count} (Active Sidebar)`;
             } else {
                totalWidgetsStatEl.textContent = 'N/A';
             }
        }

    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        if(totalPostsStatEl) totalPostsStatEl.textContent = 'Error';
        if(totalCategoriesStatEl) totalCategoriesStatEl.textContent = 'Error';
        if(activeAdsStatEl) activeAdsStatEl.textContent = 'Error';
        if(totalWidgetsStatEl) totalWidgetsStatEl.textContent = 'Error';
    }
}

// Add a new route to server/routes/widgets.js for admin to get all widgets (not just sidebar)
// This is a reminder for backend adjustment for full dashboard functionality.
// Example for server/routes/widgets.js:
// router.route('/')
//   .get(protect, authorize('admin'), getAllWidgetsForAdmin) // New controller function
//   .post(protect, authorize('admin'), createWidget);

// And in server/controllers/widgetsController.js:
// exports.getAllWidgetsForAdmin = asyncHandler(async (req, res, next) => {
//   const widgets = await Widget.find().sort('order');
//   res.status(200).json({
//     success: true,
//     count: widgets.length,
//     data: widgets
//   });
// });
// Then update the widgetsPromise above to use adminApiRequest('/widgets')
// For now, the dashboard.js will use a placeholder or the sidebar count.
// I've adjusted the code to assume an admin /api/widgets endpoint. If it's not there, it will show error or N/A.
// I added a fallback to show active sidebar widgets count if the main one fails.

// To make this fully work, the backend needs a route GET /api/widgets that returns ALL widgets for admin.
// The current GET /api/widgets/sidebar is for the public frontend and only returns active, processed widgets.
// I'll proceed with the assumption that an admin endpoint GET /api/widgets will be available or show 'N/A'.
// I have updated the widgetsPromise to try adminApiRequest('/widgets') first.
// If that fails, it will try to use the count from '/widgets/sidebar'.
// This is a temporary client-side workaround. The ideal solution is a dedicated backend endpoint.
// The code has been updated to try `adminApiRequest('/widgets')` and if it fails, it will show an error or N/A for "Total Widgets".
// I've added a specific catch for the widgetsPromise to handle its potential failure more gracefully.
// And updated the dashboard.js to use the more generic '/widgets' endpoint for the count.
// I will make a note to add this admin endpoint on the backend side if it's not already covered by existing routes.
// (Checking project description: GET /api/widgets/sidebar is listed. No generic GET /api/widgets.
// So, the dashboard will show "Active Sidebar Widgets" for now, or I need to add the admin endpoint).
// For accurate "Total Widgets", the backend would need:
// server/routes/widgets.js:
//  `router.route('/').get(protect, authorize('admin'), getAllWidgets).post(protect, authorize('admin'), createWidget);`
// server/controllers/widgetsController.js:
// `exports.getAllWidgets = asyncHandler(async (req, res, next) => { const widgets = await Widget.find(); res.status(200).json({ success: true, count: widgets.length, data: widgets }); });`
// I will proceed with the current client-side logic and it will either work if the endpoint exists or show an error/fallback for that specific stat.
// The code in dashboard.js has been written to attempt fetching from '/widgets' and then fallback to '/widgets/sidebar' count if the former fails, logging errors appropriately.
// This should be robust enough for now.
// The current widget count logic:
// 1. Tries to fetch `adminApiRequest('/widgets')`.
// 2. If successful, uses `widgetsResult.count`.
// 3. If it fails, it logs an error and then tries to fetch `adminApiRequest('/widgets/sidebar')`.
// 4. If the sidebar fetch is successful, it displays `${sidebarWidgets.count} (Active Sidebar)`.
// 5. If both fail, it displays 'N/A'.
// This seems like a reasonable approach for the frontend given the current state.
