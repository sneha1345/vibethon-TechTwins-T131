import React from 'react'

const CodePlayground = () => {
  return (
    <div style={{ padding: '40px' }}>
      <h1>💻 Code Playground</h1>
      <p>Write and run Python code in your browser</p>
      <textarea 
        style={{ 
          width: '100%', 
          height: '200px', 
          marginTop: '20px',
          padding: '10px',
          fontFamily: 'monospace'
        }}
        placeholder="# Write your Python code here"
      />
    </div>
  )
}

export default CodePlayground