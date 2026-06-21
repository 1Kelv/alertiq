const FRAUD_MODULES = [
  { tag: 'Intro · Start here', title: '🎓 Fraud Types Lesson', body: '6 fraud types explained with quick-check questions. Build your foundation before touching live alerts.', mode: 'lesson', accent: false },
  { tag: 'Beginner', title: 'Set 1 · Basic Alerts', body: 'Account age, IP mismatch, device recognition, spend patterns. 8 randomised alerts.', mode: 'set1', accent: false },
  { tag: 'Intermediate', title: 'Set 2 · Intermediate', body: 'Velocity, merchant type, email risk scoring. 7 alerts with more complexity.', mode: 'set2', accent: false },
  { tag: 'Advanced', title: 'Mixed Mode', body: 'Sets 1 & 2 combined and shuffled. Tests whether you can switch between risk frameworks.', mode: 'mixed', accent: false },
  { tag: 'Exam · 45 min', title: '⏱ Set 3 · Final Exam', body: 'Full case studies: ATO, false positive, friendly fraud. Timed. Write case notes.', mode: 'exam', accent: true },
];

const COMPLIANCE_MODULES = [
  { tag: 'Identity', title: '🪪 ID&V Verification', body: 'Document checks, liveness results, name/DOB mismatches. Pass, Refer, or Reject. 6 cases.', mode: 'idv' },
  { tag: 'Due Diligence', title: '🔍 KYC Screening', body: 'PEP flags, sanctions hits, source of funds, adverse media. Standard vs Enhanced Due Diligence.', mode: 'kyc' },
  { tag: 'Disputes', title: '↩ Chargebacks', body: 'Valid disputes vs friendly fraud vs duplicate charges. Uphold or decline with evidence.', mode: 'chargeback' },
];

export default function Landing({ onStart, onCompliance, onTrainer, onProgress }) {
  return (
    <div className="screen active">
      <div className="landing">

        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">Financial Crime Training Platform</div>
          <h1>Train like a real<br /><em>Financial Crime Analyst</em></h1>
          <p>AlertIQ puts you in the analyst&apos;s seat. Review live cases, make decisions under pressure, and get instant expert feedback.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => onStart('lesson')}>Start Training →</button>
            <button className="btn-secondary" onClick={() => onStart('exam')}>⏱ Take the Exam</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[['6','Fraud types lesson'],['15','Fraud alerts'],['6','ID&V + KYC cases'],['5','Chargeback cases']].map(([n,l]) => (
            <div className="stat" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>
          ))}
        </div>

        {/* Pillar 1 — Fraud Analysis */}
        <div className="pillar-header">
          <div className="pillar-badge fraud-badge">Fraud Analysis</div>
          <h2 className="pillar-title">Fraud Alert Simulator</h2>
          <p className="pillar-sub">Learn to spot the difference between fraud and genuine transactions. Start with the lesson, then work through alert sets.</p>
        </div>
        <div className="modes fraud-modes">
          {FRAUD_MODULES.map(m => (
            <div className={`mode-card${m.accent ? ' mode-card-accent' : ''}`} key={m.mode} onClick={() => onStart(m.mode)}>
              <div className="mc-tag">{m.tag}</div>
              <h4>{m.title} <span className="mc-arrow">→</span></h4>
              <p>{m.body}</p>
            </div>
          ))}
        </div>

        {/* Foundation Knowledge */}
        <div className="pillar-header" style={{ marginTop: 64 }}>
          <div className="pillar-badge" style={{ color:'#22d3ee', background:'rgba(34,211,238,0.1)', border:'1px solid rgba(34,211,238,0.3)' }}>Foundation Knowledge</div>
          <h2 className="pillar-title">Understand the Bigger Picture</h2>
          <p className="pillar-sub">Learn how payments work and how to ace your fraud analyst interview.</p>
        </div>
        <div className="modes">
          <div className="mode-card" onClick={() => onStart('flow')}>
            <div className="mc-tag">Interactive Diagram</div>
            <h4>💳 Card Payment Flow <span className="mc-arrow">→</span></h4>
            <p>See how a transaction travels from customer to bank — and where fraud can strike at each stage.</p>
          </div>
          <div className="mode-card" onClick={() => onStart('career')}>
            <div className="mc-tag">Career Prep</div>
            <h4>🎓 Interview Preparation <span className="mc-arrow">→</span></h4>
            <p>Common interview questions with model answers, what interviewers look for, and key terms to know.</p>
          </div>
        </div>

        {/* Pillar 2 — Compliance */}
        <div className="pillar-header" style={{ marginTop: 64 }}>
          <div className="pillar-badge compliance-badge">Financial Crime Compliance</div>
          <h2 className="pillar-title">ID&V · KYC · Chargebacks</h2>
          <p className="pillar-sub">Beyond fraud — learn identity verification, customer due diligence, and dispute management. Essential for a full fraud analyst role.</p>
        </div>
        <div className="modes">
          {COMPLIANCE_MODULES.map(m => (
            <div className="mode-card" key={m.mode} onClick={() => onCompliance(m.mode)}>
              <div className="mc-tag">{m.tag}</div>
              <h4>{m.title} <span className="mc-arrow">→</span></h4>
              <p>{m.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-banner" style={{ marginTop: 64 }}>
          <h2>Ready to start?</h2>
          <p>New? Begin with the Fraud Types lesson. Experienced? Jump straight to the exam or KYC screening.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onStart('lesson')}>Start Fraud Lesson →</button>
            <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }} onClick={() => onCompliance('idv')}>Try ID&V →</button>
            <button style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }} onClick={() => onStart('progress')}>My Progress →</button>
          </div>
        </div>

      </div>
    </div>
  );
}
