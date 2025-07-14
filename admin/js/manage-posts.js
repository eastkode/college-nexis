document.addEventListener('DOMContentLoaded', () => {
    // Auth check is handled by auth.js
    const postsTableBody = document.getElementById('posts-table-body');
    const postFormSection = document.getElementById('post-form-section');
    const postsListSection = document.getElementById('posts-list-section');
    const addNewPostBtn = document.getElementById('add-new-post-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const postForm = document.getElementById('post-form');
    const formTitle = document.getElementById('form-title');
    const postIdInput = document.getElementById('post-id');
    const categorySelect = document.getElementById('post-category');
    const searchPostsInput = document.getElementById('search-posts');
    const paginationContainer = document.getElementById('posts-pagination');

    let currentPage = 1;
    const postsPerPage = 10; // Or make this configurable
    let currentSearchTerm = '';

    function showForm(post = null) {
        formTitle.textContent = post ? 'Edit Post' : 'Add New Post';
        postIdInput.value = post ? post._id : '';

        // Reset form fields
        postForm.reset(); // Clears most fields
        document.getElementById('post-title').value = post ? post.title : '';
        document.getElementById('post-subtitle').value = post ? post.subtitle || '' : '';
        document.getElementById('post-content').value = post ? post.content : ''; // Consider using a rich text editor here
        document.getElementById('post-excerpt').value = post ? post.excerpt || '' : '';
        document.getElementById('post-featured-image').value = post ? post.featuredImage || '' : '';
        document.getElementById('post-meta-title').value = post ? post.metaTitle || '' : '';
        document.getElementById('post-meta-description').value = post ? post.metaDescription || '' : '';

        if (post && post.category) {
            // If category is an object with _id, use that. If it's just an ID string, use that.
            categorySelect.value = typeof post.category === 'object' ? post.category._id : post.category;
        } else {
            categorySelect.value = ''; // Reset category
        }

        postFormSection.style.display = 'block';
        postsListSection.style.display = 'none';
        if (paginationContainer) paginationContainer.style.display = 'none';
    }

    function hideForm() {
        postFormSection.style.display = 'none';
        postsListSection.style.display = 'block';
        if (paginationContainer) paginationContainer.style.display = 'block';
        loadPosts(); // Refresh list after closing form
    }

    async function loadCategoriesForSelect() {
        try {
            const result = await adminApiRequest('/categories');
            if (result.success && result.data) {
                categorySelect.innerHTML = '<option value="">-- Select Category --</option>'; // Default option
                result.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            } else {
                console.error('Failed to load categories for select:', result.message);
                categorySelect.innerHTML = '<option value="">Error loading categories</option>';
            }
        } catch (error) {
            console.error('Error in loadCategoriesForSelect:', error);
            categorySelect.innerHTML = '<option value="">Error loading categories</option>';
        }
    }

    async function loadPosts() {
        if (!postsTableBody) return;
        postsTableBody.innerHTML = '<tr><td colspan="5">Loading posts...</td></tr>';

        let query = `?page=${currentPage}&limit=${postsPerPage}&sort=-createdAt`;
        if (currentSearchTerm) {
            query += `&title[regex]=${encodeURIComponent(currentSearchTerm)}&title[options]=i`; // Basic title search
        }

        try {
            const result = await adminApiRequest(`/posts${query}`);
            if (result.success && result.data) {
                postsTableBody.innerHTML = ''; // Clear loading/previous
                if (result.data.length === 0) {
                    postsTableBody.innerHTML = '<tr><td colspan="5">No posts found.</td></tr>';
                }
                result.data.forEach(post => {
                    const row = postsTableBody.insertRow();
                    row.innerHTML = `
                        <td>${post.title}</td>
                        <td>${post.category ? post.category.name : 'N/A'}</td>
                        <td>${new Date(post.createdAt).toLocaleDateString()}</td>
                        <td>Published</td> <!-- Placeholder for status -->
                        <td>
                            <button class="btn btn-sm btn-primary edit-post-btn" data-id="${post._id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-post-btn" data-id="${post._id}">Delete</button>
                        </td>
                    `;
                });
                setupPagination(result.total, postsPerPage, paginationContainer, loadPosts);
            } else {
                postsTableBody.innerHTML = `<tr><td colspan="5">Error loading posts: ${result.message || 'Unknown error'}</td></tr>`;
            }
        } catch (error) {
            console.error('Failed to load posts:', error);
            postsTableBody.innerHTML = `<tr><td colspan="5">Error loading posts: ${error.message || 'Network error'}</td></tr>`;
        }
    }

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(postForm);
        const postData = Object.fromEntries(formData.entries());

        // Ensure category is sent as an ID
        if (!postData.category) {
            alert('Please select a category.');
            return;
        }
        // Convert empty strings for optional fields to undefined or handle on backend
        if (postData.subtitle === '') delete postData.subtitle;
        if (postData.excerpt === '') delete postData.excerpt;
        if (postData.featuredImage === '') delete postData.featuredImage;
        if (postData.metaTitle === '') delete postData.metaTitle;
        if (postData.metaDescription === '') delete postData.metaDescription;


        const id = postIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `/posts/${id}` : '/posts';

        try {
            const result = await adminApiRequest(endpoint, method, postData);
            if (result.success) {
                alert(`Post ${id ? 'updated' : 'created'} successfully!`);
                hideForm();
            } else {
                alert(`Error: ${result.message || 'Failed to save post.'}`);
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert(`Error: ${error.message || 'An unexpected error occurred.'}`);
        }
    });

    postsTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-post-btn')) {
            const id = e.target.dataset.id;
            try {
                const result = await adminApiRequest(`/posts/${id}`); // Fetch by ID, not slug, for admin
                if (result.success && result.data) {
                    showForm(result.data);
                } else {
                    alert(`Error: ${result.message || 'Could not fetch post details.'}`);
                }
            } catch (error) {
                console.error('Error fetching post for edit:', error);
                alert(`Error: ${error.message || 'Could not fetch post details.'}`);
            }
        } else if (e.target.classList.contains('delete-post-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this post?')) {
                try {
                    const result = await adminApiRequest(`/posts/${id}`, 'DELETE');
                    if (result.success) {
                        alert('Post deleted successfully!');
                        loadPosts(); // Refresh list
                    } else {
                        alert(`Error: ${result.message || 'Failed to delete post.'}`);
                    }
                } catch (error) {
                    console.error('Error deleting post:', error);
                    alert(`Error: ${error.message || 'An unexpected error occurred.'}`);
                }
            }
        }
    });

    searchPostsInput.addEventListener('input', () => {
        // Debounce search
        clearTimeout(searchPostsInput.searchTimeout);
        searchPostsInput.searchTimeout = setTimeout(() => {
            currentSearchTerm = searchPostsInput.value.trim();
            currentPage = 1; // Reset to first page for new search
            loadPosts();
        }, 500); // 500ms delay
    });


    if (addNewPostBtn) addNewPostBtn.addEventListener('click', () => showForm(null));
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', hideForm);

    // --- Image Search Modal Logic ---
    const findImageBtn = document.getElementById('find-image-btn');
    const imageModal = document.getElementById('image-search-modal');
    const closeModalBtn = imageModal.querySelector('.modal-close');
    const imageSearchResultsContainer = document.getElementById('image-search-results');
    const imageSearchQuerySpan = document.getElementById('image-search-query');
    const featuredImageInput = document.getElementById('post-featured-image');
    const postTitleInput = document.getElementById('post-title');

    if (findImageBtn) {
        findImageBtn.addEventListener('click', async () => {
            const query = postTitleInput.value.trim();
            if (!query) {
                alert('Please enter a post title to search for relevant images.');
                return;
            }
            imageSearchQuerySpan.textContent = query;
            imageSearchResultsContainer.innerHTML = '<p>Searching for images...</p>';
            imageModal.style.display = 'flex';

            try {
                const result = await adminApiRequest(`/images/search?q=${encodeURIComponent(query)}`);
                if (result.success && result.data.length > 0) {
                    imageSearchResultsContainer.innerHTML = '';
                    result.data.forEach(image => {
                        const imgElement = document.createElement('img');
                        imgElement.src = image.previewURL;
                        imgElement.dataset.largeUrl = image.webformatURL; // Use webformatURL for better quality
                        imgElement.alt = image.tags;
                        imgElement.title = image.tags;
                        imgElement.addEventListener('click', () => {
                            featuredImageInput.value = imgElement.dataset.largeUrl;
                            imageModal.style.display = 'none';
                        });
                        imageSearchResultsContainer.appendChild(imgElement);
                    });
                } else {
                    imageSearchResultsContainer.innerHTML = '<p>No images found for this query. Try a different title or enter a URL manually.</p>';
                }
            } catch (error) {
                console.error("Image search error:", error);
                imageSearchResultsContainer.innerHTML = `<p>Error searching for images: ${error.message}</p>`;
            }
        });
    }

    if(closeModalBtn) closeModalBtn.addEventListener('click', () => imageModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == imageModal) {
            imageModal.style.display = 'none';
        }
    });

    // Initial load
    loadCategoriesForSelect();
    loadPosts();

    // Check for query params like ?action=add to open form directly
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add') {
        showForm(null);
    }
});


