document.addEventListener('DOMContentLoaded', () => {
    loadCategoriesForTabsOnCategoryPage();
    // Initial load based on URL parameter or first category
    const initialCategorySlug = getQueryParam('category') || 'all';
    // Note: 'all' is not a real category slug, adjust if needed or default to first actual category

    // Sidebar is loaded by main.js
    // Call global meta setter after specific page meta might have been set
    if (typeof setGlobalMeta === 'function') {
        // setGlobalMeta(); // This will be called by main.js, ensure order if this page sets specific title/desc
    }
});

const categoryPagePostsGridContainer = document.getElementById('category-posts-grid');
const categoryPagePostsListContainer = document.getElementById('category-posts-list');
const categoryPageTabsContainer = document.getElementById('category-page-tabs');
const categoryPagePaginationContainer = document.getElementById('category-pagination-controls');
const categoryPageTitleElement = document.getElementById('category-page-title');


let currentCategoryPage = 1;
const postsPerPageCategoryGrid = 5;
const postsPerPageCategoryList = 6;
let currentSelectedCategorySlug = null;

async function loadCategoriesForTabsOnCategoryPage() {
    if (!categoryPageTabsContainer) return;

    const result = await fetchData('/categories');
    if (result && result.success && result.data && result.data.length > 0) {
        // Add "All Categories" tab if desired, or just list actual categories
        // For this page, it's more about selecting ONE category.
        // Maybe the "Categories" nav link itself serves as "show all categories overview".
        // And this page /categories.html?category=slug shows a specific one.
        // Let's assume tabs here are for quickly switching active category.

        result.data.forEach(category => {
            const tabButton = document.createElement('button');
            tabButton.className = 'category-tab'; // Re-use blog.css style
            tabButton.textContent = category.name;
            tabButton.dataset.categorySlug = category.slug;
            tabButton.addEventListener('click', () => {
                currentSelectedCategorySlug = category.slug;
                currentCategoryPage = 1; // Reset to first page
                loadPostsForCategory();
                updateActiveCategoryTab(tabButton);
                // Update URL without reloading page (optional)
                history.pushState(null, '', `categories.html?category=${category.slug}`);
            });
            categoryPageTabsContainer.appendChild(tabButton);
        });

        // Determine initial category to load
        const initialSlugFromUrl = getQueryParam('category');
        if (initialSlugFromUrl) {
            currentSelectedCategorySlug = initialSlugFromUrl;
            const activeTab = categoryPageTabsContainer.querySelector(`.category-tab[data-category-slug="${initialSlugFromUrl}"]`);
            if (activeTab) updateActiveCategoryTab(activeTab);
        } else if (result.data.length > 0) {
            // Default to the first category if none in URL
            currentSelectedCategorySlug = result.data[0].slug;
            updateActiveCategoryTab(categoryPageTabsContainer.querySelector('.category-tab'));
             history.replaceState(null, '', `categories.html?category=${currentSelectedCategorySlug}`);
        }

        if (currentSelectedCategorySlug) {
            loadPostsForCategory();
        } else {
            if(categoryPageTitleElement) categoryPageTitleElement.textContent = "No Categories Found";
            if(categoryPagePostsGridContainer) categoryPagePostsGridContainer.innerHTML = "<p>Please select a category.</p>";
        }

    } else {
        if(categoryPageTitleElement) categoryPageTitleElement.textContent = "No Categories Available";
        if(categoryPageTabsContainer) categoryPageTabsContainer.innerHTML = "<p>No categories found.</p>";
    }
}

function updateActiveCategoryTab(activeTab) {
    const tabs = categoryPageTabsContainer.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (activeTab) {
        activeTab.classList.add('active');
        if (categoryPageTitleElement) {
            const categoryName = activeTab.textContent;
            document.title = `${categoryName} - Categories - College Nexis`;
            categoryPageTitleElement.textContent = `Articles in ${categoryName}`;

            let metaDescriptionTag = document.querySelector('meta[name="description"]');
            if (!metaDescriptionTag) {
                metaDescriptionTag = document.createElement('meta');
                metaDescriptionTag.name = "description";
                document.head.appendChild(metaDescriptionTag);
            }
            metaDescriptionTag.content = `Browse articles in the ${categoryName} category on College Nexis.`;
        }
    }
}

