const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Upload image
// @route   POST /api/upload
// @access  Private (Author, Admin)
router.post(
  '/',
  protect,
  restrictTo('author', 'admin'),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Return image file path to be saved in Post coverImage
    res.status(200).json({
      success: true,
      data: `/${req.file.path.replace(/\\/g, '/')}`,
    });
  }
);

module.exports = router;