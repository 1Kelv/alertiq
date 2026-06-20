import { useState } from 'react';

const TERMS = {
  general: [
    { term: 'CVV', def: 'Card Verification Value — the 3-digit security code on the back of a card. Used to verify card-not-present transactions.' },
    { term: 'IP Address', def: 'Internet Protocol address — identifies the device\'s location online. An IP from a different country to the card is a red flag.' },
    { term: 'Velocity', def: 'The number of transactions in a short time window. High velocity (e.g. 5 in 10 mins) is a strong fraud indicator.' },
    { term: 'ATO', def: 'Account Takeover — a fraudster gains access to a legitimate customer\'s account, usually via phishing or credential theft.' },
    { term: 'CNP', def: 'Card-Not-Present — a transaction where the physical card is not used (e.g. online). Higher fraud risk than in-person.' },
    { term: 'APP Scam', def: 'Authorised Push Payment scam — the victim is tricked into authorising a bank transfer to a fraudster\'s account.' },
    { term: 'False Positive', def: 'A genuine transaction incorrectly flagged as fraud. Blocking these harms real customers — both outcomes have cost.' },
    { term: 'False Negative', def: 'A fraudulent transaction that passes through unchallenged. The cost is a financial loss.' },
    { term: 'Mule Account', def: 'An account used to receive and forward criminal funds, often recruited via fake job ads on social media.' },
    { term: 'Email Risk', def: 'A score indicating how suspicious an email address is — recently created, associated with fraud, or recently changed.' },
    { term: 'Behaviour Change', def: 'A flag indicating the customer\'s current activity deviates significantly from their historical pattern.' },
    { term: 'Merchant Type', def: 'The category of business. Electronics and gift cards are high-risk (resalable); supermarkets and pharmacies are low-risk.' },
  ],
  idv: [
    { term: 'ID&V', def: 'Identity Verification — the process of confirming a person is who they claim to be using documents and biometrics.' },
    { term: 'Liveness Check', def: 'A biometric test to confirm the document selfie is a real person, not a photo or deepfake.' },
    { term: 'DOB', def: 'Date of Birth — a key identity field. A mismatch between the document DOB and the account record is a red flag.' },
    { term: 'Biometric', def: 'A physical characteristic used to verify identity — fingerprint, facial scan, or liveness video.' },
    { term: 'Document Tampering', def: 'Signs that a document has been altered — blurred edges, inconsistent fonts, mismatched security features.' },
    { term: 'Pass', def: 'ID&V decision: all checks passed, customer identity confirmed, proceed.' },
    { term: 'Refer', def: 'ID&V decision: cannot auto-confirm, needs manual human review (e.g. expired doc, low image quality).' },
    { term: 'Reject', def: 'ID&V decision: identity cannot be confirmed due to critical failures (e.g. tampering, liveness fail, DOB mismatch).' },
    { term: 'Inconclusive', def: 'A liveness or document check that returned no clear pass or fail — requires manual review.' },
  ],
  kyc: [
    { term: 'KYC', def: 'Know Your Customer — the process of verifying a customer\'s identity and assessing their financial crime risk.' },
    { term: 'PEP', def: 'Politically Exposed Person — a person in a prominent public role (e.g. government official) or their close associate. PEPs require Enhanced Due Diligence.' },
    { term: 'EDD', def: 'Enhanced Due Diligence — deeper checks required for high-risk customers (PEPs, high-risk countries, complex structures).' },
    { term: 'SDD', def: 'Standard Due Diligence — the basic KYC level applied to most retail customers with no elevated risk factors.' },
    { term: 'Sanctions', def: 'Restrictions imposed by governments on individuals, entities, or countries. Onboarding a sanctioned person is illegal.' },
    { term: 'SAR', def: 'Suspicious Activity Report — a mandatory report filed with the authorities when financial crime is suspected.' },
    { term: 'AML', def: 'Anti-Money Laundering — the legal and procedural framework to prevent criminal funds entering the financial system.' },
    { term: 'Source of Funds', def: 'The origin of a customer\'s money (salary, inheritance, business). Must be verified for high-risk customers.' },
    { term: 'Adverse Media', def: 'Negative news coverage — links to criminal investigations, fraud, or corruption that may indicate financial crime risk.' },
    { term: 'Beneficial Owner', def: 'The real person who ultimately owns or controls a company. Must be identified for business customers.' },
    { term: 'Country Risk', def: 'A risk rating for a country based on its AML controls, corruption levels, and sanctions status.' },
    { term: 'Escalate to EDD', def: 'KYC decision: the customer\'s risk profile requires Enhanced Due Diligence before onboarding can proceed.' },
  ],
  chargeback: [
    { term: 'Chargeback', def: 'A dispute raised by a cardholder through their bank to reverse a transaction. The bank contacts the merchant for evidence.' },
    { term: 'Friendly Fraud', def: 'When a genuine customer raises a false chargeback — claiming non-receipt or non-authorisation despite receiving the goods/services.' },
    { term: 'Dispute Window', def: 'The time limit a merchant has to respond to a chargeback with evidence. Missing it means automatic loss.' },
    { term: 'Merchant', def: 'The business that processed the original transaction. They must respond to chargebacks with proof of delivery/service.' },
    { term: 'Billing Address', def: 'The address registered to the card. Delivery to the billing address is strong evidence against a non-receipt claim.' },
    { term: 'Uphold Chargeback', def: 'Decision to return funds to the customer — the dispute is valid or the merchant provided no evidence.' },
    { term: 'Decline Chargeback', def: 'Decision to reject the dispute — evidence shows the customer received the goods/service or the claim is fraudulent.' },
    { term: 'Access Logs', def: 'Server records showing when a digital service was accessed. Used by merchants to prove services were delivered.' },
    { term: 'Duplicate Charge', def: 'A billing error where a customer was charged twice for the same transaction. Always a valid chargeback reason.' },
  ],
};

