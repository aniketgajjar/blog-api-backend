const Post = require('../models/Post');

// @desc    Get all published posts (or all posts for Admin/Author)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    // 1. Base Query Filter (Only published posts by default)
    let queryObj = { status: 'published' };

    // 2. Category Filter
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // 3. Tag Filter
    if (req.query.tag) {
      queryObj.tags = { $in: [req.query.tag] };
    }

    // 4. Text Search (using title/content text index created in Step 7)
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search };
    }

    // 5. Pagination Setup
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Count total matching documents
    const total = await Post.countDocuments(queryObj);

    // Execute query with sorting, population, and pagination
    const posts = await Post.find(queryObj)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort(req.query.search ? { score: { $meta: 'textScore' } } : '-createdAt')
      .skip(startIndex)
      .limit(limit);

    // Pagination Metadata Response
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      limit,
    };

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get single post by ID or Slug
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name slug');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment view count automatically on fetch
    post.views += 1;
    await post.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Author, Admin)
exports.createPost = async (req, res) => {
  try {
    // Attach logged-in user as author
    req.body.author = req.user._id;

    const post = await Post.create(req.body);

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author of post or Admin)
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership: ensure user is post author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this post',
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author of post or Admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership: ensure user is post author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};