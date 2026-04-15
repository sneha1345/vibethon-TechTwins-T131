import React, { useState, useRef, useEffect } from 'react';

/* ─── Keyframes + Global Styles ───────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap');

  *{box-sizing:border-box;margin:0;padding:0}
  body,html{height:100%;background:#07040f;font-family:'Sora',sans-serif;color:#e8e0ff}

  @keyframes vb-float1{0%,100%{transform:translate(0,0)}40%{transform:translate(25px,-18px)}70%{transform:translate(-15px,12px)}}
  @keyframes vb-float2{0%,100%{transform:translate(0,0)}35%{transform:translate(-22px,18px)}65%{transform:translate(18px,-22px)}}
  @keyframes vb-float3{0%,100%{transform:translate(0,0)}50%{transform:translate(12px,25px)}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes badgePop{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}

  .scene{position:fixed;inset:0;background:#07040f;overflow:hidden}
  .blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;will-change:transform}
  .b1{width:500px;height:500px;background:radial-gradient(circle,rgba(80,20,180,.7) 0%,transparent 70%);top:-150px;left:-100px;animation:vb-float1 14s ease-in-out infinite}
  .b2{width:420px;height:420px;background:radial-gradient(circle,rgba(150,20,120,.6) 0%,transparent 70%);bottom:-100px;right:-60px;animation:vb-float2 17s ease-in-out infinite}
  .b3{width:300px;height:300px;background:radial-gradient(circle,rgba(30,15,100,.8) 0%,transparent 70%);top:45%;left:50%;animation:vb-float3 11s ease-in-out infinite}

  .app{position:relative;z-index:2;display:flex;flex-direction:column;height:100vh;overflow:hidden}

  .topbar{display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:52px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(12,8,24,.8);backdrop-filter:blur(12px);flex-shrink:0}
  .topbar-logo{display:flex;align-items:center;gap:9px}
  .logo-ring{width:26px;height:26px;border-radius:50%;border:2px solid rgba(170,110,255,.6);display:flex;align-items:center;justify-content:center}
  .logo-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#a06eff,#e060d0)}
  .logo-name{font-size:14px;font-weight:700;letter-spacing:3px;background:linear-gradient(90deg,#c49fff,#e87fe8,#a06eff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite}
  .topbar-center{display:flex;align-items:center;gap:6px}
  .diff-badge{font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:.5px}
  .diff-easy{background:rgba(34,197,120,.12);color:#34c578;border:1px solid rgba(34,197,120,.25)}
  .diff-medium{background:rgba(251,189,35,.12);color:#f5b800;border:1px solid rgba(251,189,35,.25)}
  .diff-hard{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.25)}
  .prob-num{font-size:13px;color:rgba(200,170,255,.5);font-weight:500}
  .topbar-right{display:flex;align-items:center;gap:10px}
  .tb-btn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:'Sora',sans-serif;letter-spacing:.3px;transition:all .2s}
  .tb-btn-ghost{background:rgba(255,255,255,.06);color:rgba(200,170,255,.8);border:1px solid rgba(255,255,255,.1)}
  .tb-btn-ghost:hover{background:rgba(255,255,255,.1);color:#fff}
  .tb-btn-run{background:linear-gradient(135deg,#059669,#10b981);color:#fff}
  .tb-btn-run:hover{opacity:.85}
  .tb-btn-run:disabled{background:rgba(255,255,255,.1);color:rgba(255,255,255,.3);cursor:not-allowed}

  .main{display:flex;flex:1;overflow:hidden}

  .prob-panel{width:420px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;overflow:hidden;background:rgba(10,6,20,.5)}
  .prob-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.07);padding:0 16px;gap:2px;flex-shrink:0}
  .prob-tab{padding:12px 14px;font-size:12px;font-weight:500;color:rgba(200,170,255,.4);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;letter-spacing:.3px;background:none;border-top:none;border-left:none;border-right:none;font-family:'Sora',sans-serif}
  .prob-tab.active{color:#c49fff;border-bottom-color:#7e3aff}
  .prob-tab:hover:not(.active){color:rgba(200,170,255,.7)}
  .prob-body{flex:1;overflow-y:auto;padding:24px 20px;scrollbar-width:thin;scrollbar-color:rgba(126,58,255,.3) transparent}
  .prob-body::-webkit-scrollbar{width:4px}
  .prob-body::-webkit-scrollbar-thumb{background:rgba(126,58,255,.3);border-radius:2px}

  .prob-title{font-size:20px;font-weight:700;color:#e8e0ff;margin-bottom:12px;line-height:1.3}
  .prob-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
  .prob-tag{font-size:10px;font-weight:600;padding:3px 9px;border-radius:12px;background:rgba(126,58,255,.12);color:rgba(180,140,255,.8);border:1px solid rgba(126,58,255,.2);letter-spacing:.4px;text-transform:uppercase}
  .prob-section{margin-bottom:22px}
  .prob-section-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(180,140,255,.5);margin-bottom:10px}
  .prob-desc{font-size:13.5px;color:rgba(220,200,255,.75);line-height:1.8}
  .prob-desc p{margin-bottom:10px}
  .prob-desc code{background:rgba(126,58,255,.15);color:#c49fff;padding:1px 6px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:12px}

  .example-box{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;margin-bottom:10px}
  .example-label{font-size:10px;font-weight:700;color:rgba(180,140,255,.5);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
  .example-io{font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(220,200,255,.8);line-height:1.7}
  .example-key{color:rgba(180,140,255,.6);margin-right:6px}
  .example-val{color:#c9f0a0}

  .constraint-list{list-style:none;display:flex;flex-direction:column;gap:7px}
  .constraint-list li{font-size:12.5px;color:rgba(200,170,255,.6);display:flex;align-items:flex-start;gap:8px;line-height:1.5}
  .constraint-list li::before{content:'▸';color:#7e3aff;flex-shrink:0;margin-top:1px}
  .constraint-list code{background:rgba(126,58,255,.15);color:#c49fff;padding:0 5px;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:11px}

  .hint-box{background:rgba(251,189,35,.05);border:1px solid rgba(251,189,35,.15);border-radius:10px;padding:14px;margin-top:16px}
  .hint-title{font-size:11px;font-weight:700;color:rgba(251,189,35,.7);letter-spacing:.5px;margin-bottom:8px;display:flex;align-items:center;gap:6px}
  .hint-text{font-size:12.5px;color:rgba(220,200,180,.65);line-height:1.7}

  .editor-panel{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .editor-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(10,6,20,.4);flex-shrink:0}
  .lang-badge{background:rgba(126,58,255,.2);color:#c49fff;border:1px solid rgba(126,58,255,.3);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:600;font-family:'JetBrains Mono',monospace}

  .editor-area{flex:1;position:relative;overflow:hidden}
  .code-textarea{width:100%;height:100%;background:transparent;border:none;outline:none;resize:none;font-family:'JetBrains Mono',monospace;font-size:13.5px;line-height:1.8;color:#e2d9f3;padding:20px 20px 20px 60px;tab-size:4;caret-color:#c49fff;scrollbar-width:thin;scrollbar-color:rgba(126,58,255,.3) transparent}
  .code-textarea::-webkit-scrollbar{width:4px}
  .code-textarea::-webkit-scrollbar-thumb{background:rgba(126,58,255,.3);border-radius:2px}
  .line-nums{position:absolute;left:0;top:0;padding:20px 0;width:48px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:13.5px;line-height:1.8;color:rgba(180,140,255,.25);user-select:none;pointer-events:none;padding-right:12px;border-right:1px solid rgba(255,255,255,.06)}

  .output-panel{height:240px;flex-shrink:0;border-top:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;background:rgba(8,4,18,.6)}
  .output-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}
  .output-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(180,140,255,.5);display:flex;align-items:center;gap:8px}
  .output-status{font-size:11px;padding:2px 10px;border-radius:10px;font-weight:600;animation:badgePop .3s ease}
  .status-running{background:rgba(126,58,255,.2);color:#a06eff;border:1px solid rgba(126,58,255,.3)}
  .status-passed{background:rgba(34,197,120,.12);color:#34c578;border:1px solid rgba(34,197,120,.25)}
  .status-failed{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.25)}
  .status-error{background:rgba(251,189,35,.12);color:#f5b800;border:1px solid rgba(251,189,35,.25)}
  .spinner{width:12px;height:12px;border:2px solid rgba(160,110,255,.3);border-top-color:#a06eff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}

  .output-body{flex:1;overflow-y:auto;padding:14px 16px;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.8;scrollbar-width:thin}
  .output-body::-webkit-scrollbar{width:4px}
  .output-body::-webkit-scrollbar-thumb{background:rgba(126,58,255,.3);border-radius:2px}

  .out-placeholder{color:rgba(200,170,255,.2);font-style:italic;font-family:'Sora',sans-serif;font-size:12px;text-align:center;margin-top:20px}
  .out-line{margin-bottom:4px;animation:fadeIn .2s ease;white-space:pre-wrap;word-break:break-all}
  .out-line.success{color:#34c578}
  .out-line.error{color:#ff7eb3}
  .out-line.normal{color:rgba(220,200,255,.8)}
  .out-line.dim{color:rgba(200,170,255,.35)}

  .prob-list{width:68px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.07);background:rgba(8,4,18,.5);display:flex;flex-direction:column;align-items:center;padding:10px 6px;gap:6px;overflow-y:auto}
  .pl-item{width:48px;height:40px;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;border:1px solid transparent;flex-shrink:0}
  .pl-item.active{background:rgba(126,58,255,.25);border-color:rgba(126,58,255,.4)}
  .pl-item:hover:not(.active){background:rgba(255,255,255,.05)}
  .pl-num{font-size:11px;font-weight:600;color:rgba(200,170,255,.6)}
  .pl-item.active .pl-num{color:#c49fff}
  .pl-dot{width:6px;height:6px;border-radius:50%;margin-top:2px}
  .dot-easy{background:#34c578}
  .dot-medium{background:#f5b800}
  .dot-hard{background:#ef4444}
  .pl-solved{width:6px;height:6px;border-radius:50%;background:#34c578;margin-top:2px}

  .stats-bar{display:flex;align-items:center;gap:16px;padding:0 16px}
  .stat-item{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(200,170,255,.45)}
  .stat-item span{color:rgba(200,170,255,.8);font-weight:600}
  .stat-divider{width:1px;height:12px;background:rgba(255,255,255,.1)}
`;

/* ─── ML Problem Dataset ─────────────────────────────────────────── */
const PROBLEMS = [
  {
    id: 1,
    title: "Implement Sigmoid Activation",
    difficulty: "Easy",
    tags: ["Activation", "NumPy", "Neural Networks"],
    description: `<p>Implement the <code>sigmoid</code> activation function used in neural networks.</p>
<p>The sigmoid function is defined as: <code>σ(x) = 1 / (1 + e^(-x))</code></p>
<p>Your function should work with both scalar values and NumPy arrays.</p>`,
    examples: [
      { input: "x = 0", output: "0.5" },
      { input: "x = np.array([-2, -1, 0, 1, 2])", output: "[0.1192, 0.2689, 0.5, 0.7311, 0.8808]" }
    ],
    constraints: [
      "Use NumPy's exp function",
      "Handle both scalar and array inputs"
    ],
    hint: "Use np.exp(-x) for the exponential. The formula is: 1 / (1 + np.exp(-x))",
    starterCode: `import numpy as np

def sigmoid(x):
    """
    Compute sigmoid activation.
    σ(x) = 1 / (1 + e^(-x))
    """
    return 1 / (1 + np.exp(-x))

# Test your implementation
print("Testing sigmoid function:")
print(f"Sigmoid of 0: {sigmoid(0)}")

x_array = np.array([-2, -1, 0, 1, 2])
print(f"\\nSigmoid of array [-2, -1, 0, 1, 2]:")
print(sigmoid(x_array))

# Additional test
print(f"\\nSigmoid of large positive (10): {sigmoid(10):.6f}")
print(f"Sigmoid of large negative (-10): {sigmoid(-10):.6f}")
`
  },
  {
    id: 2,
    title: "Linear Regression with Gradient Descent",
    difficulty: "Medium",
    tags: ["Regression", "Optimization", "NumPy"],
    description: `<p>Implement linear regression using gradient descent.</p>
<p>Given features X and targets y, find weights w that minimize MSE loss.</p>
<p>Update rule: <code>w = w - lr * (2/n) * X.T @ (X @ w - y)</code></p>`,
    examples: [
      { input: "X=[[1,2],[3,4]], y=[5,11], lr=0.01", output: "w ≈ [1.0, 2.0]" }
    ],
    constraints: [
      "Use NumPy operations",
      "No sklearn allowed"
    ],
    hint: "Compute gradient as (2/n) * X.T @ (X @ w - y). Update weights in a loop.",
    starterCode: `import numpy as np

def linear_regression_gd(X, y, lr=0.01, n_iters=1000):
    """
    Linear regression using gradient descent.
    """
    X = np.array(X, dtype=float)
    y = np.array(y, dtype=float)
    n = len(y)
    w = np.zeros(X.shape[1])
    
    for i in range(n_iters):
        grad = (2/n) * X.T @ (X @ w - y)
        w = w - lr * grad
        
        # Print progress every 200 iterations
        if i % 200 == 0:
            loss = np.mean((X @ w - y) ** 2)
            print(f"Iteration {i}: Loss = {loss:.6f}")
    
    return w

# Test
print("Linear Regression with Gradient Descent")
print("=" * 40)
X = [[1, 2], [3, 4], [5, 6]]
y = [5, 11, 17]
print(f"Input X:\\n{np.array(X)}")
print(f"Target y: {y}\\n")

w = linear_regression_gd(X, y, lr=0.01, n_iters=1000)
print(f"\\nFinal weights: {w}")
print(f"Expected: approx [1.0, 2.0]")

# Verify predictions
print(f"\\nPredictions:")
for i, x in enumerate(X):
    pred = np.dot(x, w)
    print(f"  x={x}: pred={pred:.2f}, actual={y[i]}")
`
  },
  {
    id: 3,
    title: "ReLU Activation Function",
    difficulty: "Easy",
    tags: ["Activation", "NumPy", "Deep Learning"],
    description: `<p>Implement the ReLU (Rectified Linear Unit) activation function.</p>
<p>ReLU is defined as: <code>f(x) = max(0, x)</code></p>
<p>It's one of the most popular activation functions in deep learning.</p>`,
    examples: [
      { input: "x = 5", output: "5" },
      { input: "x = -3", output: "0" },
      { input: "x = np.array([-2, -1, 0, 1, 2])", output: "[0, 0, 0, 1, 2]" }
    ],
    constraints: [
      "Use NumPy for array operations",
      "Return same type as input"
    ],
    hint: "Use np.maximum(0, x) for arrays, or max(0, x) for scalars.",
    starterCode: `import numpy as np

def relu(x):
    """
    ReLU activation function.
    f(x) = max(0, x)
    """
    return np.maximum(0, x)

# Test
print("ReLU Activation Function")
print("=" * 40)
print(f"ReLU(5): {relu(5)}")
print(f"ReLU(-3): {relu(-3)}")
print(f"ReLU(0): {relu(0)}")

x_array = np.array([-2, -1, 0, 1, 2, 3])
print(f"\\nReLU of {x_array}:")
print(relu(x_array))

# Visual demonstration
print(f"\\nInput values:  {x_array}")
print(f"ReLU outputs:   {relu(x_array)}")
`
  }
];

