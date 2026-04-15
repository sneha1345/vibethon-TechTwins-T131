import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Import Pages
import Home from './pages/Home'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Quiz from './pages/Quiz'
import Game from './pages/Game'
import CodePlayground from './pages/CodePlayground'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  return (
    <Router>
      <div className="app">
        {/* Navbar removed */}

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* /signup redirects to /login */}
            <Route path="/signup" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="/learn" element={
              <ProtectedRoute><Learn /></ProtectedRoute>
            } />

            <Route path="/quiz" element={
              <ProtectedRoute><Quiz /></ProtectedRoute>
            } />

            <Route path="/game" element={
              <ProtectedRoute><Game /></ProtectedRoute>
            } />

            <Route path="/playground" element={
              <ProtectedRoute><CodePlayground /></ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App