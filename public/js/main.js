const API_BASE_URL = '/api'; // Assuming the backend API is served from the same domain/port

/**
 * Fetches data from the API.
 * @param {string} endpoint - The API endpoint (e.g., '/posts/recent?limit=5').
 * @returns {Promise<Object>} - The JSON response from the API.
 */
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText} for endpoint ${endpoint}`);
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch data and parse error.' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch Error:', error);
        // Potentially display a user-friendly error message on the page
        return null; // Or rethrow error depending on how you want to handle it
    }
}

/**
 * Creates a post card element.
 * @param {Object} post - The post data.
 * @returns {HTMLElement} - The post card element.
 */
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
        <a href="single-post.html?slug=${post.slug}" class="post-card-image-link">
            <div class="post-card-image">
                <img src="${post.featuredImage || 'img/default-post.jpg'}" alt="${post.title}" loading="lazy">
            </div>
        </a>
        <div class="post-card-content">
            ${post.category ? `<a href="categories.html?category=${post.category.slug}" class="post-card-category">${post.category.name}</a>` : ''}
            <h3 class="post-card-title"><a href="single-post.html?slug=${post.slug}">${post.title}</a></h3>
            <p class="post-card-excerpt">${post.excerpt || post.content.substring(0, 100) + '...'}</p>
            <p class="post-card-date">Published: ${new Date(post.createdAt).toLocaleDateString()}</p>
            <div class="post-card-actions">
                <a href="single-post.html?slug=${post.slug}">Read More &rarr;</a>
            </div>
        </div>
    `;
    return card;
}

/**
 * Creates a post list item element.
 * @param {Object} post - The post data.
 * @returns {HTMLElement} - The post list item element.
 */
function createPostListItem(post) {
    const listItem = document.createElement('div');
    listItem.className = 'post-list-item';
    listItem.innerHTML = `
        <div class="post-list-item-thumbnail">
            <a href="single-post.html?slug=${post.slug}">
                <img src="${post.featuredImage || 'img/default-post-thumb.jpg'}" alt="${post.title}" loading="lazy">
            </a>
        </div>
        <div class="post-list-item-content">
            ${post.category ? `<a href="categories.html?category=${post.category.slug}" class="post-card-category">${post.category.name}</a>` : ''}
            <h3 class="post-card-title"><a href="single-post.html?slug=${post.slug}">${post.title}</a></h3>
            <p class="post-card-excerpt">${post.excerpt || post.content.substring(0, 150) + '...'}</p>
            <p class="post-card-date">Published: ${new Date(post.createdAt).toLocaleDateString()}</p>
            <div class="post-card-actions">
                <a href="single-post.html?slug=${post.slug}">Read More &rarr;</a>
            </div>
        </div>
    `;
    return listItem;
}


/**
 * Initializes and controls a generic slider.
 * @param {string} sliderSelector - CSS selector for the slider container.
 * @param {string} slideSelector - CSS selector for individual slides.
 * @param {string} prevButtonSelector - CSS selector for the previous button.
 * @param {string} nextButtonSelector - CSS selector for the next button.
 * @param {number} intervalTime - Time in ms for auto-rotation (0 to disable).
 */
