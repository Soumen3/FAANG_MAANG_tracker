import { useState } from 'react';

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'Other'];
const ROUNDS = ['OA', 'Phone Screen', 'Technical Round 1', 'Technical Round 2', 'System Design', 'Behavioral', 'Bar Raiser', 'Offer'];
const OUTCOMES = ['Scheduled', 'Cleared', 'Rejected', 'Pending'];
const OUTCOME_COLORS = { Scheduled: '#4361ee', Cleared: '#34d399', Rejected: '#f87171', Pending: '#fbbf24' };

export default function InterviewTracker({ interviews, addInterview, updateInterview, deleteInterview }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: 'Google', round: 'Phone Screen', date: '', outcome: 'Scheduled', notes: '', problems: '' });

  const handleAdd = () => {
    if (!form.company) return;
    addInterview(form);
    setForm({ company: 'Google', round: 'Phone Screen', date: '', outcome: 'Scheduled', notes: '', problems: '' });
    setShowForm(false);
  };

  const stats = { total: interviews.length, cleared: interviews.filter(i => i.outcome === 'Cleared').length, rejected: interviews.filter(i => i.outcome === 'Rejected').length, scheduled: interviews.filter(i => i.outcome === 'Scheduled').length };

  const byCompany = COMPANIES.reduce((acc, c) => {
    const items = interviews.filter(i => i.company === c);
    if (items.length) acc[c] = items;
    return acc;
  }, {});

  const inputStyle = { padding: '8px 12px', background: '#0c1020', border: '1px solid #1e2d45', borderRadius: 8, color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', outline: 'none' };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#00f5d4', letterSpacing: '0.15em', marginBottom: 8 }}>// INTERVIEW PIPELINE</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Interview Tracker</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 22px', background: '#00f5d4', color: '#050810', border: 'none', borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>+ Add Interview</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[{ label: 'Total Rounds', val: stats.total, color: '#00f5d4' }, { label: 'Cleared', val: stats.cleared, color: '#34d399' }, { label: 'Rejected', val: stats.rejected, color: '#f87171' }, { label: 'Upcoming', val: stats.scheduled, color: '#4361ee' }].map(({ label, val, color }) => (
          <div key={label} style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ background: '#111827', border: '1px solid rgba(0,245,212,0.25)', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#00f5d4', fontFamily: 'JetBrains Mono, monospace', marginBottom: '1rem', letterSpacing: '0.1em' }}>// LOG INTERVIEW ROUND</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[{ key: 'company', options: COMPANIES }, { key: 'round', options: ROUNDS }, { key: 'outcome', options: OUTCOMES }].map(({ key, options }) => (
              <select key={key} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={inputStyle}>{options.map(o => <option key={o}>{o}</option>)}</select>
            ))}
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
          </div>
          <input placeholder="Problems asked (e.g. Two Sum, LRU Cache)" value={form.problems} onChange={e => setForm(p => ({ ...p, problems: e.target.value }))} style={{ ...inputStyle, width: '100%', marginBottom: '0.75rem' }} />
          <textarea placeholder="Notes / feedback / what to improve..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, width: '100%', minHeight: 70, resize: 'vertical', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{ padding: '8px 20px', background: '#00f5d4', color: '#050810', border: 'none', borderRadius: 8, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Add Round</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#64748b', border: '1px solid #1e2d45', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {Object.keys(byCompany).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>// No interviews logged yet. Land those interviews! 🚀</div>
      ) : Object.entries(byCompany).map(([company, rounds]) => (
        <div key={company} style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            🏢 {company} <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>({rounds.length} rounds)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rounds.map(r => {
              const oc = OUTCOME_COLORS[r.outcome];
              return (
                <div key={r.id} style={{ background: '#111827', border: '1px solid #1e2d45', borderLeft: `3px solid ${oc}`, borderRadius: 10, padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', flex: 1, minWidth: 120 }}>{r.round}</span>
                    {r.date && <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{r.date}</span>}
                    <select value={r.outcome} onChange={e => updateInterview(r.id, { outcome: e.target.value })} style={{ padding: '3px 8px', background: `${oc}15`, border: `1px solid ${oc}40`, borderRadius: 100, color: oc, fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', outline: 'none', cursor: 'pointer' }}>
                      {OUTCOMES.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <button onClick={() => deleteInterview(r.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.5 }} onMouseEnter={e => e.target.style.color = '#f87171'} onMouseLeave={e => e.target.style.color = '#64748b'}>✕</button>
                  </div>
                  {r.problems && <div style={{ marginTop: 6, fontSize: '0.72rem', color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>Problems: {r.problems}</div>}
                  {r.notes && <div style={{ marginTop: 4, fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5 }}>{r.notes}</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
