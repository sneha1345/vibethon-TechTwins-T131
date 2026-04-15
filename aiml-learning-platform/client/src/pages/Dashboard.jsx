import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserProfile } from '../services/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetchUserProfile()
  }, [navigate])

  const fetchUserProfile = async () => {
    try {
      const { data } = await getUserProfile()
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Welcome, {user?.name || 'Learner'}! 👋</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Progress Card */}
        <div style={styles.card}>
          <h3>📊 Your Progress</h3>
          <div style={styles.progressItem}>
            <span>Quiz Score:</span>
            <strong>{user?.progress?.quizScore || 0} points</strong>
          </div>
          <div style={styles.progressItem}>
            <span>Modules Completed:</span>
            <strong>{user?.progress?.modulesCompleted?.length || 0}</strong>
          </div>
          <div style={styles.progressItem}>
            <span>Last Active:</span>
            <strong>{user?.progress?.lastActive ? new Date(user.progress.lastActive).toLocaleDateString() : 'Today'}</strong>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div style={styles.card}>
          <h3>🚀 Quick Actions</h3>
          <button 
            onClick={() => navigate('/learn')}
            style={styles.actionButton}
          >
            📚 Continue Learning
          </button>
          <button 
            onClick={() => navigate('/quiz')}
            style={styles.actionButton}
          >
            📝 Take a Quiz
          </button>
          <button 
            onClick={() => navigate('/game')}
            style={styles.actionButton}
          >
            🎮 Play Learning Games
          </button>
        </div>

        {/* Stats Card */}
        <div style={styles.card}>
          <h3>🎯 Today's Goal</h3>
          <div style={{ marginTop: '20px' }}>
            <p>Complete one learning module</p>
            <div style={styles.progressBar}>
              <div style={{ 
                width: `${(user?.progress?.modulesCompleted?.length || 0) * 33}%`,
                height: '100%',
                backgroundColor: '#667eea',
                borderRadius: '10px',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  progressItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  actionButton: {
    display: 'block',
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left'
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    marginTop: '10px'
  }
}

export default Dashboard  // ✅ THIS LINE IS CRITICAL