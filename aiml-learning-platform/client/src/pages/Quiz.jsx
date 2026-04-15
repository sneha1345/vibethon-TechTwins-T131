import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Styles matching Login page vb-* theme ────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  @keyframes vb-float1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}
  @keyframes vb-float2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,20px) scale(1.03)}66%{transform:translate(20px,-25px) scale(0.96)}}
  @keyframes vb-float3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,30px) scale(1.04)}}
  @keyframes vb-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes vb-slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
  @keyframes vb-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes vb-pulse{0%,100%{box-shadow:0 0 0 0 rgba(126,90,255,.4)}50%{box-shadow:0 0 0 12px rgba(126,90,255,0)}}

  .qz-scene {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #07040f;
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
    color: #fff;
  }
  .qz-blob { position:fixed;border-radius:50%;filter:blur(80px);will-change:transform;pointer-events:none;z-index:0 }
  .qz-b1{width:520px;height:520px;background:radial-gradient(circle,rgba(90,30,180,.75) 0%,transparent 70%);top:-160px;left:-120px;animation:vb-float1 12s ease-in-out infinite}
  .qz-b2{width:460px;height:460px;background:radial-gradient(circle,rgba(160,30,130,.65) 0%,transparent 70%);bottom:-130px;right:-80px;animation:vb-float2 15s ease-in-out infinite}
  .qz-b3{width:340px;height:340px;background:radial-gradient(circle,rgba(40,20,120,.8) 0%,transparent 70%);top:40%;left:55%;animation:vb-float3 10s ease-in-out infinite}

  .qz-header {
    position: relative; z-index: 10;
    padding: 18px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(7,4,15,0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .qz-logo { display:flex;align-items:center;gap:10px }
  .qz-logo-ring { width:30px;height:30px;border-radius:50%;border:2px solid rgba(180,120,255,.7);display:flex;align-items:center;justify-content:center }
  .qz-logo-dot { width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#a06eff,#e060d0) }
  .qz-logo-text { font-size:15px;font-weight:700;letter-spacing:3px;background:linear-gradient(90deg,#c49fff,#e87fe8,#a06eff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:vb-shimmer 3s linear infinite }
  .qz-back-btn { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 16px;color:rgba(255,255,255,0.7);font-size:13px;cursor:pointer;transition:all 0.2s;font-family:inherit;display:flex;align-items:center;gap:8px }
  .qz-back-btn:hover { background:rgba(255,255,255,0.09);color:#fff }

  .qz-body { position:relative;z-index:10;max-width:720px;margin:40px auto;padding:0 20px 40px }

  .qz-title-section { text-align:center;margin-bottom:32px;animation:vb-fadeUp 0.4s ease both }
  .qz-title { font-size:26px;font-weight:700;background:linear-gradient(90deg,#c49fff,#e87fe8,#a06eff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:vb-shimmer 3s linear infinite;margin-bottom:8px }
  .qz-subtitle { color:rgba(255,255,255,0.45);font-size:14px }

  .qz-card { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:32px;backdrop-filter:blur(10px) }

  .qz-progress-row { display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px }
  .qz-progress-track { height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;margin-bottom:28px }
  .qz-progress-fill { height:100%;border-radius:2px;background:linear-gradient(90deg,#7e3aff,#c43fc4);transition:width 0.4s ease }

  .qz-question { font-size:18px;font-weight:600;color:#fff;line-height:1.5;margin-bottom:24px;animation:vb-slideIn 0.3s ease both }

  .qz-options { display:flex;flex-direction:column;gap:10px;margin-bottom:28px }
  .qz-option {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:12px;
    padding:14px 18px;
    text-align:left;
    cursor:pointer;
    transition:all 0.2s;
    color:rgba(255,255,255,0.8);
    font-size:14px;
    font-family:inherit;
    display:flex;
    align-items:center;
    gap:14px;
  }
  .qz-option:hover:not(:disabled) { background:rgba(126,58,255,0.1);border-color:rgba(126,58,255,0.3);color:#fff }
  .qz-option.selected { background:rgba(126,58,255,0.15);border-color:#7e3aff;color:#fff }
  .qz-option.correct { background:rgba(76,175,80,0.12);border-color:#4caf50;color:#a5f3a5 }
  .qz-option.wrong { background:rgba(244,67,54,0.12);border-color:#f44336;color:#ffb3af }
  .qz-option-letter { width:26px;height:26px;border-radius:8px;background:rgba(126,58,255,0.2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#a06eff;flex-shrink:0 }
  .qz-option.correct .qz-option-letter { background:rgba(76,175,80,0.25);color:#4caf50 }
  .qz-option.wrong .qz-option-letter { background:rgba(244,67,54,0.25);color:#f44336 }

  .qz-explanation { background:rgba(126,58,255,0.08);border:1px solid rgba(126,58,255,0.2);border-radius:10px;padding:14px 18px;font-size:13px;color:rgba(200,180,255,0.85);margin-bottom:24px;line-height:1.6;animation:vb-fadeUp 0.3s ease both }
  .qz-warn { background:rgba(249,168,37,0.08);border:1px solid rgba(249,168,37,0.25);border-radius:10px;padding:12px 16px;font-size:13px;color:rgba(255,220,100,0.85);margin-bottom:16px }

  .qz-nav { display:flex;justify-content:space-between;align-items:center;gap:12px }
  .qz-btn-prev { padding:10px 22px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);font-size:13px;cursor:pointer;transition:all 0.2s;font-family:inherit;display:flex;align-items:center;gap:8px }
  .qz-btn-prev:hover:not(:disabled) { background:rgba(255,255,255,0.09);color:#fff }
  .qz-btn-prev:disabled { opacity:0.35;cursor:not-allowed }
  .qz-btn-next { padding:10px 24px;border-radius:10px;border:none;color:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:opacity 0.2s,transform 0.1s;font-family:inherit;background:linear-gradient(135deg,#7e3aff,#c43fc4);display:flex;align-items:center;gap:8px }
  .qz-btn-next:hover { opacity:0.88 }
  .qz-btn-next:active { transform:scale(0.97) }

  /* Results */
  .qz-results { text-align:center;animation:vb-fadeUp 0.4s ease both }
  .qz-score-ring { width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;font-weight:700 }
  .qz-result-row { display:flex;align-items:center;gap:12px;padding:12px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;text-align:left }
  .qz-tick { width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0 }
`;

const questions = [
  {
    id: 1,
    text: "What does 'm' represent in the linear regression equation y = mx + b?",
    options: ["Intercept", "Slope", "Predicted value", "Error term"],
    correct: 1,
    explanation: "m represents the slope — how much y changes when x increases by 1 unit.",
  },
  {
    id: 2,
    text: "Which metric measures prediction error in Linear Regression?",
    options: ["Accuracy", "Mean Squared Error (MSE)", "F1 Score", "Precision"],
    correct: 1,
    explanation: "Mean Squared Error (MSE) measures the average squared difference between predictions and actual values.",
  },
  {
    id: 3,
    text: "What does a negative slope (m) indicate?",
    options: ["Positive correlation", "Negative correlation", "No correlation", "Perfect prediction"],
    correct: 1,
    explanation: "A negative slope means negative correlation — as x increases, y decreases.",
  },
  {
    id: 4,
    text: "What is overfitting in Linear Regression?",
    options: [
      "Model performs well on training but poorly on new data",
      "Model performs poorly on all data",
      "Model is too simple to learn patterns",
      "Model has zero errors",
    ],
    correct: 0,
    explanation: "Overfitting is when the model memorizes training data noise and fails to generalize to unseen data.",
  },
  {
    id: 5,
    text: "What is the intercept (b) in Linear Regression?",
    options: [
      "The slope of the line",
      "The predicted value when x = 0",
      "The error of the model",
      "The correlation coefficient",
    ],
    correct: 1,
    explanation: "The intercept (b) is the predicted value of y when all input features are zero.",
  },
];

/* ─── SVG Icons ─────────────────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showWarn, setShowWarn] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (idx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestion]: idx }));
    setShowWarn(false);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === undefined) {
      setShowWarn(true);
      return;
    }
    setShowExplanation(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(q => q + 1);
        setShowExplanation(false);
        setAnimKey(k => k + 1);
      } else {
        handleSubmit();
      }
    }, 1400);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(q => q - 1);
      setShowExplanation(false);
      setShowWarn(false);
      setAnimKey(k => k + 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const pct = Math.round((correct / questions.length) * 100);
    setScore({ correct, total: questions.length, pct });
    setSubmitted(true);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="qz-scene">
        <div className="qz-blob qz-b1" />
        <div className="qz-blob qz-b2" />
        <div className="qz-blob qz-b3" />

        {/* Header */}
        <header className="qz-header">
          <div className="qz-logo">
            <div className="qz-logo-ring"><div className="qz-logo-dot" /></div>
            <span className="qz-logo-text">AIML LEARN</span>
          </div>
          <button className="qz-back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft /> Dashboard
          </button>
        </header>

        <div className="qz-body">
          <div className="qz-title-section">
            <h1 className="qz-title">Linear Regression Quiz</h1>
            <p className="qz-subtitle">Test your understanding of core ML concepts</p>
          </div>

          <div className="qz-card">
            {!submitted ? (
              <>
                {/* Progress */}
                <div className="qz-progress-row">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span style={{ color: '#a06eff', fontWeight: 600 }}>{Object.keys(answers).length} answered</span>
                </div>
                <div className="qz-progress-track">
                  <div className="qz-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                {/* Question */}
                <div key={animKey}>
                  <p className="qz-question">{currentQ.text}</p>

                  {showWarn && (
                    <div className="qz-warn">⚠️ Please select an answer before continuing.</div>
                  )}

                  <div className="qz-options">
                    {currentQ.options.map((opt, idx) => {
                      let cls = 'qz-option';
                      if (showExplanation) {
                        if (idx === currentQ.correct) cls += ' correct';
                        else if (idx === selectedAnswer && selectedAnswer !== currentQ.correct) cls += ' wrong';
                      } else if (selectedAnswer === idx) {
                        cls += ' selected';
                      }
                      return (
                        <button
                          key={idx}
                          className={cls}
                          onClick={() => !showExplanation && handleAnswer(idx)}
                          disabled={showExplanation}
                        >
                          <span className="qz-option-letter">{String.fromCharCode(65 + idx)}</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div className="qz-explanation">
                      💡 {currentQ.explanation}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="qz-nav">
                  <button
                    className="qz-btn-prev"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0 || showExplanation}
                  >
                    <ArrowLeft /> Previous
                  </button>
                  <button
                    className="qz-btn-next"
                    onClick={handleNext}
                    disabled={showExplanation}
                  >
                    {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                    <ArrowRight />
                  </button>
                </div>
              </>
            ) : (
              /* Results screen */
              <div className="qz-results">
                <div
                  className="qz-score-ring"
                  style={{
                    background: score.pct >= 70 ? 'rgba(76,175,80,0.15)' : 'rgba(249,168,37,0.15)',
                    border: `2px solid ${score.pct >= 70 ? '#4caf50' : '#f9a825'}`,
                    color: score.pct >= 70 ? '#4caf50' : '#f9a825',
                  }}
                >
                  {score.pct}%
                </div>
                <h2 style={{ fontSize: 22, marginBottom: 8 }}>
                  {score.pct >= 70 ? '🎉 Great Job!' : '📚 Keep Practicing!'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 }}>
                  You got {score.correct} out of {score.total} questions correct
                </p>

                <div style={{ marginBottom: 28 }}>
                  {questions.map((q, idx) => (
                    <div key={idx} className="qz-result-row">
                      <span
                        className="qz-tick"
                        style={{
                          background: answers[idx] === q.correct ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)',
                          color: answers[idx] === q.correct ? '#4caf50' : '#f44336',
                        }}
                      >
                        {answers[idx] === q.correct ? '✓' : '✗'}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{q.text.substring(0, 72)}…</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setSubmitted(false); setAnswers({}); setCurrentQuestion(0); setScore(null); setAnimKey(k => k + 1); }}
                    className="qz-btn-prev"
                    style={{ padding: '12px 24px' }}
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="qz-btn-next"
                    style={{ padding: '12px 24px' }}
                  >
                    Dashboard <ArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}