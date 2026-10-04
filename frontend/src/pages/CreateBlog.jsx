import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    api.get('/auth/me')
      .then(res => {
        if (!res.data) {
          navigate('/login');
        }
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.post('/posts', { title, content, category }, token ? { withCredentials: true, headers: { Authorization: `Bearer ${token}` } } : { withCredentials: true });
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create post');
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="create-blog">
      <div className="page-container">
        <h2>Create New Blog Post</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleCreate} className="form-container">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post..."
              rows={4}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;