document.addEventListener('DOMContentLoaded', async () => {
    const postSlug = getQueryParam('slug');
    if (!postSlug) {
        displayError('No post specified.');
        return;
    }

    // Set a default title while loading
    document.title = "Loading Post... - College Nexis";

    const result = await fetchData(`/posts/${postSlug}`);

    if (result && result.success && result.data) {
        displayPost(result.data);
        // Sidebar is loaded by main.js, but if it has related posts, it might need post ID/category
        // For now, main.js loads generic sidebar content.
        // A more advanced sidebar might take result.data.category.slug or related tags.
    } else {
        const message = result ? result.message : 'Post not found or error loading.';
        displayError(message);
        document.title = "Post Not Found - College Nexis";
    }
     // Call global meta setter after specific page meta might have been set by displayPost
    if (typeof setGlobalMeta === 'function') {
        // setGlobalMeta();
    }
});

function displayError(message) {
    const contentArea = document.getElementById('post-content-area');
    const postTitleElement = document.getElementById('post-title');
    if (postTitleElement) postTitleElement.textContent = 'Error';
    if (contentArea) {
        contentArea.innerHTML = `<p class="error-message" style="color: red; text-align: center;">${message}</p>`;
    }
    // Hide other elements that expect post data
    const heroBanner = document.getElementById('post-hero-banner');
    if (heroBanner) heroBanner.style.display = 'none';
    const postMeta = document.querySelector('.post-meta');
    if (postMeta) postMeta.style.display = 'none';
}

function displayPost(post) {
    // Set page title and meta description
    document.title = `${post.metaTitle || post.title} - College Nexis`;
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag) {
        metaDescriptionTag = document.createElement('meta');
        metaDescriptionTag.name = "description";
        document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.content = post.metaDescription || post.excerpt || post.content.substring(0, 160);

    // Update hero banner
    const heroBanner = document.getElementById('post-hero-banner');
    if (post.featuredImage && post.featuredImage !== 'no-photo.jpg') {
        heroBanner.style.backgroundImage = `url('${post.featuredImage}')`;
    } else {
        heroBanner.style.backgroundImage = `url('img/default-hero.jpg')`; // Default if no image
        heroBanner.style.backgroundColor = '#333'; // Fallback color
    }

    document.getElementById('post-title').textContent = post.title;
    if (post.subtitle) {
        document.getElementById('post-subtitle').textContent = post.subtitle;
    } else {
        document.getElementById('post-subtitle').style.display = 'none';
    }

    document.getElementById('post-publish-date').textContent = `Published: ${new Date(post.createdAt).toLocaleDateString()}`;
    document.getElementById('post-author').textContent = post.author ? post.author.username : 'College Nexis Team';

    const categoryNameEl = document.getElementById('post-category-name');
    const categoryLinkEl = document.getElementById('post-category-link');
    if (post.category) {
        categoryNameEl.textContent = post.category.name;
        categoryLinkEl.href = `categories.html?category=${post.category.slug}`;
    } else {
        categoryNameEl.textContent = 'Uncategorized';
        categoryLinkEl.href = '#';
    }


    // Sanitize HTML content if it's coming from a rich text editor that might have XSS vectors.
    // For now, assuming content is safe or will be sanitized server-side before saving.
    // If content is Markdown, it should be converted to HTML here or on server.
    // For now, directly injecting HTML:
    document.getElementById('post-content-area').innerHTML = post.content;

    // Update share button links
    const pageUrl = window.location.href;
    const shareText = encodeURIComponent(post.title);
    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`;
    document.getElementById('share-linkedin').href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${shareText}`;

    // Update Schema.org JSON-LD
    const schemaMarkupElement = document.getElementById('post-schema-markup');
    if (schemaMarkupElement) {
        try {
            const schemaData = JSON.parse(schemaMarkupElement.textContent);
            schemaData.headline = post.title;
            schemaData.image = post.featuredImage || `${window.location.origin}/img/default-hero.jpg`;
            schemaData.author.name = post.author ? post.author.username : 'College Nexis Team';
            // Assuming logo URL can be fetched or is static
            // schemaData.publisher.logo.url = `${window.location.origin}/favicon.ico`;
            schemaData.datePublished = new Date(post.createdAt).toISOString().split('T')[0];
            schemaData.dateModified = new Date(post.updatedAt || post.createdAt).toISOString().split('T')[0];
            schemaData.description = post.metaDescription || post.excerpt || post.content.substring(0, 160);

            // Update publisher logo URL if available from settings, otherwise use a default
            fetchData('/settings/public/faviconUrl').then(faviconSetting => { // Assuming favicon is logo
                if (faviconSetting && faviconSetting.success && faviconSetting.data && faviconSetting.data.value) {
                    schemaData.publisher.logo.url = faviconSetting.data.value;
                } else {
                    schemaData.publisher.logo.url = `${window.location.origin}/favicon.ico`; // Fallback
                }
                schemaMarkupElement.textContent = JSON.stringify(schemaData, null, 2);
            }).catch(() => { // Fallback if fetch fails
                 schemaData.publisher.logo.url = `${window.location.origin}/favicon.ico`;
                 schemaMarkupElement.textContent = JSON.stringify(schemaData, null, 2);
            });


        } catch(e) {
            console.error("Error updating schema markup:", e);
        }
    }


    if (typeof lazyLoadImages === 'function') {
        // Call lazyLoadImages specifically for images within the new content
        const contentImages = document.getElementById('post-content-area').querySelectorAll('img');
        contentImages.forEach(img => {
            if(img.getAttribute('src') && !img.getAttribute('data-src')) { // If it has src but not data-src
                img.setAttribute('data-src', img.getAttribute('src')); // Make it lazy-loadable
                img.removeAttribute('src'); // Remove src to let IntersectionObserver handle it
                img.classList.remove('lazyloaded'); // Reset state if it was somehow set
            }
        });
        lazyLoadImages(); // Re-initialize for any new images or modified ones
    }
}

// Sticky share buttons (optional - basic version)
// More advanced sticky would check scroll position against sidebar, etc.
// window.addEventListener('scroll', () => {
//     const shareButtons = document.getElementById('sticky-share');
//     if (!shareButtons) return;
//     const headerHeight = document.querySelector('header')?.offsetHeight || 70;
//     const footer = document.querySelector('footer');
//     const contentTop = shareButtons.parentElement.offsetTop;
//     const contentBottom = footer.offsetTop;

//     if (window.scrollY > contentTop - headerHeight - 20 && window.scrollY < contentBottom - window.innerHeight) {
//         shareButtons.style.position = 'fixed';
//         shareButtons.style.top = `${headerHeight + 20}px`;
//         shareButtons.style.width = `${shareButtons.parentElement.offsetWidth}px`; // Match parent width
//     } else {
//         shareButtons.style.position = 'static';
//     }
// });
