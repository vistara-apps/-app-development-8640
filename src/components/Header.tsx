import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useApp } from '../context/AppContext';

function Header() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🏛️ Ancient Eats
        </Link>
        <nav className="nav">
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            Home
          </Link>
          {user && (
            <Link 
              to="/library" 
              className={isActive('/library') ? 'active' : ''}
            >
              My Library
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-inverse">
                Welcome, <span className="font-semibold">{user.name}</span>
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-ghost btn-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}

export default Header;
