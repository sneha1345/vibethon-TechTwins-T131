import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Styles matching Login page vb-* theme ────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  @keyframes vb-float1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}
  @keyframes vb-float2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,20px) scale(1.03)}66%{transform:translate(20px,-25px) scale(0.96)}}
  @keyframes vb-float3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,30px) scale(1.04)}}
  @keyframes vb-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes vb-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

  .gm-scene { position:relative;width:100%;min-height:100vh;background:#07040f;overflow-x:hidden;font-family:'Inter',sans-serif;color:#fff }
  .gm-blob { position:fixed;border-radius:50%;filter:blur(80px);will-change:transform;pointer-events:none;z-index:0 }
  .gm-b1{width:520px;height:520px;background:radial-gradient(circle,rgba(90,30,180,.75) 0%,transparent 70%);top:-160px;left:-120px;animation:vb-float1 12s ease-in-out infinite}
  .gm-b2{width:460px;height:460px;background:radial-gradient(circle,rgba(160,30,130,.65) 0%,transparent 70%);bottom:-130px;right:-80px;animation:vb-float2 15s ease-in-out infinite}
  .gm-b3{width:340px;height:340px;background:radial-gradient(circle,rgba(40,20,120,.8) 0%,transparent 70%);top:40%;left:55%;animation:vb-float3 10s ease-in-out infinite}
  .gm-b4{width:260px;height:260px;background:radial-gradient(circle,rgba(100,10,100,.5) 0%,transparent 70%);bottom:10%;left:10%;animation:vb-float1 18s ease-in-out infinite reverse}

  .gm-header { position:relative;z-index:10;padding:18px 32px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;background:rgba(7,4,15,0.7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px) }
  .gm-logo { display:flex;align-items:center;gap:10px }
  .gm-logo-ring { width:30px;height:30px;border-radius:50%;border:2px solid rgba(180,120,255,.7);display:flex;align-items:center;justify-content:center }
  .gm-logo-dot { width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#a06eff,#e060d0) }
  .gm-logo-text { font-size:15px;font-weight:700;letter-spacing:3px;background:linear-gradient(90deg,#c49fff,#e87fe8,#a06eff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:vb-shimmer 3s linear infinite }
  .gm-back-btn { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 16px;color:rgba(255,255,255,0.7);font-size:13px;cursor:pointer;transition:all 0.2s;font-family:inherit;display:flex;align-items:center;gap:8px }
  .gm-back-btn:hover { background:rgba(255,255,255,0.09);color:#fff }

  .gm-body { position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:40px 24px }
  .gm-title-section { text-align:center;margin-bottom:40px;animation:vb-fadeUp 0.4s ease both }
  .gm-title { font-size:32px;font-weight:700;background:linear-gradient(90deg,#c49fff,#e87fe8,#a06eff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:vb-shimmer 3s linear infinite;margin-bottom:10px }
  .gm-subtitle { color:rgba(255,255,255,0.45);font-size:15px }

  .gm-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin-bottom:48px }

  .gm-card {
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:20px;
    padding:28px;
    cursor:pointer;
    transition:all 0.25s ease;
    display:flex;
    flex-direction:column;
    align-items:center;
    text-align:center;
    animation:vb-fadeUp 0.4s ease both;
  }
  .gm-card:hover { transform:translateY(-6px);background:rgba(126,58,255,0.08);border-color:rgba(126,58,255,0.3);box-shadow:0 16px 40px rgba(0,0,0,0.3) }

  .gm-icon-wrap { width:68px;height:68px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:30px;margin-bottom:18px;transition:transform 0.25s }
  .gm-card:hover .gm-icon-wrap { transform:scale(1.1) }

  .gm-card-title { font-size:17px;font-weight:700;color:#fff;margin-bottom:8px }
  .gm-card-desc { font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;margin-bottom:16px;flex:1 }
  .gm-badges { display:flex;gap:8px;justify-content:center;margin-bottom:18px;flex-wrap:wrap }
  .gm-badge { font-size:11px;padding:4px 12px;border-radius:20px;font-weight:500 }
  .gm-play-btn { padding:9px 22px;border-radius:10px;border:none;color:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:opacity 0.2s,transform 0.1s;font-family:inherit;display:flex;align-items:center;gap:6px }
  .gm-play-btn:hover { opacity:0.88 }
  .gm-play-btn:active { transform:scale(0.97) }

  .gm-coming-soon { background:rgba(255,255,255,0.02);border:1px dashed rgba(126,58,255,0.35);border-radius:20px;padding:36px;text-align:center }
  .gm-cs-icon { font-size:48px;margin-bottom:14px }
  .gm-cs-title { font-size:18px;font-weight:600;color:#fff;margin-bottom:8px }
  .gm-cs-text { color:rgba(255,255,255,0.4);font-size:14px;line-height:1.6 }

  @media(max-width:600px) { .gm-body{padding:24px 16px} .gm-title{font-size:24px} }
`;

const games = [
  {
    id: 1,
    title: 'Decision Tree Challenge',
    description: 'Build a decision tree by answering yes/no questions and watch the tree grow in real time!',
    icon: '🧠',
    color: '#7e3aff',
    gradient: 'linear-gradient(135deg,#7e3aff,#5b21b6)',
    difficulty: 'Easy',
    points: 100,
    delay: '0s',
  },
  {
    id: 2,
    title: 'Linear Regression Lab',
    description: 'Drag the slope and intercept sliders to find the best fit line for a scatter plot dataset.',
    icon: '📈',
    color: '#c43fc4',
    gradient: 'linear-gradient(135deg,#c43fc4,#7e3aff)',
    difficulty: 'Medium',
    points: 150,
    delay: '0.08s',
  },
  {
    id: 3,
    title: 'Neural Network Builder',
    description: 'Connect neurons, set weights, and watch activations flow through a live neural network.',
    icon: '⚡',
    color: '#f9a825',
    gradient: 'linear-gradient(135deg,#f9a825,#e65c00)',
    difficulty: 'Hard',
    points: 200,
    delay: '0.16s',
  },
  {
    id: 4,
    title: 'ML Algorithm Race',
    description: 'Race against the clock to match ML algorithms to their descriptions before time runs out!',
    icon: '🚀',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg,#ff6b6b,#c43fc4)',
    difficulty: 'Medium',
    points: 120,
    delay: '0.24s',
  },
];

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export default function Game() {
  const navigate = useNavigate();

  const handlePlay = (game) => {
    // placeholder: in future would route to game-specific page
    alert(`🎮 ${game.title} — Coming soon!\n\nThis interactive game will teach you ${game.title.split(' ')[0]} through hands-on play. Stay tuned!`);
  };

  const difficultyColor = (d) => d === 'Easy' ? '#4caf50' : d === 'Medium' ? '#f9a825' : '#ff6b6b';

  return (
    <>
      <style>{STYLES}</style>
      <div className="gm-scene">
        <div className="gm-blob gm-b1" />
        <div className="gm-blob gm-b2" />
        <div className="gm-blob gm-b3" />
        <div className="gm-blob gm-b4" />

        <header className="gm-header">
          <div className="gm-logo">
            <div className="gm-logo-ring"><div className="gm-logo-dot" /></div>
            <span className="gm-logo-text">AIML LEARN</span>
          </div>
          <button className="gm-back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft /> Dashboard
          </button>
        </header>

        <div className="gm-body">
          <div className="gm-title-section">
            <h1 className="gm-title">🎮 Learn Through Games</h1>
            <p className="gm-subtitle">Master AIML concepts by playing interactive, hands-on games</p>
          </div>

          <div className="gm-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className="gm-card"
                style={{ animationDelay: game.delay }}
                onClick={() => handlePlay(game)}
              >
                <div className="gm-icon-wrap" style={{ background: `${game.color}22` }}>
                  {game.icon}
                </div>
                <h3 className="gm-card-title">{game.title}</h3>
                <p className="gm-card-desc">{game.description}</p>
                <div className="gm-badges">
                  <span
                    className="gm-badge"
                    style={{ background: `${difficultyColor(game.difficulty)}20`, color: difficultyColor(game.difficulty) }}
                  >
                    {game.difficulty}
                  </span>
                  <span className="gm-badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                    🏆 {game.points} pts
                  </span>
                </div>
                <button className="gm-play-btn" style={{ background: game.gradient }}>
                  <PlayIcon /> Play Now
                </button>
              </div>
            ))}
          </div>

          <div className="gm-coming-soon">
            <div className="gm-cs-icon">🎯</div>
            <h3 className="gm-cs-title">More Games Coming Soon!</h3>
            <p className="gm-cs-text">
              We're building exciting new challenges to help you master{' '}
              <span style={{ color: '#a06eff', fontWeight: 600 }}>KNN, SVM, Clustering, Deep Learning & more!</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}