async function loadPostsForCategory() {
    if (!currentSelectedCategorySlug) {
        if(categoryPagePostsGridContainer) categoryPagePostsGridContainer.innerHTML = "<p>Select a category to see posts.</p>";
        if(categoryPagePostsListContainer) categoryPagePostsListContainer.innerHTML = "";
        if(categoryPagePaginationContainer) categoryPagePaginationContainer.innerHTML = "";
        return;
    }

    if (!categoryPagePostsGridContainer || !categoryPagePostsListContainer) return;

    categoryPagePostsGridContainer.innerHTML = '<div class="loading-spinner">Loading articles...</div>';
    categoryPagePostsListContainer.innerHTML = ''; // Clear list

    const combinedLimitPerPage = postsPerPageCategoryGrid + postsPerPageCategoryList;
    const categoryFilter = `&category_slug=${currentSelectedCategorySlug}`;

    const result = await fetchData(`/posts?limit=${combinedLimitPerPage}&page=${currentCategoryPage}${categoryFilter}&sort=-createdAt`);

    categoryPagePostsGridContainer.innerHTML = ''; // Clear loading
    categoryPagePostsListContainer.innerHTML = '';

    if (result && result.success && result.data.length > 0) {
        const allPostsForPage = result.data;

        allPostsForPage.slice(0, postsPerPageCategoryGrid).forEach(post => {
            categoryPagePostsGridContainer.appendChild(createPostCard(post));
        });

        if (allPostsForPage.length > postsPerPageCategoryGrid) {
            allPostsForPage.slice(postsPerPageCategoryGrid, combinedLimitPerPage).forEach(post => {
                categoryPagePostsListContainer.appendChild(createPostListItem(post));
            });
        } else if (allPostsForPage.length > 0 && allPostsForPage.length <= postsPerPageCategoryGrid) {
            categoryPagePostsListContainer.innerHTML = '<p>No more articles to display in this section for this category.</p>';
        } else { // Should not happen if length > 0
             categoryPagePostsGridContainer.innerHTML = `<p>No articles found in category: ${currentSelectedCategorySlug}.</p>`;
        }

        setupCategoryPagination(result.total, combinedLimitPerPage);

    } else {
        categoryPagePostsGridContainer.innerHTML = `<p>No articles found in category: ${currentSelectedCategorySlug.replace(/-/g, ' ')}.</p>`;
        categoryPagePostsListContainer.innerHTML = '';
        if(categoryPagePaginationContainer) categoryPagePaginationContainer.innerHTML = ''; // Clear pagination
    }
     if (typeof lazyLoadImages === 'function') lazyLoadImages();
}


function setupCategoryPagination(totalItems, itemsPerPage) {
    if (!categoryPagePaginationContainer) return;
    categoryPagePaginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return;

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.textContent = '« Prev';
    prevButton.disabled = currentCategoryPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentCategoryPage > 1) {
            currentCategoryPage--;
            loadPostsForCategory();
        }
    });
    categoryPagePaginationContainer.appendChild(prevButton);

    // Page Number Buttons (Simplified as in blog.js)
    let startPage = Math.max(1, currentCategoryPage - 2);
    let endPage = Math.min(totalPages, currentCategoryPage + 2);
    if (currentCategoryPage <=3) endPage = Math.min(totalPages, 5);
    if (currentCategoryPage >= totalPages - 2) startPage = Math.max(1, totalPages - 4);

    if (startPage > 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.addEventListener('click', () => { currentCategoryPage = 1; loadPostsForCategory(); });
        categoryPagePaginationContainer.appendChild(firstButton);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = "0 10px";
            categoryPagePaginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentCategoryPage) {
            pageButton.classList.add('active');
            pageButton.disabled = true;
        }
        pageButton.addEventListener('click', () => { currentCategoryPage = i; loadPostsForCategory(); });
        categoryPagePaginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {
         if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = "0 10px";
            categoryPagePaginationContainer.appendChild(ellipsis);
        }
        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => { currentCategoryPage = totalPages; loadPostsForCategory(); });
        categoryPagePaginationContainer.appendChild(lastButton);
    }

    // Next Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next »';
    nextButton.disabled = currentCategoryPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentCategoryPage < totalPages) {
            currentCategoryPage++;
            loadPostsForCategory();
        }
    });
    categoryPagePaginationContainer.appendChild(nextButton);
}

// Listen for URL changes if user uses browser back/forward for category navigation
window.addEventListener('popstate', () => {
    const slugFromUrl = getQueryParam('category');
    if (slugFromUrl && slugFromUrl !== currentSelectedCategorySlug) {
        currentSelectedCategorySlug = slugFromUrl;
        currentCategoryPage = 1; // Reset page
        loadPostsForCategory();
        const activeTab = categoryPageTabsContainer.querySelector(`.category-tab[data-category-slug="${slugFromUrl}"]`);
        if (activeTab) updateActiveCategoryTab(activeTab);
    } else if (!slugFromUrl && currentSelectedCategorySlug) { // Navigated away from a category URL to plain categories.html
        // Decide behavior: show first category, or a "select category" message
        // For now, re-trigger load which will pick first if no slug.
        if (categoryPageTabsContainer && categoryPageTabsContainer.firstChild) {
             const firstCatSlug = categoryPageTabsContainer.querySelector('.category-tab')?.dataset.categorySlug;
             if (firstCatSlug) {
                currentSelectedCategorySlug = firstCatSlug;
                currentCategoryPage = 1;
                loadPostsForCategory();
                updateActiveCategoryTab(categoryPageTabsContainer.querySelector('.category-tab'));
             }
        }
    }
});
