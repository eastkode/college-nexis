# College Nexis - Online Magazine/Blog Platform

College Nexis is a modern, fully custom online magazine/blog platform designed for students. It covers topics like colleges, courses, exams, and careers, serving as a dynamic, professional, and easy-to-update education portal.

## Features

*   **Dynamic Frontend:** Built with HTML5, CSS3, and vanilla JavaScript. Content is dynamically fetched from the backend API.
*   **Robust Backend:** Node.js with Express.js framework and MongoDB (via Atlas) for data storage.
*   **Admin Panel:** Secure and user-friendly interface for managing posts, categories, users, sidebar widgets, advertisements, and site-wide settings.
*   **Dynamic Imagery:**
    *   **Live News Slider:** Homepage hero slider is powered by NewsAPI.org, showing the latest relevant news.
    *   **Automatic Post Images:** Uses the Pixabay API to automatically find and display relevant images for blog posts that don't have a featured image set.
    *   **Company Logos:** Dynamically fetches company logos for the homepage carousel using the Clearbit Logo API.
*   **SEO Optimized:** Auto-generated slugs, meta tags, dynamic `sitemap.xml` and `robots.txt`, Schema.org markup.
*   **Customizable:** Manage sidebar content, ad slots, and global site settings like Google Analytics, SMTP, and AdSense.
*   **Responsive Design:** Ensures a good viewing experience across devices.

## Tech Stack

*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Font Awesome
*   **Backend:** Node.js, Express.js, Axios
*   **Database:** MongoDB (MongoDB Atlas recommended)
*   **Authentication:** JWT (JSON Web Tokens) for Admin Panel
*   **External Services/APIs:**
    *   **NewsAPI.org:** Used for the live "Industry News" hero slider. Requires an API key.
    *   **Pixabay API:** Used to dynamically source images for blog posts. Requires an API key.
    *   **Clearbit Logo API:** Used for dynamically fetching company logos.

---

## Deployment

This project consists of two main parts that need to be deployed separately: the **Backend (Node.js API)** and the **Frontend (Static Website)**.

### Backend Deployment with Render (Recommended)

The easiest way to deploy the backend is using [Render](https://render.com/) and the included `render.yaml` "Blueprint" file.

1.  **Push to GitHub:** Ensure your latest code is pushed to your GitHub repository.
2.  **Create a Render Account:** Sign up at [Render.com](https://render.com/) and connect your GitHub account.
3.  **Create a Blueprint:**
    *   From your dashboard, click **New + > Blueprint**.
    *   Select your `college-nexis` repository. Render will automatically detect and parse `render.yaml`.
4.  **Create a Secret Group:** Before deploying, you must provide your secret environment variables.
    *   Render will prompt you to create the `college-nexis-secrets` group defined in the YAML. Click to create it.
    *   Add the following secrets to the group:
        *   `MONGO_URI`: Your full MongoDB Atlas connection string.
        *   `JWT_SECRET`: Your unique and strong JWT secret key.
        *   `NEWS_API_KEY`: Your API key from NewsAPI.org.
        *   `PIXABAY_API_KEY`: Your API key from Pixabay.com.
    *   Save the secret group.
5.  **Deploy:**
    *   Click **"Apply"** or **"Create New Services"**. Render will deploy your service.
    *   Once live, Render will provide the public URL for your backend (e.g., `https://college-nexis-api.onrender.com`). **Copy this URL.**

### Frontend Deployment with GitHub Pages

1.  **Update API URL in Frontend Code:** This is a crucial step.
    *   Open `public/js/main.js` and `admin/js/auth.js`.
    *   Find the line `const API_BASE_URL = '/api';`.
    *   Change it to the live URL from your Render deployment:
        ```javascript
        const API_BASE_URL = 'https://college-nexis-api.onrender.com/api';
        ```
    *   Save, commit, and push this change to GitHub.
2.  **Enable GitHub Pages:**
    *   In your GitHub repository, go to **Settings > Pages**.
    *   Under "Build and deployment," select **"Deploy from a branch"**.
    *   Set the branch to **`main`** and the folder to **`/(root)`**.
    *   Click **Save**. Your site will be live in a few minutes.

---

## Local Development

### Prerequisites

*   Node.js (v14.x or later recommended)
*   npm (usually comes with Node.js)
*   MongoDB Atlas account (or a local MongoDB instance)
*   NewsAPI.org API Key
*   Pixabay API Key

### 1. Clone & Install

```bash
git clone <repository_url>
cd college-nexis
npm install
```

### 2. Configure Local Environment

1.  **Create `.env` file:** Create a `.env` file in the project root.
2.  **Add Variables:** Copy the contents from the template below and add your credentials.
    ```env
    # .env - For Local Development

    # MongoDB Connection String
    MONGO_URI="mongodb+srv://..."

    # JWT Secret Key
    JWT_SECRET="a_very_strong_local_secret"

    # NewsAPI.org API Key for Hero Slider
    NEWS_API_KEY="your_news_api_key_here"

    # Pixabay API Key for Image Search
    PIXABAY_API_KEY="your_pixabay_api_key_here"

    # Port
    PORT=3000

    # Node Environment
    NODE_ENV=development
    ```

### 3. Running the Application

*   **Development Mode:**
    ```bash
    npm run dev
    ```
    The backend API will run on `http://localhost:3000`. The frontend can be accessed by opening `public/index.html` file or navigating to `http://localhost:3000`.

*   **Production Mode:**
    ```bash
    npm start
    ```

---

## Admin Panel & Content Seeding

### First Admin User Setup
The first admin user must be created manually for security.
1.  **Temporarily Modify `server/routes/auth.js`:**
    *   Find: `router.post('/register', protect, authorize('admin'), register);`
    *   Replace with: `router.post('/register', register);`
2.  **Start Server:** `npm run dev`
3.  **Register via API Tool (e.g., Postman):**
    *   `POST` to `http://localhost:3000/api/auth/register` with Header `Content-Type: application/json`.
    *   Body:
        ```json
        { "username": "admin", "email": "admin@example.com", "password": "your_secure_password", "role": "admin" }
        ```
4.  **IMPORTANT: Revert `server/routes/auth.js` Changes** and restart the server.
5.  You can now log in at `http://localhost:3000/admin/`.

### Content Management
Once logged into the admin panel, you can:
*   **Add Categories & Posts:** Use the "Manage Posts" and "Manage Categories" sections to create your own blog content. The "Manage Posts" page includes a **"Find Image"** button that uses the Pixabay API to help you find relevant featured images based on your post title.
*   **Configure Site Settings:** Go to "Site Settings" to configure Google Analytics, SMTP, AdSense, etc.

---
*For a full list of API endpoints, please refer to the files in the `server/routes/` directory.*
*For potential future enhancements, see the project plan or previous `README.md` versions.*
```
