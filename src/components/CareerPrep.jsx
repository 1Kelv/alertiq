import { useState } from 'react';

const SECTIONS = [
  {
    id: 'what',
    title: 'What Interviewers Are Looking For',
    icon: '🎯',
    content: [
      { heading: 'Scenario-based decision making', body: 'You will be given a fraud scenario and asked what you would do. They are not testing for the "right" answer alone — they want to see your reasoning process. Think out loud.' },
      { heading: 'Understanding of fraud risk', body: 'You should be able to explain why something is suspicious, not just that it is. "The IP country doesn\'t match the card country, which suggests the card details may have been stolen and used remotely" — not just "IP mismatch."' },
      { heading: 'Ability to explain your reasoning', body: 'Fraud analysts write case notes for every decision. Interviewers will often ask you to explain your thinking as if writing a case note. Be structured: what you saw, what it means, what you did.' },
      { heading: 'Balance between fraud prevention and customer experience', body: 'The best analysts understand that both false positives and false negatives have costs. Show you understand this balance — blocking a genuine customer is a problem too.' },
    ],
  },
  {
    id: 'questions',
    title: 'Common Interview Questions',
    icon: '❓',
    questions: [
      {
        q: 'Tell me about a time you had to make a quick decision under pressure.',
        tip: 'Use the STAR method (Situation, Task, Action, Result). If you don\'t have work experience yet, describe the exam mode in AlertIQ — 45 minutes, live timer, real decisions.',
        model: 'During our fraud training bootcamp, I had to review five alerts in 45 minutes. One alert had an established account with a travel history, and the transaction was in Spain — my first instinct was to block it, but when I checked the customer\'s travel history, Spain was consistent. I approved it. Rushing without checking the full profile would have caused a false positive. The lesson was: even under time pressure, the customer profile is always part of the decision.',
      },
      {
        q: 'What is the difference between a false positive and a false negative in fraud?',
        tip: 'This is a standard test question. Make sure you can define both and explain why both matter.',
        model: 'A false positive is when a genuine transaction is incorrectly flagged as fraud — the customer is blocked when they shouldn\'t be. A false negative is when a fraudulent transaction passes through undetected. Both have costs: false positives damage customer trust and revenue, false negatives result in direct financial loss. A good fraud analyst tries to minimise both, not just stop fraud at any cost.',
      },
      {
        q: 'Walk me through how you would investigate a fraud alert.',
        tip: 'Use a structured 5-step approach. Interviewers love structure — it shows you think like an analyst.',
        model: 'I would follow a structured approach: first, understand what triggered the alert — what rule fired? Second, review the customer profile — how long have they been a customer, what\'s their normal behaviour? Third, analyse the transaction — does the amount, merchant, and location fit their pattern? Fourth, identify the anomalies — what\'s different about this transaction compared to normal? Finally, make a risk-based decision — approve, escalate, or block — and document my reasoning clearly enough that another analyst could understand it without re-investigating.',
      },
      {
        q: 'What is an Account Takeover (ATO) and what signs would you look for?',
        tip: 'Demonstrate you know the fraud type and can identify specific signals — not just the definition.',
        model: 'An ATO is when a fraudster gains access to a legitimate customer\'s account — usually through phishing, credential stuffing, or social engineering. The signs I would look for are: a password reset shortly before a transaction, a new device registered immediately before a purchase, a new delivery address added, high-value electronics transactions (fraudsters go for resalable goods), and a velocity spike. Any one of these alone might be acceptable, but when two or three appear together, that\'s a strong ATO signal.',
      },
      {
        q: 'How would you handle a situation where you\'re unsure whether a transaction is fraud?',
        tip: 'This tests your judgement and your understanding of the escalation process. Avoid saying "I\'d just block it to be safe" — that\'s not the right answer.',
        model: 'If I\'m genuinely unsure, I wouldn\'t make a binary block or approve decision. I would escalate to a senior analyst — that\'s what the escalate option exists for. Before escalating, I\'d document exactly what I found: the red flags, the good signals, and why I couldn\'t make a clear decision. A good analyst knows the limits of their own judgment and escalates with context, not just uncertainty.',
      },
      {
        q: 'Why do you want to become a fraud analyst?',
        tip: 'Be genuine. Mention the combination of analytical thinking, decision-making under pressure, and the impact of protecting real customers.',
        model: 'I\'m drawn to fraud analysis because it sits at the intersection of critical thinking and real impact. Every decision protects a real customer — or catches a real fraudster. I enjoy the analytical challenge of reading patterns, weighing signals, and making reasoned decisions quickly. I also find the financial crime landscape genuinely interesting — it\'s constantly evolving, which means the role never becomes routine.',
      },
    ],
  },
  {
    id: 'tips',
    title: 'Interview Tips',
    icon: '💡',
    tips: [
      { icon: '📝', tip: 'Structure every answer', detail: 'Use a clear structure: what you observed → what it means → what you did. This mirrors how case notes are written and shows you already think like an analyst.' },
      { icon: '⚖️', tip: 'Always acknowledge the trade-off', detail: 'Mention that both fraud and false positives have costs. Interviewers are looking for analysts who understand the customer experience side, not just stopping fraud.' },
      { icon: '🔍', tip: 'Be specific with signals', detail: 'Don\'t just say "it looked suspicious." Say "the IP was from Romania on a UK card, combined with a new device and an electronics purchase" — specificity shows real knowledge.' },
      { icon: '❓', tip: 'Ask clarifying questions', detail: 'If given a scenario, ask what else you can check — customer history, prior disputes, travel flag. This shows you think about the full picture before deciding.' },
      { icon: '📖', tip: 'Know your terminology', detail: 'Be comfortable with: ATO, CNP, APP scam, false positive, velocity, 3DS, chargeback, friendly fraud, PEP, KYC. Dropping the right terms shows you\'ve done more than surface-level research.' },
      { icon: '🎯', tip: 'Bring examples from your training', detail: 'AlertIQ gives you real scenarios you can reference. "In my training I reviewed a case where..." is stronger than a theoretical answer and shows hands-on preparation.' },
    ],
  },
  {
    id: 'glossary',
    title: 'Terms You Must Know',
    icon: '📚',
    terms: [
      { term: 'ATO', def: 'Account Takeover' },
      { term: 'CNP', def: 'Card-Not-Present fraud' },
      { term: 'APP Scam', def: 'Authorised Push Payment scam' },
      { term: 'False Positive', def: 'Genuine transaction incorrectly flagged as fraud' },
      { term: 'False Negative', def: 'Fraud that passes through undetected' },
      { term: 'Velocity', def: 'Multiple transactions in a short time window' },
      { term: '3DS', def: '3D Secure — additional authentication layer' },
      { term: 'Chargeback', def: 'Customer dispute raised after settlement to reverse a transaction' },
      { term: 'Friendly Fraud', def: 'Customer makes false dispute claim after receiving goods' },
      { term: 'PEP', def: 'Politically Exposed Person — requires Enhanced Due Diligence' },
      { term: 'KYC', def: 'Know Your Customer — identity and risk verification process' },
      { term: 'SAR', def: 'Suspicious Activity Report — filed with authorities when crime suspected' },
      { term: 'EDD', def: 'Enhanced Due Diligence — deeper checks for high-risk customers' },
      { term: 'Mule Account', def: 'Account used to receive and forward criminal funds' },
      { term: 'SIM Swap', def: 'Fraudster takes over victim\'s phone number to intercept OTPs' },
    ],
  },
];

