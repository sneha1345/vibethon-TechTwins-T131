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
  @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(126,58,255,.4)}70%{box-shadow:0 0 0 8px rgba(126,58,255,0)}100%{box-shadow:0 0 0 0 rgba(126,58,255,0)}}
  @keyframes slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes badgePop{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}

  .scene{position:fixed;inset:0;background:#07040f;overflow:hidden}
  .blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;will-change:transform}
  .b1{width:500px;height:500px;background:radial-gradient(circle,rgba(80,20,180,.7) 0%,transparent 70%);top:-150px;left:-100px;animation:vb-float1 14s ease-in-out infinite}
  .b2{width:420px;height:420px;background:radial-gradient(circle,rgba(150,20,120,.6) 0%,transparent 70%);bottom:-100px;right:-60px;animation:vb-float2 17s ease-in-out infinite}
  .b3{width:300px;height:300px;background:radial-gradient(circle,rgba(30,15,100,.8) 0%,transparent 70%);top:45%;left:50%;animation:vb-float3 11s ease-in-out infinite}

  .app{position:relative;z-index:2;display:flex;flex-direction:column;height:100vh;overflow:hidden}

  /* ── Top Bar ── */
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
  .tb-btn-primary{background:linear-gradient(135deg,#7e3aff,#c43fc4);color:#fff}
  .tb-btn-primary:hover{opacity:.85}
  .tb-btn-run{background:linear-gradient(135deg,#059669,#10b981);color:#fff}
  .tb-btn-run:hover{opacity:.85}
  .tb-btn-run:disabled{background:rgba(255,255,255,.1);color:rgba(255,255,255,.3);cursor:not-allowed}

  /* ── Main Layout ── */
  .main{display:flex;flex:1;overflow:hidden}

  /* ── Problem Panel ── */
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

  /* ── Editor Panel ── */
  .editor-panel{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .editor-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(10,6,20,.4);flex-shrink:0}
  .lang-selector{display:flex;align-items:center;gap:8px}
  .lang-badge{background:rgba(126,58,255,.2);color:#c49fff;border:1px solid rgba(126,58,255,.3);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:600;font-family:'JetBrains Mono',monospace}
  .editor-actions{display:flex;gap:8px}

  .editor-area{flex:1;position:relative;overflow:hidden}
  .code-textarea{width:100%;height:100%;background:transparent;border:none;outline:none;resize:none;font-family:'JetBrains Mono',monospace;font-size:13.5px;line-height:1.8;color:#e2d9f3;padding:20px 20px 20px 60px;tab-size:4;-moz-tab-size:4;caret-color:#c49fff;scrollbar-width:thin;scrollbar-color:rgba(126,58,255,.3) transparent}
  .code-textarea::-webkit-scrollbar{width:4px}
  .code-textarea::-webkit-scrollbar-thumb{background:rgba(126,58,255,.3);border-radius:2px}
  .line-nums{position:absolute;left:0;top:0;padding:20px 0;width:48px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:13.5px;line-height:1.8;color:rgba(180,140,255,.25);user-select:none;pointer-events:none;padding-right:12px;border-right:1px solid rgba(255,255,255,.06)}

  /* ── Output Panel ── */
  .output-panel{height:240px;flex-shrink:0;border-top:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;background:rgba(8,4,18,.6)}
  .output-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}
  .output-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(180,140,255,.5);display:flex;align-items:center;gap:8px}
  .output-status{font-size:11px;padding:2px 10px;border-radius:10px;font-weight:600;animation:badgePop .3s ease}
  .status-running{background:rgba(126,58,255,.2);color:#a06eff;border:1px solid rgba(126,58,255,.3)}
  .status-passed{background:rgba(34,197,120,.12);color:#34c578;border:1px solid rgba(34,197,120,.25)}
  .status-failed{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.25)}
  .status-error{background:rgba(251,189,35,.12);color:#f5b800;border:1px solid rgba(251,189,35,.25)}
  .spinner{width:12px;height:12px;border:2px solid rgba(160,110,255,.3);border-top-color:#a06eff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}

  .output-body{flex:1;overflow-y:auto;padding:14px 16px;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.8;scrollbar-width:thin;scrollbar-color:rgba(126,58,255,.3) transparent}
  .output-body::-webkit-scrollbar{width:4px}
  .output-body::-webkit-scrollbar-thumb{background:rgba(126,58,255,.3);border-radius:2px}

  .out-placeholder{color:rgba(200,170,255,.2);font-style:italic;font-family:'Sora',sans-serif;font-size:12px;text-align:center;margin-top:20px}
  .out-line{margin-bottom:4px;animation:fadeIn .2s ease}
  .out-line.info{color:rgba(200,170,255,.6)}
  .out-line.success{color:#34c578}
  .out-line.error{color:#ff7eb3}
  .out-line.warn{color:#f5b800}
  .out-line.normal{color:rgba(220,200,255,.8)}
  .out-line.dim{color:rgba(200,170,255,.35)}
  .out-section{margin-bottom:12px}
  .out-section-head{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(180,140,255,.4);margin-bottom:6px;font-family:'Sora',sans-serif}

  .testcase-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)}
  .testcase-row:last-child{border-bottom:none}
  .tc-icon{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
  .tc-pass{background:rgba(34,197,120,.2);color:#34c578;border:1px solid rgba(34,197,120,.3)}
  .tc-fail{background:rgba(239,68,68,.2);color:#ef4444;border:1px solid rgba(239,68,68,.3)}
  .tc-label{font-size:11px;color:rgba(200,170,255,.6);font-family:'Sora',sans-serif;flex:1}
  .tc-time{font-size:10px;color:rgba(180,140,255,.35)}

  /* ── Problem List Sidebar ── */
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

  /* ── Stats bar ── */
  .stats-bar{display:flex;align-items:center;gap:16px;padding:0 16px}
  .stat-item{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(200,170,255,.45)}
  .stat-item span{color:rgba(200,170,255,.8);font-weight:600}
  .stat-divider{width:1px;height:12px;background:rgba(255,255,255,.1)}
`;

/* ─── ML Problem Dataset ─────────────────────────────────────────── */
const PROBLEMS = [
  {
    id: 1,
    title: "Implement Gradient Descent",
    difficulty: "Easy",
    tags: ["Optimization", "Linear Algebra", "NumPy"],
    description: `<p>Implement the <code>gradient_descent</code> function that minimizes a quadratic loss function using vanilla gradient descent.</p>
<p>You are given a dataset with features <code>X</code> and labels <code>y</code>. Your function must update the weights <code>w</code> iteratively for <code>n_iters</code> steps with learning rate <code>lr</code>, minimizing the Mean Squared Error (MSE) loss.</p>
<p>The gradient of MSE with respect to weights <code>w</code> is: <code>grad = (2/n) * X.T @ (X @ w - y)</code></p>`,
    examples: [
      { input: "X = [[1,2],[3,4]], y = [5,11], w = [0,0], lr = 0.01, n_iters = 100", output: "[1.0, 2.0]  # approx" }
    ],
    constraints: [
      "Use only NumPy for numerical operations",
      "n_iters ≤ 10000, lr ∈ (0, 1)",
      "X shape: (n_samples, n_features), y shape: (n_samples,)",
      "Return the final weight vector as a NumPy array"
    ],
    hint: "Remember to convert inputs to NumPy arrays first. The update rule is: w = w - lr * grad",
    starterCode: `import numpy as np

def gradient_descent(X, y, w, lr=0.01, n_iters=100):
    """
    Minimize MSE loss using gradient descent.
    
    Args:
        X: Feature matrix (n_samples, n_features)
        y: Target vector (n_samples,)
        w: Initial weights (n_features,)
        lr: Learning rate
        n_iters: Number of iterations
    
    Returns:
        Final weight vector
    """
    X, y, w = np.array(X, dtype=float), np.array(y, dtype=float), np.array(w, dtype=float)
    n = len(y)
    
    # YOUR CODE HERE
    
    return w


# Test your implementation
X = np.array([[1, 2], [3, 4], [5, 6]])
y = np.array([5.0, 11.0, 17.0])
w_init = np.zeros(2)

w_final = gradient_descent(X, y, w_init, lr=0.01, n_iters=1000)
print("Final weights:", w_final)
print("Expected: approx [1.0, 2.0]")
`,
    testCases: [
      { name: "Basic test", desc: "Simple 2-feature dataset" },
      { name: "Zero init", desc: "Weights start at zero" },
      { name: "Convergence", desc: "Loss decreases over time" }
    ]
  },
  {
    id: 2,
    title: "K-Means Clustering",
    difficulty: "Medium",
    tags: ["Unsupervised", "Clustering", "NumPy", "Distance"],
    description: `<p>Implement the K-Means clustering algorithm from scratch. Given a dataset <code>X</code> and number of clusters <code>k</code>, your function should return the cluster assignments for each data point.</p>
<p>Algorithm steps:</p>
<p>1. Initialize <code>k</code> centroids randomly from the data<br/>2. Assign each point to the nearest centroid (Euclidean distance)<br/>3. Recompute centroids as the mean of assigned points<br/>4. Repeat steps 2-3 until convergence or <code>max_iters</code> reached</p>`,
    examples: [
      { input: "X = [[1,1],[1.5,2],[3,4],[5,7],[3.5,5]], k = 2", output: "[0, 0, 1, 1, 1]  # cluster ids (may vary)" }
    ],
    constraints: [
      "Use Euclidean distance for assignments",
      "k ≤ min(20, n_samples)",
      "Return cluster labels as integer array",
      "Convergence: centroids change < 1e-4"
    ],
    hint: "Use np.argmin on pairwise distances. Compute distances with broadcasting: np.linalg.norm(X[:, None] - centroids[None, :], axis=2)",
    starterCode: `import numpy as np

def kmeans(X, k, max_iters=100, seed=42):
    """
    K-Means clustering from scratch.
    
    Args:
        X: Dataset of shape (n_samples, n_features)
        k: Number of clusters
        max_iters: Maximum iterations
        seed: Random seed for reproducibility
    
    Returns:
        labels: Cluster assignment for each point (n_samples,)
    """
    np.random.seed(seed)
    X = np.array(X, dtype=float)
    n_samples = X.shape[0]
    
    # Initialize centroids randomly from data points
    idx = np.random.choice(n_samples, k, replace=False)
    centroids = X[idx].copy()
    
    labels = np.zeros(n_samples, dtype=int)
    
    for _ in range(max_iters):
        # YOUR CODE HERE
        pass
    
    return labels


# Test
X = np.array([[1,1],[1.5,2],[3,4],[5,7],[3.5,5],[4.5,6]])
labels = kmeans(X, k=2)
print("Cluster labels:", labels)
print("Unique clusters:", np.unique(labels))
`,
    testCases: [
      { name: "2 clusters", desc: "Well-separated blobs" },
      { name: "3 clusters", desc: "Gaussian mixture data" },
      { name: "Convergence", desc: "Stable after iterations" }
    ]
  },
  {
    id: 3,
    title: "Backpropagation — Single Layer",
    difficulty: "Hard",
    tags: ["Neural Networks", "Backprop", "Calculus", "NumPy"],
    description: `<p>Implement the forward pass and backpropagation for a single fully-connected layer with sigmoid activation.</p>
<p>Given inputs <code>X</code>, weights <code>W</code>, bias <code>b</code>, and labels <code>y</code>, compute the gradients <code>dW</code> and <code>db</code> using binary cross-entropy loss.</p>
<p>Forward: <code>z = X @ W + b</code>, <code>a = sigmoid(z)</code>, <code>loss = -mean(y * log(a) + (1-y) * log(1-a))</code></p>
<p>Backward: <code>dz = a - y</code>, <code>dW = X.T @ dz / n</code>, <code>db = mean(dz)</code></p>`,
    examples: [
      { input: "X shape (100, 4), W shape (4, 1), single output neuron", output: "dW shape (4,1), db shape (1,)" }
    ],
    constraints: [
      "Clip predictions to [1e-7, 1-1e-7] to avoid log(0)",
      "Binary cross-entropy loss only",
      "Return dW, db as NumPy arrays",
      "Must handle batches correctly"
    ],
    hint: "The key insight: gradient of sigmoid cross-entropy simplifies to (a - y). Make sure your shapes are consistent — use keepdims=True where needed.",
    starterCode: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward_backward(X, W, b, y):
    """
    Forward pass + backprop for single sigmoid layer.
    
    Args:
        X: Inputs (n_samples, n_features)
        W: Weights (n_features, 1)
        b: Bias (1,)
        y: Binary labels (n_samples, 1)
    
    Returns:
        loss: Scalar BCE loss
        dW: Gradient w.r.t W
        db: Gradient w.r.t b
    """
    n = X.shape[0]
    
    # Forward pass
    # YOUR CODE HERE
    
    # Compute loss (with clipping)
    # YOUR CODE HERE
    
    # Backward pass
    # YOUR CODE HERE
    
    return loss, dW, db


# Test
np.random.seed(0)
X = np.random.randn(50, 3)
W = np.random.randn(3, 1) * 0.1
b = np.zeros((1,))
y = (np.random.randn(50, 1) > 0).astype(float)

loss, dW, db = forward_backward(X, W, b, y)
print(f"Loss: {loss:.4f}")
print(f"dW shape: {dW.shape}, db shape: {db.shape}")
`,
    testCases: [
      { name: "Shape check", desc: "Gradient shapes match W, b" },
      { name: "Gradient check", desc: "Numerical vs analytical" },
      { name: "Loss decreasing", desc: "Step reduces loss" }
    ]
  },
  {
    id: 4,
    title: "Precision, Recall & F1",
    difficulty: "Easy",
    tags: ["Evaluation", "Classification", "Metrics"],
    description: `<p>Implement the <code>classification_metrics</code> function that computes precision, recall, and F1-score from predicted labels and true labels.</p>
<p><code>Precision = TP / (TP + FP)</code><br/><code>Recall = TP / (TP + FN)</code><br/><code>F1 = 2 * Precision * Recall / (Precision + Recall)</code></p>
<p>Handle the edge case where the denominator is zero by returning 0 for that metric.</p>`,
    examples: [
      { input: "y_true = [1,0,1,1,0], y_pred = [1,0,0,1,1]", output: "precision=0.667, recall=0.667, f1=0.667" }
    ],
    constraints: [
      "Binary classification (0 and 1 only)",
      "Return a dict with keys: precision, recall, f1",
      "Round to 4 decimal places",
      "Do not use sklearn"
    ],
    hint: "Count TP, FP, FN first. TP = sum(y_true AND y_pred), FP = sum(NOT y_true AND y_pred), FN = sum(y_true AND NOT y_pred).",
    starterCode: `import numpy as np

def classification_metrics(y_true, y_pred):
    """
    Compute precision, recall, and F1-score.
    
    Args:
        y_true: Ground truth binary labels
        y_pred: Predicted binary labels
    
    Returns:
        dict with precision, recall, f1
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    
    # YOUR CODE HERE
    
    return {"precision": 0.0, "recall": 0.0, "f1": 0.0}


# Test
y_true = [1, 0, 1, 1, 0, 1]
y_pred = [1, 0, 0, 1, 1, 1]

metrics = classification_metrics(y_true, y_pred)
print("Precision:", metrics["precision"])
print("Recall:   ", metrics["recall"])
print("F1 Score: ", metrics["f1"])
`,
    testCases: [
      { name: "Basic metrics", desc: "Standard binary case" },
      { name: "All correct", desc: "Perfect predictions" },
      { name: "Zero division", desc: "Handle edge cases" }
    ]
  },
  {
    id: 5,
    title: "Attention Mechanism",
    difficulty: "Hard",
    tags: ["Transformers", "Attention", "Linear Algebra", "Deep Learning"],
    description: `<p>Implement scaled dot-product attention as used in transformer models.</p>
<p>Given query <code>Q</code>, key <code>K</code>, and value <code>V</code> matrices, compute the attention output.</p>
<p>Formula: <code>Attention(Q, K, V) = softmax(Q @ K.T / sqrt(d_k)) @ V</code></p>
<p>Where <code>d_k</code> is the dimension of the key vectors (K.shape[-1]).</p>
<p>Optionally apply a mask (set masked positions to -1e9 before softmax).</p>`,
    examples: [
      { input: "Q shape (4,8), K shape (4,8), V shape (4,16)", output: "output shape (4,16)" }
    ],
    constraints: [
      "Use stable softmax (subtract max before exp)",
      "Scale by sqrt(d_k) before softmax",
      "mask shape must broadcast to (seq_len, seq_len)",
      "Return attention output and attention weights"
    ],
    hint: "Compute scores = Q @ K.T / sqrt(d_k). Apply mask by adding -1e9. Then softmax row-wise. Output = softmax_scores @ V.",
    starterCode: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Scaled dot-product attention.
    
    Args:
        Q: Query matrix (seq_len, d_k)
        K: Key matrix (seq_len, d_k)
        V: Value matrix (seq_len, d_v)
        mask: Optional boolean mask (seq_len, seq_len)
    
    Returns:
        output: Attention output (seq_len, d_v)
        weights: Attention weights (seq_len, seq_len)
    """
    d_k = K.shape[-1]
    
    # YOUR CODE HERE
    
    return output, weights


# Test
np.random.seed(42)
seq_len, d_k, d_v = 4, 8, 16
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_v)

out, attn = scaled_dot_product_attention(Q, K, V)
print("Output shape:", out.shape)
print("Attention weights shape:", attn.shape)
print("Weights sum to 1 (per row):", np.allclose(attn.sum(axis=-1), 1.0))
`,
    testCases: [
      { name: "Shape check", desc: "Output matches V dimensions" },
      { name: "Softmax sum", desc: "Weights sum to 1.0 per row" },
      { name: "Causal mask", desc: "Future tokens masked" }
    ]
  }
];

/* ─── Helpers ─────────────────────────────────────────────────────── */
function lineCount(code) {
  return code.split('\n').length;
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function MLCodeLab() {
  const [activeProbIdx, setActiveProbIdx] = useState(0);
  const [probTab, setProbTab] = useState('problem');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [outputLines, setOutputLines] = useState([]);
  const [runStatus, setRunStatus] = useState(null); // null | 'running' | 'passed' | 'failed' | 'error'
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [tcResults, setTcResults] = useState([]);
  const textareaRef = useRef(null);
  const outputRef = useRef(null);

  const prob = PROBLEMS[activeProbIdx];

  useEffect(() => {
    setCode(prob.starterCode);
    setOutputLines([]);
    setRunStatus(null);
    setTcResults([]);
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
  };

  const runCode = async () => {
    setRunning(true);
    setRunStatus('running');
    setOutputLines([]);
    setTcResults([]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a Python code execution simulator for an ML coding platform. The user is solving this problem: "${prob.title}".

Here is their submitted Python code:
\`\`\`python
${code}
\`\`\`

Simulate executing this Python code. Your response MUST be a JSON object with this exact schema:
{
  "stdout": ["line1", "line2", ...],
  "status": "passed" | "failed" | "error",
  "error_msg": null or "error message",
  "test_results": [
    {"name": "test name", "passed": true/false, "time_ms": number},
    ...
  ],
  "runtime_ms": number,
  "memory_kb": number,
  "feedback": "brief 1-2 sentence constructive feedback on the code quality or correctness"
}

Rules:
- If the code has NO implementation (just pass or empty), status="failed", include helpful stdout showing what the output would look like when solved
- If code has syntax errors, status="error"
- If code is partially correct, status="failed" with specific failing test info
- If code appears correct for the problem, status="passed"
- stdout should reflect realistic Python print output
- test_results should have exactly ${prob.testCases.length} items matching: ${prob.testCases.map(t => t.name).join(', ')}
- runtime_ms between 50-800, memory_kb between 1000-8000
- Respond ONLY with the JSON object, no markdown, no backticks`
          }]
        })
      });

      const data = await response.json();
      const text = data.content.map(i => i.text || '').join('');
      const clean = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(clean);

      const lines = [];
      if (result.stdout && result.stdout.length > 0) {
        result.stdout.forEach(l => lines.push({ text: l, type: 'normal' }));
      }
      if (result.error_msg) {
        lines.push({ text: result.error_msg, type: 'error' });
      }
      lines.push({ text: '', type: 'dim' });
      lines.push({ text: `Runtime: ${result.runtime_ms}ms  |  Memory: ${(result.memory_kb / 1024).toFixed(1)} MB`, type: 'dim' });
      if (result.feedback) {
        lines.push({ text: '', type: 'dim' });
        lines.push({ text: '💡 ' + result.feedback, type: 'info' });
      }

      setOutputLines(lines);
      setRunStatus(result.status);
      setTcResults(result.test_results || []);

      if (result.status === 'passed') {
        setSolvedSet(prev => new Set([...prev, prob.id]));
      }
    } catch (err) {
      setOutputLines([{ text: 'Execution service error. Please try again.', type: 'error' }]);
      setRunStatus('error');
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    setCode(prob.starterCode);
    setOutputLines([]);
    setRunStatus(null);
    setTcResults([]);
  };

  const numLines = lineCount(code);
  const lineNums = Array.from({ length: numLines }, (_, i) => i + 1).join('\n');

  return (
    <>
      <style>{STYLES}</style>
      <div className="scene">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>

      <div className="app">
        {/* ── Top Bar ── */}
        <div className="topbar">
          <div className="topbar-logo">
            <div className="logo-ring"><div className="logo-dot" /></div>
            <span className="logo-name">AIMLify</span>
          </div>
          <div className="topbar-center">
            <span className="prob-num">#{prob.id}</span>
            <span className={`diff-badge diff-${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
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
              disabled={running}
            >
              {running ? '⏳ Running...' : '▶ Run Code'}
            </button>
          </div>
        </div>

        {/* ── Main Area ── */}
        <div className="main">
          {/* Problem sidebar list */}
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

          {/* Problem description panel */}
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
                <>
                  <div className="prob-section">
                    <div className="prob-section-title">Approach Hint</div>
                    <div className="hint-box">
                      <div className="hint-title">💡 Hint</div>
                      <div className="hint-text">{prob.hint}</div>
                    </div>
                  </div>
                  <div className="prob-section" style={{ marginTop: 20 }}>
                    <div className="prob-section-title">Test Cases</div>
                    {prob.testCases.map((tc, i) => (
                      <div key={i} className="example-box" style={{ marginBottom: 8 }}>
                        <div className="example-label">Test {i + 1}: {tc.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(200,170,255,.55)', fontFamily: "'Sora', sans-serif" }}>{tc.desc}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Editor + Output */}
          <div className="editor-panel">
            <div className="editor-topbar">
              <div className="lang-selector">
                <span className="lang-badge">Python 3.10</span>
              </div>
              <div className="editor-actions">
                <span style={{ fontSize: 11, color: 'rgba(200,170,255,.35)', fontFamily: "'JetBrains Mono', monospace" }}>{numLines} lines</span>
              </div>
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

            {/* Output Panel */}
            <div className="output-panel">
              <div className="output-header">
                <div className="output-title">
                  {running && <span className="spinner" />}
                  Output Console
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {tcResults.length > 0 && (
                    <span style={{ fontSize: 11, color: 'rgba(200,170,255,.45)', fontFamily: "'JetBrains Mono',monospace" }}>
                      {tcResults.filter(t => t.passed).length}/{tcResults.length} tests
                    </span>
                  )}
                  {runStatus && (
                    <span className={`output-status status-${runStatus}`}>
                      {runStatus === 'running' ? 'Evaluating...'
                        : runStatus === 'passed' ? '✓ All Tests Passed'
                        : runStatus === 'failed' ? '✗ Tests Failed'
                        : '⚠ Error'}
                    </span>
                  )}
                </div>
              </div>

              <div className="output-body" ref={outputRef}>
                {outputLines.length === 0 && !running && (
                  <div className="out-placeholder">Click "Run Code" to execute and evaluate your solution</div>
                )}
                {running && outputLines.length === 0 && (
                  <div className="out-placeholder">Compiling and running your code...</div>
                )}

                {tcResults.length > 0 && (
                  <div className="out-section">
                    <div className="out-section-head">Test Results</div>
                    {tcResults.map((tc, i) => (
                      <div key={i} className="testcase-row">
                        <div className={`tc-icon ${tc.passed ? 'tc-pass' : 'tc-fail'}`}>
                          {tc.passed ? '✓' : '✗'}
                        </div>
                        <span className="tc-label">{tc.name}</span>
                        <span className="tc-time">{tc.time_ms}ms</span>
                      </div>
                    ))}
                  </div>
                )}

                {outputLines.length > 0 && (
                  <div className="out-section">
                    <div className="out-section-head">Stdout</div>
                    {outputLines.map((line, i) => (
                      <div key={i} className={`out-line ${line.type}`}>{line.text || '\u00A0'}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}