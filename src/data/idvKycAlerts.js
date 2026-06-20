// ID&V — Identity Verification alerts
export const IDV_SET = [
  {
    id: 'IDV01', set: 'idv',
    fields: {
      'Document Type': 'Passport',
      'Expiry': 'Valid (2 years)',
      'Name Match': 'Full match',
      'DOB Match': 'Match',
      'Liveness Check': 'Pass',
      'Address Match': 'Match',
      'Document Condition': 'Clear',
    },
    riskLevel: 'LOW', correctDecision: 'Pass',
    flags: [], goodSigns: ['All fields match', 'Valid document', 'Liveness passed', 'Address confirmed'],
    explanation: 'Clean verification. All identity fields match, the document is valid, and the liveness check passed. Pass the customer without delay.',
  },
  {
    id: 'IDV02', set: 'idv',
    fields: {
      'Document Type': 'Driving Licence',
      'Expiry': 'Expired (4 months ago)',
      'Name Match': 'Full match',
      'DOB Match': 'Match',
      'Liveness Check': 'Pass',
      'Address Match': 'Match',
      'Document Condition': 'Clear',
    },
    riskLevel: 'MEDIUM', correctDecision: 'Refer',
    flags: ['Document expired 4 months ago'],
    goodSigns: ['Name and DOB match', 'Liveness passed', 'Address confirmed'],
    explanation: 'Expired documents cannot be accepted as valid ID regardless of other indicators. Refer the customer to re-submit a current document. Do not reject — this is likely a genuine customer who forgot to renew.',
  },
  {
    id: 'IDV03', set: 'idv',
    fields: {
      'Document Type': 'Passport',
      'Expiry': 'Valid (3 years)',
      'Name Match': 'Partial (surname mismatch)',
      'DOB Match': 'Match',
      'Liveness Check': 'Pass',
      'Address Match': 'No match',
      'Document Condition': 'Clear',
    },
    riskLevel: 'MEDIUM', correctDecision: 'Refer',
    flags: ['Surname mismatch', 'Address does not match'],
    goodSigns: ['Valid document', 'DOB matches', 'Liveness passed'],
    explanation: 'Two mismatches (surname and address) require human review before passing. The surname could indicate a recent name change — ask for supporting documents. Do not reject outright.',
  },
  {
    id: 'IDV04', set: 'idv',
    fields: {
      'Document Type': 'National ID',
      'Expiry': 'Valid (1 year)',
      'Name Match': 'Full match',
      'DOB Match': 'No match',
      'Liveness Check': 'Fail',
      'Address Match': 'Match',
      'Document Condition': 'Suspected tamper',
    },
    riskLevel: 'HIGH', correctDecision: 'Reject',
    flags: ['DOB mismatch', 'Liveness check failed', 'Suspected document tampering'],
    goodSigns: ['Name and address match'],
    explanation: 'Three critical failures: a DOB mismatch, a failed liveness check, and suspected document tampering. This is a strong indicator of identity fraud. Reject and flag for investigation.',
  },
  {
    id: 'IDV05', set: 'idv',
    fields: {
      'Document Type': 'Passport',
      'Expiry': 'Valid (5 years)',
      'Name Match': 'Full match',
      'DOB Match': 'Match',
      'Liveness Check': 'Pass',
      'Address Match': 'No match',
      'Document Condition': 'Clear',
    },
    riskLevel: 'LOW', correctDecision: 'Pass',
    flags: [],
    goodSigns: ['Valid passport', 'Name and DOB match', 'Liveness passed'],
    explanation: 'Address mismatches alone are not a reason to fail ID&V — customers move frequently. All primary identity fields match and liveness passed. Pass, but note the address discrepancy for the customer record.',
  },
  {
    id: 'IDV06', set: 'idv',
    fields: {
      'Document Type': 'Driving Licence',
      'Expiry': 'Valid (2 years)',
      'Name Match': 'Full match',
      'DOB Match': 'Match',
      'Liveness Check': 'Inconclusive',
      'Address Match': 'Match',
      'Document Condition': 'Low quality image',
    },
    riskLevel: 'MEDIUM', correctDecision: 'Refer',
    flags: ['Liveness check inconclusive', 'Low quality document image'],
    goodSigns: ['Valid document', 'Name, DOB, address all match'],
    explanation: 'Inconclusive liveness and a low-quality image cannot be auto-approved. Refer for manual document review — the customer may need to re-submit clearer images.',
  },
];

