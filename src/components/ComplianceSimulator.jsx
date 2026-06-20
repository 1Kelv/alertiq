import { useState, useRef } from 'react';
import { buildModuleQueue } from '../data/idvKycAlerts';
import Results from './Results';
import NameModal from './NameModal';

const MODULE_CONFIG = {
  idv:        { label: 'ID&V — Identity Verification', decisions: ['Pass', 'Refer', 'Reject'], colors: { Pass: 'dec-approve', Refer: 'dec-escalate', Reject: 'dec-block' } },
  kyc:        { label: 'KYC — Know Your Customer',    decisions: ['Pass', 'Refer', 'Escalate to EDD', 'Reject'], colors: { Pass: 'dec-approve', Refer: 'dec-escalate', 'Escalate to EDD': 'dec-edd', Reject: 'dec-block' } },
  chargeback: { label: 'Chargebacks',                 decisions: ['Uphold Chargeback', 'Decline Chargeback'], colors: { 'Uphold Chargeback': 'dec-approve', 'Decline Chargeback': 'dec-block' } },
};

const TABS = [
  { module: 'idv',        label: 'ID&V' },
  { module: 'kyc',        label: 'KYC' },
  { module: 'chargeback', label: 'Chargebacks' },
];

function fieldClass(key, val) {
  const high = ['Fail', 'Yes', 'High', 'Suspected tamper', 'Reject', 'Expired'];
  const warn = ['Inconclusive', 'Partial', 'Medium', 'Potential match'];
  const good = ['Pass', 'Match', 'Full match', 'None', 'Low', 'No', 'Valid'];
  if (high.some(h => val.includes(h))) return 'flag';
  if (warn.some(w => val.includes(w))) return 'warn';
  if (good.some(g => val.includes(g))) return 'safe';
  return '';
}

export default function ComplianceSimulator({ initialModule = 'idv', onHome }) {
  const [studentName, setStudentName] = useState(null);
  const [cohort, setCohort]           = useState(null);
  const [module, setModule]           = useState(initialModule);
  const [queue, setQueue]             = useState(() => buildModuleQueue(initialModule));
  const [index, setIndex]             = useState(0);
  const [score, setScore]             = useState(0);
  const [history, setHistory]         = useState([]);
  const [decided, setDecided]         = useState(false);
  const [feedback, setFeedback]       = useState(null);
  const [showResults, setShowResults] = useState(false);
  const sessionStart                  = useRef(Date.now());
  const reasonRef                     = useRef(null);

  function changeModule(m) {
    setModule(m);
    resetWith(buildModuleQueue(m));
  }

  function resetWith(q) {
    setQueue(q); setIndex(0); setScore(0); setHistory([]);
    setDecided(false); setFeedback(null); setShowResults(false);
    sessionStart.current = Date.now();
    if (reasonRef.current) reasonRef.current.value = '';
  }

  function restart() { resetWith(buildModuleQueue(module)); }

  function decide(choice) {
    if (decided) return;
    const reason = reasonRef.current?.value.trim();
    if (!reason) {
      reasonRef.current.style.borderColor = '#ef4444';
      reasonRef.current.placeholder = 'Please write your reasoning before deciding…';
      setTimeout(() => {
        if (reasonRef.current) {
          reasonRef.current.style.borderColor = '';
          reasonRef.current.placeholder = 'Write your reasoning here — what are the key indicators? (required)';
        }
      }, 2000);
      return;
    }
    const alert = queue[index];
    const isCorrect = choice === alert.correctDecision;
    const pts = isCorrect ? 10 : 0;
    setDecided(true);
    setScore(s => s + pts);
    setHistory(h => [...h, { alert, choice, isCorrect, isPartial: false, pts, reason }]);
    setFeedback({ alert, choice, isCorrect });
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= queue.length) { setShowResults(true); }
    else { setIndex(nextIndex); setDecided(false); setFeedback(null); if (reasonRef.current) reasonRef.current.value = ''; }
  }

  if (!studentName) return <NameModal onStart={(n, c) => { setStudentName(n); setCohort(c); }} />;

  const config  = MODULE_CONFIG[module];
  const alert   = queue[index];
  const progress = queue.length > 0 ? (index / queue.length) * 100 : 0;
  const correct  = history.filter(h => h.isCorrect).length;

  if (showResults) {
    return (
      <div className="screen active">
        <div className="sim-wrap">
          <Results
            history={history} score={score} mode={module}
            sessionStart={sessionStart.current}
            studentName={studentName}
            cohort={cohort}
            onRestart={restart}
            onHome={onHome}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="screen active">
      <div className="sim-wrap">
        <div className="tabs">
          {TABS.map(t => (
            <button key={t.module} className={`tab-btn${module === t.module ? ' active' : ''}`} onClick={() => changeModule(t.module)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="score-bar">
          <span>Score <strong>{score}</strong></span>
          <span>Correct <strong>{correct}</strong></span>
          <span>Case <strong>{Math.min(index + 1, queue.length)}</strong> / {queue.length}</span>
          <span style={{ color: 'var(--text3)', fontSize: 12 }}>👤 {studentName}</span>
        </div>

        <div className="progress-wrap">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="set-label">{config.label}</div>

        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-id">{alert.id}</span>
            <span className={`risk-badge risk-${alert.riskLevel}`}>{alert.riskLevel} RISK</span>
          </div>

          <div className="fields">
            {Object.entries(alert.fields).map(([key, val]) => (
              <div className="field" key={key}>
                <div className="field-label">{key}</div>
                <div className={`field-value ${fieldClass(key, val)}`}>{val}</div>
              </div>
            ))}
          </div>

          <textarea
            ref={reasonRef}
            className="reason-box"
            placeholder="Write your reasoning here — what are the key indicators? (required)"
          />

          <div className="decisions" style={{ flexWrap: 'wrap' }}>
            {config.decisions.map(d => (
              <button
                key={d}
                className={`dec-btn ${config.colors[d] || 'dec-escalate'}`}
                disabled={decided}
                onClick={() => decide(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <div className="feedback show">
            <div className="feedback-title">
              <span className={feedback.isCorrect ? 'verdict-correct' : 'verdict-wrong'}>
                {feedback.isCorrect ? '✓ Correct!' : '✕ Incorrect'} {feedback.isCorrect ? '+10 points' : '+0 points'}
              </span>
              &nbsp;·&nbsp;
              <span style={{ color: 'var(--text3)', fontSize: 12 }}>
                Correct decision: <strong style={{ color: 'var(--text)' }}>{feedback.alert.correctDecision}</strong>
              </span>
            </div>
            <div className="feedback-body">{feedback.alert.explanation}</div>
            <div className="chips">
              {feedback.alert.flags.map(f => <span className="chip-flag" key={f}>⚑ {f}</span>)}
              {feedback.alert.goodSigns.map(g => <span className="chip-good" key={g}>✓ {g}</span>)}
            </div>
          </div>
        )}

        {feedback && (
          <button className="next-btn show" onClick={next}>
            {index < queue.length - 1 ? 'Next Case →' : 'See Results →'}
          </button>
        )}
      </div>
    </div>
  );
}
