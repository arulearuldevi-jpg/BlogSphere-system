import { useState, useEffect } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the post details
    api.get(`/posts/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.category);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load post');
        setLoading(false);
        console.error(error);
        navigate('/');
      });
  }, [id]);

  useEffect(() => {
    // Check if user is logged in and is the author
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = token ? { withCredentials: true, headers: { Authorization: `Bearer ${token}` } } : { withCredentials: true };
      const response = await api.put(`/posts/${id}`, {
        title,
        content,
        category
      }, config);
      setLoading(false);
      navigate(`/blog/${id}`);
    } catch (error) {
      setError('Failed to update post');
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="edit-blog">
      <div className="page-container">
        <h2>Edit Blog Post</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleUpdate} className="form-container">
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
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;