function initializeSlider(sliderSelector, slideSelector, prevButtonSelector, nextButtonSelector, intervalTime = 5000) {
    const slider = document.querySelector(sliderSelector);
    if (!slider) return; // Slider not present on this page

    const slides = slider.querySelectorAll(slideSelector);
    const prevButton = document.querySelector(prevButtonSelector);
    const nextButton = document.querySelector(nextButtonSelector);
    let currentIndex = 0;
    let autoRotateInterval;

    if (slides.length === 0) {
        slider.innerHTML = '<p>No slides to display.</p>';
        if(prevButton) prevButton.style.display = 'none';
        if(nextButton) nextButton.style.display = 'none';
        return;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.display = 'none'; // Ensure only active is block
            if (i === index) {
                slide.classList.add('active');
                slide.style.display = 'block';
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    if (prevButton) prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoRotate();
    });
    if (nextButton) nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoRotate();
    });

    function startAutoRotate() {
        if (intervalTime > 0 && slides.length > 1) {
            autoRotateInterval = setInterval(nextSlide, intervalTime);
        }
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    function resetAutoRotate() {
        stopAutoRotate();
        startAutoRotate();
    }

    // Swipe functionality for mobile
    let touchstartX = 0;
    let touchendX = 0;

    slider.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
        stopAutoRotate(); // Pause rotation during touch
    }, false);

    slider.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
        startAutoRotate(); // Resume rotation after touch
    }, false);

    function handleSwipe() {
        if (slides.length <= 1) return; // No swipe if 1 or 0 slides
        if (touchendX < touchstartX - 50) { // Swiped left
            nextSlide();
        }
        if (touchendX > touchstartX + 50) { // Swiped right
            prevSlide();
        }
    }


    showSlide(currentIndex); // Show initial slide
    startAutoRotate(); // Start auto-rotation
}


/**
 * Loads and displays the hero slider with recent posts.
 * Common for homepage and blog page.
 */
async function loadHeroSlider() {
    const heroSliderElement = document.querySelector('.hero-slider');
    if (!heroSliderElement) return; // Slider not on this page

    heroSliderElement.innerHTML = '<div class="loading-spinner">Loading slides...</div>';
    const result = await fetchData('/posts/recent?limit=5'); // Fetch 5 recent posts

    if (result && result.success && result.data.length > 0) {
        heroSliderElement.innerHTML = ''; // Clear loading
        result.data.forEach(post => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide';
            slide.innerHTML = `
                <img src="${post.featuredImage || 'img/default-hero.jpg'}" alt="${post.title}" loading="lazy">
                <div class="hero-slide-content">
                    ${post.category ? `<span class="post-card-category">${post.category.name}</span>` : ''}
                    <h3><a href="single-post.html?slug=${post.slug}">${post.title}</a></h3>
                    <p>${post.excerpt || post.subtitle || post.content.substring(0, 80) + '...'}</p>
                </div>
            `;
            heroSliderElement.appendChild(slide);
        });
        // Initialize the slider functionality (assuming controls are outside heroSliderElement but associated)
        initializeSlider('.hero-slider', '.hero-slide', '.slider-controls .prev', '.slider-controls .next', 6000);
    } else {
        heroSliderElement.innerHTML = '<p>No recent posts to display in slider.</p>';
        const controls = document.querySelector('.slider-controls');
        if(controls) controls.style.display = 'none';
    }
}

/**
 * Loads sidebar content.
 * @param {string} sidebarId - The ID of the sidebar container element.
 */
async function loadSidebarContent(sidebarId = 'sidebar-content') {
    const sidebarContainer = document.getElementById(sidebarId);
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = '<div class="loading-spinner">Loading sidebar...</div>'; // Loading state
    const result = await fetchData('/widgets/sidebar');

    if (result && result.success && result.data.length > 0) {
        sidebarContainer.innerHTML = ''; // Clear loading
        result.data.forEach(widget => {
            const widgetElement = document.createElement('div');
            widgetElement.className = 'widget';
            let contentHTML = `<h3>${widget.name}</h3>`;

            if (widget.content) {
                switch (widget.type) {
                    case 'latest_posts':
                    case 'popular_posts': // Assuming 'popular_posts' also returns an array of posts
                        contentHTML += '<ul>';
                        widget.content.forEach(post => {
                            contentHTML += `<li><a href="single-post.html?slug=${post.slug}">${post.title}</a></li>`;
                        });
                        contentHTML += '</ul>';
                        break;
                    case 'custom_html':
                        contentHTML += `<div class="custom-html-widget">${widget.content}</div>`;
                        break;
                    case 'ad_slot':
                        // widget.content here is the Ad object
                        if (widget.content.type === 'image' && widget.content.imageUrl) {
                            contentHTML += `<div class="ad-widget">
                                ${widget.content.linkUrl ? `<a href="${widget.content.linkUrl}" target="_blank" rel="noopener noreferrer">` : ''}
                                <img src="${widget.content.imageUrl}" alt="${widget.content.name || 'Advertisement'}" loading="lazy">
                                ${widget.content.linkUrl ? `</a>` : ''}
                            </div>`;
                        } else if (widget.content.type === 'code' && widget.content.adCode) {
                            contentHTML += `<div class="ad-widget">${widget.content.adCode}</div>`;
                        } else {
                             contentHTML += `<div class="ad-widget"><!-- Ad slot available: ${widget.name} --></div>`
                        }
                        break;
                    default:
                        contentHTML += '<p>Widget content not available.</p>';
                }
            } else {
                contentHTML += '<p>No content for this widget.</p>';
            }
            widgetElement.innerHTML = contentHTML;
            sidebarContainer.appendChild(widgetElement);
        });
    } else {
        sidebarContainer.innerHTML = '<p>Sidebar is currently empty.</p>';
    }
}


