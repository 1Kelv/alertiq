import { useState, useEffect } from 'react';
import { fetchCustomAlerts, saveCustomAlert, deleteCustomAlert } from '../lib/supabase';

const MODULES = [
  { value: 'fraud',       label: 'Fraud Alert' },
  { value: 'idv',         label: 'ID&V' },
  { value: 'kyc',         label: 'KYC' },
  { value: 'chargeback',  label: 'Chargeback' },
];
const DECISIONS_BY_MODULE = {
  fraud:      ['Approve', 'Escalate', 'Block'],
  idv:        ['Pass', 'Refer', 'Reject'],
  kyc:        ['Pass', 'Refer', 'Escalate to EDD', 'Reject'],
  chargeback: ['Uphold Chargeback', 'Decline Chargeback'],
};

const EMPTY_FORM = { alert_id: '', module: 'fraud', risk_level: 'MEDIUM', correct_decision: 'Approve', explanation: '', flags: '', good_signs: '', fields: [{ key: '', value: '' }] };

export default function CustomAlertBuilder() {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('list'); // 'list' | 'create'

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const data = await fetchCustomAlerts();
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function setField(i, key, val) {
    setForm(f => {
      const fields = [...f.fields];
      fields[i] = { ...fields[i], [key]: val };
      return { ...f, fields };
    });
  }

  function addField()    { setForm(f => ({ ...f, fields: [...f.fields, { key: '', value: '' }] })); }
  function removeField(i){ setForm(f => ({ ...f, fields: f.fields.filter((_, idx) => idx !== i) })); }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.alert_id.trim()) { setError('Alert ID is required.'); return; }
    if (!form.explanation.trim()) { setError('Explanation is required.'); return; }
    const filledFields = form.fields.filter(f => f.key.trim() && f.value.trim());
    if (!filledFields.length) { setError('Add at least one field.'); return; }

    setSaving(true);
    try {
      const payload = {
        alert_id: form.alert_id.trim().toUpperCase(),
        module: form.module,
        risk_level: form.risk_level,
        correct_decision: form.correct_decision,
        explanation: form.explanation.trim(),
        flags: form.flags.split('\n').map(s => s.trim()).filter(Boolean),
        good_signs: form.good_signs.split('\n').map(s => s.trim()).filter(Boolean),
        fields: Object.fromEntries(filledFields.map(f => [f.key.trim(), f.value.trim()])),
      };
      const result = await saveCustomAlert(payload);
      setAlerts(prev => [result, ...prev]);
      setForm(EMPTY_FORM);
      setSaved(true);
      setTab('list');
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError('Failed to save. Check your Supabase connection.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm('Remove this custom alert?')) return;
    await deleteCustomAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="builder-wrap">
      <div className="builder-header">
        <h2 className="builder-title">Custom Alert Builder</h2>
        <p className="builder-sub">Create your own scenarios — they appear as "Custom Set" in the simulator.</p>
      </div>

      <div className="builder-tabs">
        <button className={`builder-tab${tab === 'list' ? ' active' : ''}`} onClick={() => setTab('list')}>
          My Alerts ({alerts.length})
        </button>
        <button className={`builder-tab${tab === 'create' ? ' active' : ''}`} onClick={() => setTab('create')}>
          + Create New
        </button>
      </div>

      {saved && <div className="builder-saved">✓ Alert saved and live in the Custom Set!</div>}

      {tab === 'list' && (
        loading ? <div className="dash-loading">Loading custom alerts…</div> :
        alerts.length === 0 ? (
          <div className="dash-empty">
            <p>No custom alerts yet.</p>
            <p style={{ fontSize: 13, marginTop: 8, color: 'var(--text3)' }}>Click "+ Create New" to add your first scenario.</p>
            <button className="modal-btn" style={{ marginTop: 16, maxWidth: 220, margin: '16px auto 0' }} onClick={() => setTab('create')}>Create first alert →</button>
          </div>
        ) : (
          <div className="builder-list">
            {alerts.map(a => (
              <div className="builder-alert-card" key={a.id}>
                <div className="builder-alert-header">
                  <span className="alert-id">{a.alert_id}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="mode-pill">{MODULES.find(m => m.value === a.module)?.label || a.module}</span>
                    <span className={`risk-badge risk-${a.risk_level}`}>{a.risk_level}</span>
                    <button className="builder-delete-btn" onClick={() => remove(a.id)}>✕</button>
                  </div>
                </div>
                <div className="builder-alert-decision">Correct decision: <strong>{a.correct_decision}</strong></div>
                <div className="builder-alert-fields">
                  {Object.entries(a.fields).slice(0, 4).map(([k, v]) => (
                    <span key={k} className="builder-field-chip"><span className="builder-field-key">{k}:</span> {v}</span>
                  ))}
                  {Object.entries(a.fields).length > 4 && <span className="builder-field-chip">+{Object.entries(a.fields).length - 4} more</span>}
                </div>
                <p className="builder-alert-exp">{a.explanation}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'create' && (
        <form className="builder-form" onSubmit={submit}>
          <div className="builder-row">
            <div className="builder-field-group">
              <label className="builder-label">Alert ID</label>
              <input className="modal-input" placeholder="e.g. CUSTOM01" value={form.alert_id} onChange={e => setForm(f => ({ ...f, alert_id: e.target.value }))} />
            </div>
            <div className="builder-field-group">
              <label className="builder-label">Module</label>
              <select className="sort-select" style={{ width: '100%', padding: '12px 14px' }} value={form.module}
                onChange={e => setForm(f => ({ ...f, module: e.target.value, correct_decision: DECISIONS_BY_MODULE[e.target.value][0] }))}>
                {MODULES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="builder-field-group">
              <label className="builder-label">Risk Level</label>
              <select className="sort-select" style={{ width: '100%', padding: '12px 14px' }} value={form.risk_level}
                onChange={e => setForm(f => ({ ...f, risk_level: e.target.value }))}>
                {['LOW', 'MEDIUM', 'HIGH'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="builder-field-group">
              <label className="builder-label">Correct Decision</label>
              <select className="sort-select" style={{ width: '100%', padding: '12px 14px' }} value={form.correct_decision}
                onChange={e => setForm(f => ({ ...f, correct_decision: e.target.value }))}>
                {(DECISIONS_BY_MODULE[form.module] || []).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="builder-section-label">Alert Fields</div>
          {form.fields.map((f, i) => (
            <div key={i} className="builder-field-row">
              <input className="modal-input" style={{ flex: 1, marginBottom: 0 }} placeholder="Field name (e.g. Account Age)" value={f.key} onChange={e => setField(i, 'key', e.target.value)} />
              <input className="modal-input" style={{ flex: 1, marginBottom: 0 }} placeholder="Value (e.g. 3 years)" value={f.value} onChange={e => setField(i, 'value', e.target.value)} />
              {form.fields.length > 1 && <button type="button" className="builder-delete-btn" onClick={() => removeField(i)}>✕</button>}
            </div>
          ))}
          <button type="button" className="builder-add-field-btn" onClick={addField}>+ Add field</button>

          <div className="builder-section-label">Explanation (shown after decision)</div>
          <textarea className="reason-box" style={{ minHeight: 100 }} placeholder="Explain the correct decision and what signals to look for…" value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} />

          <div className="builder-row" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div className="builder-section-label">Red Flags (one per line)</div>
              <textarea className="reason-box" style={{ minHeight: 80 }} placeholder="IP mismatch&#10;New device&#10;High velocity" value={form.flags} onChange={e => setForm(f => ({ ...f, flags: e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="builder-section-label">Good Signs (one per line)</div>
              <textarea className="reason-box" style={{ minHeight: 80 }} placeholder="Known device&#10;Low amount&#10;Consistent history" value={form.good_signs} onChange={e => setForm(f => ({ ...f, good_signs: e.target.value }))} />
            </div>
          </div>

          {error && <p className="modal-error" style={{ marginBottom: 8 }}>{error}</p>}
          <button className="modal-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Alert →'}</button>
        </form>
      )}
    </div>
  );
}
