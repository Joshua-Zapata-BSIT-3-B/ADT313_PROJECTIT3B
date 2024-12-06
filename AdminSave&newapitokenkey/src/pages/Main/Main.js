import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  return (
    <div className="Main">
      <div className="container">
        <nav className="navigation">
          <ul>
            <li>
              <Link to="/main/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li>
              <Link to="/main/movies" className="nav-link">Movies</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
        <main className="outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Main;
