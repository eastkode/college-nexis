# College Nexis - Online Magazine/Blog Platform

College Nexis is a modern, fully custom online magazine/blog platform designed for students. It covers topics like colleges, courses, exams, and careers, serving as a dynamic, professional, and easy-to-update education portal.

## Features

*   **Dynamic Frontend:** Built with HTML5, CSS3, and vanilla JavaScript. Content is dynamically fetched from the backend API.
*   **Robust Backend:** Node.js with Express.js framework and MongoDB (via Atlas) for data storage.
*   **Admin Panel:** Secure and user-friendly interface for managing posts, categories, users, sidebar widgets, advertisements, and site-wide settings.
*   **SEO Optimized:** Auto-generated slugs, meta tags, dynamic `sitemap.xml` and `robots.txt`, Schema.org markup.
*   **Customizable:** Manage sidebar content, ad slots, and global site settings like Google Analytics, SMTP, and AdSense.
*   **Responsive Design:** Ensures a good viewing experience across devices.
*   **Enhanced Homepage:** Includes an "Industry News" hero slider, sections for "Courses to Pursue" (with Font Awesome icons), "Companies Hiring (Logo Carousel with Brandfetch API integration)," and "Trending Jobs."

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

---

## Deployment

This project consists of two main parts that need to be deployed separately: the **Backend (Node.js API)** and the **Frontend (Static Website)**.

### Backend Deployment with Render (Recommended)

The easiest way to deploy the backend is using [Render](https://render.com/) and the included `render.yaml` "Blueprint" file.

1.  **Push to GitHub:** Ensure your latest code, including the `render.yaml` file, is pushed to your GitHub repository.
2.  **Create a Render Account:** Sign up at [Render.com](https://render.com/) and connect your GitHub account.
3.  **Create a Blueprint:**
    *   From your dashboard, click **New + > Blueprint**.
    *   Select your `college-nexis` repository. Render will automatically detect and parse the `render.yaml` file.
    *   Give your new service group a name.
4.  **Create a Secret Group:** Before deploying, you must provide your secret environment variables.
    *   Navigate to the **Environment** tab for the `college-nexis-api` service that Render has planned for you.
    *   Render will prompt you to create the `college-nexis-secrets` group defined in the YAML. Click to create it.
    *   Add the following secrets to the group:
        *   `MONGO_URI`: Your full MongoDB Atlas connection string.
        *   `JWT_SECRET`: Your unique and strong JWT secret key.
    *   Save the secret group.
5.  **Deploy:**
    *   Click **"Apply"** or **"Create New Services"**. Render will start the build (`npm install`) and start (`npm start`) commands.
    *   Once live, Render will provide the public URL for your backend (e.g., `https://college-nexis-api.onrender.com`). **Copy this URL.**

### Frontend Deployment with GitHub Pages

1.  **Update API URL in Frontend Code:** This is a crucial step.
    *   Open `public/js/main.js` and `admin/js/auth.js`.
    *   Find the line `const API_BASE_URL = '/api';`.
    *   Change it to the live URL from your Render deployment. **Important:** Make sure it points to the `/api` path.
        ```javascript
        // Example:
        const API_BASE_URL = 'https://college-nexis-api.onrender.com/api';
        ```
    *   Save, commit, and push this change to GitHub.
2.  **Enable GitHub Pages:**
    *   In your GitHub repository, go to **Settings > Pages**.
    *   Under "Build and deployment," select **"Deploy from a branch"**.
    *   Set the branch to **`main`** and the folder to **`/(root)`**.
    *   Click **Save**.
    *   Your site will be live in a few minutes at `https://your-username.github.io/your-repo-name/`.

---

## Local Development

### Prerequisites

*   Node.js (v14.x or later recommended)
*   npm (usually comes with Node.js)
*   MongoDB Atlas account (or a local MongoDB instance)
*   (Optional) Brandfetch API Key for dynamic company logos.

### 1. Clone & Install

```bash
git clone <repository_url>
cd college-nexis
npm install
```

### 2. Configure Local Environment

1.  **Create `.env` file:** Create a `.env` file in the project root.
2.  **Add Variables:** Copy the contents from the template below and replace with your credentials.
    ```env
    # .env - For Local Development

    # MongoDB Connection String
    MONGO_URI="mongodb+srv://..."

    # JWT Secret Key
    JWT_SECRET="a_very_strong_local_secret"

    # Port
    PORT=3000

    # Node Environment
    NODE_ENV=development
    ```
3.  **Configure Brandfetch API Key (Optional):**
    *   The `public/js/main.js` file is hardcoded with the key you provided for demonstration. For production, it's recommended to manage this more securely (e.g., via a backend proxy).

### 3. Running the Application

*   **Development Mode:**
    ```bash
    npm run dev
    ```
    The backend API will run on `http://localhost:3000`. The frontend can be accessed by opening the `public/index.html` file in your browser, or by navigating to `http://localhost:3000`.

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

### Seeding Example Data
Once logged into the admin panel, you can:
*   **Add Categories:** Go to "Manage Categories". To populate the homepage news slider, create a category with the exact name **`Industry News`**. Add other categories as needed (e.g., `Tech Careers`, `Higher Education Tips`).
*   **Add Posts:** Go to "Manage Posts" and add articles to your created categories. The latest posts from the "Industry News" category will appear in the homepage hero slider.
*   **Configure Site Settings:** Go to "Site Settings" to configure Google Analytics, SMTP, AdSense, etc.

---
*For a full list of API endpoints, please refer to the files in the `server/routes/` directory.*
*For potential future enhancements, see the project plan or previous `README.md` versions.*
```
