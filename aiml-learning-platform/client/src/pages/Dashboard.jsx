import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { getUserProfile } from '../services/api'

/* ─── Global styles ─────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#07040f;color:#fff;min-height:100vh}

  @keyframes vb-float1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}
  @keyframes vb-float2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,20px) scale(1.03)}66%{transform:translate(20px,-25px) scale(0.96)}}
  @keyframes vb-float3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,30px) scale(1.04)}}
  @keyframes vb-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes vb-pulse{0%,100%{box-shadow:0 0 0 0 rgba(126,90,255,.4)}50%{box-shadow:0 0 0 12px rgba(126,90,255,0)}}
  @keyframes vb-slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes vb-fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes vb-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes vb-bar{from{width:0}to{width:var(--w)}}
  @keyframes vb-count{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes vb-ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(1.8);opacity:0}}
  @keyframes vb-streak{0%{transform:scale(1) rotate(-5deg)}50%{transform:scale(1.15) rotate(5deg)}100%{transform:scale(1) rotate(-5deg)}}

  /* ── Layout ── */
  .vb-root{display:flex;min-height:100vh;position:relative;overflow-x:hidden}
  .vb-bg{position:fixed;inset:0;pointer-events:none;z-index:0}
  .vb-blob{position:absolute;border-radius:50%;filter:blur(90px);will-change:transform}
  .vb-b1{width:600px;height:600px;background:radial-gradient(circle,rgba(90,30,180,.6) 0%,transparent 70%);top:-200px;left:-150px;animation:vb-float1 14s ease-in-out infinite}
  .vb-b2{width:500px;height:500px;background:radial-gradient(circle,rgba(160,30,130,.5) 0%,transparent 70%);bottom:-150px;right:-100px;animation:vb-float2 18s ease-in-out infinite}
  .vb-b3{width:380px;height:380px;background:radial-gradient(circle,rgba(40,20,120,.7) 0%,transparent 70%);top:45%;left:50%;animation:vb-float3 12s ease-in-out infinite}

  /* ── Sidebar ── */
  .vb-sidebar{position:fixed;left:0;top:0;bottom:0;width:240px;background:rgba(255,255,255,.03);border-right:1px solid rgba(255,255,255,.07);backdrop-filter:blur(20px);z-index:100;display:flex;flex-direction:column;padding:28px 16px;gap:6px;animation:vb-fadeIn .4s ease both}
  .vb-logo{display:flex;align-items:center;gap:10px;padding:0 8px;margin-bottom:28px}
  .vb-logo-ring{width:34px;height:34px;border-radius:50%;border:2px solid rgba(180,120,255,.7);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .vb-logo-dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#a06eff,#e060d0)}
  .vb-logo-text{font-family:'Syne',sans-serif;font-size:14px;font-weight:800;letter-spacing:3px;background:linear-gradient(90deg,#c49fff,#e87fe8,#a06eff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:vb-shimmer 3s linear infinite}
  .vb-nav-label{font-size:10px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,.25);text-transform:uppercase;padding:12px 10px 6px}
  .vb-nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:rgba(255,255,255,.5);font-size:13.5px;font-weight:500;text-decoration:none;transition:all .2s;cursor:pointer;border:none;background:none;width:100%;font-family:inherit}
  .vb-nav-item:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.9)}
  .vb-nav-item.active{background:linear-gradient(135deg,rgba(126,58,255,.25),rgba(196,63,196,.2));color:#fff;border:1px solid rgba(160,100,255,.2)}
  .vb-nav-icon{font-size:16px;width:20px;text-align:center}
  .vb-sidebar-bottom{margin-top:auto;padding-top:16px;border-top:1px solid rgba(255,255,255,.07)}
  .vb-user-pill{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.04)}
  .vb-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7e3aff,#c43fc4);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;flex-shrink:0}
  .vb-user-info{flex:1;min-width:0}
  .vb-user-name{font-size:13px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .vb-user-role{font-size:11px;color:rgba(255,255,255,.35)}
  .vb-logout-btn{background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;font-size:16px;padding:4px;transition:color .2s;flex-shrink:0}
  .vb-logout-btn:hover{color:#ff7eb3}

  /* ── Main content ── */
  .vb-main{margin-left:240px;flex:1;padding:32px 36px;position:relative;z-index:1;animation:vb-slideUp .5s ease both}
  .vb-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px}
  .vb-page-title{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff}
  .vb-page-sub{font-size:13px;color:rgba(255,255,255,.4);margin-top:3px}
  .vb-date-chip{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:6px 14px;font-size:12px;color:rgba(255,255,255,.45)}

  /* ── Stat cards ── */
  .vb-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
  .vb-stat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px 22px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s;animation:vb-slideUp .5s ease both}
  .vb-stat:hover{border-color:rgba(160,100,255,.3);transform:translateY(-2px)}
  .vb-stat::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(126,58,255,.06),transparent);opacity:0;transition:opacity .2s}
  .vb-stat:hover::before{opacity:1}
  .vb-stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:14px}
  .vb-stat-val{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;line-height:1;margin-bottom:4px;animation:vb-count .4s ease both}
  .vb-stat-label{font-size:12px;color:rgba(255,255,255,.4);font-weight:400}
  .vb-stat-delta{font-size:11px;margin-top:8px;display:flex;align-items:center;gap:4px}
  .vb-delta-up{color:#7bffd4}
  .vb-delta-neu{color:rgba(255,255,255,.3)}

  /* ── Grid layout ── */
  .vb-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
  .vb-col2{grid-column:span 2}
  .vb-col1{grid-column:span 1}

  /* ── Cards ── */
  .vb-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px;transition:border-color .2s}
  .vb-card:hover{border-color:rgba(160,100,255,.2)}
  .vb-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
  .vb-card-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff}
  .vb-card-action{font-size:12px;color:rgba(160,100,255,.8);cursor:pointer;text-decoration:none;transition:color .2s}
  .vb-card-action:hover{color:#c49fff}

  /* ── Module list ── */
  .vb-module{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)}
  .vb-module:last-child{border-bottom:none;padding-bottom:0}
  .vb-module-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
  .vb-module-info{flex:1;min-width:0}
  .vb-module-name{font-size:13.5px;font-weight:500;color:#fff;margin-bottom:3px}
  .vb-module-meta{font-size:11px;color:rgba(255,255,255,.35)}
  .vb-module-prog{width:80px}
  .vb-prog-bar{height:4px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
  .vb-prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#7e3aff,#c43fc4);animation:vb-bar .8s ease both}
  .vb-prog-pct{font-size:10px;color:rgba(255,255,255,.35);text-align:right;margin-top:3px}
  .vb-badge-chip{font-size:10px;padding:3px 8px;border-radius:20px;font-weight:500;white-space:nowrap}
  .vb-chip-done{background:rgba(123,255,212,.1);color:#7bffd4;border:1px solid rgba(123,255,212,.2)}
  .vb-chip-prog{background:rgba(126,58,255,.15);color:#c49fff;border:1px solid rgba(126,58,255,.2)}
  .vb-chip-lock{background:rgba(255,255,255,.05);color:rgba(255,255,255,.3);border:1px solid rgba(255,255,255,.08)}

  /* ── Quiz scores ── */
  .vb-quiz-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)}
  .vb-quiz-row:last-child{border-bottom:none}
  .vb-quiz-rank{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:rgba(255,255,255,.25);width:20px}
  .vb-quiz-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:'Syne',sans-serif;flex-shrink:0}
  .vb-quiz-name{flex:1;font-size:13px;color:rgba(255,255,255,.8)}
  .vb-quiz-score{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#c49fff}
  .vb-quiz-bar-wrap{width:70px;height:4px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
  .vb-quiz-bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#7e3aff,#e060d0)}

  /* ── Activity feed ── */
  .vb-activity{display:flex;flex-direction:column;gap:12px}
  .vb-act-item{display:flex;align-items:flex-start;gap:12px}
  .vb-act-dot-wrap{display:flex;flex-direction:column;align-items:center;gap:0}
  .vb-act-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
  .vb-act-line{width:1px;flex:1;background:rgba(255,255,255,.06);min-height:18px;margin-top:4px}
  .vb-act-body{flex:1}
  .vb-act-text{font-size:13px;color:rgba(255,255,255,.7);line-height:1.5}
  .vb-act-time{font-size:11px;color:rgba(255,255,255,.25);margin-top:2px}

  /* ── XP / Level ── */
  .vb-level-wrap{display:flex;align-items:center;gap:16px;margin-bottom:18px}
  .vb-level-badge{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#7e3aff,#c43fc4);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;animation:vb-pulse 2s ease infinite}
  .vb-level-num{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#fff;line-height:1}
  .vb-level-lbl{font-size:9px;color:rgba(255,255,255,.6);letter-spacing:1px}
  .vb-xp-info{flex:1}
  .vb-xp-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#fff}
  .vb-xp-sub{font-size:12px;color:rgba(255,255,255,.35);margin-bottom:8px}
  .vb-xp-bar-bg{height:6px;background:rgba(255,255,255,.07);border-radius:6px;overflow:hidden}
  .vb-xp-bar-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,#7e3aff,#e060d0);animation:vb-bar .9s ease both}

  /* ── Badges ── */
  .vb-badges{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .vb-badge{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);transition:all .2s}
  .vb-badge:hover{background:rgba(255,255,255,.07);border-color:rgba(160,100,255,.2)}
  .vb-badge-icon{font-size:22px}
  .vb-badge-name{font-size:10px;color:rgba(255,255,255,.45);text-align:center;line-height:1.3}
  .vb-badge.earned .vb-badge-name{color:rgba(200,160,255,.8)}
  .vb-badge.earned{border-color:rgba(126,58,255,.3);background:rgba(126,58,255,.08)}

  /* ── Quick action buttons ── */
  .vb-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .vb-action-btn{display:flex;align-items:center;gap:10px;padding:13px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(255,255,255,.8);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;text-decoration:none;font-family:inherit}
  .vb-action-btn:hover{background:rgba(126,58,255,.15);border-color:rgba(126,58,255,.3);color:#fff;transform:translateY(-1px)}
  .vb-action-icon{font-size:18px}

  /* ── Streak ── */
  .vb-streak{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:12px;background:linear-gradient(135deg,rgba(255,160,50,.08),rgba(255,100,50,.05));border:1px solid rgba(255,160,50,.15);margin-bottom:16px}
  .vb-streak-flame{font-size:24px;animation:vb-streak 2s ease-in-out infinite}
  .vb-streak-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#ffb347}
  .vb-streak-lbl{font-size:12px;color:rgba(255,255,255,.5)}

  /* ── Loading ── */
  .vb-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:16px}
  .vb-spinner{width:36px;height:36px;border:2px solid rgba(255,255,255,.1);border-top-color:#a06eff;border-radius:50%;animation:vb-spin .7s linear infinite}
  .vb-loading-text{font-size:13px;color:rgba(255,255,255,.35)}

  /* ── Responsive ── */
  @media(max-width:1100px){.vb-stats{grid-template-columns:repeat(2,1fr)}.vb-grid{grid-template-columns:1fr 1fr}.vb-col2{grid-column:span 2}.vb-col1{grid-column:span 1}}
  @media(max-width:900px){.vb-sidebar{display:none}.vb-main{margin-left:0;padding:24px}.vb-grid{grid-template-columns:1fr}.vb-col2,.vb-col1{grid-column:span 1}}
  @media(max-width:600px){.vb-stats{grid-template-columns:1fr 1fr}.vb-badges{grid-template-columns:repeat(4,1fr)}}
`

/* ─── Data ─────────────────────────────────────────────────────────── */
const NAV = [
  { icon: '◈', label: 'Dashboard', path: '/dashboard' },
  { icon: '⬡', label: 'Learn',     path: '/learn' },
  { icon: '◎', label: 'Quiz',      path: '/quiz' },
  { icon: '⬟', label: 'Games',     path: '/game' },
  { icon: '⌨', label: 'Playground',path: '/playground' },
]

const MODULES = [
  { name: 'Intro to Machine Learning', icon: '🧠', color: 'rgba(126,58,255,.2)', level: 'Beginner', pct: 100, status: 'done' },
  { name: 'Supervised Learning', icon: '📐', color: 'rgba(196,63,196,.2)', level: 'Beginner', pct: 100, status: 'done' },
  { name: 'Neural Networks 101', icon: '⚡', color: 'rgba(90,30,180,.25)', level: 'Intermediate', pct: 60, status: 'prog' },
  { name: 'Decision Trees & Forests', icon: '🌲', color: 'rgba(40,140,80,.2)', level: 'Intermediate', pct: 0, status: 'lock' },
  { name: 'Deep Learning Architectures', icon: '🔮', color: 'rgba(160,30,130,.2)', level: 'Advanced', pct: 0, status: 'lock' },
]

const LEADERBOARD = [
  { name: 'Aryan K.', score: 2840, color: '#ffd700', bg: 'rgba(255,215,0,.15)' },
  { name: 'Priya S.', score: 2610, color: '#c0c0c0', bg: 'rgba(192,192,192,.12)' },
  { name: 'Mihail T.', score: 2390, color: '#cd7f32', bg: 'rgba(205,127,50,.12)' },
  { name: 'You',       score: 1750, color: '#a06eff', bg: 'rgba(160,100,255,.15)' },
  { name: 'Sofia R.',  score: 1620, color: '#888', bg: 'rgba(255,255,255,.06)' },
]

const ACTIVITY = [
  { text: 'Completed "Supervised Learning" module', time: '2h ago', color: '#7bffd4' },
  { text: 'Scored 92% on Neural Networks Quiz', time: '5h ago', color: '#a06eff' },
  { text: 'Earned "Quick Learner" badge', time: 'Yesterday', color: '#ffb347' },
  { text: 'Started "Neural Networks 101"', time: '2 days ago', color: '#c49fff' },
  { text: 'Joined Vibethon platform', time: '3 days ago', color: '#7bffd4' },
]

const BADGES = [
  { icon: '🚀', name: 'First Launch', earned: true },
  { icon: '⚡', name: 'Quick Learner', earned: true },
  { icon: '🎯', name: 'Sharpshooter', earned: true },
  { icon: '🔥', name: '7-Day Streak', earned: false },
  { icon: '🏆', name: 'Top 10', earned: false },
  { icon: '🧬', name: 'Deep Diver', earned: false },
  { icon: '🤖', name: 'AI Master', earned: false },
  { icon: '💎', name: 'Diamond', earned: false },
]

/* ─── Component ─────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await getUserProfile()
      setUser(data)
    } catch {
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
    navigate('/')
  }

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="vb-loading">
        <div className="vb-spinner" />
        <span className="vb-loading-text">Loading your workspace…</span>
      </div>
    </>
  )

  const quizScore       = user?.progress?.quizScore || 0
  const modulesCount    = user?.progress?.modulesCompleted?.length || 2
  const xpTotal         = quizScore + modulesCount * 200
  const xpLevel         = Math.floor(xpTotal / 500) + 1
  const xpPct           = ((xpTotal % 500) / 500 * 100).toFixed(0)
  const initials        = (user?.name || 'U').charAt(0).toUpperCase()
  const streak          = 5

  return (
    <>
      <style>{STYLES}</style>
      <div className="vb-root">

        {/* Background blobs */}
        <div className="vb-bg">
          <div className="vb-blob vb-b1" />
          <div className="vb-blob vb-b2" />
          <div className="vb-blob vb-b3" />
        </div>

        {/* Sidebar */}
        <aside className="vb-sidebar">
          <div className="vb-logo">
            <div className="vb-logo-ring"><div className="vb-logo-dot" /></div>
            <span className="vb-logo-text">AIMLify</span>
          </div>

          <span className="vb-nav-label">Menu</span>
          {NAV.map(n => (
            <Link key={n.path} to={n.path}
              className={`vb-nav-item${location.pathname === n.path ? ' active' : ''}`}>
              <span className="vb-nav-icon">{n.icon}</span>
              {n.label}
            </Link>
          ))}

          <div className="vb-sidebar-bottom">
            <div className="vb-user-pill">
              <div className="vb-avatar">{initials}</div>
              <div className="vb-user-info">
                <div className="vb-user-name">{user?.name || 'Learner'}</div>
                <div className="vb-user-role">Level {xpLevel} · {xpTotal} XP</div>
              </div>
              <button className="vb-logout-btn" onClick={handleLogout} title="Logout">⏻</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="vb-main">

          {/* Topbar */}
          <div className="vb-topbar">
            <div>
              <div className="vb-page-title">Welcome back, {user?.name?.split(' ')[0] || 'Learner'} 👋</div>
              <div className="vb-page-sub">Here's your learning snapshot for today</div>
            </div>
            <div className="vb-date-chip">{today}</div>
          </div>

          {/* Stat cards */}
          <div className="vb-stats">
            {[
              { icon:'🏅', bg:'rgba(126,58,255,.2)',  val: quizScore,      label:'Quiz Score',         delta:'+120 this week',  up:true },
              { icon:'📚', bg:'rgba(196,63,196,.2)',  val: modulesCount,   label:'Modules Done',       delta:'2 in progress',   up:false },
              { icon:'⚡', bg:'rgba(255,180,50,.15)', val: xpTotal,        label:'Total XP',           delta:`Level ${xpLevel}`, up:true },
              { icon:'🔥', bg:'rgba(255,100,50,.15)', val: `${streak}d`,   label:'Current Streak',     delta:'Personal best!',  up:true },
            ].map((s,i) => (
              <div className="vb-stat" key={i} style={{ animationDelay: `${i*0.08}s` }}>
                <div className="vb-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div className="vb-stat-val">{s.val}</div>
                <div className="vb-stat-label">{s.label}</div>
                <div className={`vb-stat-delta ${s.up ? 'vb-delta-up' : 'vb-delta-neu'}`}>
                  {s.up ? '↑' : '·'} {s.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="vb-grid">

            {/* Learning Modules — col span 2 */}
            <div className="vb-card vb-col2">
              <div className="vb-card-head">
                <span className="vb-card-title">Learning Modules</span>
                <Link to="/learn" className="vb-card-action">View all →</Link>
              </div>
              {MODULES.map((m, i) => (
                <div className="vb-module" key={i}>
                  <div className="vb-module-icon" style={{ background: m.color }}>{m.icon}</div>
                  <div className="vb-module-info">
                    <div className="vb-module-name">{m.name}</div>
                    <div className="vb-module-meta">{m.level}</div>
                  </div>
                  <div className="vb-module-prog">
                    <div className="vb-prog-bar">
                      <div className="vb-prog-fill" style={{ '--w': `${m.pct}%`, width: `${m.pct}%` }} />
                    </div>
                    <div className="vb-prog-pct">{m.pct}%</div>
                  </div>
                  <span className={`vb-badge-chip ${m.status === 'done' ? 'vb-chip-done' : m.status === 'prog' ? 'vb-chip-prog' : 'vb-chip-lock'}`}>
                    {m.status === 'done' ? '✓ Done' : m.status === 'prog' ? 'In Progress' : '🔒 Locked'}
                  </span>
                </div>
              ))}
            </div>

            {/* Level & XP */}
            <div className="vb-card vb-col1">
              <div className="vb-card-head">
                <span className="vb-card-title">Level & XP</span>
              </div>

              {/* Streak */}
              <div className="vb-streak">
                <span className="vb-streak-flame">🔥</span>
                <div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span className="vb-streak-val">{streak}</span>
                    <span className="vb-streak-lbl">day streak</span>
                  </div>
                  <div style={{ fontSize:11, color:'rgba(255,180,50,.6)', marginTop:2 }}>Keep it going!</div>
                </div>
              </div>

              {/* XP bar */}
              <div className="vb-level-wrap">
                <div className="vb-level-badge">
                  <span className="vb-level-num">{xpLevel}</span>
                  <span className="vb-level-lbl">LVL</span>
                </div>
                <div className="vb-xp-info">
                  <div className="vb-xp-title">Apprentice AI</div>
                  <div className="vb-xp-sub">{xpTotal} / {xpLevel * 500} XP</div>
                  <div className="vb-xp-bar-bg">
                    <div className="vb-xp-bar-fill" style={{ '--w': `${xpPct}%`, width: `${xpPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="vb-card-head" style={{ marginBottom:12 }}>
                <span className="vb-card-title" style={{ fontSize:13 }}>Badges</span>
                <span className="vb-card-action">3 / 8 earned</span>
              </div>
              <div className="vb-badges">
                {BADGES.map((b,i) => (
                  <div key={i} className={`vb-badge${b.earned ? ' earned' : ''}`}
                    style={{ opacity: b.earned ? 1 : 0.45 }}>
                    <span className="vb-badge-icon">{b.icon}</span>
                    <span className="vb-badge-name">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="vb-card vb-col1">
              <div className="vb-card-head">
                <span className="vb-card-title">Leaderboard</span>
                <span className="vb-card-action">This week</span>
              </div>
              {LEADERBOARD.map((l, i) => (
                <div className="vb-quiz-row" key={i}>
                  <span className="vb-quiz-rank">#{i+1}</span>
                  <div className="vb-quiz-avatar" style={{ background: l.bg, color: l.color }}>{l.name.charAt(0)}</div>
                  <span className="vb-quiz-name" style={{ color: l.name === 'You' ? '#c49fff' : undefined, fontWeight: l.name === 'You' ? 600 : 400 }}>{l.name}</span>
                  <div className="vb-quiz-bar-wrap">
                    <div className="vb-quiz-bar-fill" style={{ width: `${(l.score/2840*100).toFixed(0)}%` }} />
                  </div>
                  <span className="vb-quiz-score">{l.score.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="vb-card vb-col1">
              <div className="vb-card-head">
                <span className="vb-card-title">Quick Actions</span>
              </div>
              <div className="vb-actions">
                {[
                  { icon:'📚', label:'Continue Learning', path:'/learn' },
                  { icon:'📝', label:'Take a Quiz',       path:'/quiz' },
                  { icon:'🎮', label:'Play Games',        path:'/game' },
                  { icon:'💻', label:'Playground',        path:'/playground' },
                ].map((a,i) => (
                  <Link to={a.path} key={i} className="vb-action-btn">
                    <span className="vb-action-icon">{a.icon}</span>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="vb-card vb-col1">
              <div className="vb-card-head">
                <span className="vb-card-title">Recent Activity</span>
              </div>
              <div className="vb-activity">
                {ACTIVITY.map((a, i) => (
                  <div className="vb-act-item" key={i}>
                    <div className="vb-act-dot-wrap">
                      <div className="vb-act-dot" style={{ background: a.color }} />
                      {i < ACTIVITY.length - 1 && <div className="vb-act-line" />}
                    </div>
                    <div className="vb-act-body">
                      <div className="vb-act-text">{a.text}</div>
                      <div className="vb-act-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end grid */}
        </main>
      </div>
    </>
  )
}