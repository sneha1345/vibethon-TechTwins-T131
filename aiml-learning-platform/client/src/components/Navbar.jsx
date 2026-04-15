import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../css/Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const raw = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : {}
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'Learner'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    )},
    { to: '/learn', label: 'Learn', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    )},
    { to: '/quiz', label: 'Quiz', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )},
    { to: '/game', label: 'Games', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M7 12h.01"/><path d="M17 12h.01M10 10v4M8 12h4"/>
      </svg>
    )},
    { to: '/playground', label: 'Playground', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    )},
  ]

  return (
    <nav className={`nb-nav${scrolled ? ' nb-scrolled' : ''}`}>
      <div className="nb-container">

        {/* ── Logo ── */}
        <Link to="/dashboard" className="nb-logo">
          <div className="nb-logo-ring">
            <div className="nb-logo-dot" />
          </div>
          <span className="nb-logo-text">AIML LEARN</span>
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className="nb-links">
          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`nb-link${isActive(to) ? ' nb-link--active' : ''}`}
              >
                <span className="nb-link-icon">{icon}</span>
                <span className="nb-link-label">{label}</span>
                {isActive(to) && <span className="nb-link-pill" />}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right: user + logout ── */}
        <div className="nb-right">
          <div className="nb-user">
            <div className="nb-avatar">{initials}</div>
            <span className="nb-username">{displayName}</span>
          </div>

          <button className="nb-logout" onClick={handleLogout} title="Sign out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="nb-logout-label">Logout</span>
          </button>

          {/* ── Hamburger ── */}
          <button
            className={`nb-hamburger${mobileOpen ? ' nb-hamburger--open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`nb-drawer${mobileOpen ? ' nb-drawer--open' : ''}`}>
        <ul className="nb-drawer-links">
          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`nb-drawer-link${isActive(to) ? ' nb-drawer-link--active' : ''}`}
              >
                <span className="nb-link-icon">{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="nb-drawer-logout" onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar