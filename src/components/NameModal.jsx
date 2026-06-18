import { useState } from 'react';

export default function NameModal({ onStart }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) { setError(true); return; }
    onStart(name.trim());
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">🔍</div>
        <h2>Welcome to AlertIQ</h2>
        <p>Enter your name so your trainer can see your score.</p>
        <form onSubmit={submit}>
          <input
            className={`modal-input${error ? ' error' : ''}`}
            type="text"
            placeholder="Your full name"
            value={name}
            autoFocus
            onChange={e => { setName(e.target.value); setError(false); }}
          />
          {error && <p className="modal-error">Please enter your name to continue.</p>}
          <button className="modal-btn" type="submit">Start Training →</button>
        </form>
      </div>
    </div>
  );
}