/**
 * Injects Google Analytics script if ID is available.
 */
async function injectGoogleAnalytics() {
    try {
        const settingResult = await fetchData('/settings/public/googleAnalyticsId');
        if (settingResult && settingResult.success && settingResult.data && settingResult.data.value) {
            const gaID = settingResult.data.value;
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaID}`;
            document.head.appendChild(gaScript);

            const gaInitScript = document.createElement('script');
            gaInitScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaID}');
            `;
            document.head.appendChild(gaInitScript);
        }
    } catch (error) {
        console.warn('Could not load Google Analytics ID:', error);
    }
}

/**
 * Injects Webmaster Tools meta tag if available.
 */
async function injectWebmasterToolsMeta() {
    try {
        const settingResult = await fetchData('/settings/public/webmasterMeta'); // e.g., { key: "webmasterMeta", value: "<meta name='google-site-verification' content='YOUR_CODE_HERE'>" }
        if (settingResult && settingResult.success && settingResult.data && settingResult.data.value) {
            const metaTagString = settingResult.data.value;
            // Create a temporary div to parse the meta tag string
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = metaTagString;
            const metaTag = tempDiv.firstChild;
            if (metaTag && metaTag.tagName === 'META') {
                document.head.appendChild(metaTag);
            }
        }
    } catch (error) {
        console.warn('Could not load Webmaster Tools meta:', error);
    }
}

/**
 * Sets global meta title and description if not already set on the page.
 */
async function setGlobalMeta() {
    try {
        const titlePromise = fetchData('/settings/public/globalTitle');
        const descriptionPromise = fetchData('/settings/public/globalDescription');

        const [titleResult, descriptionResult] = await Promise.all([titlePromise, descriptionPromise]);

        if (titleResult && titleResult.success && titleResult.data && titleResult.data.value) {
            if (!document.title || document.title === "Post Title - College Nexis" || document.title === "College Nexis - Home") { // Avoid overwriting specific page titles
                 // Check if a more specific title is already set by page-specific JS
                const currentTitle = document.querySelector('title');
                if (currentTitle && (currentTitle.textContent === 'Post Title Will Be Here' || currentTitle.dataset.defaultTitle)) {
                    currentTitle.textContent = titleResult.data.value;
                }
            }
        }

        if (descriptionResult && descriptionResult.success && descriptionResult.data && descriptionResult.data.value) {
            let metaDescriptionTag = document.querySelector('meta[name="description"]');
            if (!metaDescriptionTag) {
                metaDescriptionTag = document.createElement('meta');
                metaDescriptionTag.name = "description";
                document.head.appendChild(metaDescriptionTag);
            }
            // Avoid overwriting specific page meta descriptions
            if (!metaDescriptionTag.content || metaDescriptionTag.content === "Post excerpt or beginning of content." || metaDescriptionTag.dataset.defaultDescription) {
                metaDescriptionTag.content = descriptionResult.data.value;
            }
        }
    } catch (error) {
        console.warn('Could not load global meta tags:', error);
    }
}


/**
 * Sets custom footer text if available.
 */
