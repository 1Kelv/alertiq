export default function Certificate({ studentName, mode, score, maxScore, pct, grade, gradeLetter, date, onClose }) {
  const MODE_LABELS = { set1: 'Fraud Alert Set 1 — Basic', set2: 'Fraud Alert Set 2 — Intermediate', mixed: 'Mixed Alert Set', exam: 'Set 3 — Final Exam', idv: 'ID&V — Identity Verification', kyc: 'KYC — Know Your Customer', chargeback: 'Chargebacks & Disputes' };
  const modeLabel = MODE_LABELS[mode] || mode;
  const dateStr = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  function printCert() { window.print(); }

  return (
    <div className="cert-overlay">
      <div className="cert-actions no-print">
        <button className="cert-print-btn" onClick={printCert}>🖨 Print / Save Certificate</button>
        <button className="cert-close-btn" onClick={onClose}>✕ Close</button>
      </div>
      <div className="cert-page">
        <div className="cert-border">
          <div className="cert-inner">
            <div className="cert-logo">🔍 Alert<span>IQ</span></div>
            <div className="cert-title-small">Financial Crime Training Platform</div>
            <div className="cert-divider" />
            <div className="cert-presents">This certifies that</div>
            <div className="cert-name">{studentName}</div>
            <div className="cert-presents">has successfully completed</div>
            <div className="cert-course">{modeLabel}</div>
            <div className="cert-score-row">
              <div className="cert-score-box">
                <div className="cert-score-val">{pct}%</div>
                <div className="cert-score-label">Final Score</div>
              </div>
              <div className="cert-score-box">
                <div className="cert-score-val">{score}/{maxScore}</div>
                <div className="cert-score-label">Points</div>
              </div>
              <div className="cert-score-box">
                <div className="cert-score-val cert-grade-val">{gradeLetter}</div>
                <div className="cert-score-label">Grade</div>
              </div>
            </div>
            <div className="cert-divider" />
            <div className="cert-date">{dateStr}</div>
            <div className="cert-sig-row">
              <div className="cert-sig">
                <div className="cert-sig-line" />
                <div className="cert-sig-label">Trainer Signature</div>
              </div>
              <div className="cert-sig">
                <div className="cert-sig-line" />
                <div className="cert-sig-label">Date</div>
              </div>
            </div>
            <div className="cert-footer">AlertIQ — Fraud Analysis Bootcamp · alertiq-bootcamp.vercel.app</div>
          </div>
        </div>
      </div>
    </div>
  );
}
