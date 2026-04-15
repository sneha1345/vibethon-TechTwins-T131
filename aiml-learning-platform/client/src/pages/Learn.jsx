import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Keyframes + styles matching Login page theme ─────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  @keyframes vb-float1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}
  @keyframes vb-float2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,20px) scale(1.03)}66%{transform:translate(20px,-25px) scale(0.96)}}
  @keyframes vb-float3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,30px) scale(1.04)}}
  @keyframes vb-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes vb-slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
  @keyframes vb-fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes vb-pulse{0%,100%{opacity:1}50%{opacity:0.5}}

  .lrn-scene {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #07040f;
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
    color: #fff;
  }
  .lrn-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    will-change: transform;
    pointer-events: none;
    z-index: 0;
  }
  .lrn-b1 { width:520px;height:520px;background:radial-gradient(circle,rgba(90,30,180,.75) 0%,transparent 70%);top:-160px;left:-120px;animation:vb-float1 12s ease-in-out infinite }
  .lrn-b2 { width:460px;height:460px;background:radial-gradient(circle,rgba(160,30,130,.65) 0%,transparent 70%);bottom:-130px;right:-80px;animation:vb-float2 15s ease-in-out infinite }
  .lrn-b3 { width:340px;height:340px;background:radial-gradient(circle,rgba(40,20,120,.8) 0%,transparent 70%);top:40%;left:55%;animation:vb-float3 10s ease-in-out infinite }
  .lrn-b4 { width:260px;height:260px;background:radial-gradient(circle,rgba(100,10,100,.5) 0%,transparent 70%);bottom:10%;left:10%;animation:vb-float1 18s ease-in-out infinite reverse }

  .lrn-header {
    position: relative;
    z-index: 10;
    padding: 18px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(7,4,15,0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .lrn-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lrn-logo-ring {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 2px solid rgba(180,120,255,.7);
    display: flex; align-items: center; justify-content: center;
  }
  .lrn-logo-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a06eff, #e060d0);
  }
  .lrn-logo-text {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 3px;
    background: linear-gradient(90deg, #c49fff, #e87fe8, #a06eff);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: vb-shimmer 3s linear infinite;
  }
  .lrn-back-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 8px 16px;
    color: rgba(255,255,255,0.7);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lrn-back-btn:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.2);
    color: #fff;
  }

  .lrn-layout {
    position: relative;
    z-index: 10;
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 24px;
    gap: 28px;
    min-height: calc(100vh - 70px);
  }

  /* Sidebar */
  .lrn-sidebar {
    width: 280px;
    flex-shrink: 0;
  }
  .lrn-sidebar-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: rgba(200,160,255,0.7);
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .lrn-module-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.25s ease;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .lrn-module-card:hover {
    background: rgba(126,58,255,0.1);
    border-color: rgba(126,58,255,0.3);
    transform: translateX(4px);
  }
  .lrn-module-card.active {
    background: rgba(126,58,255,0.15);
    border-color: rgba(126,58,255,0.4);
    transform: translateX(6px);
  }
  .lrn-module-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .lrn-module-name {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
  .lrn-module-meta {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-top: 2px;
  }

  /* Content Area */
  .lrn-content {
    flex: 1;
    min-width: 0;
  }
  .lrn-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Progress */
  .lrn-progress-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 8px;
  }
  .lrn-progress-track {
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .lrn-progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  /* Section content */
  .lrn-section-anim {
    animation: vb-slideIn 0.3s ease both;
  }
  .lrn-section-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .lrn-body-text {
    color: rgba(255,255,255,0.75);
    line-height: 1.7;
    font-size: 14px;
    margin-bottom: 16px;
  }
  .lrn-highlight-box {
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 16px;
  }
  .lrn-code-block {
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 20px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    color: #7eb8ff;
    overflow-x: auto;
    line-height: 1.6;
    margin: 16px 0;
    white-space: pre;
  }
  .lrn-tip-box {
    background: rgba(76,175,80,0.08);
    border: 1px solid rgba(76,175,80,0.25);
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 13px;
    color: rgba(180,255,185,0.85);
    margin-top: 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  /* Nav buttons */
  .lrn-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .lrn-btn-prev {
    padding: 10px 22px;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lrn-btn-prev:hover:not(:disabled) {
    background: rgba(255,255,255,0.09);
    color: #fff;
  }
  .lrn-btn-prev:disabled { opacity: 0.35; cursor: not-allowed; }
  .lrn-btn-next {
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lrn-btn-next:hover { opacity: 0.88; }
  .lrn-btn-next:active { transform: scale(0.97); }

  /* Section tabs */
  .lrn-section-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .lrn-section-tab {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: rgba(255,255,255,0.4);
    font-family: inherit;
  }
  .lrn-section-tab.active {
    color: #fff;
  }

  @media (max-width: 900px) {
    .lrn-layout { flex-direction: column; padding: 16px; }
    .lrn-sidebar { width: 100%; }
  }
`;

/* ─── Course Data ─────────────────────────────────────────────────────── */
const modules = [
  {
    id: 1,
    title: 'Linear Regression',
    icon: '📈',
    color: '#7e3aff',
    gradient: 'linear-gradient(135deg,#7e3aff,#c43fc4)',
    sections: [
      {
        title: 'What is Linear Regression?',
        body: 'Linear Regression is a fundamental machine learning algorithm used for predicting a continuous value based on input features. It\'s one of the simplest and most widely used algorithms in statistics and machine learning.',
        highlight: {
          label: '🎯 Real-World Example:',
          text: 'Predicting house prices based on house size, number of bedrooms, location, and other factors.',
          color: 'rgba(126,58,255,0.12)',
          border: '#7e3aff',
        },
        formula: 'y = mx + b',
        formulaItems: [
          'y = predicted value (e.g. house price)',
          'x = input feature (e.g. house size)',
          'm = slope (how much price increases per sq ft)',
          'b = intercept (base price)',
        ],
      },
      {
        title: 'How It Works',
        body: 'Linear Regression finds the "best fit" line through your data points by minimizing the error between predictions and actual values using a method called Gradient Descent.',
        highlight: {
          label: '📊 Step-by-Step Process:',
          text: null,
          steps: [
            'Plot your data points on a graph',
            'Draw a line that best represents the data',
            'Calculate the error (distance between line and points)',
            'Adjust line parameters to minimize error',
            'Use the final line to make predictions',
          ],
          color: 'rgba(126,58,255,0.12)',
          border: '#7e3aff',
        },
        formula: 'MSE = (1/n) Σ(actual - predicted)²',
        formulaLabel: '📐 Mean Squared Error (lower = better fit)',
      },
      {
        title: 'Code Implementation',
        body: 'Let\'s implement Linear Regression from scratch using Python!',
        code: `import numpy as np

class LinearRegression:
    def __init__(self):
        self.slope = None
        self.intercept = None

    def fit(self, X, y):
        n = len(X)
        self.slope = (n * np.sum(X * y) - np.sum(X) * np.sum(y)) / \\
                     (n * np.sum(X**2) - np.sum(X)**2)
        self.intercept = (np.sum(y) - self.slope * np.sum(X)) / n

    def predict(self, X):
        return self.slope * X + self.intercept

# Sample data
X = np.array([500, 800, 1000, 1200, 1500])
y = np.array([100, 150, 200, 250, 300])

model = LinearRegression()
model.fit(X, y)
print(f"Predicted price for 2000 sq ft: {model.predict(2000):.0f}k USD")`,
        tip: '✨ Head to the Code Playground to run and experiment with this code!',
      },
    ],
  },
  {
    id: 2,
    title: 'Logistic Regression',
    icon: '🔀',
    color: '#c43fc4',
    gradient: 'linear-gradient(135deg,#c43fc4,#7e3aff)',
    sections: [
      {
        title: 'Introduction to Logistic Regression',
        body: 'Logistic Regression is used for binary classification problems where the output is categorical (0 or 1). Despite its name, it\'s a classification algorithm — not a regression one.',
        highlight: {
          label: '🎯 Common Applications:',
          text: null,
          steps: [
            'Email spam detection (Spam vs Not Spam)',
            'Disease diagnosis (Positive vs Negative)',
            'Credit card fraud detection',
            'Student pass/fail prediction',
          ],
          color: 'rgba(196,63,196,0.12)',
          border: '#c43fc4',
        },
        formula: 'P(y=1) = 1 / (1 + e^(-z))',
        formulaLabel: '📐 The Sigmoid Function maps any value to [0,1]',
      },
      {
        title: 'Decision Boundary',
        body: 'Logistic Regression creates a decision boundary — a line (or hyperplane) that separates different classes. Points on one side are predicted as class 0, and the other side as class 1.',
        highlight: {
          label: '💡 Key Insight:',
          text: 'If the sigmoid output > 0.5, we classify as 1. If output ≤ 0.5, we classify as 0.',
          color: 'rgba(196,63,196,0.12)',
          border: '#c43fc4',
        },
        code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Test the sigmoid function
values = [-5, -2, 0, 2, 5]
for v in values:
    print(f"sigmoid({v:2d}) = {sigmoid(v):.4f}")`,
      },
    ],
  },
  {
    id: 3,
    title: 'Neural Networks',
    icon: '🧠',
    color: '#3a8fff',
    gradient: 'linear-gradient(135deg,#3a8fff,#7e3aff)',
    sections: [
      {
        title: 'What are Neural Networks?',
        body: 'Neural Networks are computing systems inspired by the biological neural networks in our brains. They consist of layers of interconnected nodes (neurons) that learn patterns from data.',
        highlight: {
          label: '🏗️ Network Layers:',
          text: null,
          steps: [
            'Input Layer — receives raw data features',
            'Hidden Layers — learn complex patterns and representations',
            'Output Layer — produces the final prediction',
          ],
          color: 'rgba(58,143,255,0.12)',
          border: '#3a8fff',
        },
        formula: 'output = activation(Σ(weight × input) + bias)',
        formulaLabel: '📐 Each neuron computes a weighted sum plus activation',
      },
    ],
  },
];

