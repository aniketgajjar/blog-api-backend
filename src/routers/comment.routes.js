const express = require('express');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// mergeParams: true allows us to access :postId from postRoutes
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;