import { useState } from 'react';

export default function NameModal({ onStart }) {
  const [name, setName]     = useState('');
  const [cohort, setCohort] = useState('');
  const [error, setError]   = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) { setError(true); return; }
    onStart(name.trim(), cohort.trim() || null);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">🔍</div>
        <h2>Welcome to AlertIQ</h2>
        <p>Enter your details so your trainer can track your progress.</p>
        <form onSubmit={submit}>
          <label className="progress-label" style={{ textAlign: 'left', display: 'block', marginBottom: 6 }}>Full name <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            className={`modal-input${error ? ' error' : ''}`}
            type="text"
            placeholder="Your full name"
            value={name}
            autoFocus
            onChange={e => { setName(e.target.value); setError(false); }}
          />
          {error && <p className="modal-error">Please enter your name to continue.</p>}
          <label className="progress-label" style={{ textAlign: 'left', display: 'block', margin: '10px 0 6px' }}>Cohort / Class <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional)</span></label>
          <input
            className="modal-input"
            type="text"
            placeholder="e.g. June 2026 Bootcamp"
            value={cohort}
            onChange={e => setCohort(e.target.value)}
          />
          <button className="modal-btn" type="submit">Start Training →</button>
        </form>
      </div>
    </div>
  );
}