const MODULE_TERMS = {
  set1:       ['general'],
  set2:       ['general'],
  mixed:      ['general'],
  exam:       ['general'],
  idv:        ['idv', 'general'],
  kyc:        ['kyc', 'general'],
  chargeback: ['chargeback', 'general'],
  lesson:     ['general'],
};

const GROUP_LABELS = { general: 'General Fraud', idv: 'ID&V', kyc: 'KYC', chargeback: 'Chargebacks' };
const GROUP_COLORS = { general: '#f59e0b', idv: '#3b82f6', kyc: '#a78bfa', chargeback: '#22c55e' };

export default function GlossaryKey({ mode = 'set1' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const groups = MODULE_TERMS[mode] || ['general'];
  const allTerms = groups.flatMap(g => TERMS[g].map(t => ({ ...t, group: g })));
  const filtered = search.trim()
    ? allTerms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()))
    : allTerms;

  return (
    <>
      <button className="glossary-fab" onClick={() => setOpen(o => !o)} title="Key / Glossary">
        {open ? '✕' : '📖 Key'}
      </button>

      {open && (
        <div className="glossary-panel">
          <div className="glossary-panel-header">
            <span className="glossary-panel-title">Key Terms</span>
            <button className="glossary-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <input
            className="glossary-search"
            placeholder="Search terms…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="glossary-body">
            {groups.map(g => {
              const terms = filtered.filter(t => t.group === g);
              if (!terms.length) return null;
              return (
                <div key={g}>
                  <div className="glossary-group-label" style={{ color: GROUP_COLORS[g] }}>
                    {GROUP_LABELS[g]}
                  </div>
                  {terms.map(t => (
                    <div className="glossary-entry" key={t.term}>
                      <div className="glossary-term">{t.term}</div>
                      <div className="glossary-def">{t.def}</div>
                    </div>
                  ))}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ color: 'var(--text3)', fontSize: 13, padding: '12px 0' }}>No terms match "{search}"</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
