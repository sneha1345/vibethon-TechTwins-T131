import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

/* ─── Keyframes injected once ─────────────────────────────────────── */
const STYLES = `
  @keyframes vb-float1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}
  @keyframes vb-float2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,20px) scale(1.03)}66%{transform:translate(20px,-25px) scale(0.96)}}
  @keyframes vb-float3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,30px) scale(1.04)}}
  @keyframes vb-slideUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
  @keyframes vb-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes vb-pulse{0%,100%{box-shadow:0 0 0 0 rgba(126,90,255,.5)}50%{box-shadow:0 0 0 10px rgba(126,90,255,0)}}
  @keyframes vb-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes vb-fadeTab{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}

  .vb-scene{position:relative;width:100%;min-height:100vh;background:#07040f;overflow:hidden;display:flex;align-items:center;justify-content:center}
  .vb-blob{position:absolute;border-radius:50%;filter:blur(80px);will-change:transform;pointer-events:none}
  .vb-b1{width:520px;height:520px;background:radial-gradient(circle,rgba(90,30,180,.75) 0%,transparent 70%);top:-160px;left:-120px;animation:vb-float1 12s ease-in-out infinite}
  .vb-b2{width:460px;height:460px;background:radial-gradient(circle,rgba(160,30,130,.65) 0%,transparent 70%);bottom:-130px;right:-80px;animation:vb-float2 15s ease-in-out infinite}
  .vb-b3{width:340px;height:340px;background:radial-gradient(circle,rgba(40,20,120,.8) 0%,transparent 70%);top:40%;left:55%;animation:vb-float3 10s ease-in-out infinite}
  .vb-b4{width:260px;height:260px;background:radial-gradient(circle,rgba(100,10,100,.5) 0%,transparent 70%);bottom:10%;left:10%;animation:vb-float1 18s ease-in-out infinite reverse}
  .vb-card{position:relative;z-index:2;width:100%;max-width:420px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:40px 36px;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);animation:vb-slideUp .6s ease both;margin:24px}
  .vb-logo{display:flex;align-items:center;justify-content:center;gap:9px;margin-bottom:26px}
  .vb-logo-ring{width:30px;height:30px;border-radius:50%;border:2px solid rgba(180,120,255,.7);display:flex;align-items:center;justify-content:center}
  .vb-logo-dot{width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#a06eff,#e060d0)}
  .vb-logo-text{font-size:15px;font-weight:700;letter-spacing:3px;background:linear-gradient(90deg,#c49fff,#e87fe8,#a06eff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:vb-shimmer 3s linear infinite}
  .vb-tabs{display:flex;background:rgba(255,255,255,.05);border-radius:10px;padding:4px;margin-bottom:28px;position:relative}
  .vb-tab-ind{position:absolute;top:4px;bottom:4px;width:calc(50% - 4px);background:linear-gradient(135deg,rgba(130,70,255,.5),rgba(200,60,200,.4));border-radius:7px;border:1px solid rgba(180,100,255,.3);transition:left .35s cubic-bezier(.4,0,.2,1)}
  .vb-tab{flex:1;background:none;border:none;color:rgba(255,255,255,.45);font-size:13px;font-weight:500;padding:8px 0;cursor:pointer;border-radius:7px;transition:color .2s;position:relative;z-index:1;letter-spacing:.5px}
  .vb-tab.active{color:#fff}
  .vb-panel{animation:vb-fadeTab .3s ease both}
  .vb-field{margin-bottom:16px}
  .vb-field label{display:block;font-size:11px;font-weight:500;letter-spacing:1px;color:rgba(200,160,255,.7);text-transform:uppercase;margin-bottom:6px}
  .vb-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 14px;color:#fff;font-size:14px;outline:none;transition:border-color .2s,background .2s;font-family:inherit}
  .vb-input::placeholder{color:rgba(255,255,255,.25)}
  .vb-input:focus{border-color:rgba(160,100,255,.6);background:rgba(160,100,255,.07)}
  .vb-row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .vb-forgot{display:block;text-align:right;font-size:11px;color:rgba(180,130,255,.7);cursor:pointer;margin-top:-8px;margin-bottom:16px;text-decoration:none}
  .vb-forgot:hover{color:rgba(210,160,255,.9)}
  .vb-btn{width:100%;padding:13px;border:none;border-radius:11px;background:linear-gradient(135deg,#7e3aff,#c43fc4);color:#fff;font-size:14px;font-weight:600;letter-spacing:.5px;cursor:pointer;transition:opacity .2s,transform .1s;margin-top:4px;position:relative;overflow:hidden;font-family:inherit}
  .vb-btn:hover:not(:disabled){opacity:.88}
  .vb-btn:active:not(:disabled){transform:scale(.98)}
  .vb-btn:disabled{cursor:not-allowed}
  .vb-btn.loading::after{content:'';position:absolute;top:50%;left:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:vb-spin .7s linear infinite}
  .vb-btn.loading .vb-btn-label{opacity:0}
  .vb-divider{display:flex;align-items:center;gap:10px;margin:18px 0;color:rgba(255,255,255,.2);font-size:12px}
  .vb-divider::before,.vb-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08)}
  .vb-socials{display:flex;gap:10px}
  .vb-soc{flex:1;padding:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:rgba(255,255,255,.6);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .2s,border-color .2s;font-family:inherit}
  .vb-soc:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.2);color:#fff}
  .vb-terms{font-size:11px;color:rgba(255,255,255,.25);text-align:center;margin-top:16px;line-height:1.6}
  .vb-terms a{color:rgba(180,130,255,.6);text-decoration:none}
  .vb-terms a:hover{color:rgba(200,160,255,.9)}
  .vb-strength{height:3px;border-radius:2px;margin-top:6px;background:rgba(255,255,255,.08);overflow:hidden}
  .vb-strength-fill{height:100%;border-radius:2px;transition:width .3s,background .3s}
  .vb-err{font-size:11px;color:#ff7eb3;margin-top:5px}
  .vb-alert{background:rgba(255,100,150,.08);border:1px solid rgba(255,100,150,.2);border-radius:8px;color:#ff9eb8;font-size:13px;padding:10px 14px;margin-bottom:16px}
  .vb-success{text-align:center;padding:24px 0;animation:vb-slideUp .4s ease both}
  .vb-check{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#7e3aff,#c43fc4);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;animation:vb-pulse 1.5s ease infinite}
`;

