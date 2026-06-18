const FEATURES = [
  { icon: '🎯', title: 'Decision-based learning', body: 'Every alert requires a written reason before you can submit. No guessing — you must think like an analyst.' },
  { icon: '⚡', title: 'Instant expert feedback', body: 'After each decision, see exactly what you missed — red flags, good signals, and the full explanation.' },
  { icon: '📈', title: 'Progressive difficulty', body: 'Start with basic alerts, build up to velocity and email risk, then face timed exam case studies.' },
  { icon: '⏱', title: 'Exam-ready pressure', body: 'Set 3 runs a live 45-minute countdown — just like a real fraud desk where decisions cannot wait.' },
  { icon: '🖨', title: 'Printable score report', body: 'Every session ends with a full breakdown you can print and hand to your trainer for review.' },
  { icon: '🔀', title: 'Randomised every time', body: 'Alerts are shuffled each session so you build pattern recognition, not memorisation.' },
];

const MODES = [
  { tag: 'Beginner', title: 'Set 1 · Basic', body: 'Account age, IP mismatch, device recognition, and spend patterns. 8 randomised alerts.', mode: 'set1' },
  { tag: 'Intermediate', title: 'Set 2 · Intermediate', body: 'Velocity, merchant type, email risk scoring. 7 alerts with more complexity.', mode: 'set2' },
  { tag: 'Advanced', title: 'Mixed Mode', body: 'Sets 1 & 2 combined and shuffled. Tests whether you can switch between risk frameworks.', mode: 'mixed' },
  { tag: 'Exam · 45 min', title: 'Set 3 · Final Exam', body: 'Full case studies: ATO, false positive, friendly fraud. Timed. Write case notes.', mode: 'exam' },
];

export default function Landing({ onStart }) {
  return (
    <div className="screen active">
      <div className="landing">

        <div className="hero">
          <div className="hero-badge">Fraud Analysis Bootcamp</div>
          <h1>Train like a real<br /><em>Fraud Analyst</em></h1>
          <p>AlertIQ puts you in the analyst&apos;s seat. Review live alerts, make decisions under pressure, and get instant expert feedback.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => onStart('set1')}>Start Training →</button>
            <button className="btn-secondary" onClick={() => onStart('exam')}>⏱ Take the Exam</button>
          </div>
        </div>

        <div className="stats-row">
          {[['18','Alert scenarios'],['4','Training modes'],['3','Full case studies'],['100%','Browser-based']].map(([n,l]) => (
            <div className="stat" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>
          ))}
        </div>

        <div className="section-label">What you get</div>
        <div className="section-title">Built for real training</div>
        <div className="features">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>

        <div className="section-label">Training modes</div>
        <div className="section-title">Pick your level</div>
        <div className="modes">
          {MODES.map(m => (
            <div className="mode-card" key={m.mode} onClick={() => onStart(m.mode)}>
              <div className="mc-tag">{m.tag}</div>
              <h4>{m.title} <span className="mc-arrow">→</span></h4>
              <p>{m.body}</p>
            </div>
          ))}
        </div>

        <div className="cta-banner">
          <h2>Ready to start?</h2>
          <p>Begin with Set 1 if you&apos;re new, or jump straight to the exam if you want a challenge.</p>
          <button onClick={() => onStart('set1')}>Begin Set 1 →</button>
        </div>

      </div>
    </div>
  );
}
