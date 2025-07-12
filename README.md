# College Nexis - Online Magazine/Blog Platform

College Nexis is a modern, fully custom online magazine/blog platform designed for students. It covers topics like colleges, courses, exams, and careers, serving as a dynamic, professional, and easy-to-update education portal.

## Features

*   **Dynamic Frontend:** Built with HTML5, CSS3, and vanilla JavaScript. Content is dynamically fetched from the backend API.
*   **Robust Backend:** Node.js with Express.js framework and MongoDB (via Atlas) for data storage.
*   **Admin Panel:** Secure and user-friendly interface for managing posts, categories, sidebar widgets, advertisements, and site-wide settings.
*   **SEO Optimized:** Auto-generated slugs, meta tags, dynamic `sitemap.xml` and `robots.txt`, Schema.org markup.
*   **Customizable:** Manage sidebar content, ad slots, and global site settings like Google Analytics ID, footer text, etc.
*   **Responsive Design:** Ensures a good viewing experience across devices.
*   **No Bloated Frameworks:** Frontend and Admin Panel use vanilla JS for speed and simplicity.
*   **Enhanced Homepage:** Includes sections for "Courses to Pursue" (with Font Awesome icons), "Companies Hiring (Logo Carousel with Brandfetch API integration)," and "Trending Jobs."

## Tech Stack

*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Font Awesome
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (MongoDB Atlas recommended)
*   **Authentication:** JWT (JSON Web Tokens) for Admin Panel
*   **Key npm Packages:**
    *   `express`: Web framework
    *   `mongoose`: MongoDB ODM
    *   `jsonwebtoken`: For JWT generation and verification
    *   `bcryptjs`: For password hashing
    *   `dotenv`: For environment variables
    *   `cors`: For enabling Cross-Origin Resource Sharing
    *   `slugify`: For generating URL-friendly slugs
    *   `xmlbuilder2`: For generating sitemap.xml
*   **External Services/APIs (Optional but Recommended for Full Experience):**
    *   **Brandfetch API:** Used for dynamically fetching company logos on the homepage. Requires an API key.

## Project Structure

```
.
├── admin/                # Admin Panel static files (HTML, CSS, JS)
│   ├── css/
│   ├── js/
│   └── *.html            # Admin pages
├── public/               # Frontend static files (HTML, CSS, JS, images)
│   ├── css/
│   ├── js/
│   ├── img/              # Placeholder for images
│   └── *.html            # Frontend pages
├── server/               # Backend Node.js/Express application
│   ├── config/           # Database configuration (db.js)
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware (auth, asyncHandler, etc.)
│   ├── models/           # Mongoose schemas
│   └── routes/           # API route definitions
│   └── server.js         # Main Express server setup
├── views/                # EJS templates (if used, currently static HTML)
├── .env                  # Environment variables (MONGO_URI, JWT_SECRET, PORT) - IMPORTANT: Add to .gitignore
├── .gitignore            # Specifies intentionally untracked files
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## Setup and Installation

### Prerequisites

*   Node.js (v14.x or later recommended)
*   npm (usually comes with Node.js)
*   MongoDB Atlas account (or a local MongoDB instance)
*   (Optional) Brandfetch API Key for dynamic company logos.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd college-nexis
```

### 2. Install Dependencies

Install both backend and development dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project. Use the following template:

```env
# .env

# MongoDB Connection String
MONGO_URI="mongodb+srv://manasranjanbisi:Jcwon6sqhndTYujK@collegenexis.x3juesn.mongodb.net/?retryWrites=true&w=majority&appName=CollegeNexis"

# JWT Secret Key for Admin Authentication
JWT_SECRET="8bc2a1e182edb445cbfd064f8f702707" # Change if needed for your own deployment

# Port for the backend server
PORT=3000

# Optional: JWT Token Expiry (e.g., 30d, 1h, 7d)
# JWT_EXPIRE="30d"

# Optional: Cookie Expiry for JWT (in days)
# JWT_COOKIE_EXPIRE_DAYS=30

# Node Environment (development or production)
NODE_ENV=development
```

