import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  /* ── Keyframes ── */
  @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}30%{transform:translate(50px,-40px) scale(1.08)}65%{transform:translate(-30px,25px) scale(0.94)}}
  @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-40px,30px) scale(1.05)}70%{transform:translate(30px,-35px) scale(0.96)}}
  @keyframes blob3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,40px) scale(1.07)}}
  @keyframes blob4{0%,100%{transform:translate(0,0)}45%{transform:translate(-20px,-25px) scale(0.93)}}
  @keyframes gridMove{0%{transform:translateY(0)}100%{transform:translateY(64px)}}
  @keyframes shimmer{0%{background-position:-400% center}100%{background-position:400% center}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
  @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
  @keyframes typewriter{from{width:0}to{width:100%}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes counterUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cardHover{from{transform:translateY(0) scale(1)}to{transform:translateY(-6px) scale(1.01)}}
  @keyframes orbitRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes particleDrift{0%{transform:translate(0,0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  :root{
    --purple: #7c3aed;
    --purple-light: #a855f7;
    --pink: #be185d;
    --pink-light: #ec4899;
    --bg: #060412;
    --bg2: #0a0620;
    --card-bg: rgba(10,6,30,.6);
    --border: rgba(139,92,246,.15);
    --border-bright: rgba(139,92,246,.35);
    --text: #f3e8ff;
    --text-muted: rgba(216,180,254,.55);
    --text-dim: rgba(216,180,254,.28);
  }

  html{scroll-behavior:smooth}

  .hm-root{
    width:100%;min-height:100vh;
    background:var(--bg);
    font-family:'DM Sans',sans-serif;
    color:var(--text);
    overflow-x:hidden;
  }

  /* ── Background scene ── */
  .hm-scene{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
  .hm-grid{
    position:absolute;inset:0;
    background-image:
      linear-gradient(rgba(139,92,246,.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,.055) 1px, transparent 1px);
    background-size:64px 64px;
    animation:gridMove 10s linear infinite;
  }
  .hm-blob{position:absolute;border-radius:50%;filter:blur(100px);will-change:transform}
  .hm-b1{width:700px;height:700px;background:radial-gradient(circle,rgba(109,40,217,.65) 0%,transparent 68%);top:-200px;left:-180px;animation:blob1 16s ease-in-out infinite}
  .hm-b2{width:580px;height:580px;background:radial-gradient(circle,rgba(190,24,93,.55) 0%,transparent 68%);bottom:-180px;right:-120px;animation:blob2 19s ease-in-out infinite}
  .hm-b3{width:420px;height:420px;background:radial-gradient(circle,rgba(49,25,130,.8) 0%,transparent 68%);top:40%;left:50%;animation:blob3 13s ease-in-out infinite}
  .hm-b4{width:300px;height:300px;background:radial-gradient(circle,rgba(124,20,120,.4) 0%,transparent 68%);top:20%;right:10%;animation:blob4 22s ease-in-out infinite}

  /* ── Navbar ── */
  .hm-nav{
    position:fixed;top:0;left:0;right:0;z-index:100;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 48px;height:68px;
    background:rgba(6,4,18,.75);
    border-bottom:1px solid var(--border);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
  }
  .hm-nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
  .hm-nav-icon{
    width:32px;height:32px;
    background:linear-gradient(135deg,var(--purple),var(--pink));
    border-radius:8px;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 16px rgba(124,58,237,.35);
  }
  .hm-nav-icon svg{width:17px;height:17px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .hm-nav-name{
    font-family:'Syne',sans-serif;font-size:18px;font-weight:800;letter-spacing:1px;
    background:linear-gradient(90deg,#c084fc,#f0abfc,#e879f9,#a855f7);
    background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    animation:shimmer 4s linear infinite;
  }
  .hm-nav-links{display:flex;align-items:center;gap:32px}
  .hm-nav-link{
    font-size:13.5px;font-weight:400;color:var(--text-muted);
    text-decoration:none;letter-spacing:.3px;
    transition:color .2s;position:relative;
  }
  .hm-nav-link::after{
    content:'';position:absolute;bottom:-3px;left:0;right:0;height:1px;
    background:linear-gradient(90deg,var(--purple-light),var(--pink-light));
    transform:scaleX(0);transition:transform .2s;transform-origin:left;
  }
  .hm-nav-link:hover{color:var(--text)}
  .hm-nav-link:hover::after{transform:scaleX(1)}
  .hm-nav-actions{display:flex;align-items:center;gap:12px}
  .hm-btn-ghost{
    padding:8px 20px;border-radius:8px;border:1px solid var(--border-bright);
    background:transparent;color:var(--text-muted);font-size:13px;font-weight:500;
    cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;text-decoration:none;
    display:inline-flex;align-items:center;
  }
  .hm-btn-ghost:hover{background:rgba(139,92,246,.1);color:var(--text);border-color:rgba(168,85,247,.5)}
  .hm-btn-primary{
    padding:9px 22px;border-radius:9px;border:none;
    background:linear-gradient(135deg,var(--purple),var(--pink));
    color:#fff;font-size:13px;font-weight:600;
    cursor:pointer;transition:all .2s;font-family:'Syne',sans-serif;
    letter-spacing:.3px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;
    box-shadow:0 4px 20px rgba(124,58,237,.3);
  }
  .hm-btn-primary:hover{box-shadow:0 6px 28px rgba(124,58,237,.5);transform:translateY(-1px)}

  /* ── Page wrapper ── */
  .hm-page{position:relative;z-index:1;padding-top:68px}

  /* ── Hero ── */
  .hm-hero{
    min-height:calc(100vh - 68px);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;padding:80px 24px 60px;
  }
  .hm-hero-badge{
    display:inline-flex;align-items:center;gap:8px;
    border:1px solid rgba(168,85,247,.3);border-radius:20px;
    padding:6px 16px;
    background:rgba(124,58,237,.1);
    font-size:11.5px;font-weight:500;letter-spacing:.8px;
    color:rgba(216,180,254,.75);text-transform:uppercase;
    margin-bottom:32px;
    animation:fadeUp .6s ease both;
  }
  .hm-hero-badge-dot{
    width:6px;height:6px;border-radius:50%;
    background:var(--purple-light);
    box-shadow:0 0 6px var(--purple-light);
    animation:pulse 1.8s ease-in-out infinite;
  }
  .hm-hero-headline{
    font-family:'Syne',sans-serif;
    font-size:clamp(42px,7vw,88px);
    font-weight:900;
    line-height:1.0;
    letter-spacing:-1.5px;
    margin-bottom:24px;
    animation:fadeUp .65s .1s ease both;
  }
  .hm-hero-headline .line1{display:block;color:var(--text)}
  .hm-hero-headline .line2{
    display:block;
    background:linear-gradient(120deg,#c084fc 0%,#f472b6 40%,#818cf8 80%,#c084fc 100%);
    background-size:300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    animation:shimmer 5s linear infinite;
  }
  .hm-hero-sub{
    max-width:560px;
    font-size:17px;font-weight:300;line-height:1.7;
    color:var(--text-muted);
    margin-bottom:44px;
    animation:fadeUp .7s .2s ease both;
  }
  .hm-hero-actions{
    display:flex;gap:14px;flex-wrap:wrap;justify-content:center;
    animation:fadeUp .75s .3s ease both;
    margin-bottom:72px;
  }
  .hm-btn-xl{
    padding:15px 34px;border-radius:12px;border:none;
    background:linear-gradient(135deg,var(--purple),var(--pink));
    color:#fff;font-size:15px;font-weight:700;
    cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:.4px;
    text-decoration:none;display:inline-flex;align-items:center;gap:8px;
    box-shadow:0 8px 32px rgba(124,58,237,.4);
    transition:all .25s;
  }
  .hm-btn-xl:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(124,58,237,.55)}
  .hm-btn-xl-ghost{
    padding:15px 34px;border-radius:12px;
    border:1px solid var(--border-bright);
    background:rgba(255,255,255,.03);
    color:var(--text);font-size:15px;font-weight:500;
    cursor:pointer;font-family:'DM Sans',sans-serif;
    text-decoration:none;display:inline-flex;align-items:center;gap:8px;
    transition:all .25s;
  }
  .hm-btn-xl-ghost:hover{background:rgba(139,92,246,.1);border-color:rgba(168,85,247,.45)}

  /* Hero visual — orbit */
  .hm-orbit-wrap{
    position:relative;width:320px;height:320px;
    animation:fadeIn 1s .5s ease both;
    flex-shrink:0;
  }
  .hm-orbit-core{
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%);
    width:110px;height:110px;border-radius:50%;
    background:linear-gradient(135deg,var(--purple),var(--pink));
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 60px rgba(124,58,237,.5),0 0 120px rgba(190,24,93,.25);
    animation:float 4s ease-in-out infinite;
  }
  .hm-orbit-core svg{width:46px;height:46px;fill:none;stroke:#fff;stroke-width:1.5;stroke-linecap:round}
  .hm-orbit-ring{
    position:absolute;top:50%;left:50%;border-radius:50%;border-style:solid;
    transform:translate(-50%,-50%);
  }
  .hm-ring1{
    width:180px;height:180px;
    border:1px solid rgba(168,85,247,.25);
    animation:orbitRing 8s linear infinite;
  }
  .hm-ring2{
    width:260px;height:260px;
    border:1px dashed rgba(236,72,153,.18);
    animation:orbitRing 14s linear infinite reverse;
  }
  .hm-ring3{
    width:320px;height:320px;
    border:1px solid rgba(99,102,241,.12);
    animation:orbitRing 22s linear infinite;
  }
  .hm-orbit-dot{
    position:absolute;border-radius:50%;
    background:linear-gradient(135deg,var(--purple-light),var(--pink-light));
    box-shadow:0 0 10px var(--purple-light);
  }
  .hm-od1{width:12px;height:12px;top:0;left:50%;transform:translateX(-50%)}
  .hm-od2{width:9px;height:9px;bottom:0;left:50%;transform:translateX(-50%)}
  .hm-od3{width:10px;height:10px;top:50%;right:0;transform:translateY(-50%)}

  /* ── Stats strip ── */
  .hm-stats{
    display:flex;align-items:center;justify-content:center;
    gap:0;flex-wrap:wrap;
    background:rgba(10,6,30,.5);
    border-top:1px solid var(--border);border-bottom:1px solid var(--border);
    padding:28px 48px;
  }
  .hm-stat{
    flex:1;min-width:160px;text-align:center;
    padding:0 32px;
    border-right:1px solid var(--border);
  }
  .hm-stat:last-child{border-right:none}
  .hm-stat-num{
    font-family:'Syne',sans-serif;font-size:36px;font-weight:800;
    background:linear-gradient(135deg,#c084fc,#f472b6);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    line-height:1;margin-bottom:6px;
  }
  .hm-stat-label{font-size:12px;color:var(--text-dim);letter-spacing:.5px;text-transform:uppercase}

  /* ── Section common ── */
  .hm-section{padding:100px 48px;max-width:1200px;margin:0 auto}
  .hm-section-tag{
    display:inline-block;
    font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;
    color:rgba(192,132,252,.65);border:1px solid rgba(139,92,246,.2);
    border-radius:20px;padding:4px 14px;
    background:rgba(124,58,237,.07);margin-bottom:18px;
  }
  .hm-section-title{
    font-family:'Syne',sans-serif;font-size:clamp(30px,4vw,48px);
    font-weight:800;line-height:1.15;letter-spacing:-.5px;
    color:var(--text);margin-bottom:14px;
  }
  .hm-section-title span{
    background:linear-gradient(90deg,#c084fc,#f472b6);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  }
  .hm-section-sub{font-size:16px;font-weight:300;color:var(--text-muted);line-height:1.7;max-width:560px}

  /* ── Feature cards ── */
  .hm-features-grid{
    display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:20px;margin-top:56px;
  }
  .hm-feat-card{
    background:var(--card-bg);
    border:1px solid var(--border);border-radius:18px;
    padding:32px 28px;
    backdrop-filter:blur(16px);
    transition:border-color .3s,transform .3s,box-shadow .3s;
    cursor:default;position:relative;overflow:hidden;
  }
  .hm-feat-card::before{
    content:'';position:absolute;
    top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(168,85,247,.4),transparent);
    opacity:0;transition:opacity .3s;
  }
  .hm-feat-card:hover{
    border-color:rgba(168,85,247,.35);
    transform:translateY(-5px);
    box-shadow:0 20px 60px rgba(0,0,0,.4),0 0 40px rgba(124,58,237,.1);
  }
  .hm-feat-card:hover::before{opacity:1}
  .hm-feat-icon{
    width:52px;height:52px;border-radius:13px;
    background:linear-gradient(135deg,rgba(124,58,237,.3),rgba(190,24,93,.25));
    border:1px solid rgba(168,85,247,.25);
    display:flex;align-items:center;justify-content:center;
    margin-bottom:20px;font-size:22px;
  }
  .hm-feat-title{
    font-family:'Syne',sans-serif;font-size:18px;font-weight:700;
    color:var(--text);margin-bottom:10px;
  }
  .hm-feat-desc{font-size:14px;font-weight:300;color:var(--text-muted);line-height:1.65}
  .hm-feat-tag{
    display:inline-block;margin-top:18px;
    font-size:10px;font-weight:500;letter-spacing:.8px;text-transform:uppercase;
    color:rgba(192,132,252,.6);border:1px solid rgba(139,92,246,.18);
    border-radius:20px;padding:3px 10px;
  }

  /* ── Learning path / Steps ── */
  .hm-path-wrap{
    display:grid;grid-template-columns:1fr 1fr;
    gap:60px;align-items:center;margin-top:56px;
  }
  .hm-path-steps{display:flex;flex-direction:column;gap:0}
  .hm-step{
    display:flex;gap:20px;padding:24px 0;
    border-bottom:1px solid var(--border);
    position:relative;
  }
  .hm-step:last-child{border-bottom:none}
  .hm-step-num{
    width:38px;height:38px;border-radius:10px;flex-shrink:0;
    background:linear-gradient(135deg,rgba(124,58,237,.35),rgba(190,24,93,.3));
    border:1px solid rgba(168,85,247,.3);
    display:flex;align-items:center;justify-content:center;
    font-family:'Syne',sans-serif;font-size:14px;font-weight:800;
    color:rgba(192,132,252,.9);
    margin-top:2px;
  }
  .hm-step-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--text);margin-bottom:6px}
  .hm-step-desc{font-size:13.5px;font-weight:300;color:var(--text-muted);line-height:1.6}

  /* Path visual */
  .hm-path-visual{
    position:relative;
    background:var(--card-bg);
    border:1px solid var(--border);border-radius:22px;
    padding:36px;
    backdrop-filter:blur(16px);
    overflow:hidden;
  }
  .hm-path-visual::before{
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(124,58,237,.08),rgba(190,24,93,.05));
    pointer-events:none;
  }
  .hm-pv-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:600;letter-spacing:1px;color:rgba(192,132,252,.6);text-transform:uppercase;margin-bottom:24px}
  .hm-pv-track{display:flex;flex-direction:column;gap:12px}
  .hm-pv-item{
    display:flex;align-items:center;gap:14px;
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
    border-radius:11px;padding:14px 16px;
    transition:border-color .2s;
  }
  .hm-pv-item:hover{border-color:rgba(168,85,247,.3)}
  .hm-pv-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
  .hm-pv-dot.done{background:var(--purple-light);box-shadow:0 0 8px var(--purple-light)}
  .hm-pv-dot.active{background:var(--pink-light);box-shadow:0 0 8px var(--pink-light);animation:pulse 1.5s ease-in-out infinite}
  .hm-pv-dot.locked{background:rgba(255,255,255,.15)}
  .hm-pv-name{flex:1;font-size:13.5px;color:var(--text);font-weight:400}
  .hm-pv-badge{font-size:10px;letter-spacing:.5px;padding:2px 8px;border-radius:20px;font-weight:500}
  .hm-pv-badge.done{color:#a78bfa;background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.25)}
  .hm-pv-badge.active{color:#f9a8d4;background:rgba(190,24,93,.15);border:1px solid rgba(190,24,93,.25)}
  .hm-pv-badge.locked{color:rgba(255,255,255,.25);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
  .hm-pv-progress-wrap{margin-top:24px}
  .hm-pv-progress-label{display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim);margin-bottom:8px}
  .hm-pv-bar{height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
  .hm-pv-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--pink-light));border-radius:3px;width:65%;transition:width 1s ease}

  /* ── Tools section ── */
  .hm-tools-grid{
    display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:16px;margin-top:56px;
  }
  .hm-tool-card{
    background:var(--card-bg);
    border:1px solid var(--border);border-radius:16px;
    padding:28px 24px;text-align:center;
    transition:all .3s;cursor:pointer;
    text-decoration:none;display:block;
  }
  .hm-tool-card:hover{
    border-color:rgba(168,85,247,.4);
    transform:translateY(-4px);
    box-shadow:0 16px 48px rgba(0,0,0,.4);
    background:rgba(124,58,237,.08);
  }
  .hm-tool-emoji{font-size:32px;margin-bottom:14px;display:block;animation:float 3s ease-in-out infinite}
  .hm-tool-card:nth-child(2) .hm-tool-emoji{animation-delay:.4s}
  .hm-tool-card:nth-child(3) .hm-tool-emoji{animation-delay:.8s}
  .hm-tool-card:nth-child(4) .hm-tool-emoji{animation-delay:1.2s}
  .hm-tool-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px}
  .hm-tool-desc{font-size:13px;font-weight:300;color:var(--text-muted);line-height:1.55}

  /* ── Testimonials ── */
  .hm-testi-grid{
    display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:20px;margin-top:56px;
  }
  .hm-testi-card{
    background:var(--card-bg);border:1px solid var(--border);
    border-radius:18px;padding:28px;backdrop-filter:blur(12px);
    transition:border-color .3s;
  }
  .hm-testi-card:hover{border-color:rgba(168,85,247,.3)}
  .hm-testi-quote{font-size:22px;color:rgba(192,132,252,.5);font-family:'Syne',sans-serif;line-height:1;margin-bottom:14px}
  .hm-testi-text{font-size:14px;font-weight:300;color:var(--text-muted);line-height:1.7;margin-bottom:20px}
  .hm-testi-author{display:flex;align-items:center;gap:12px}
  .hm-testi-avatar{
    width:38px;height:38px;border-radius:50%;
    background:linear-gradient(135deg,var(--purple),var(--pink));
    display:flex;align-items:center;justify-content:center;
    font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#fff;
    flex-shrink:0;
  }
  .hm-testi-name{font-family:'Syne',sans-serif;font-size:13.5px;font-weight:700;color:var(--text)}
  .hm-testi-role{font-size:11.5px;color:var(--text-dim)}
  .hm-stars{color:#f59e0b;font-size:11px;letter-spacing:2px;margin-bottom:12px}

  /* ── CTA ── */
  .hm-cta{
    margin:0 48px 80px;
    background:linear-gradient(135deg,rgba(124,58,237,.2),rgba(190,24,93,.15));
    border:1px solid rgba(168,85,247,.25);
    border-radius:28px;
    padding:80px 48px;text-align:center;
    position:relative;overflow:hidden;
  }
  .hm-cta::before{
    content:'';position:absolute;top:-1px;left:10%;right:10%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(168,85,247,.5),transparent);
  }
  .hm-cta-title{
    font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,52px);
    font-weight:900;color:var(--text);letter-spacing:-.5px;margin-bottom:16px;
  }
  .hm-cta-sub{font-size:16px;font-weight:300;color:var(--text-muted);margin-bottom:36px}
  .hm-cta-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}

  /* ── Footer ── */
  .hm-footer{
    border-top:1px solid var(--border);
    padding:40px 48px;
    display:flex;align-items:center;justify-content:space-between;
    flex-wrap:wrap;gap:16px;
  }
  .hm-footer-copy{font-size:12px;color:var(--text-dim);letter-spacing:.3px}
  .hm-footer-links{display:flex;gap:24px}
  .hm-footer-link{font-size:12px;color:var(--text-dim);text-decoration:none;transition:color .2s}
  .hm-footer-link:hover{color:rgba(192,132,252,.7)}

  /* ── Responsive ── */
  @media(max-width:768px){
    .hm-nav{padding:0 20px}
    .hm-nav-links{display:none}
    .hm-section{padding:70px 20px}
    .hm-path-wrap{grid-template-columns:1fr}
    .hm-stats{gap:8px}
    .hm-stat{min-width:120px;padding:0 16px;border-right:none;border-bottom:1px solid var(--border)}
    .hm-stat:last-child{border-bottom:none}
    .hm-cta{margin:0 20px 60px;padding:52px 24px}
    .hm-footer{flex-direction:column;align-items:center;text-align:center;padding:32px 20px}
    .hm-hero{padding:60px 20px 40px}
  }
`;

/* ─── Icons ──────────────────────────────────────────────────────────── */
const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:46,height:46,color:'#fff'}}>
    <path d="M9.5 2C7 2 5 4 5 6.5c0 .9.3 1.8.7 2.5C4.3 9.6 3 11.1 3 13c0 2.2 1.8 4 4 4h.5l1 4h7l1-4H17c2.2 0 4-1.8 4-4 0-1.9-1.3-3.4-3.2-3.9.4-.7.7-1.6.7-2.5C18.5 4 16.5 2 14 2c-1 0-1.9.4-2.5 1C11 2.4 10.2 2 9.5 2z"/>
    <path d="M12 7v6M9 10h6"/>
  </svg>
);

const NavBrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}>
    <path d="M9.5 2C7 2 5 4 5 6.5c0 1 .3 2 .8 2.7C4.3 9.8 3 11.2 3 13c0 2.2 1.8 4 4 4h.5l1 4h7l1-4H17c2.2 0 4-1.8 4-4 0-1.8-1.3-3.3-3-3.8.5-.7.8-1.6.8-2.7C18.5 4 16.5 2 14 2c-1 0-1.9.4-2.5 1C11 2.4 10.2 2 9.5 2z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

/* ─── Data ───────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '🧠', title: 'AutoML Engine', desc: 'Train production-ready models with zero code. Our AutoML pipeline handles feature engineering, model selection, and hyperparameter tuning automatically.', tag: 'No-code' },
  { icon: '⚡', title: 'Real-time Inference', desc: 'Deploy models as live APIs in one click. Sub-50ms response times with auto-scaling infrastructure built for enterprise workloads.', tag: 'Low latency' },
  { icon: '📊', title: 'Visual Notebooks', desc: 'Jupyter-style interactive notebooks with built-in GPU acceleration, live collaboration, and version-controlled experiments.', tag: 'Collaborative' },
  { icon: '🎮', title: 'Learn by Doing', desc: 'Gamified ML challenges with leaderboards. Earn XP, unlock advanced modules, and compete with a global community of engineers.', tag: 'Gamified' },
  { icon: '🔬', title: 'Model Hub', desc: 'Browse 500+ pre-trained models. Fine-tune BERT, ResNet, Whisper and more on your own data in minutes.', tag: '500+ models' },
  { icon: '🛡️', title: 'Enterprise Security', desc: 'SOC 2 Type II certified. Private model registries, RBAC, audit logs, and VPC deployments for security-conscious teams.', tag: 'SOC 2' },
];

const STEPS = [
  { n: '01', title: 'Pick a Learning Track', desc: 'Choose from ML Fundamentals, Deep Learning, NLP, Computer Vision, or MLOps. Tracks adapt to your pace.' },
  { n: '02', title: 'Build in the Playground', desc: 'Write and run real Python code, train real models, and see live results — all in the browser.' },
  { n: '03', title: 'Solve Challenges & Earn XP', desc: 'Complete quizzes, beat leaderboards, and unlock badges. Learning feels like a game.' },
  { n: '04', title: 'Deploy & Share', desc: 'Push your model to a live API endpoint and share it. Build a portfolio employers actually care about.' },
];

const TOOLS = [
  { emoji: '💻', name: 'Code Playground', desc: 'Python IDE with instant execution', to: '/playground' },
  { emoji: '🎯', name: 'Quizzes', desc: 'Test your knowledge with adaptive quizzes', to: '/quiz' },
  { emoji: '🏆', name: 'Challenges', desc: 'Compete in live ML competitions', to: '/game' },
  { emoji: '📚', name: 'Learn', desc: 'Structured courses from zero to hero', to: '/learn' },
];

const TESTIMONIALS = [
  { text: 'AIMLify took me from knowing basic Python to deploying my first NLP model in 6 weeks. The gamified XP system made me come back every day.', name: 'Priya S.', role: 'ML Engineer @ Razorpay', init: 'P' },
  { text: 'The Code Playground is insane — I can run GPU-accelerated training right in the browser. No setup, no dependencies, just code.', name: 'Arjun M.', role: 'Data Scientist @ Flipkart', init: 'A' },
  { text: 'Best structured ML curriculum I have found. The projects actually mirror real industry work, not toy examples. Highly recommend.', name: 'Sneha R.', role: 'Final Year, IIT Bombay', init: 'S' },
];

/* ─── Component ──────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="hm-root">

        {/* Background */}
        <div className="hm-scene">
          <div className="hm-grid" />
          <div className="hm-blob hm-b1" />
          <div className="hm-blob hm-b2" />
          <div className="hm-blob hm-b3" />
          <div className="hm-blob hm-b4" />
        </div>

        {/* Navbar */}
        <nav className="hm-nav" style={scrolled ? { boxShadow: '0 8px 40px rgba(0,0,0,.4)' } : {}}>
          <Link to="/" className="hm-nav-logo">
            <div className="hm-nav-icon"><NavBrainIcon /></div>
            <span className="hm-nav-name">AIMLify</span>
          </Link>
          <div className="hm-nav-links">
            <Link to="/learn" className="hm-nav-link">Learn</Link>
            <Link to="/playground" className="hm-nav-link">Playground</Link>
            <Link to="/quiz" className="hm-nav-link">Quizzes</Link>
            <Link to="/game" className="hm-nav-link">Challenges</Link>
          </div>
          <div className="hm-nav-actions">
            <Link to="/login" className="hm-btn-ghost">Sign In</Link>
            <Link to="/login" className="hm-btn-primary">Get Started <ArrowIcon /></Link>
          </div>
        </nav>

        <div className="hm-page">

          {/* ── Hero ── */}
          <section className="hm-hero">
            <div className="hm-hero-badge">
              <span className="hm-hero-badge-dot" />
              Now in Beta · Free for Learners
            </div>
            <h1 className="hm-hero-headline">
              <span className="line1">Master AI & ML.</span>
              <span className="line2">Ship Real Models.</span>
            </h1>
            <p className="hm-hero-sub">
              AIMLify is the all-in-one platform to learn machine learning, run experiments in the browser, and deploy models to production — no setup required.
            </p>
            <div className="hm-hero-actions">
              <Link to="/login" className="hm-btn-xl">Start Learning Free <ArrowIcon /></Link>
              <Link to="/playground" className="hm-btn-xl-ghost"><PlayIcon /> Open Playground</Link>
            </div>

            {/* Orbit visual */}
            <div className="hm-orbit-wrap">
              <div className="hm-orbit-ring hm-ring3">
                <div className="hm-orbit-dot hm-od3" />
              </div>
              <div className="hm-orbit-ring hm-ring2">
                <div className="hm-orbit-dot hm-od2" />
              </div>
              <div className="hm-orbit-ring hm-ring1">
                <div className="hm-orbit-dot hm-od1" />
              </div>
              <div className="hm-orbit-core">
                <BrainIcon />
              </div>
            </div>
          </section>

          {/* ── Stats strip ── */}
          <div className="hm-stats">
            {[
              { num: '50K+', label: 'Active Learners' },
              { num: '500+', label: 'Pretrained Models' },
              { num: '120+', label: 'Guided Courses' },
              { num: '< 50ms', label: 'Inference Latency' },
            ].map(s => (
              <div key={s.label} className="hm-stat">
                <div className="hm-stat-num">{s.num}</div>
                <div className="hm-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Features ── */}
          <section className="hm-section">
            <span className="hm-section-tag">Platform Features</span>
            <h2 className="hm-section-title">Everything you need to go from<br /><span>idea to production</span></h2>
            <p className="hm-section-sub">One platform for learning, experimenting, and shipping. No context switching, no infrastructure headaches.</p>
            <div className="hm-features-grid">
              {FEATURES.map(f => (
                <div key={f.title} className="hm-feat-card">
                  <div className="hm-feat-icon">{f.icon}</div>
                  <div className="hm-feat-title">{f.title}</div>
                  <div className="hm-feat-desc">{f.desc}</div>
                  <span className="hm-feat-tag">{f.tag}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Learning Path ── */}
          <section className="hm-section" style={{ paddingTop: 0 }}>
            <span className="hm-section-tag">How It Works</span>
            <h2 className="hm-section-title">Your path to becoming<br /><span>an ML engineer</span></h2>
            <div className="hm-path-wrap">
              <div className="hm-path-steps">
                {STEPS.map(s => (
                  <div key={s.n} className="hm-step">
                    <div className="hm-step-num">{s.n}</div>
                    <div>
                      <div className="hm-step-title">{s.title}</div>
                      <div className="hm-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hm-path-visual">
                <div className="hm-pv-title">Your Progress · ML Track</div>
                <div className="hm-pv-track">
                  {[
                    { name: 'Python & NumPy Basics', status: 'done' },
                    { name: 'Supervised Learning', status: 'done' },
                    { name: 'Neural Networks', status: 'active' },
                    { name: 'Deep Learning & CNNs', status: 'locked' },
                    { name: 'NLP with Transformers', status: 'locked' },
                  ].map(item => (
                    <div key={item.name} className="hm-pv-item">
                      <span className={`hm-pv-dot ${item.status}`} />
                      <span className="hm-pv-name">{item.name}</span>
                      <span className={`hm-pv-badge ${item.status}`}>
                        {item.status === 'done' ? '✓ Done' : item.status === 'active' ? 'In Progress' : '🔒 Locked'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="hm-pv-progress-wrap">
                  <div className="hm-pv-progress-label"><span>Overall Progress</span><span>65%</span></div>
                  <div className="hm-pv-bar"><div className="hm-pv-fill" /></div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Tools ── */}
          <section className="hm-section" style={{ paddingTop: 0 }}>
            <span className="hm-section-tag">Core Tools</span>
            <h2 className="hm-section-title">Built for <span>builders</span></h2>
            <p className="hm-section-sub">Four powerful tools, one seamless experience. Jump between learning, coding, and competing without losing flow.</p>
            <div className="hm-tools-grid">
              {TOOLS.map(t => (
                <Link to={t.to} key={t.name} className="hm-tool-card">
                  <span className="hm-tool-emoji">{t.emoji}</span>
                  <div className="hm-tool-name">{t.name}</div>
                  <div className="hm-tool-desc">{t.desc}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section className="hm-section" style={{ paddingTop: 0 }}>
            <span className="hm-section-tag">Community Love</span>
            <h2 className="hm-section-title">Loved by engineers &amp; <span>students alike</span></h2>
            <div className="hm-testi-grid">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="hm-testi-card">
                  <div className="hm-stars">★★★★★</div>
                  <div className="hm-testi-quote">"</div>
                  <div className="hm-testi-text">{t.text}</div>
                  <div className="hm-testi-author">
                    <div className="hm-testi-avatar">{t.init}</div>
                    <div>
                      <div className="hm-testi-name">{t.name}</div>
                      <div className="hm-testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <div className="hm-cta">
            <h2 className="hm-cta-title">Ready to build your first model?</h2>
            <p className="hm-cta-sub">Join 50,000+ engineers learning AI & ML on AIMLify. Free forever for learners.</p>
            <div className="hm-cta-actions">
              <Link to="/login" className="hm-btn-xl">Create Free Account <ArrowIcon /></Link>
              <Link to="/learn" className="hm-btn-xl-ghost">Browse Courses</Link>
            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="hm-footer">
            <span className="hm-footer-copy">© 2025 AIMLify · Built for the next generation of ML engineers</span>
            <div className="hm-footer-links">
              <a href="#" className="hm-footer-link">Privacy</a>
              <a href="#" className="hm-footer-link">Terms</a>
              <a href="#" className="hm-footer-link">Docs</a>
              <a href="#" className="hm-footer-link">GitHub</a>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}