/* ─── Arrow SVGs ─────────────────────────────────────────────────────── */
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
const CheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* ─── Section Renderer ───────────────────────────────────────────────── */
function SectionContent({ section, color }) {
  return (
    <div className="lrn-section-anim" key={section.title}>
      <h2 className="lrn-section-title" style={{ color }}>{section.title}</h2>
      <p className="lrn-body-text">{section.body}</p>

      {section.highlight && (
        <div className="lrn-highlight-box" style={{
          background: section.highlight.color,
          borderLeft: `3px solid ${section.highlight.border}`,
        }}>
          <strong style={{ color: section.highlight.border, display: 'block', marginBottom: 8 }}>
            {section.highlight.label}
          </strong>
          {section.highlight.text && (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>{section.highlight.text}</p>
          )}
          {section.highlight.steps && (
            <ol style={{ margin: 0, paddingLeft: 20, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              {section.highlight.steps.map((s, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{s}</li>
              ))}
            </ol>
          )}
        </div>
      )}

      {section.formula && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          {section.formulaLabel && (
            <strong style={{ color, fontSize: 12, display: 'block', marginBottom: 10 }}>{section.formulaLabel}</strong>
          )}
          <p style={{ fontFamily: 'Monaco, Courier New, monospace', fontSize: 16, textAlign: 'center', color: '#b8eaff', margin: 0 }}>
            {section.formula}
          </p>
          {section.formulaItems && (
            <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
              {section.formulaItems.map((item, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {section.code && (
        <div className="lrn-code-block">{section.code}</div>
      )}

      {section.tip && (
        <div className="lrn-tip-box">
          <span>✨</span>
          <span>{section.tip.replace('✨ ', '')}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function Learn() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const module = modules[selectedModule];
  const section = module.sections[currentSection];
  const progress = ((currentSection + 1) / module.sections.length) * 100;
  const isFirst = selectedModule === 0 && currentSection === 0;
  const isLast = selectedModule === modules.length - 1 && currentSection === module.sections.length - 1;

  const goToSection = (modIdx, secIdx) => {
    setSelectedModule(modIdx);
    setCurrentSection(secIdx);
    setAnimKey(k => k + 1);
  };

  const handleNext = () => {
    if (currentSection < module.sections.length - 1) {
      goToSection(selectedModule, currentSection + 1);
    } else if (selectedModule < modules.length - 1) {
      goToSection(selectedModule + 1, 0);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      goToSection(selectedModule, currentSection - 1);
    } else if (selectedModule > 0) {
      const prevMod = modules[selectedModule - 1];
      goToSection(selectedModule - 1, prevMod.sections.length - 1);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="lrn-scene">
        {/* Blobs */}
        <div className="lrn-blob lrn-b1" />
        <div className="lrn-blob lrn-b2" />
        <div className="lrn-blob lrn-b3" />
        <div className="lrn-blob lrn-b4" />

        {/* Header */}
        <div className="lrn-header">
          <div className="lrn-logo">
            <div className="lrn-logo-ring"><div className="lrn-logo-dot" /></div>
            <span className="lrn-logo-text">AIMLify </span>
          </div>
          <button className="lrn-back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft /> Dashboard
          </button>
        </div>

        {/* Layout */}
        <div className="lrn-layout">
          {/* Sidebar */}
          <aside className="lrn-sidebar">
            <p className="lrn-sidebar-title">Modules</p>
            {modules.map((mod, idx) => (
              <div
                key={mod.id}
                className={`lrn-module-card ${selectedModule === idx ? 'active' : ''}`}
                onClick={() => goToSection(idx, 0)}
              >
                <div className="lrn-module-icon" style={{ background: `${mod.color}22` }}>
                  {mod.icon}
                </div>
                <div>
                  <div className="lrn-module-name">{mod.title}</div>
                  <div className="lrn-module-meta">{mod.sections.length} section{mod.sections.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </aside>

          {/* Content */}
          <main className="lrn-content">
            <div className="lrn-card">
              {/* Progress */}
              <div className="lrn-progress-row">
                <span>Section {currentSection + 1} of {module.sections.length}</span>
                <span style={{ color: module.color, fontWeight: 600 }}>{Math.round(progress)}% complete</span>
              </div>
              <div className="lrn-progress-track">
                <div className="lrn-progress-fill" style={{ width: `${progress}%`, background: module.gradient }} />
              </div>

              {/* Section tabs */}
              {module.sections.length > 1 && (
                <div className="lrn-section-tabs">
                  {module.sections.map((s, i) => (
                    <button
                      key={i}
                      className={`lrn-section-tab ${i === currentSection ? 'active' : ''}`}
                      onClick={() => goToSection(selectedModule, i)}
                      style={i === currentSection ? { background: `${module.color}25`, borderColor: module.color, color: module.color } : {}}
                    >
                      {i + 1}. {s.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Content */}
              <div key={animKey}>
                <SectionContent section={section} color={module.color} />
              </div>

              {/* Navigation */}
              <div className="lrn-nav">
                <button
                  className="lrn-btn-prev"
                  onClick={handlePrevious}
                  disabled={isFirst}
                >
                  <ArrowLeft /> Previous
                </button>
                <button
                  className="lrn-btn-next"
                  onClick={handleNext}
                  style={{ background: module.gradient }}
                >
                  {isLast ? (
                    <><CheckCircle /> Complete</>
                  ) : (
                    <>Next <ArrowRight /></>
                  )}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}