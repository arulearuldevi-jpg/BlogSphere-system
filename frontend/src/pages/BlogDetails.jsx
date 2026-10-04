import { useEffect, useState } from 'react';
import api from '../api';
import { Link, useParams } from 'react-router-dom';
import CommentList from '../components/CommentList';

const BlogDetails = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);

        setPost(response.data);
      } catch (error) {
        console.error('Failed to load post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="blog-details">
      <div className="page-container">
        <h1>{post.title}</h1>

        <div className="meta">
          <small>
            Category: {post.category}
          </small>

          <small>
            By: {post.author?.name || 'Unknown'}
          </small>

          <small>
            Created:{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </div>

        <p>{post.content}</p>

        <h3>Comments</h3>

        <CommentList postId={post._id} />

        <br />

        <Link
          to="/"
          className="btn btn-link"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default BlogDetails;