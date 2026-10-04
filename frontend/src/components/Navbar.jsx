import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on mount
    api.get('/auth/me')
      .then(res => {
        setUser(res.data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, [navigate]);

  const login = () => {
    navigate('/login');
  };

  const register = () => {
    navigate('/register');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">BlogSphere</div>
        <div className="navbar-links">
          {!isLoggedIn ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span>Welcome, {user.name}</span>
              <Link to="/create" className="btn btn-primary">
                Create Blog
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;