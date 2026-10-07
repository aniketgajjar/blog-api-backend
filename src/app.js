const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);


// Make uploads folder static so images can be accessed via URL
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Blog API Backend is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);

// Unhandled Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;