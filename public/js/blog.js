document.addEventListener('DOMContentLoaded', () => {
    // Hero slider is also on blog page
    if (typeof loadHeroSlider === 'function') {
        loadHeroSlider();
    } else {
        console.error("loadHeroSlider function not found. Make sure main.js is loaded first.");
    }

    loadCategoriesForTabs();
    loadBlogPosts(); // Initial load for "All Posts"

    // Sidebar is loaded by main.js
});

const postsGridContainer = document.getElementById('blog-posts-grid');
const postsListContainer = document.getElementById('blog-posts-list');
const categoryTabsContainer = document.getElementById('category-tabs');
const paginationContainer = document.getElementById('pagination-controls');

let currentPage = 1;
const postsPerPageGrid = 5; // As per requirement
const postsPerPageList = 6; // As per requirement
let currentCategorySlug = 'all'; // Default to all posts

async function loadCategoriesForTabs() {
    if (!categoryTabsContainer) return;

    const result = await fetchData('/categories');
    if (result && result.success && result.data) {
        result.data.forEach(category => {
            const tabButton = document.createElement('button');
            tabButton.className = 'category-tab';
            tabButton.textContent = category.name;
            tabButton.dataset.categorySlug = category.slug;
            tabButton.addEventListener('click', () => {
                currentCategorySlug = category.slug;
                currentPage = 1; // Reset to first page
                loadBlogPosts();
                updateActiveTab(tabButton);
            });
            categoryTabsContainer.appendChild(tabButton);
        });
        // Listener for "All Posts" tab
        const allPostsTab = categoryTabsContainer.querySelector('[data-category-slug="all"]');
        if (allPostsTab) {
            allPostsTab.addEventListener('click', () => {
                currentCategorySlug = 'all';
                currentPage = 1;
                loadBlogPosts();
                updateActiveTab(allPostsTab);
            });
        }
    }
}

function updateActiveTab(activeTab) {
    const tabs = categoryTabsContainer.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (activeTab) {
        activeTab.classList.add('active');
    }
}


