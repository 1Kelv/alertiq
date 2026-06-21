import { useState } from 'react';

const STAGES = [
  {
    id: 1,
    icon: '🛒',
    title: 'Transaction Initiated',
    short: 'Customer pays',
    detail: 'The customer enters their card details online, taps their card in-store, or authorises a payment via their banking app. This is the moment the transaction request is created.',
    fraudRisk: 'Card-Not-Present (CNP) fraud occurs here — stolen card details are used to initiate a transaction the real cardholder never authorised.',
    riskLevel: 'medium',
    signals: ['Unusual device or browser', 'IP country mismatch', 'Velocity spike on same card'],
  },
  {
    id: 2,
    icon: '📡',
    title: 'Authorisation Request',
    short: 'Request sent to bank',
    detail: 'The merchant\'s payment system sends an authorisation request through the card network (Visa/Mastercard) to the customer\'s issuing bank, asking permission to charge the amount.',
    fraudRisk: 'Fraudsters may attempt multiple authorisation requests with slightly different amounts to find a threshold that avoids fraud rules — known as "threshold testing."',
    riskLevel: 'medium',
    signals: ['Multiple small test transactions', 'Declining then retrying with lower amounts'],
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Fraud Risk Checks',
    short: 'Automated screening',
    detail: 'The issuing bank runs the transaction through its fraud detection engine — checking behavioural patterns, velocity, device fingerprint, IP geolocation, and transaction history in real time.',
    fraudRisk: 'This is where alert analysts like you step in. Transactions flagged by the automated system land in the fraud queue for human review.',
    riskLevel: 'high',
    signals: ['Behaviour change from norm', 'High-risk merchant category', 'New device + overseas IP', 'Velocity patterns'],
    highlight: true,
  },
  {
    id: 4,
    icon: '🔐',
    title: 'Authentication (3DS)',
    short: '3D Secure challenge',
    detail: '3D Secure (3DS) is an additional layer where the customer may be asked to verify via their banking app, SMS code, or biometric. It shifts fraud liability from the bank to the merchant if bypassed.',
    fraudRisk: 'SIM swap fraud — the fraudster has taken control of the victim\'s phone number and intercepts the SMS one-time password (OTP), passing 3DS on a stolen card.',
    riskLevel: 'medium',
    signals: ['New phone number recently registered', 'SIM swap alert on account', 'OTP requested from new device'],
  },
  {
    id: 5,
    icon: '✅',
    title: 'Approval or Decline',
    short: 'Bank decision',
    detail: 'The issuing bank sends an approve or decline response back through the card network to the merchant. The decision is based on fraud risk checks, available funds, and authentication outcome.',
    fraudRisk: 'False positives happen here — genuine transactions declined because the fraud model incorrectly flagged them. Both fraud and false positives have real costs.',
    riskLevel: 'low',
    signals: ['Genuine customer travelling abroad', 'Unusual but legitimate large purchase', 'New device for known customer'],
  },
  {
    id: 6,
    icon: '🏦',
    title: 'Clearing & Settlement',
    short: 'Money moves',
    detail: 'After approval, the transaction goes through clearing (matching payment records) and settlement (the actual movement of funds from customer\'s bank to merchant\'s bank), usually within 1–2 business days.',
    fraudRisk: 'Chargebacks occur at this stage — the customer disputes the transaction after settlement, forcing a reversal. Friendly fraud exploits this window between payment and dispute.',
    riskLevel: 'medium',
    signals: ['Dispute raised after goods received', 'Pattern of prior chargebacks', 'High-value item delivered to own address'],
  },
];

const RISK_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const RISK_LABELS = { high: 'HIGH FRAUD RISK', medium: 'MEDIUM RISK', low: 'LOW / FALSE POSITIVE RISK' };

export default function CardPaymentFlow({ onHome }) {
  const [active, setActive] = useState(null);

  const selected = active !== null ? STAGES[active] : null;

  return (
    <div className="screen active">
      <div className="flow-wrap">
        <div className="flow-header">
          <h1 className="flow-title">Card Payment Flow</h1>
          <p className="flow-sub">How a card transaction travels from customer to bank — and where fraud can occur at each stage. Click any stage to explore.</p>
        </div>

        <div className="flow-stages">
          {STAGES.map((s, i) => (
            <div key={s.id} className="flow-stage-row">
              <div
                className={`flow-stage-card${active === i ? ' active' : ''}${s.highlight ? ' highlight' : ''}`}
                onClick={() => setActive(active === i ? null : i)}
              >
                <div className="flow-stage-num">{s.id}</div>
                <div className="flow-stage-icon">{s.icon}</div>
                <div className="flow-stage-info">
                  <div className="flow-stage-title">{s.title}</div>
                  <div className="flow-stage-short">{s.short}</div>
                </div>
                <div className="flow-stage-risk" style={{ color: RISK_COLORS[s.riskLevel] }}>●</div>
              </div>
              {i < STAGES.length - 1 && <div className="flow-arrow">↓</div>}
            </div>
          ))}
        </div>

        {selected && (
          <div className="flow-detail-card" style={{ borderColor: RISK_COLORS[selected.riskLevel] + '55' }}>
            <div className="flow-detail-header">
              <span className="flow-detail-icon">{selected.icon}</span>
              <div>
                <div className="flow-detail-title">{selected.title}</div>
                <div className="flow-risk-badge" style={{ color: RISK_COLORS[selected.riskLevel], background: RISK_COLORS[selected.riskLevel] + '18', border: `1px solid ${RISK_COLORS[selected.riskLevel]}44` }}>
                  {RISK_LABELS[selected.riskLevel]}
                </div>
              </div>
            </div>

            <p className="flow-detail-body">{selected.detail}</p>

            <div className="flow-fraud-box">
              <div className="flow-fraud-label">⚑ Fraud risk at this stage</div>
              <p className="flow-fraud-body">{selected.fraudRisk}</p>
            </div>

            {selected.signals && (
              <div className="flow-signals">
                <div className="flow-signals-label">Signals to watch for:</div>
                <div className="flow-signal-chips">
                  {selected.signals.map(sig => (
                    <span className="flow-signal-chip" key={sig}>{sig}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!selected && (
          <div className="flow-hint">
            <p>← Click any stage to see what happens and where fraud can occur</p>
            <p style={{ marginTop: 8, fontSize: 12 }}>
              <span style={{ color: '#ef4444' }}>●</span> High risk &nbsp;
              <span style={{ color: '#f59e0b' }}>●</span> Medium risk &nbsp;
              <span style={{ color: '#22c55e' }}>●</span> Low / False positive risk
            </p>
          </div>
        )}

        <div className="flow-key-point">
          <strong>Key principle:</strong> Fraud can occur at multiple points in this flow. Your job as an analyst is to catch it at Stage 3 — before approval — without blocking genuine customers.
        </div>

        <button className="back-home-btn" onClick={onHome}>← Back to Home</button>
      </div>
    </div>
  );
}
