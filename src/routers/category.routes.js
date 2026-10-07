const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect, restrictTo } = require('../Middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, restrictTo('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .delete(protect, restrictTo('admin'), deleteCategory);

module.exports = router;