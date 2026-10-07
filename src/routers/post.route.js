const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/post.controller');
const { protect, restrictTo } = require('../Middlewares/auth.middleware');

// Include comment router
const commentRouter = require('./commentRoutes');

const router = express.Router();

// Re-route into other resource routers for nested routes
router.use('/:postId/comments', commentRouter);

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