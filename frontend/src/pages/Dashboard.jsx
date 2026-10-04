import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/my');
        const data = Array.isArray(response.data) ? response.data : [];
        setPosts(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load your posts');
        setLoading(false);
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading your posts...</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-container">
        <h2>Dashboard</h2>
        {error && <p className="error">{error}</p>}
        {posts.length === 0 ? (
          <p>No posts yet. <Link to="/create">Create your first post</Link></p>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 100)}...</p>
                <small>Category: {post.category}</small>
                <br />
                <Link to={`/edit/${post._id}`}>Edit</Link>
                <Link to={`/blog/${post._id}`}>View</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;