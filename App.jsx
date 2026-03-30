import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Search, Activity, Terminal, AlertTriangle, Info } from 'lucide-react';
import { analyzeInput } from './components/AnalyzerEngine';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    // Simulate deep scanning animation
    setTimeout(() => {
      const data = analyzeInput(input);
      setResult(data);
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (level) => {
    switch (level) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'success';
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>PhishGuard AI</h1>
        <p>Cybersecurity Grade URL & Social Engineering Analysis Tool</p>
      </header>

      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        {loading && <div className="scanning-bar"></div>}
        
        <div className="input-container">
          <div className="input-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Terminal size={18} className="text-primary" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>PASTE URL OR COMMUNICATION TEXT</span>
          </div>
          
          <textarea 
            placeholder="e.g., https://secure-login-bank.com or 'Urgent: Your account is suspended...'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <button 
            className="analyze-button" 
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <Activity className="animate-spin" size={20} />
            ) : (
              <Search size={20} />
            )}
            {loading ? 'ANALYZING...' : 'INITIALIZE SCAN'}
          </button>
        </div>
      </div>

      {result && (
        <div className="result-container">
          <div className="glass-panel">
            <div className="risk-header">
              <div className="risk-level">
                <span>RISK LEVEL</span>
                <div className={`level-badge text-${getStatusColor(result.level)}`}>
                  {result.level}
                </div>
                <div className={`classification-tag bg-${getStatusColor(result.level)}`}>
                  {result.classification}
                </div>
              </div>
              
              <div className={`risk-score-circle text-${getStatusColor(result.level)}`}>
                <span className="score">{result.score}</span>
                <span className="score-label">RISK SCORE</span>
              </div>
            </div>

            <div className="indicators-list">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Activity size={18} className="text-primary" />
                <h3>KEY INDICATORS</h3>
              </div>
              {result.indicators.map((indicator, index) => (
                <div key={index} className="indicator-item">
                  <span className="text-primary">•</span>
                  {indicator}
                </div>
              ))}
            </div>

            <div className="explanation-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Info size={16} className="text-primary" />
                <h3>EXPLANATION</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{result.explanation}</p>
            </div>

            <div className={`recommendation-box`} style={{ borderLeftColor: `var(--${getStatusColor(result.level)})` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldAlert size={16} className={`text-${getStatusColor(result.level)}`} />
                <h3>RECOMMENDATION</h3>
              </div>
              <p style={{ color: 'white', fontWeight: 500 }}>{result.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