async function setFooterText() {
    try {
        const footerTextElement = document.getElementById('footer-text');
        if (!footerTextElement) return;

        const settingResult = await fetchData('/settings/public/footerText');
        if (settingResult && settingResult.success && settingResult.data && settingResult.data.value) {
            footerTextElement.innerHTML = settingResult.data.value; // Use innerHTML to allow basic HTML in footer text
        }
    } catch (error) {
        console.warn('Could not load custom footer text:', error);
    }
}

/**
 * Sets custom favicon if available.
 */
async function setFavicon() {
    try {
        const settingResult = await fetchData('/settings/public/faviconUrl');
        if (settingResult && settingResult.success && settingResult.data && settingResult.data.value) {
            let faviconTag = document.querySelector('link[rel="icon"]');
            if (faviconTag) {
                faviconTag.href = settingResult.data.value;
            } else {
                faviconTag = document.createElement('link');
                faviconTag.rel = 'icon';
                faviconTag.href = settingResult.data.value;
                // faviconTag.type = 'image/x-icon'; // Or determine type from URL if needed
                document.head.appendChild(faviconTag);
            }
        }
    } catch (error) {
        console.warn('Could not load custom favicon:', error);
    }
}


/**
 * Lazy loads images with data-src attribute.
 */
function lazyLoadImages() {
    const lazyImages = [].slice.call(document.querySelectorAll("img[data-src]"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    // lazyImage.removeAttribute("data-src"); // Optional: remove data-src after loading
                    lazyImage.classList.add("lazyloaded");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add("lazyloaded");
        });
    }
}


// --- Common initializations for all pages ---
document.addEventListener('DOMContentLoaded', () => {
    // Global settings injections
    injectGoogleAnalytics();
    injectWebmasterToolsMeta();
    // setGlobalMeta(); // Call this before page-specific meta setting
    setFooterText();
    setFavicon();

    // Load sidebar content (if a sidebar container exists on the page)
    if (document.getElementById('sidebar-content')) {
        loadSidebarContent('sidebar-content');
    }
    if (document.getElementById('sidebar-content-post')) {
        loadSidebarContent('sidebar-content-post');
    }
    if (document.getElementById('sidebar-content-category')) {
        loadSidebarContent('sidebar-content-category');
    }

    // Initialize lazy loading (call after dynamic content might be added, or re-call)
    // For now, call it once. If content is added dynamically and has new images, call it again.
    lazyLoadImages();

    // Specific initializations based on page (body ID or specific element)
    const bodyId = document.body.id;
    const currentPath = window.location.pathname;

    if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
        loadHeroSlider(); // Homepage hero slider
        loadLatestPostsPreview(); // Homepage latest posts preview
        initializeLogoCarousel(); // Homepage company logo carousel
    }
    // Blog page specific JS is in blog.js
    // Single post page specific JS is in single-post.js
    // Categories page specific JS is in categories.js
    // Contact page specific JS is in contact.js

    // Add a default title and description meta tag if they don't exist, so setGlobalMeta can fill them
    if (!document.querySelector('title')) {
        const titleTag = document.createElement('title');
        titleTag.dataset.defaultTitle = "true"; // Mark as default
        titleTag.textContent = "College Nexis"; // Placeholder
        document.head.appendChild(titleTag);
    }
    if (!document.querySelector('meta[name="description"]')) {
        const metaDescTag = document.createElement('meta');
        metaDescTag.name = "description";
        metaDescTag.dataset.defaultDescription = "true"; // Mark as default
        metaDescTag.content = "Your guide to colleges and careers."; // Placeholder
        document.head.appendChild(metaDescTag);
    }
    setGlobalMeta(); // Call this after ensuring tags exist, before page-specific meta setting
});


// --- Homepage Specific Functions (Example) ---
async function loadLatestPostsPreview() {
    const previewGrid = document.getElementById('latest-posts-preview-grid');
    if (!previewGrid) return;

    previewGrid.innerHTML = '<div class="loading-spinner">Loading posts...</div>';
    const result = await fetchData('/posts?limit=3&sort=-createdAt'); // Fetch 3 newest posts
    if (result && result.success && result.data.length > 0) {
        previewGrid.innerHTML = '';
        result.data.forEach(post => {
            previewGrid.appendChild(createPostCard(post));
        });
        lazyLoadImages(); // Re-run for newly added images
    } else {
        previewGrid.innerHTML = '<p>No posts to display yet.</p>';
    }
}