// KYC — Know Your Customer alerts
export const KYC_SET = [
  {
    id: 'KYC01', set: 'kyc',
    fields: {
      'Customer Type': 'Retail',
      'PEP Status': 'No',
      'Sanctions Hit': 'None',
      'Source of Funds': 'Salary (employer confirmed)',
      'Expected Activity': 'Matches profile',
      'Country Risk': 'Low',
      'Prior Adverse Info': 'None',
    },
    riskLevel: 'LOW', correctDecision: 'Pass',
    flags: [], goodSigns: ['No PEP or sanctions concerns', 'Source of funds clear', 'Low-risk country', 'Activity matches profile'],
    explanation: 'Straightforward Standard Due Diligence. All KYC indicators are clean. No PEP, no sanctions, confirmed source of funds, and expected activity matches. Pass.',
  },
  {
    id: 'KYC02', set: 'kyc',
    fields: {
      'Customer Type': 'Business',
      'PEP Status': 'No',
      'Sanctions Hit': 'None',
      'Source of Funds': 'Business revenue',
      'Expected Activity': 'High volume cash',
      'Country Risk': 'Medium',
      'Prior Adverse Info': 'None',
    },
    riskLevel: 'MEDIUM', correctDecision: 'Refer',
    flags: ['High volume cash activity', 'Medium-risk country'],
    goodSigns: ['No PEP or sanctions', 'Source of funds stated'],
    explanation: 'Business customers with high cash volumes in medium-risk countries require Enhanced Due Diligence. Refer to the compliance team for deeper source of funds verification and beneficial ownership checks.',
  },
  {
    id: 'KYC03', set: 'kyc',
    fields: {
      'Customer Type': 'Retail',
      'PEP Status': 'Yes — foreign government official',
      'Sanctions Hit': 'None',
      'Source of Funds': 'Unverified',
      'Expected Activity': 'High value transfers',
      'Country Risk': 'High',
      'Prior Adverse Info': 'None',
    },
    riskLevel: 'HIGH', correctDecision: 'Escalate to EDD',
    flags: ['PEP — foreign government official', 'Unverified source of funds', 'High-risk country', 'High value transfers'],
    goodSigns: ['No sanctions hit'],
    explanation: 'A PEP from a high-risk country with unverified source of funds and high-value transfer activity requires mandatory Enhanced Due Diligence (EDD). Escalate — do not approve without full EDD completion and senior sign-off.',
  },
  {
    id: 'KYC04', set: 'kyc',
    fields: {
      'Customer Type': 'Retail',
      'PEP Status': 'No',
      'Sanctions Hit': 'Potential match (same name)',
      'Source of Funds': 'Salary',
      'Expected Activity': 'Normal retail',
      'Country Risk': 'Low',
      'Prior Adverse Info': 'None',
    },
    riskLevel: 'HIGH', correctDecision: 'Refer',
    flags: ['Potential sanctions name match — requires verification'],
    goodSigns: ['Low-risk country', 'Normal expected activity', 'Salary confirmed'],
    explanation: 'A potential sanctions match must always be escalated for manual verification — it cannot be auto-cleared. The name may be a false positive, but the risk of onboarding a sanctioned individual is severe. Refer to compliance for identity disambiguation.',
  },
  {
    id: 'KYC05', set: 'kyc',
    fields: {
      'Customer Type': 'Business',
      'PEP Status': 'No',
      'Sanctions Hit': 'None',
      'Source of Funds': 'Inheritance',
      'Expected Activity': 'High value deposits',
      'Country Risk': 'Low',
      'Prior Adverse Info': 'Adverse media: company linked to fraud investigation',
    },
    riskLevel: 'HIGH', correctDecision: 'Reject',
    flags: ['Adverse media: linked to fraud investigation', 'High-value deposits with inheritance as source'],
    goodSigns: ['No PEP or sanctions', 'Low-risk country'],
    explanation: 'Adverse media linking the business to a fraud investigation is a serious red flag that outweighs the clean PEP and sanctions position. Combined with high-value deposits, the financial crime risk is too high to onboard. Reject and file a SAR if appropriate.',
  },
  {
    id: 'KYC06', set: 'kyc',
    fields: {
      'Customer Type': 'Retail',
      'PEP Status': 'No',
      'Sanctions Hit': 'None',
      'Source of Funds': 'Salary',
      'Expected Activity': 'Matches profile',
      'Country Risk': 'Low',
      'Prior Adverse Info': 'None',
    },
    riskLevel: 'LOW', correctDecision: 'Pass',
    flags: [],
    goodSigns: ['No PEP', 'No sanctions', 'Salary confirmed', 'Normal activity', 'Low-risk country', 'No adverse media'],
    explanation: 'All Standard Due Diligence checks pass. Low-risk customer with confirmed source of funds, no adverse information, and expected activity in line with profile. Pass.',
  },
];