export default function CareerPrep({ onHome }) {
  const [activeSection, setActiveSection] = useState('what');
  const [expandedQ, setExpandedQ] = useState(null);

  const section = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="screen active">
      <div className="career-wrap">
        <div className="career-header">
          <div className="hero-badge">Career Preparation</div>
          <h1 className="career-title">Fraud Analyst Interview Prep</h1>
          <p className="career-sub">What interviewers test, common questions with model answers, and the terms you must know.</p>
        </div>

        <div className="career-tabs">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`career-tab${activeSection === s.id ? ' active' : ''}`}
              onClick={() => { setActiveSection(s.id); setExpandedQ(null); }}
            >
              {s.icon} {s.title}
            </button>
          ))}
        </div>

        {section.id === 'what' && (
          <div className="career-content">
            {section.content.map((item, i) => (
              <div className="career-card" key={i}>
                <h3 className="career-card-title">{item.heading}</h3>
                <p className="career-card-body">{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {section.id === 'questions' && (
          <div className="career-content">
            <p className="career-section-note">Click any question to reveal a model answer and interview tip.</p>
            {section.questions.map((item, i) => (
              <div className="career-q-card" key={i}>
                <button className="career-q-header" onClick={() => setExpandedQ(expandedQ === i ? null : i)}>
                  <span className="career-q-num">Q{i + 1}</span>
                  <span className="career-q-text">{item.q}</span>
                  <span className="career-q-toggle">{expandedQ === i ? '▲' : '▼'}</span>
                </button>
                {expandedQ === i && (
                  <div className="career-q-body">
                    <div className="career-tip-box">
                      <div className="career-tip-label">💡 Tip</div>
                      <p>{item.tip}</p>
                    </div>
                    <div className="career-answer-box">
                      <div className="career-answer-label">✓ Model answer</div>
                      <p>{item.model}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {section.id === 'tips' && (
          <div className="career-content">
            {section.tips.map((item, i) => (
              <div className="career-tip-card" key={i}>
                <div className="career-tip-icon">{item.icon}</div>
                <div>
                  <div className="career-tip-title">{item.tip}</div>
                  <p className="career-card-body">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {section.id === 'glossary' && (
          <div className="career-content">
            <p className="career-section-note">These terms come up in interviews. Know the definition and be able to use them in context.</p>
            <div className="career-glossary-grid">
              {section.terms.map(t => (
                <div className="career-glossary-item" key={t.term}>
                  <div className="career-glossary-term">{t.term}</div>
                  <div className="career-glossary-def">{t.def}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flow-key-point" style={{ marginTop: 32 }}>
          <strong>Remember:</strong> Interviewers are not just testing knowledge — they are testing how you think. Show your reasoning, acknowledge trade-offs, and use specific signals. That is what separates a good candidate from a great one.
        </div>

        <button className="back-home-btn" onClick={onHome}>← Back to Home</button>
      </div>
    </div>
  );
}
