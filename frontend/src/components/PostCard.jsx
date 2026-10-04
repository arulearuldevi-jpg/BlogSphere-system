import { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import CommentList from './CommentList';

const PostCard = ({ post }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentKey, setCommentKey] = useState(0);
  const [commentError, setCommentError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentError('');

      await api.post('/comments', {
        text: commentText.trim(),
        postId: post._id,
      });

      setCommentText('');
      setShowCommentForm(false);

      // Refresh CommentList
      setCommentKey((prev) => prev + 1);
    } catch (error) {
      console.error('Comment error:', error);
      setCommentError(
        error.response?.data?.message || 'Failed to post comment'
      );
    }
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <h3>{post.title}</h3>
        <small>{post.category}</small>
      </div>

      <p className="post-card-content">
        {post.content}
      </p>

      <div className="post-card-meta">
        Created:{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </div>

      {showCommentForm ? (
        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
          />

          {commentError && (
            <p className="error">{commentError}</p>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Post Comment
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              setShowCommentForm(false);
              setCommentText('');
              setCommentError('');
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-link"
          onClick={() => setShowCommentForm(true)}
        >
          Add Comment
        </button>
      )}

      <CommentList
        key={commentKey}
        postId={post._id}
      />

      <br />

      <Link
        to={`/blog/${post._id}`}
        className="btn btn-link"
      >
        Read more
      </Link>
    </div>
  );
};

export default PostCard;