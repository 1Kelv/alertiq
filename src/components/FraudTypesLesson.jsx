import { useState } from 'react';
import GlossaryKey from './GlossaryKey';

const LESSONS = [
  {
    id: 1,
    type: 'Card-Not-Present (CNP) Fraud',
    icon: '💳',
    explanation: 'The fraudster uses stolen card details to make online or phone purchases without the physical card. The real cardholder never authorised the transaction.',
    signals: ['IP country differs from card country', 'New device', 'High-value electronics/gift cards', 'Velocity spike'],
    question: 'A transaction comes in: £650 electronics purchase, new device, IP from Romania on a UK card. What is this likely to be?',
    options: ['Card-Not-Present (CNP) Fraud', 'Friendly Fraud', 'Application Fraud', 'Genuine transaction'],
    correct: 0,
    feedback: 'Correct. IP mismatch, new device, and high-value electronics are classic CNP fraud indicators — the stolen card details are being used online.',
  },
  {
    id: 2,
    type: 'Account Takeover (ATO)',
    icon: '🔓',
    explanation: 'A fraudster gains access to a legitimate customer\'s existing account — usually via phishing, credential stuffing, or social engineering — and then transacts as the customer.',
    signals: ['Password reset followed immediately by purchases', 'New device registered', 'New delivery address added', 'Behaviour change from normal pattern'],
    question: 'A 5-year customer resets their password at 2AM, registers a new device, and immediately buys £900 in electronics. What is this?',
    options: ['Friendly Fraud', 'Account Takeover (ATO)', 'Application Fraud', 'CNP Fraud'],
    correct: 1,
    feedback: 'Correct. Password reset + new device + immediate high-value purchase is the textbook ATO sequence. The real customer didn\'t do any of this.',
  },
  {
    id: 3,
    type: 'Friendly / First-Party Fraud',
    icon: '🤝',
    explanation: 'The genuine account holder makes a purchase, receives the goods or services, then falsely claims a dispute to get a refund — essentially stealing from the merchant.',
    signals: ['Delivery confirmed to billing address', 'Correct CVV used', 'No device or IP anomaly', 'Pattern of prior disputes'],
    question: 'A customer disputes a £200 clothing order as "not received." Delivery went to their billing address, correct CVV was used, and they have 3 disputes in 12 months. What is this?',
    options: ['Genuine dispute — uphold', 'Account Takeover', 'Friendly / First-Party Fraud', 'Application Fraud'],
    correct: 2,
    feedback: 'Correct. All transaction signals are genuine — delivery to own address, correct CVV — but the pattern of prior disputes reveals a history of false claims. This is first-party fraud.',
  },
  {
    id: 4,
    type: 'Application Fraud',
    icon: '📋',
    explanation: 'A fraudster applies for a financial product (account, card, loan) using false or stolen identity details, with no intention of repaying or with intent to immediately abuse the account.',
    signals: ['Very new account (days old)', 'High first transaction', 'No prior history', 'Multiple applications from same device/IP'],
    question: 'An account opened 3 days ago attempts a £1,200 cash advance. No transaction history, new device, no credit footprint. What is this likely to be?',
    options: ['CNP Fraud', 'ATO', 'Genuine new customer', 'Application Fraud'],
    correct: 3,
    feedback: 'Correct. A brand-new account with no history immediately attempting a high-value cash advance is a hallmark application fraud or mule account pattern.',
  },
  {
    id: 5,
    type: 'Authorised Push Payment (APP) Scams',
    icon: '📲',
    explanation: 'The victim is manipulated — by phone, email, or social media — into authorising a bank transfer to a fraudster\'s account. The payment is authorised, making recovery difficult.',
    signals: ['Unusual large outbound transfer', 'Customer received unexpected call/email', 'Payee is new/never paid before', 'Customer acting under urgency'],
    question: 'A customer calls to report they transferred £4,500 to a "HMRC debt collector" who called them. They authorised the payment themselves. What type of fraud is this?',
    options: ['CNP Fraud', 'ATO', 'APP Scam', 'Friendly Fraud'],
    correct: 2,
    feedback: 'Correct. APP scams involve the victim authorising the transfer themselves after being manipulated. HMRC impersonation is one of the most common APP scam scripts.',
  },
  {
    id: 6,
    type: 'Mule Account Activity',
    icon: '🏦',
    explanation: 'A mule account receives and forwards fraudulent funds on behalf of a criminal network. Account holders may be witting (knowingly involved) or unwitting (recruited unknowingly).',
    signals: ['Rapid in-and-out transactions', 'Multiple inbound transfers then immediate withdrawals', 'New account with sudden large credits', 'Recruited via social media job offer'],
    question: 'An account 2 weeks old receives £3,000 in 4 transfers from different sources, then immediately withdraws it all as cash. What does this suggest?',
    options: ['Normal savings behaviour', 'APP Scam victim', 'Mule Account Activity', 'CNP Fraud'],
    correct: 2,
    feedback: 'Correct. Rapid layering — multiple inbound credits followed by immediate full withdrawal — is a defining mule account pattern. The account is being used to move criminal funds.',
  },
];