function initializeLogoCarousel() {
    const carousel = document.getElementById('logo-carousel');
    if (!carousel) return;

    const logos = Array.from(carousel.children);
    if (logos.length === 0) return;

    // Duplicate logos for seamless looping
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        carousel.appendChild(clone);
    });

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Adjust speed: lower is slower

    function animateCarousel() {
        scrollAmount -= scrollSpeed;
        // If the first half of logos has scrolled out of view, reset scrollAmount
        // This assumes all original logos have roughly the same width.
        // A more robust way would be to calculate the width of the first set of logos.
        const firstSetWidth = carousel.scrollWidth / 2;
        if (Math.abs(scrollAmount) >= firstSetWidth) {
            scrollAmount = 0;
        }
        carousel.style.transform = `translateX(${scrollAmount}px)`;
        requestAnimationFrame(animateCarousel);
    }

// This function will fetch logos and then start the animation
async function initializeLogoCarousel() {
    const carousel = document.getElementById('logo-carousel');
    if (!carousel) return;

    // ***** IMPORTANT API KEY INSTRUCTION *****
    // For your local testing, you can set this in your browser's developer console:
    //   window.BRANDFETCH_API_KEY = "1id3jIHfKCPaRF59DUN";
    // OR, for a quick test, replace BRANDFETCH_API_KEY_PLACEHOLDER below with your key,
    // BUT REMEMBER TO REMOVE IT OR CHANGE IT BACK BEFORE COMMITTING/PUSHING CODE.
    const apiKey = window.BRANDFETCH_API_KEY || "BRANDFETCH_API_KEY_PLACEHOLDER"; // Use placeholder if not set globally

    if (apiKey === "BRANDFETCH_API_KEY_PLACEHOLDER") {
        console.warn("Brandfetch API key not set. Using static placeholder images for logo carousel. Set window.BRANDFETCH_API_KEY to your key for dynamic logos.");
        // If API key is not set, the static placeholders in HTML will be used.
        // We still need to start their animation if they exist.
        if (carousel.children.length > 0) {
            startLogoCarouselAnimation(carousel, Array.from(carousel.children).length);
        }
        return;
    }

    const companyNames = ["Google", "Microsoft", "Amazon", "Infosys", "Wipro", "Accenture"];
    carousel.innerHTML = '<div class="loading-spinner" style="width:100%; text-align:center;">Loading logos...</div>'; // Clear static placeholders & show loading

    const logoPromises = companyNames.map(async (name) => {
        try {
            // Using the API key as a query parameter 'c' as per user's cURL example.
            const apiUrl = `https://api.brandfetch.io/v2/search/${encodeURIComponent(name)}?c=${apiKey}`;
            const apiResponse = await fetch(apiUrl);

            if (!apiResponse.ok) {
                console.warn(`Brandfetch API error for ${name}: ${apiResponse.status} ${apiResponse.statusText}. URL: ${apiUrl}`);
                return { name, src: `https://via.placeholder.com/150x60.png?text=${name.replace(/\s+/g, '+')}+Not+Found`, alt: `${name} Logo (Not Found)` };
            }

            const data = await apiResponse.json();
            let logoUrl = null;
            const brandInfo = Array.isArray(data) ? data[0] : data;

            if (brandInfo) {
                if (brandInfo.logos && brandInfo.logos.length > 0) {
                    const logoObject = brandInfo.logos.find(l => l.type === 'logo');
                    if (logoObject && logoObject.formats && logoObject.formats.length > 0) {
                        const svgLogo = logoObject.formats.find(f => f.format === 'svg' && f.src);
                        const pngLogo = logoObject.formats.find(f => f.format === 'png' && f.src);
                        logoUrl = svgLogo ? svgLogo.src : (pngLogo ? pngLogo.src : null);
                    }
                    if (!logoUrl && brandInfo.logos[0].formats && brandInfo.logos[0].formats.length > 0) {
                         logoUrl = brandInfo.logos[0].formats[0].src;
                    }
                }
                if (!logoUrl && brandInfo.icon) {
                    logoUrl = brandInfo.icon;
                } else if (!logoUrl && brandInfo.icons && brandInfo.icons.length > 0) {
                     const svgIcon = brandInfo.icons.find(i => i.type === 'svg' && i.src);
                     const pngIcon = brandInfo.icons.find(i => i.type === 'png' && i.src);
                     logoUrl = svgIcon ? svgIcon.src : (pngIcon ? pngIcon.src : null);
                     if(!logoUrl && brandInfo.icons[0].src) logoUrl = brandInfo.icons[0].src;
                }
            }

            if (logoUrl) {
                return { name, src: logoUrl, alt: `${name} Logo` };
            } else {
                console.warn(`Logo URL not found in Brandfetch response for ${name}.`);
                return { name, src: `https://via.placeholder.com/150x60.png?text=${name.replace(/\s+/g, '+')}+Logo`, alt: `${name} Logo (Placeholder)` };
            }
        } catch (error) {
            console.error(`Error fetching logo for ${name}:`, error);
            return { name, src: `https://via.placeholder.com/150x60.png?text=${name.replace(/\s+/g, '+')}+Error`, alt: `${name} Logo (Error)` };
        }
    });

    const loadedLogos = await Promise.all(logoPromises);
    carousel.innerHTML = ''; // Clear loading message

    loadedLogos.forEach(logoData => {
        const img = document.createElement('img');
        img.src = logoData.src;
        img.alt = logoData.alt;
        carousel.appendChild(img);
    });

    if (carousel.children.length > 0) {
        startLogoCarouselAnimation(carousel, companyNames.length); // Pass original number of logos
    } else {
        carousel.innerHTML = "<p>Could not load company logos.</p>";
    }
}

