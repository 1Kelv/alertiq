import { useState, useEffect } from 'react';
import { fetchSessions, supabase } from '../lib/supabase';

const MODE_LABELS = { set1: 'Set 1', set2: 'Set 2', mixed: 'Mixed', exam: 'Exam' };
const GRADE_COLOR = { A:'#22c55e', B:'#84cc16', C:'#eab308', D:'#f97316', F:'#ef4444' };

function timeAgo(ts) {
  const s = Math.round((Date.now() - new Date(ts)) / 1000);
  if (s < 60)  return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return new Date(ts).toLocaleDateString('en-GB');
}

export default function TrainerDashboard({ onBack }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sort, setSort]         = useState('recent');
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    load();
    // Real-time subscription
    const channel = supabase
      .channel('sessions-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sessions' }, payload => {
        setSessions(prev => [payload.new, ...prev]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function load() {
    try {
      const data = await fetchSessions();
      setSessions(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = sessions.filter(s => filter === 'all' || s.mode === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'score')  return b.pct - a.pct;
    if (sort === 'name')   return a.student_name.localeCompare(b.student_name);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const avgPct = sessions.length ? Math.round(sessions.reduce((s, r) => s + r.pct, 0) / sessions.length) : 0;
  const topScore = sessions.length ? Math.max(...sessions.map(s => s.pct)) : 0;
  const passRate = sessions.length ? Math.round((sessions.filter(s => s.pct >= 75).length / sessions.length) * 100) : 0;

  return (
    <div className="screen active">
      <div className="dashboard-wrap">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Trainer Dashboard</h1>
            <p className="dashboard-sub">Live session results · updates in real time</p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span className="live-dot" title="Live">● LIVE</span>
            <button className="topbar-nav-btn" onClick={onBack}>← Back</button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="dash-stats">
          <div className="dash-stat-box">
            <div className="dsv">{sessions.length}</div>
            <div className="dsl">Sessions</div>
          </div>
          <div className="dash-stat-box">
            <div className="dsv">{avgPct}%</div>
            <div className="dsl">Avg Score</div>
          </div>
          <div className="dash-stat-box">
            <div className="dsv">{topScore}%</div>
            <div className="dsl">Top Score</div>
          </div>
          <div className="dash-stat-box">
            <div className="dsv">{passRate}%</div>
            <div className="dsl">Pass Rate (≥75%)</div>
          </div>
        </div>

        {/* Filters */}
        <div className="dash-controls">
          <div className="dash-filters">
            {['all','set1','set2','mixed','exam'].map(f => (
              <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All modes' : MODE_LABELS[f]}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="recent">Most recent</option>
            <option value="score">Highest score</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Sessions table */}
        {loading ? (
          <div className="dash-loading">Loading sessions…</div>
        ) : sorted.length === 0 ? (
          <div className="dash-empty">
            <p>No sessions yet.</p>
            <p style={{ fontSize:13, marginTop:8, color:'var(--text3)' }}>Sessions appear here as soon as trainees complete a set.</p>
          </div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Mode</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Correct</th>
                  <th>Time</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => {
                  const grade = s.grade.charAt(0);
                  const mm = String(Math.floor(s.time_taken/60)).padStart(2,'0');
                  const ss = String(s.time_taken%60).padStart(2,'0');
                  return (
                    <tr key={s.id}>
                      <td className="td-name">{s.student_name}</td>
                      <td><span className="mode-pill">{MODE_LABELS[s.mode] || s.mode}</span></td>
                      <td><strong>{s.pct}%</strong> <span style={{color:'var(--text3)',fontSize:12}}>({s.score}/{s.max_score}pts)</span></td>
                      <td><span className="grade-pill" style={{color: GRADE_COLOR[grade] || '#fff'}}>{grade}</span></td>
                      <td>{s.correct}/{s.total}</td>
                      <td>{mm}:{ss}</td>
                      <td style={{color:'var(--text3)',fontSize:12}}>{timeAgo(s.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