/* ─── Main Component ─────────────────────────────────────────────── */
export default function MLCodeLab() {
  const [activeProbIdx, setActiveProbIdx] = useState(0);
  const [probTab, setProbTab] = useState('problem');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [outputLines, setOutputLines] = useState([]);
  const [runStatus, setRunStatus] = useState(null);
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [pyodide, setPyodide] = useState(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const textareaRef = useRef(null);
  const outputRef = useRef(null);

  const prob = PROBLEMS[activeProbIdx];

  // Load Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.onload = async () => {
          const pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
          });
          
          await pyodideInstance.loadPackage('numpy');
          
          setPyodide(pyodideInstance);
          setPyodideReady(true);
          console.log('✅ Pyodide ready!');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        setOutputLines([{ text: 'Failed to load Python runtime.', type: 'error' }]);
      }
    };
    
    loadPyodide();
  }, []);

  useEffect(() => {
    if (PROBLEMS[activeProbIdx]) {
      setCode(PROBLEMS[activeProbIdx].starterCode);
    }
    setOutputLines([]);
    setRunStatus(null);
    setProbTab('problem');
  }, [activeProbIdx]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textareaRef.current.selectionStart = start + 4;
        textareaRef.current.selectionEnd = start + 4;
      }, 0);
    }
    
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runCode();
    }
  };

  const runCode = async () => {
    if (!pyodideReady || !pyodide) {
      setOutputLines([{ text: 'Python runtime is still loading...', type: 'error' }]);
      return;
    }

    setRunning(true);
    setRunStatus('running');
    setOutputLines([]);

    // String to collect output
    let stdoutBuffer = '';
    let stderrBuffer = '';

    try {
      // Set up stdout capture
      pyodide.setStdout({
        batched: (text) => {
          if (text) {
            stdoutBuffer += text;
            // Split by newline and add each line
            const lines = text.split('\\n');
            lines.forEach(line => {
              if (line.trim()) {
                setOutputLines(prev => [...prev, { text: line, type: 'normal' }]);
              }
            });
          }
        }
      });

      // Set up stderr capture
      pyodide.setStderr({
        batched: (text) => {
          if (text) {
            stderrBuffer += text;
            const lines = text.split('\\n');
            lines.forEach(line => {
              if (line.trim()) {
                setOutputLines(prev => [...prev, { text: line, type: 'error' }]);
              }
            });
          }
        }
      });

      const startTime = performance.now();
      
      // Run the Python code
      await pyodide.runPythonAsync(code);
      
      const endTime = performance.now();
      const runtime = Math.round(endTime - startTime);
      
      // If no output was captured but code ran successfully
      if (stdoutBuffer === '' && stderrBuffer === '') {
        setOutputLines(prev => [...prev, { text: '(No output - code executed successfully)', type: 'dim' }]);
      }
      
      setOutputLines(prev => [
        ...prev,
        { text: '', type: 'dim' },
        { text: `✓ Execution completed in ${runtime}ms`, type: 'success' }
      ]);

      setRunStatus('passed');
      setSolvedSet(prev => new Set([...prev, prob.id]));

    } catch (error) {
      console.error('Python execution error:', error);
      
      // Parse Python error message
      let errorMsg = error.message;
      if (errorMsg.includes('Traceback')) {
        const lines = errorMsg.split('\\n');
        lines.forEach(line => {
          setOutputLines(prev => [...prev, { text: line, type: 'error' }]);
        });
      } else {
        setOutputLines(prev => [...prev, { text: errorMsg, type: 'error' }]);
      }
      
      setRunStatus('error');
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    setCode(prob.starterCode);
    setOutputLines([]);
    setRunStatus(null);
  };

  const numLines = code.split('\n').length;
  const lineNums = Array.from({ length: Math.max(numLines, 1) }, (_, i) => i + 1).join('\n');

  return (
    <>
      <style>{STYLES}</style>
      <div className="scene">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>

      <div className="app">
        <div className="topbar">
          <div className="topbar-logo">
            <div className="logo-ring"><div className="logo-dot" /></div>
            <span className="logo-name">VIBETHON AI</span>
          </div>
          <div className="topbar-center">
            <span className="prob-num">#{prob.id}</span>
            <span className={`diff-badge diff-${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
            {!pyodideReady && <span style={{ color: '#f5b800', fontSize: 11, marginLeft: 8 }}>Loading Python...</span>}
          </div>
          <div className="topbar-right">
            <div className="stats-bar">
              <div className="stat-item">Solved <span>{solvedSet.size}</span></div>
              <div className="stat-divider" />
              <div className="stat-item">Total <span>{PROBLEMS.length}</span></div>
            </div>
            <button className="tb-btn tb-btn-ghost" onClick={resetCode}>Reset</button>
            <button
              className="tb-btn tb-btn-run"
              onClick={runCode}
              disabled={running || !pyodideReady}
            >
              {running ? '⏳ Running...' : !pyodideReady ? 'Loading...' : '▶ Run'}
            </button>
          </div>
        </div>

        <div className="main">
          <div className="prob-list">
            {PROBLEMS.map((p, i) => (
              <div
                key={p.id}
                className={`pl-item${activeProbIdx === i ? ' active' : ''}`}
                onClick={() => setActiveProbIdx(i)}
                title={p.title}
              >
                <span className="pl-num">{p.id}</span>
                {solvedSet.has(p.id)
                  ? <div className="pl-solved" />
                  : <div className={`pl-dot dot-${p.difficulty.toLowerCase()}`} />
                }
              </div>
            ))}
          </div>

          <div className="prob-panel">
            <div className="prob-tabs">
              {['problem', 'hints'].map(t => (
                <button
                  key={t}
                  className={`prob-tab${probTab === t ? ' active' : ''}`}
                  onClick={() => setProbTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="prob-body">
              {probTab === 'problem' && (
                <>
                  <div className="prob-title">{prob.title}</div>
                  <div className="prob-tags">
                    {prob.tags.map(tag => <span key={tag} className="prob-tag">{tag}</span>)}
                  </div>

                  <div className="prob-section">
                    <div className="prob-section-title">Description</div>
                    <div className="prob-desc" dangerouslySetInnerHTML={{ __html: prob.description }} />
                  </div>

                  <div className="prob-section">
                    <div className="prob-section-title">Examples</div>
                    {prob.examples.map((ex, i) => (
                      <div key={i} className="example-box">
                        <div className="example-label">Example {i + 1}</div>
                        <div className="example-io">
                          <div><span className="example-key">Input:</span><span className="example-val">{ex.input}</span></div>
                          <div><span className="example-key">Output:</span><span className="example-val">{ex.output}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="prob-section">
                    <div className="prob-section-title">Constraints</div>
                    <ul className="constraint-list">
                      {prob.constraints.map((c, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: c.replace(/`([^`]+)`/g, '<code>$1</code>') }} />
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {probTab === 'hints' && (
                <div className="prob-section">
                  <div className="prob-section-title">Approach Hint</div>
                  <div className="hint-box">
                    <div className="hint-title">💡 Hint</div>
                    <div className="hint-text">{prob.hint}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="editor-panel">
            <div className="editor-topbar">
              <span className="lang-badge">Python 3.10 (Pyodide)</span>
              <span style={{ fontSize: 11, color: 'rgba(200,170,255,.35)', fontFamily: "'JetBrains Mono', monospace" }}>
                {numLines} lines
              </span>
            </div>

            <div className="editor-area">
              <div className="line-nums">{lineNums}</div>
              <textarea
                ref={textareaRef}
                className="code-textarea"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            <div className="output-panel">
              <div className="output-header">
                <div className="output-title">
                  {running && <span className="spinner" />}
                  OUTPUT CONSOLE
                </div>
                {runStatus && (
                  <span className={`output-status status-${runStatus}`}>
                    {runStatus === 'running' ? 'Running...'
                      : runStatus === 'passed' ? '✓ Success'
                      : runStatus === 'failed' ? '✗ Failed'
                      : '⚠ Error'}
                  </span>
                )}
              </div>

              <div className="output-body" ref={outputRef}>
                {outputLines.length === 0 && !running && (
                  <div className="out-placeholder">
                    Click "Run" to execute your code ▶
                  </div>
                )}
                {running && outputLines.length === 0 && (
                  <div className="out-placeholder">Executing Python code...</div>
                )}

                {outputLines.map((line, i) => (
                  <div key={i} className={`out-line ${line.type}`}>
                    {line.text || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}