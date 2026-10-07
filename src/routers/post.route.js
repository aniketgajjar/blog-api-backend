const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getPosts)
  .post(protect, restrictTo('author', 'admin'), createPost);

router
  .route('/:id')
  .get(getPost)
  .put(protect, restrictTo('author', 'admin'), updatePost)
  .delete(protect, restrictTo('author', 'admin'), deletePost);

module.exports = router;