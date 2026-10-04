const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const protect = require('../middleware/auth');

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/posts/my
router.get('/my', protect, async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/posts/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const posts = await Post.find({
      category: req.params.category,
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/posts/search?title=...
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;

    const posts = await Post.find({
      title: {
        $regex: title || '',
        $options: 'i',
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/posts/:postId/comments
router.get('/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/posts
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/posts/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to update this post',
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: 'Post removed',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;