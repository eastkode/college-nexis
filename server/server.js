const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // For serving static files
const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorHandler'); // Optional: if you implement a centralized error handler

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env')}); // Correct path to .env in the root

// Connect to database
connectDB();

// Route files
const postsRoutes = require('./routes/posts');
const categoriesRoutes = require('./routes/categories');
const widgetsRoutes = require('./routes/widgets');
const adsRoutes = require('./routes/ads');
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const sitemapRoutes = require('./routes/sitemap');
const robotsRoutes = require('./routes/robots');
const usersRoutes = require('./routes/users'); // Added users route

const app = express();

// Body parser
app.use(express.json());

// Enable CORS - configure as needed for production
app.use(cors()); // Allows all origins by default

// Mount routers
app.use('/api/posts', postsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/widgets', widgetsRoutes);
app.use('/api/ads', adsRoutes); // Admin only
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes); // Mostly admin, some public access handled in controller
app.use('/api/users', usersRoutes); // Added users route mounting

// Sitemap and Robots.txt
app.use('/', sitemapRoutes); // Serves /sitemap.xml
app.use('/', robotsRoutes);   // Serves /robots.txt


// Serve static assets (frontend) in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder - assumes your frontend build is in 'public' directory in the root
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // For any route not handled by API, serve index.html (for SPAs)
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html')));
} else {
  // In development, you might serve static files differently or rely on a dev server for the frontend
  // For simplicity, we can still serve a basic public folder if it exists
  app.use(express.static(path.join(__dirname, '..', 'public')));
   app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}


// Optional: Centralized error handler (must be after routes)
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