// Chargebacks
export const CHARGEBACK_SET = [
  {
    id: 'CB01', set: 'chargeback',
    fields: {
      'Dispute Reason': 'Transaction not recognised',
      'Delivery': 'Delivered to billing address',
      'CVV': 'Correct',
      'Device': 'Known',
      'Prior Disputes': '3 in 12 months',
      'Merchant Response': 'Proof of delivery provided',
    },
    riskLevel: 'MEDIUM', correctDecision: 'Decline Chargeback',
    flags: ['3 prior disputes in 12 months', 'Pattern suggests first-party fraud'],
    goodSigns: ['Delivered to billing address', 'Correct CVV', 'Merchant has proof of delivery'],
    explanation: "Friendly fraud. The transaction signals are all genuine — correct CVV, known device, delivery to the customer's own address with merchant proof. Three prior disputes in 12 months is a clear pattern of first-party fraud. Decline the chargeback.",
  },
  {
    id: 'CB02', set: 'chargeback',
    fields: {
      'Dispute Reason': 'Item not received',
      'Delivery': 'No delivery confirmation',
      'CVV': 'Correct',
      'Device': 'Known',
      'Prior Disputes': 'None',
      'Merchant Response': 'No response within deadline',
    },
    riskLevel: 'LOW', correctDecision: 'Uphold Chargeback',
    flags: ['No delivery confirmation', 'Merchant did not respond'],
    goodSigns: ['No prior disputes', 'Correct CVV and known device'],
    explanation: 'Valid chargeback. The merchant provided no delivery evidence and failed to respond within the dispute window. The customer has no prior dispute history. Uphold the chargeback and return funds.',
  },
  {
    id: 'CB03', set: 'chargeback',
    fields: {
      'Dispute Reason': 'Services not received',
      'Delivery': 'Digital — access logs show usage',
      'CVV': 'Correct',
      'Device': 'Known',
      'Prior Disputes': '1 in 6 months',
      'Merchant Response': 'Access logs shared',
    },
    riskLevel: 'MEDIUM', correctDecision: 'Decline Chargeback',
    flags: ['Access logs show service was used', '1 prior dispute'],
    goodSigns: ['Merchant provided access evidence', 'Correct CVV'],
    explanation: 'The merchant has provided access logs showing the customer used the digital service. Declining is appropriate — the "services not received" claim cannot stand when usage logs contradict it.',
  },
  {
    id: 'CB04', set: 'chargeback',
    fields: {
      'Dispute Reason': 'Duplicate charge',
      'Delivery': 'N/A',
      'CVV': 'Correct',
      'Device': 'Known',
      'Prior Disputes': 'None',
      'Merchant Response': 'Duplicate confirmed by merchant',
    },
    riskLevel: 'LOW', correctDecision: 'Uphold Chargeback',
    flags: ['Duplicate transaction confirmed'],
    goodSigns: ['Merchant acknowledged the error', 'No prior disputes'],
    explanation: 'Clear duplicate charge — the merchant has confirmed it. This is a legitimate billing error, not fraud. Uphold the chargeback and return the duplicate amount.',
  },
  {
    id: 'CB05', set: 'chargeback',
    fields: {
      'Dispute Reason': 'Transaction not recognised',
      'Delivery': 'New delivery address (not billing)',
      'CVV': 'Correct',
      'Device': 'New device',
      'Prior Disputes': 'None',
      'Merchant Response': 'Delivered to address on order',
    },
    riskLevel: 'HIGH', correctDecision: 'Uphold Chargeback',
    flags: ['New delivery address', 'New device at point of purchase', 'Genuine fraud indicators'],
    goodSigns: ['No prior disputes'],
    explanation: 'Genuine third-party fraud. A new device and new delivery address at the time of purchase are ATO indicators. The customer legitimately did not make this transaction. Uphold the chargeback and refer account for security review.',
  },
];

export function buildModuleQueue(module) {
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  if (module === 'idv')         return shuffle(IDV_SET);
  if (module === 'kyc')         return shuffle(KYC_SET);
  if (module === 'chargeback')  return shuffle(CHARGEBACK_SET);
  return [];
}