**Important:**
*   Ensure the `MONGO_URI` is correct for your database.
*   If you change `JWT_SECRET`, ensure it's a strong, unique string.
*   Ensure the `.env` file is added to your `.gitignore` file to prevent committing sensitive information.

### 4. Configure Brandfetch API Key (Optional, for Company Logos)

The homepage's "Companies Hiring" section can dynamically fetch company logos using the Brandfetch API.
To enable this:
1.  Obtain an API key from [Brandfetch](https://brandfetch.com/). The free tier is usually sufficient for development.
2.  Open the file `public/js/main.js`.
3.  Locate the `initializeLogoCarousel` function. Inside it, you'll find a line like:
    `const apiKey = window.BRANDFETCH_API_KEY || "BRANDFETCH_API_KEY_PLACEHOLDER";`
4.  **For local testing, you have two options:**
    *   **Option A (Recommended for quick test):** Temporarily replace `"BRANDFETCH_API_KEY_PLACEHOLDER"` with your actual Brandfetch API key string. **Remember to remove or revert this before committing your code.**
        ```javascript
        // Example:
        const apiKey = window.BRANDFETCH_API_KEY || "YOUR_ACTUAL_BRANDFETCH_KEY_HERE";
        ```
    *   **Option B (Slightly cleaner for local dev):** Before the page loads `main.js` (e.g., in your browser's developer console, or in a script tag before `main.js` in `index.html` for testing only), set the global variable:
        ```javascript
        window.BRANDFETCH_API_KEY = "YOUR_ACTUAL_BRANDFETCH_KEY_HERE";
        ```
If the API key is not provided or is invalid, the section will show placeholder images or a message. **Never commit your API key directly into the repository.** For production, this API call should be proxied through your backend.

### 5. Running the Application

*   **Development Mode (with Nodemon for auto-restarts):**
    ```bash
    npm run dev
    ```
    The backend server will typically start on `http://localhost:3000` (or the port specified in `.env`).

*   **Production Mode:**
    ```bash
    npm start
    ```
    In production, the Express server is also configured to serve static files from the `public` directory.

The API will be available at `http://localhost:PORT/api/...`.
The frontend will be at `http://localhost:PORT/`.
The admin panel login will be at `http://localhost:PORT/admin/` (or `admin/index.html`).

## Seeding Example Data (Manual Steps Using Admin Panel)

After setting up your first admin user (see next section if you haven't), you can populate the site with initial content:

1.  **Log into the Admin Panel:**
    *   Navigate to `http://localhost:PORT/admin/` and log in.

2.  **Add Categories:**
    *   Go to "Manage Categories".
    *   Click "Add New Category".
    *   Create categories such as:
        *   `Tech Careers` (Description: Articles and guides on pursuing a successful career in the technology sector...)
        *   `Higher Education Tips` (Description: Advice and strategies for students navigating college applications, campus life...)
        *   `Exam Preparation` (Description: Resources, study guides, and tips for cracking various competitive entrance exams...)

3.  **Add Posts (Example Structure - 2 per category):**
    *   Go to "Manage Posts".
    *   Click "Add New Post" for each.
    *   **Featured Image URL:** For placeholder images, you can use services like `https://via.placeholder.com/800x400.png?text=Your+Image+Text`. Replace these with actual image URLs from Pexels, Pixabay, or your own hosted images.
    *   **Content:** Aim for ~600 words per article for good quality. Use the placeholder text below as a guide for the topic.

    *   **Category: Tech Careers**
        *   **Post 1:**
            *   Title: `Ace Your Next Tech Interview: Key Strategies`
            *   Content: `[Placeholder for a comprehensive 600-word article on tech interview strategies...]`
            *   Featured Image URL: `https://via.placeholder.com/800x400.png?text=Tech+Interview+Tips`
        *   **Post 2:**
            *   Title: `The Rise of AI/ML: Top Career Paths in Artificial Intelligence`
            *   Content: `[Placeholder for an in-depth 600-word article on AI/ML career paths...]`
            *   Featured Image URL: `https://via.placeholder.com/800x400.png?text=AI+ML+Careers`

    *   **Category: Higher Education Tips**
        *   **Post 1:**
            *   Title: `Choosing the Right College Major: A Student's Guide`
            *   Content: `[Placeholder for a practical 600-word guide on choosing a college major...]`
            *   Featured Image URL: `https://via.placeholder.com/800x400.png?text=Choosing+College+Major`
        *   **Post 2:**
            *   Title: `Effective Time Management Strategies for College Students`
            *   Content: `[Placeholder for a helpful 600-word article on time management for students...]`
            *   Featured Image URL: `https://via.placeholder.com/800x400.png?text=Student+Time+Management`

    *   **Category: Exam Preparation**
        *   **Post 1:**
            *   Title: `Conquering Competitive Exams: A Smart Study Plan`
            *   Content: `[Placeholder for a strategic 600-word article on creating an exam study plan...]`
            *   Featured Image URL: `https://via.placeholder.com/800x400.png?text=Exam+Study+Plan`
        *   **Post 2:**
            *   Title: `The Power of Mock Tests in Exam Success`
            *   Content: `[Placeholder for an insightful 600-word article on the benefits of mock tests...]`
            *   Featured Image URL: `https://via.placeholder.com/800x400.png?text=Mock+Test+Benefits`

4.  **Configure Sidebar Widgets & Ads (Optional):**
    *   Use "Manage Ads" to add ad slots.
    *   Use "Manage Sidebar Widgets" to create and arrange widgets.

5.  **Configure Site Settings:**
    *   Go to "Site Settings" in the Admin Panel.
    *   Here you can configure:
        *   General Settings: Site Name, Base URL, Favicon URL.
        *   SEO & Analytics: Global Meta Title/Description, Google Analytics ID, Webmaster Meta Tags.
        *   Footer: Custom Footer Text.
        *   **Email & SMTP Settings:** SMTP Host, Port, User, Password, and "From" Email for enabling email functionalities (e.g., future password resets).
        *   **Advertising Settings:** Google AdSense Publisher ID.

## Admin Panel Access & First User Setup

*   **Access URL:** `http://localhost:PORT/admin/`
*   **Creating the First Admin User:**
    1.  **Temporarily Modify `server/routes/auth.js`:**
        *   Find: `router.post('/register', protect, authorize('admin'), register);`
        *   Replace with:
            ```javascript
            // router.post('/register', protect, authorize('admin'), register); // Comment out original
            router.post('/register', register); // Add this temporarily
            ```
    2.  **Start Server:** `npm run dev`
    3.  **Register via API Tool (e.g., Postman):**
        *   `POST` to `http://localhost:PORT/api/auth/register`
        *   Header: `Content-Type: application/json`
        *   Body:
            ```json
            {
                "username": "admin_user",
                "email": "admin@example.com",
                "password": "your_secure_password",
                "role": "admin"
            }
            ```
            (If you wish to create a specific initial user, e.g., `username: admin` with password `Admin123`, you can use those values here during this setup. Remember to choose a strong password for any production environment.)
    4.  **IMPORTANT: Revert `server/routes/auth.js` Changes:**
        *   Restore the original secure registration line and remove the temporary one. Save the file (server should restart if using nodemon).
    5.  You can now log in at `/admin/` with the credentials you registered.

## API Endpoints Overview

(Refer to backend route files for a detailed list. Key public endpoints include:)

*   `GET /api/posts`
*   `GET /api/posts/recent?limit=N`
*   `GET /api/posts/:slug`
*   `GET /api/categories`
*   `GET /api/posts?category_slug=slug`
*   `GET /api/widgets/sidebar`
*   `GET /sitemap.xml`
*   `GET /robots.txt`

Admin-only endpoints exist for CRUD operations on all resources.

## Further Development / To-Do (Optional)

*   Implement rich text editor (e.g., TinyMCE, Quill.js) for post content in Admin Panel.
*   Add file upload capability for featured images and ad images directly through the Admin Panel.
*   Develop a more sophisticated "Popular Posts" algorithm.
*   Implement user comments on posts.
*   Add more advanced search and filtering options on the frontend.
*   Automated database seeding script.
*   Unit and integration tests.
*   **Security:** For production, proxy Brandfetch API calls through the backend to protect the API key.
```
