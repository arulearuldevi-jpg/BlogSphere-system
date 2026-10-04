
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const protect = require('../middleware/auth');

// @route   GET /api/posts/:postId/comments
// @desc    Get comments for a post
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId
    }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/comments
// @desc    Add comment to a post
// @access  Private
router.post('/', protect, async (req, res) => {
  const { text, postId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      text,
      author: req.user.id,
      post: postId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: 'Comment removed'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
