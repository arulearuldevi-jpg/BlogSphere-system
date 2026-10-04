import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import CommentList from '../components/CommentList';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Build query string
        const queryParams = [];
        if (selectedCategory) {
          queryParams.push(`category=${selectedCategory}`);
        }
        if (searchQuery) {
          queryParams.push(`title=${searchQuery}`);
        }
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        
        const response = await api.get(`/posts${queryString}`);
        setPosts(Array.isArray(response.data) ? response.data : []);
        setLoading(false);

        // Extract unique categories - safe array check
        const allCategories = response.data && Array.isArray(response.data)
          ? [...new Set(response.data.map(post => post.category))]
          : [];
        setCategories(allCategories);
      } catch (error) {
        setError('Failed to load posts');
        setLoading(false);
        console.error(error);
      }
    };

    loadPosts();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="home">
      <div className="page-container">
        <h1>BlogSphere</h1>
        
        {/* Search and Filter */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search blogs by title..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Posts Section */}
        {loading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

function handleComment(comment) {
  console.log('Comment added:', comment);
}