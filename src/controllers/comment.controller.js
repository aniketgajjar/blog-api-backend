const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private (Authenticated users)
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      post: req.params.postId,
      user: req.user._id,
    });

    // Populate user info before returning response
    await comment.populate('user', 'name');

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Comment author, Post author, or Admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostAuthor = comment.post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Authorization check: must be comment author, post author, or admin
    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this comment',
      });
    }

    await comment.deleteOne();

    res.status(200).json({ success: true, message: 'Comment removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};