// Generic pagination setup function (can be moved to a utility file)
function setupPagination(totalItems, itemsPerPage, paginationElement, loadFunction) {
    if (!paginationElement) return;
    paginationElement.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let currentPageNum = 1;

    if (totalPages <= 1) return;

    const createPageButton = (page, text, isDisabled = false, isActive = false) => {
        const button = document.createElement('button');
        button.textContent = text || page;
        button.disabled = isDisabled;
        if (isActive) button.classList.add('active');
        button.addEventListener('click', () => {
            if (typeof window.managePostsCurrentPage !== 'undefined') {
                window.managePostsCurrentPage = page;
            } else {
                 if (page === 'prev') {
                    if (currentPage > 1) currentPage--;
                 } else if (page === 'next') {
                    if (currentPage < totalPages) currentPage++;
                 } else {
                    currentPage = page;
                 }
                 loadFunction();
            }
        });
        return button;
    };

    paginationElement.appendChild(createPageButton('prev', '« Prev', currentPage === 1));

    const pageRange = 2;
    let start = Math.max(1, currentPage - pageRange);
    let end = Math.min(totalPages, currentPage + pageRange);

    if (currentPage <= pageRange + 1) end = Math.min(totalPages, (pageRange * 2) + 1);
    if (currentPage >= totalPages - pageRange) start = Math.max(1, totalPages - (pageRange * 2));


    if (start > 1) {
        paginationElement.appendChild(createPageButton(1, '1'));
        if (start > 2) paginationElement.appendChild(document.createTextNode('...'));
    }

    for (let i = start; i <= end; i++) {
        paginationElement.appendChild(createPageButton(i, i, false, i === currentPage));
    }

    if (end < totalPages) {
        if (end < totalPages - 1) paginationElement.appendChild(document.createTextNode('...'));
        paginationElement.appendChild(createPageButton(totalPages, totalPages));
    }

    paginationElement.appendChild(createPageButton('next', 'Next »', currentPage === totalPages));
}