/* ─── SVG icons ─────────────────────────────────────────────────────── */
const IconGoogle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ─── Password strength helper ──────────────────────────────────────── */
function getStrength(v) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const widths  = ['0%', '35%', '60%', '80%', '100%'];
  const colors  = ['transparent', '#ff6b6b', '#f9a825', '#7eb8ff', '#7e3aff'];
  return { width: widths[s], color: colors[s] };
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab]           = useState('login');   // 'login' | 'signup'
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [done, setDone]         = useState(null);      // { title, sub }

  /* login fields */
  const [lEmail, setLEmail] = useState('');
  const [lPass,  setLPass]  = useState('');
  const [lErrs,  setLErrs]  = useState({});

  /* signup fields */
  const [sFirst,  setSFirst]  = useState('');
  const [sLast,   setSLast]   = useState('');
  const [sEmail,  setSEmail]  = useState('');
  const [sPass,   setSPass]   = useState('');
  const [sPass2,  setSPass2]  = useState('');
  const [sErrs,   setSErrs]   = useState({});
  const strength = getStrength(sPass);

  const switchTab = (t) => {
    setTab(t);
    setApiError('');
    setDone(null);
    setLErrs({});
    setSErrs({});
  };

  /* ── Login submit ─────────────────────────── */
  const handleLogin = async () => {
    const errs = {};
    if (!lEmail || !/\S+@\S+\.\S+/.test(lEmail)) errs.email = 'Please enter a valid email';
    if (!lPass) errs.pass = 'Password is required';
    if (Object.keys(errs).length) { setLErrs(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      const { data } = await loginUser({ email: lEmail, password: lPass });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setDone({ title: 'Welcome back!', sub: 'Redirecting to your dashboard…' });
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Signup submit ────────────────────────── */
  const handleSignup = async () => {
    const errs = {};
    if (!sEmail || !/\S+@\S+\.\S+/.test(sEmail)) errs.email = 'Please enter a valid email';
    if (sPass.length < 8) errs.pass = 'Password must be at least 8 characters';
    if (sPass !== sPass2)  errs.pass2 = "Passwords don't match";
    if (Object.keys(errs).length) { setSErrs(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      const { data } = await registerUser({ firstName: sFirst, lastName: sLast, email: sEmail, password: sPass });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setDone({ title: 'Account created!', sub: "You're all set — welcome to Vibethon 🎉" });
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLogin = tab === 'login';

  return (
    <>
      <style>{STYLES}</style>
      <div className="vb-scene">
        <div className="vb-blob vb-b1" />
        <div className="vb-blob vb-b2" />
        <div className="vb-blob vb-b3" />
        <div className="vb-blob vb-b4" />

        <div className="vb-card">
          {/* Logo */}
          <div className="vb-logo">
            <div className="vb-logo-ring"><div className="vb-logo-dot" /></div>
            <span className="vb-logo-text">VIBETHON</span>
          </div>

          {/* Tabs */}
          <div className="vb-tabs">
            <div className="vb-tab-ind" style={{ left: isLogin ? '4px' : 'calc(50%)' }} />
            <button className={`vb-tab${isLogin ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
            <button className={`vb-tab${!isLogin ? ' active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</button>
          </div>

          {/* API error banner */}
          {apiError && <div className="vb-alert">{apiError}</div>}

          {/* Success screen */}
          {done ? (
            <div className="vb-success">
              <div className="vb-check"><IconCheck /></div>
              <strong style={{ color: '#fff', fontSize: 18, display: 'block', marginBottom: 8 }}>{done.title}</strong>
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>{done.sub}</p>
            </div>
          ) : isLogin ? (
            /* ── Login form ─────────────────────────────── */
            <div className="vb-panel" key="login">
              <div className="vb-field">
                <label>Email</label>
                <input className="vb-input" type="email" placeholder="you@example.com"
                  value={lEmail} onChange={e => { setLEmail(e.target.value); setLErrs(p => ({ ...p, email: '' })); }} />
                {lErrs.email && <div className="vb-err">{lErrs.email}</div>}
              </div>
              <div className="vb-field">
                <label>Password</label>
                <input className="vb-input" type="password" placeholder="••••••••"
                  value={lPass} onChange={e => { setLPass(e.target.value); setLErrs(p => ({ ...p, pass: '' })); }} />
                {lErrs.pass && <div className="vb-err">{lErrs.pass}</div>}
              </div>
              <Link to="/forgot-password" className="vb-forgot">Forgot password?</Link>
              <button className={`vb-btn${loading ? ' loading' : ''}`} onClick={handleLogin} disabled={loading}>
                <span className="vb-btn-label">Sign In</span>
              </button>
              <div className="vb-divider">or continue with</div>
              <div className="vb-socials">
                <button className="vb-soc"><IconGoogle /> Google</button>
                <button className="vb-soc"><IconGithub /> GitHub</button>
              </div>
              <p className="vb-terms">
                By signing in you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy</a>
              </p>
            </div>
          ) : (
            /* ── Signup form ────────────────────────────── */
            <div className="vb-panel" key="signup">
              <div className="vb-row2">
                <div className="vb-field">
                  <label>First name</label>
                  <input className="vb-input" type="text" placeholder="Alex"
                    value={sFirst} onChange={e => setSFirst(e.target.value)} />
                </div>
                <div className="vb-field">
                  <label>Last name</label>
                  <input className="vb-input" type="text" placeholder="Chen"
                    value={sLast} onChange={e => setSLast(e.target.value)} />
                </div>
              </div>
              <div className="vb-field">
                <label>Email</label>
                <input className="vb-input" type="email" placeholder="you@example.com"
                  value={sEmail} onChange={e => { setSEmail(e.target.value); setSErrs(p => ({ ...p, email: '' })); }} />
                {sErrs.email && <div className="vb-err">{sErrs.email}</div>}
              </div>
              <div className="vb-field">
                <label>Password</label>
                <input className="vb-input" type="password" placeholder="Min 8 characters"
                  value={sPass} onChange={e => { setSPass(e.target.value); setSErrs(p => ({ ...p, pass: '' })); }} />
                <div className="vb-strength">
                  <div className="vb-strength-fill" style={{ width: strength.width, background: strength.color }} />
                </div>
                {sErrs.pass && <div className="vb-err">{sErrs.pass}</div>}
              </div>
              <div className="vb-field">
                <label>Confirm password</label>
                <input className="vb-input" type="password" placeholder="••••••••"
                  value={sPass2} onChange={e => { setSPass2(e.target.value); setSErrs(p => ({ ...p, pass2: '' })); }} />
                {sErrs.pass2 && <div className="vb-err">{sErrs.pass2}</div>}
              </div>
              <button className={`vb-btn${loading ? ' loading' : ''}`} onClick={handleSignup} disabled={loading}>
                <span className="vb-btn-label">Create Account</span>
              </button>
              <p className="vb-terms">
                By creating an account you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}