export default function FraudTypesLesson({ onComplete, onHome }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('learn'); // 'learn' | 'quiz' | 'result'
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const lesson = LESSONS[step];
  const isLast = step === LESSONS.length - 1;

  function answer(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === lesson.correct) setScore(s => s + 1);
  }

  function next() {
    if (isLast) {
      setPhase('result');
    } else {
      setStep(s => s + 1);
      setPhase('learn');
      setSelected(null);
      setAnswered(false);
    }
  }

  function startQuiz() {
    setPhase('quiz');
    setSelected(null);
    setAnswered(false);
  }

  if (phase === 'result') {
    const pct = Math.round((score / LESSONS.length) * 100);
    return (
      <div className="screen active">
        <div className="lesson-wrap">
          <div className="lesson-result-card">
            <div className="lesson-result-icon">🎓</div>
            <h2>Fraud Types Complete</h2>
            <div className="lesson-score-big">{score}/{LESSONS.length}</div>
            <p className="lesson-score-label">
              {pct === 100 ? 'Perfect score — you know your fraud types.' : pct >= 70 ? 'Good work — now put it into practice.' : 'Review the types and try again before moving on.'}
            </p>
            <div className="lesson-result-btns">
              <button className="btn-primary" onClick={onComplete}>Start Alert Training →</button>
              <button className="lesson-retry-btn" onClick={() => { setStep(0); setPhase('learn'); setScore(0); setSelected(null); setAnswered(false); }}>Retry Lesson</button>
              <button className="back-home-btn" onClick={onHome}>← Back to Home</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen active">
      <GlossaryKey mode="lesson" />
      <div className="lesson-wrap">
        <div className="lesson-progress-bar">
          <div className="lesson-progress-fill" style={{ width: `${((step) / LESSONS.length) * 100}%` }} />
        </div>
        <div className="lesson-step-label">{step + 1} of {LESSONS.length} — Fraud Types</div>

        {phase === 'learn' && (
          <div className="lesson-card">
            <div className="lesson-type-icon">{lesson.icon}</div>
            <h2 className="lesson-type-title">{lesson.type}</h2>
            <p className="lesson-explainer">{lesson.explanation}</p>
            <div className="lesson-signals">
              <div className="lesson-signals-label">Key signals to watch for:</div>
              {lesson.signals.map(s => (
                <div className="lesson-signal-chip" key={s}>⚑ {s}</div>
              ))}
            </div>
            <button className="btn-primary lesson-cta" onClick={startQuiz}>Test my understanding →</button>
          </div>
        )}

        {phase === 'quiz' && (
          <div className="lesson-card">
            <div className="lesson-quiz-badge">Quick check</div>
            <p className="lesson-question">{lesson.question}</p>
            <div className="lesson-options">
              {lesson.options.map((opt, i) => {
                let cls = 'lesson-option';
                if (answered) {
                  if (i === lesson.correct) cls += ' correct';
                  else if (i === selected) cls += ' wrong';
                }
                return (
                  <button key={i} className={cls} onClick={() => answer(i)} disabled={answered}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className={`lesson-feedback ${selected === lesson.correct ? 'fb-correct' : 'fb-wrong'}`}>
                {selected === lesson.correct ? '✓ ' : '✕ '}{lesson.feedback}
              </div>
            )}
            {answered && (
              <button className="btn-primary lesson-cta" onClick={next}>
                {isLast ? 'See my results →' : 'Next type →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
