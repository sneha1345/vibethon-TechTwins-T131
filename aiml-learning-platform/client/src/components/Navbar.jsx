import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../css/Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/dashboard">
            <span className="brand-icon">🎯</span>
            <span className="brand-text">VIBETHON AI</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="navbar-menu">
          <li className="nav-item">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/learn" className={`nav-link ${isActive('/learn')}`}>
              <span className="nav-icon">📚</span>
              <span>Learn</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/quiz" className={`nav-link ${isActive('/quiz')}`}>
              <span className="nav-icon">📝</span>
              <span>Quiz</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/game" className={`nav-link ${isActive('/game')}`}>
              <span className="nav-icon">🎮</span>
              <span>Games</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/playground" className={`nav-link ${isActive('/playground')}`}>
              <span className="nav-icon">💻</span>
              <span>Playground</span>
            </Link>
          </li>
        </ul>

        {/* User Profile Section */}
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0) || 'U'}
            </div>
            <span className="user-name">{user.name || 'User'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar