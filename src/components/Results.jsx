export default function Results({ history, score, mode, sessionStart, onRestart, onHome }) {
  const completed = history.length;
  const maxScore  = completed * 10;
  const pct       = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const elapsed   = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  let gradeClass, gradeLabel;
  if      (pct >= 90) { gradeClass = 'grade-A'; gradeLabel = 'Outstanding — Ready for live alerts'; }
  else if (pct >= 75) { gradeClass = 'grade-B'; gradeLabel = 'Good — Solid fraud instincts'; }
  else if (pct >= 60) { gradeClass = 'grade-C'; gradeLabel = 'Developing — Review your false negatives'; }
  else if (pct >= 45) { gradeClass = 'grade-D'; gradeLabel = 'Needs work — Revisit core risk indicators'; }
  else                { gradeClass = 'grade-F'; gradeLabel = 'Keep practising — Focus on red flag patterns'; }

  const correct = history.filter(h => h.isCorrect).length;

  function printReport() {
    const now = new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
    const ml  = { set1:'Set 1 – Basic', set2:'Set 2 – Intermediate', mixed:'Mixed', exam:'Set 3 – Final Exam' };
    document.getElementById('printMeta').textContent =
      `Mode: ${ml[mode]}  ·  Date: ${now}  ·  Score: ${score} pts  ·  ${correct}/${completed} correct`;
    window.print();
  }

  return (
    <div className="results-screen show">
      <div className="results-hero">
        <h2>Session Complete</h2>
        <div className={`pct ${gradeClass}`}>{pct}%</div>
        <p className="grade-label">{gradeLabel}</p>
      </div>

      <div className="results-stats">
        <div className="stat-box"><div className="sv">{correct}/{completed}</div><div className="sl">Correct</div></div>
        <div className="stat-box"><div className="sv">{score}</div><div className="sl">Points</div></div>
        <div className="stat-box"><div className="sv">{mm}:{ss}</div><div className="sl">Time taken</div></div>
      </div>

      <div className="results-breakdown">
        <h3>Alert Breakdown</h3>
        {history.map((h, i) => {
          const icon  = h.isCorrect ? '✓' : h.isPartial ? '~' : '✕';
          const color = h.isCorrect ? '#22c55e' : h.isPartial ? '#eab308' : '#ef4444';
          return (
            <div className="result-row" key={i}>
              <span style={{ color, fontWeight: 700, minWidth: 48 }}>{icon} {h.alert.id}</span>
              <span className="rr">You: {h.choice} · Correct: {h.alert.correctDecision}</span>
              <strong style={{ minWidth: 32, textAlign: 'right' }}>+{h.pts}</strong>
            </div>
          );
        })}
      </div>

      <button className="report-btn" onClick={printReport}>🖨 Print / Save Score Report</button>
      <button className="restart-btn" onClick={onRestart}>Start New Session</button>
      <button className="back-home-btn" onClick={onHome}>← Back to Home</button>
    </div>
  );
}
