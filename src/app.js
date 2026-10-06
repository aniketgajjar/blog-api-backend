const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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