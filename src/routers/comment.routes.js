const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/comment.controller');
const { protect } = require('../Middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getComments)
  .post(protect, addComment);

router
  .route('/:id')
  .delete(protect, deleteComment);

module.exports = router;