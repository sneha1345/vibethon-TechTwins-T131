import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Home.css'

const Home = () => {
  const token = localStorage.getItem('token')

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="logo">
          <h1>🎯 VIBETHON AI</h1>
        </div>
        <div className="nav-links">
          {token ? (
            <Link to="/dashboard" className="nav-btn">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/signup" className="nav-btn primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn AI & ML Through
            <span className="highlight"> Interactive Play</span>
          </h1>
          <p className="hero-description">
            Master Artificial Intelligence and Machine Learning concepts through 
            hands-on coding, engaging games, and real-world simulations.
          </p>
          <div className="hero-buttons">
            {token ? (
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary">Start Learning Free</Link>
                <Link to="/login" className="btn-secondary">I already have an account</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <h3>Interactive</h3>
            <p>Learn by doing</p>
          </div>
          <div className="stat-item">
            <h3>Gamified</h3>
            <p>Earn badges & points</p>
          </div>
          <div className="stat-item">
            <h3>Real Projects</h3>
            <p>Build portfolio</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>What You'll Experience</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Structured Learning</h3>
            <p>From beginner to advanced AI concepts with clear explanations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Live Code Playground</h3>
            <p>Write and run Python code directly in your browser</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Interactive Games</h3>
            <p>Learn decision trees and neural networks through play</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Visual dashboard to monitor your learning journey</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 VIBETHON - AI/ML Learning Platform</p>
        <p className="team-tag">Team: WEBHEN-TECH-WINS-151</p>
      </footer>
    </div>
  )
}

export default Home