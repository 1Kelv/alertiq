import { useState } from 'react';
import { fetchStudentSessions } from '../lib/supabase';

const MODE_LABELS = { set1: 'Set 1 · Basic', set2: 'Set 2 · Int.', mixed: 'Mixed', exam: 'Exam', idv: 'ID&V', kyc: 'KYC', chargeback: 'Chargebacks' };
const GRADE_COLOR = { A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', F: '#ef4444' };

function timeAgo(ts) {
  const s = Math.round((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(ts).toLocaleDateString('en-GB');
}

export default function StudentProgress({ onHome }) {
  const [name, setName]       = useState('');
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function lookup(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Enter your name to look up your progress.'); return; }
    setLoading(true); setError('');
    try {
      const data = await fetchStudentSessions(name.trim());
      setSessions(data || []);
    } catch {
      setError('Could not load sessions. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const best   = sessions?.length ? Math.max(...sessions.map(s => s.pct)) : 0;
  const avg    = sessions?.length ? Math.round(sessions.reduce((a, s) => a + s.pct, 0) / sessions.length) : 0;
  const passes = sessions?.filter(s => s.pct >= 75).length || 0;

  return (
    <div className="screen active">
      <div className="progress-wrap-page">
        <div className="progress-header">
          <h1>My Progress</h1>
          <p>Look up your training history by name.</p>
        </div>

        {sessions === null ? (
          <div className="progress-lookup-card">
            <form onSubmit={lookup}>
              <label className="progress-label">Your full name</label>
              <input
                className={`modal-input${error ? ' error' : ''}`}
                type="text"
                placeholder="Enter the name you trained with"
                value={name}
                autoFocus
                onChange={e => { setName(e.target.value); setError(''); }}
              />
              {error && <p className="modal-error">{error}</p>}
              <button className="modal-btn" type="submit" disabled={loading}>
                {loading ? 'Looking up…' : 'View My Progress →'}
              </button>
            </form>
          </div>
        ) : sessions.length === 0 ? (
          <div className="progress-empty">
            <p>No sessions found for <strong>{name}</strong>.</p>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 8 }}>Check the spelling matches what you used during training.</p>
            <button className="lesson-retry-btn" style={{ marginTop: 16 }} onClick={() => setSessions(null)}>Try a different name</button>
          </div>
        ) : (
          <>
            <div className="progress-student-header">
              <div className="progress-student-name">👤 {sessions[0].student_name}</div>
              {sessions[0].cohort && <div className="progress-cohort-badge">{sessions[0].cohort}</div>}
            </div>

            <div className="dash-stats" style={{ marginBottom: 28 }}>
              <div className="dash-stat-box"><div className="dsv">{sessions.length}</div><div className="dsl">Sessions</div></div>
              <div className="dash-stat-box"><div className="dsv">{best}%</div><div className="dsl">Best Score</div></div>
              <div className="dash-stat-box"><div className="dsv">{avg}%</div><div className="dsl">Avg Score</div></div>
              <div className="dash-stat-box"><div className="dsv">{passes}</div><div className="dsl">Passes (≥75%)</div></div>
            </div>

            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Correct</th>
                    <th>Time</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => {
                    const grade = s.grade?.charAt(0) || '?';
                    const mm = String(Math.floor(s.time_taken / 60)).padStart(2, '0');
                    const ss = String(s.time_taken % 60).padStart(2, '0');
                    return (
                      <tr key={s.id}>
                        <td><span className="mode-pill">{MODE_LABELS[s.mode] || s.mode}</span></td>
                        <td><strong>{s.pct}%</strong> <span style={{ color: 'var(--text3)', fontSize: 12 }}>({s.score}/{s.max_score}pts)</span></td>
                        <td><span className="grade-pill" style={{ color: GRADE_COLOR[grade] || '#fff' }}>{grade}</span></td>
                        <td>{s.correct}/{s.total}</td>
                        <td>{mm}:{ss}</td>
                        <td style={{ color: 'var(--text3)', fontSize: 12 }}>{timeAgo(s.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button className="lesson-retry-btn" style={{ marginTop: 16, width: '100%' }} onClick={() => setSessions(null)}>
              Look up a different name
            </button>
          </>
        )}

        <button className="back-home-btn" style={{ marginTop: 12 }} onClick={onHome}>← Back to Home</button>
      </div>
    </div>
  );
}
