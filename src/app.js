const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const errorHandler = require('./Middlewares/error.middleware');

// Route Imports
const authRoutes = require('./routers/auth.route');
const categoryRoutes = require('./routers/category.routes');
const postRoutes = require('./routers/post.route');
const commentRoutes = require('./routers/comment.routes');
const uploadRoutes = require('./routers/upload.routes');

const app = express();

// Set security HTTP headers with Helmet
app.use(helmet());

// Enable CORS
app.use(cors());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Blog API Backend is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);

// Static upload folder setup
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Unhandled Route Handler (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Attach Global Error Handling Middleware (MUST be attached AFTER routes)
app.use(errorHandler);

module.exports = app;