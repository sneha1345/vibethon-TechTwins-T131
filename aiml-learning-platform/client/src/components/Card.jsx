import React from 'react'
import '../css/Card.css'

const Card = ({ 
  children, 
  title, 
  icon, 
  className = '', 
  onClick,
  hoverable = true,
  variant = 'default', // default, outlined, elevated, gradient
  padding = 'normal', // none, small, normal, large
  headerAction,
  footer
}) => {
  const cardClasses = `
    card 
    card-${variant} 
    ${hoverable ? 'card-hoverable' : ''} 
    card-padding-${padding}
    ${onClick ? 'card-clickable' : ''}
    ${className}
  `.trim()

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || icon || headerAction) && (
        <div className="card-header">
          <div className="card-title-wrapper">
            {icon && <span className="card-icon">{icon}</span>}
            {title && <h3 className="card-title">{title}</h3>}
          </div>
          {headerAction && (
            <div className="card-header-action">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  )
}

// Specialized Card Components
export const StatCard = ({ title, value, icon, trend, color = '#667eea' }) => {
  return (
    <Card variant="elevated" className="stat-card">
      <div className="stat-card-content">
        <div className="stat-info">
          <span className="stat-label">{title}</span>
          <span className="stat-value">{value}</span>
          {trend && (
            <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {icon && (
          <div className="stat-icon" style={{ backgroundColor: color + '20', color: color }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export const ModuleCard = ({ title, description, progress, icon, status, onClick }) => {
  return (
    <Card 
      variant="elevated" 
      className="module-card"
      onClick={onClick}
      hoverable
    >
      <div className="module-header">
        <div className="module-icon">{icon}</div>
        {status && (
          <span className={`module-status module-status-${status}`}>
            {status === 'completed' ? '✓ Completed' : status === 'in-progress' ? '● In Progress' : '○ Not Started'}
          </span>
        )}
      </div>
      
      <div className="module-body">
        <h4 className="module-title">{title}</h4>
        <p className="module-description">{description}</p>
      </div>
      
      {progress !== undefined && (
        <div className="module-footer">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}% Complete</span>
        </div>
      )}
    </Card>
  )
}

export const QuizCard = ({ question, options, correctAnswer, onAnswer, showResult }) => {
  const [selected, setSelected] = React.useState(null)
  
  const handleSelect = (index) => {
    setSelected(index)
    if (onAnswer) {
      onAnswer(index, index === correctAnswer)
    }
  }
  
  return (
    <Card variant="outlined" className="quiz-card">
      <div className="quiz-question">
        <span className="quiz-icon">❓</span>
        <p>{question}</p>
      </div>
      
      <div className="quiz-options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${selected === index ? 'selected' : ''} ${
              showResult ? (index === correctAnswer ? 'correct' : 'incorrect') : ''
            }`}
            onClick={() => handleSelect(index)}
            disabled={showResult}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}

export const GameCard = ({ title, description, icon, difficulty, highScore, onPlay }) => {
  const difficultyColor = {
    easy: '#4caf50',
    medium: '#ff9800',
    hard: '#f44336'
  }
  
  return (
    <Card variant="gradient" className="game-card">
      <div className="game-header">
        <div className="game-icon">{icon}</div>
        <span 
          className="game-difficulty"
          style={{ backgroundColor: difficultyColor[difficulty] }}
        >
          {difficulty}
        </span>
      </div>
      
      <div className="game-body">
        <h4 className="game-title">{title}</h4>
        <p className="game-description">{description}</p>
      </div>
      
      <div className="game-footer">
        {highScore !== undefined && (
          <div className="game-highscore">
            <span>🏆 High Score</span>
            <strong>{highScore}</strong>
          </div>
        )}
        <button className="game-play-btn" onClick={onPlay}>
          Play Now →
        </button>
      </div>
    </Card>
  )
}

export default Card