// Renamed and adjusted animation function
function startLogoCarouselAnimation(carouselElement, originalLogoCount) {
    if (!carouselElement || !carouselElement.children || carouselElement.children.length === 0) return;

    // Only duplicate if the number of children is equal to originalLogoCount (meaning not yet duplicated)
    if (carouselElement.children.length === originalLogoCount) {
        const originalLogos = Array.from(carouselElement.children);
        originalLogos.forEach(logo => {
            const clone = logo.cloneNode(true);
            carouselElement.appendChild(clone);
        });
    }

    let scrollAmount = 0;
    const scrollSpeed = 0.5;
    let animationFrameId;

    function animate() {
        scrollAmount -= scrollSpeed;
        // Calculate width based on the first half of children (original set)
        const firstSetWidth = carouselElement.scrollWidth / 2;
        if (firstSetWidth > 0 && Math.abs(scrollAmount) >= firstSetWidth) {
            scrollAmount = 0;
        }
        carouselElement.style.transform = `translateX(${scrollAmount}px)`;
        animationFrameId = requestAnimationFrame(animate);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = () => {
        if (!mediaQuery || !mediaQuery.matches) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(animate);
        }
    };
    const stop = () => cancelAnimationFrame(animationFrameId);

    const container = carouselElement.parentElement;
    if (container) {
        container.removeEventListener('mouseenter', stop);
        container.removeEventListener('mouseleave', start);
        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);
    }
    start();
}

// Helper function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Make some functions globally accessible if needed by other specific JS files
window.fetchData = fetchData;
window.createPostCard = createPostCard;
window.createPostListItem = createPostListItem;
window.loadSidebarContent = loadSidebarContent;
window.loadHeroSlider = loadHeroSlider; // For blog.js to use
window.initializeSlider = initializeSlider; // For blog.js to use
window.getQueryParam = getQueryParam;
window.lazyLoadImages = lazyLoadImages;
window.API_BASE_URL = API_BASE_URL;
window.setGlobalMeta = setGlobalMeta; // Allow page-specific scripts to call this after setting their own title/desc