async function loadBlogPosts() {
    if (!postsGridContainer || !postsListContainer) return;

    postsGridContainer.innerHTML = '<div class="loading-spinner">Loading articles...</div>';
    postsListContainer.innerHTML = ''; // Clear list container initially or also show loading

    // For grid: page 1, limit 5
    // For list: page 1, limit 6 (or page 2 if grid takes page 1 fully)
    // Let's assume pagination applies to the combined view, or we fetch separately.
    // For simplicity here, let's treat pagination as a single sequence.
    // The brief says "Grid section: Display 5 posts", "List section: Display 6 posts"
    // This sounds like fixed numbers, not paginated together.
    // For now, let's make pagination apply to "All Articles" and filter by category.
    // The fixed 5 grid + 6 list might be for a "featured" section on top, then paginated below.
    // Re-interpreting: the page *shows* a grid of 5 and a list of 6. Pagination then applies to further posts.

    let categoryFilter = '';
    if (currentCategorySlug !== 'all') {
        categoryFilter = `&category_slug=${currentCategorySlug}`;
        document.querySelector('.main-content h2').textContent = `Articles in ${currentCategorySlug.replace(/-/g, ' ')}`;
    } else {
         document.querySelector('.main-content h2').textContent = `All Articles`;
    }

    // Fetch for Grid (first 5)
    const gridResult = await fetchData(`/posts?limit=${postsPerPageGrid}&page=${currentPage}${categoryFilter}&sort=-createdAt`);

    if (gridResult && gridResult.success && gridResult.data.length > 0) {
        postsGridContainer.innerHTML = ''; // Clear loading
        gridResult.data.forEach(post => {
            postsGridContainer.appendChild(createPostCard(post));
        });
    } else {
        postsGridContainer.innerHTML = '<p>No articles found in this section.</p>';
    }

    // Fetch for List (next 6, so effectively page after grid content)
    // This logic needs refinement for proper pagination.
    // Let's simplify: Pagination controls the *start* of the content block.
    // Page 1: Grid shows posts 1-5, List shows posts 6-11 from the query.
    // Page 2: Grid shows posts 12-16, List shows posts 17-22.
    // This means we need to calculate skip based on combined total per page.

    const combinedLimitPerPage = postsPerPageGrid + postsPerPageList; // 11 posts per "page" view
    // We need to fetch postsPerPageGrid for the grid starting at `(currentPage - 1) * combinedLimitPerPage`
    // And postsPerPageList for the list starting after the grid posts.

    // Fetch for Grid
    const gridSkip = (currentPage - 1) * postsPerPageGrid; // This interpretation is simpler: pagination applies to grid, then list shows more.
                                                            // Or, pagination applies to the whole set.
                                                            // Let's use the spec: Grid 5, List 6. Pagination for *more* posts.

    // For now, let's assume the grid always shows the first 5 of the current filter,
    // and the list shows the next 6 of the current filter. Pagination will affect the *set* of posts.

    const listResult = await fetchData(`/posts?limit=${postsPerPageList}&page=${currentPage}&skip=${postsPerPageGrid}${categoryFilter}&sort=-createdAt`);
    // The `skip` parameter is not standard in my backend controller like that.
    // The backend pagination is page + limit.
    // So, if page 1 for grid is `page=1&limit=5`.
    // For list, if it's truly the *next* 6, it would be `page=2&limit=6` (if limit was 5 per page).
    // This is tricky. Let's assume for now the list is just more posts from the same page, or a different set.

    // Simpler: Grid shows from current page. List shows from current page, but with an offset.
    // Or, Grid shows page X, List shows page X+1 (conceptually).
    // The requirements are "Grid section: Display 5 posts", "List section: Display 6 posts". This sounds like fixed content per view.
    // Pagination then loads the *next set* of 5 for grid and 6 for list.

    // Fetch for List (page `currentPage` for the list items, after grid)
    // This assumes the backend can handle `skip` or we fetch more and slice.
    // My backend uses `page` and `limit`.
    // To get items 6-11 for page 1:
    // Option A: Fetch 11 items (page=1, limit=11), use 0-4 for grid, 5-10 for list.
    // Option B: Fetch for grid (page=1, limit=5). Fetch for list (page=1, limit=6, but need a way to say "start after the first 5").
    // The easiest with current backend:
    // Grid: page=currentPage, limit=5
    // List: page=currentPage, limit=6. This will show the *same* first 5 as grid, plus one more. This is not ideal.

    // Let's fetch a larger batch and distribute.
    const totalToFetchForPage = postsPerPageGrid + postsPerPageList; // 11
    const combinedResult = await fetchData(`/posts?limit=${totalToFetchForPage}&page=${currentPage}${categoryFilter}&sort=-createdAt`);

    postsGridContainer.innerHTML = '';
    postsListContainer.innerHTML = '';

    if (combinedResult && combinedResult.success && combinedResult.data.length > 0) {
        const allPostsForPage = combinedResult.data;

        allPostsForPage.slice(0, postsPerPageGrid).forEach(post => {
            postsGridContainer.appendChild(createPostCard(post));
        });

        if (allPostsForPage.length > postsPerPageGrid) {
            allPostsForPage.slice(postsPerPageGrid, totalToFetchForPage).forEach(post => {
                postsListContainer.appendChild(createPostListItem(post));
            });
        } else if (allPostsForPage.length > 0 && allPostsForPage.length <= postsPerPageGrid) {
            // If fewer than 5 posts, grid has them, list is empty for this "page"
            postsListContainer.innerHTML = '<p>No more articles to display in this section.</p>';
        } else {
            postsGridContainer.innerHTML = '<p>No articles found.</p>';
            postsListContainer.innerHTML = '';
        }

        setupPagination(combinedResult.total, combinedLimitPerPage);

    } else {
        postsGridContainer.innerHTML = '<p>No articles found for this selection.</p>';
        postsListContainer.innerHTML = '';
        paginationContainer.innerHTML = ''; // Clear pagination if no results
    }
    if (typeof lazyLoadImages === 'function') lazyLoadImages();
}


function setupPagination(totalItems, itemsPerPage) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = ''; // Clear existing pagination

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return; // No pagination needed for 1 or fewer pages

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.textContent = '« Prev';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadBlogPosts();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Page Number Buttons (simplified: just current and next/prev, not all numbers)
    // For a more complete pagination, you'd loop and create page number buttons.
    // Example: showing up to 5 page numbers around current page.
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <=3) { // Ensure first pages are shown if current is low
        endPage = Math.min(totalPages, 5);
    }
    if (currentPage >= totalPages - 2) { // Ensure last pages are shown if current is high
        startPage = Math.max(1, totalPages - 4);
    }


    if (startPage > 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.addEventListener('click', () => {
            currentPage = 1;
            loadBlogPosts();
        });
        paginationContainer.appendChild(firstButton);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = "0 10px";
            paginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
            pageButton.disabled = true;
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadBlogPosts();
        });
        paginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = "0 10px";
            paginationContainer.appendChild(ellipsis);
        }
        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            loadBlogPosts();
        });
        paginationContainer.appendChild(lastButton);
    }


    // Next Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next »';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadBlogPosts();
        }
    });
    paginationContainer.appendChild(nextButton);
}
