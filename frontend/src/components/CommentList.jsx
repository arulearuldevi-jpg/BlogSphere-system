import { useEffect, useState } from 'react';
import api from '../api';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setComments(data);
    } catch (error) {
      console.error('Load comments error:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);

      setComments((prevComments) =>
        prevComments.filter(
          (comment) => comment._id !== commentId
        )
      );
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <p>{comment.text}</p>

            <small>
              {comment.author?.name || 'User'} •{' '}
              {new Date(comment.createdAt).toLocaleDateString()}
            </small>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(comment._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;