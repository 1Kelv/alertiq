import { useState, useRef } from 'react';
import { buildQueue } from '../data/alerts';
import { useTimer } from '../hooks/useTimer';
import Results from './Results';
import NameModal from './NameModal';

const MODES = ['set1', 'set2', 'mixed', 'exam'];
const MODE_LABELS = { set1:'ALERT SET 1 — BASIC', set2:'ALERT SET 2 — INTERMEDIATE', mixed:'MIXED SET', exam:'SET 3 — FINAL EXAM (45 MIN)' };
const TAB_LABELS  = ['Set 1 · Basic', 'Set 2 · Int.', 'Mixed', '⏱ Exam'];

function fieldClass(key, val, alert) {
  if (val==='High'||val==='New'||(key==='IP Country'&&val!==alert.fields['Country'])||(key==='Email Risk'&&val==='High')) return 'flag';
  if (val==='Medium'||(key==='Velocity'&&val.includes('in'))) return 'warn';
  if (val==='Known'||val==='Low'||val==='None') return 'safe';
  return '';
}

export default function Simulator({ initialMode='set1', onHome }) {
  const [studentName, setStudentName]   = useState(null);
  const [cohort, setCohort]             = useState(null);
  const [mode, setMode]                 = useState(initialMode);
  const [queue, setQueue]               = useState(() => buildQueue(initialMode));
  const [index, setIndex]               = useState(0);
  const [score, setScore]               = useState(0);
  const [history, setHistory]           = useState([]);
  const [decided, setDecided]           = useState(false);
  const [feedback, setFeedback]         = useState(null);
  const [showResults, setShowResults]   = useState(false);
  const [timeUp, setTimeUp]             = useState(false);
  const sessionStart                    = useRef(Date.now());
  const reasonRef                       = useRef(null);
  const timer = useTimer(() => setTimeUp(true));

  function handleNameSubmit(name, cohortVal) {
    setStudentName(name);
    setCohort(cohortVal);
  }

  function changeMode(m) {
    setMode(m);
    resetWith(buildQueue(m), m);
  }

  function resetWith(q, m) {
    timer.stop();
    setQueue(q); setIndex(0); setScore(0); setHistory([]);
    setDecided(false); setFeedback(null); setShowResults(false); setTimeUp(false);
    sessionStart.current = Date.now();
    if (m === 'exam') timer.start(45 * 60);
    if (reasonRef.current) reasonRef.current.value = '';
  }

  function restart() { resetWith(buildQueue(mode), mode); }

  function decide(choice) {
    if (decided) return;
    const reason = reasonRef.current?.value.trim();
    if (!reason) {
      reasonRef.current.style.borderColor = '#ef4444';
      reasonRef.current.placeholder = 'Please write your reasoning before deciding…';
      setTimeout(() => {
        if (reasonRef.current) {
          reasonRef.current.style.borderColor = '';
          reasonRef.current.placeholder = 'Write your reasoning here — what signals are you seeing? (required before submitting)';
        }
      }, 2000);
      return;
    }
    const alert = queue[index];
    const isCorrect = choice === alert.correctDecision;
    const isPartial = !isCorrect && (
      (alert.correctDecision==='Block'&&choice==='Escalate') ||
      (alert.correctDecision==='Escalate'&&choice==='Block')
    );
    const pts = isCorrect ? 10 : isPartial ? 5 : 0;
    setDecided(true);
    setScore(s => s + pts);
    setHistory(h => [...h, { alert, choice, isCorrect, isPartial, pts, reason }]);
    setFeedback({ alert, choice, isCorrect, isPartial, pts });
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= queue.length) { timer.stop(); setShowResults(true); }
    else { setIndex(nextIndex); setDecided(false); setFeedback(null); if (reasonRef.current) reasonRef.current.value = ''; }
  }

  if (!studentName) return <NameModal onStart={handleNameSubmit} />;

  const alert    = queue[index];
  const progress = queue.length > 0 ? (index / queue.length) * 100 : 0;
  const correct  = history.filter(h => h.isCorrect).length;

  if (showResults) {
    return (
      <div className="screen active">
        <div className="sim-wrap">
          <Results
            history={history} score={score} mode={mode}
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
      {timeUp && (
        <div className="overlay show">
          <h2>⏰ Time&apos;s Up!</h2>
          <p>Your 45-minute exam window has closed. Your score has been recorded.</p>
          <button onClick={() => { setTimeUp(false); timer.stop(); setShowResults(true); }}>See My Results</button>
        </div>
      )}

      <div className="sim-wrap">
        <div className="tabs">
          {MODES.map((m, i) => (
            <button key={m} className={`tab-btn${mode===m?' active':''}`} onClick={() => changeMode(m)}>{TAB_LABELS[i]}</button>
          ))}
        </div>

        <div className="score-bar">
          <span>Score <strong>{score}</strong></span>
          <span>Correct <strong>{correct}</strong></span>
          <span>Alert <strong>{Math.min(index+1,queue.length)}</strong> / {queue.length}</span>
          <span style={{color:'var(--text3)',fontSize:12}}>👤 {studentName}</span>
        </div>

        {mode==='exam' && timer.running && (
          <div className="timer-wrap show">
            <span>⏱ Time remaining:</span>
            <span className={`timer-display ${timer.urgency}`}>{timer.display}</span>
          </div>
        )}

        <div className="progress-wrap">
          <div className="progress-fill" style={{ width:`${progress}%` }} />
        </div>

        <div className="set-label">{MODE_LABELS[mode]}</div>

        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-id">{alert.id}</span>
            <span className={`risk-badge ${alert.set===3?'risk-EXAM':`risk-${alert.riskLevel}`}`}>
              {alert.set===3?'EXAM CASE':`${alert.riskLevel} RISK`}
            </span>
          </div>

          {alert.caseTitle && (
            <div className="case-block">
              <h4>{alert.caseTitle}</h4>
              <strong style={{fontSize:12,color:'var(--text3)'}}>Customer Profile:</strong>
              <ul style={{margin:'4px 0 10px',paddingLeft:18}}>
                {alert.profile.map(p => <li key={p}>{p}</li>)}
              </ul>
              <strong style={{fontSize:12,color:'var(--text3)'}}>Recent Activity:</strong>
              <ul style={{margin:'4px 0',paddingLeft:18}}>
                {alert.recentActivity.map(a => (
                  <li key={a} className={a.includes('reset')||a.includes('New d')||a.includes('Claim')||a.includes('dispute')?'red':''}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="fields">
            {Object.entries(alert.fields).map(([key,val]) => (
              <div className="field" key={key}>
                <div className="field-label">{key}</div>
                <div className={`field-value ${fieldClass(key,val,alert)}`}>
                  {key==='Velocity'&&val.includes('in') ? <span className="vel-tag">{val}</span> : val}
                </div>
              </div>
            ))}
          </div>

          <textarea ref={reasonRef} className="reason-box"
            placeholder="Write your reasoning here — what signals are you seeing? (required before submitting)" />
          {mode==='exam' && <p className="reason-hint">Exam: Include your decision, red flags identified, and any follow-up actions.</p>}

          <div className="decisions">
            <button className="dec-btn dec-approve"  disabled={decided} onClick={() => decide('Approve')}>✓ Approve</button>
            <button className="dec-btn dec-escalate" disabled={decided} onClick={() => decide('Escalate')}>⚠ Escalate</button>
            <button className="dec-btn dec-block"    disabled={decided} onClick={() => decide('Block')}>✕ Block</button>
          </div>
        </div>

        {feedback && (
          <div className="feedback show">
            <div className="feedback-title">
              <span className={feedback.isCorrect?'verdict-correct':feedback.isPartial?'verdict-partial':'verdict-wrong'}>
                {feedback.isCorrect?'✓ Correct!':feedback.isPartial?'~ Partially correct':'✕ Incorrect'} +{feedback.pts} points
              </span>
              &nbsp;·&nbsp;
              <span style={{color:'var(--text3)',fontSize:12}}>
                Correct answer: <strong style={{color:'var(--text)'}}>{feedback.alert.correctDecision}</strong>
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
            {index < queue.length-1 ? 'Next Alert →' : 'See Results →'}
          </button>
        )}
      </div>
    </div>
  );
}
