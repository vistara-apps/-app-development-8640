import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useApp } from '../context/AppContext';

function Header() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Ancient Eats
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            {user && <Link to="/library">My Library</Link>}
            {user ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span>Welcome, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                Login
              </Link>
            )}
            <ConnectButton />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;