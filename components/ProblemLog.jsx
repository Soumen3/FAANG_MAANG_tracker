import { useState } from 'react';

const TAGS = ['Array', 'Graph', 'DP', 'Tree', 'Linked List', 'Heap', 'Backtracking', 'Binary Search', 'String', 'Math', 'System Design', 'Other'];
const DIFF = ['Easy', 'Medium', 'Hard'];

export default function ProblemLog({ problems, addProblem, updateProblem, deleteProblem }) {
  const [form, setForm] = useState({ name: '', tag: 'Array', difficulty: 'Medium', link: '', time: '', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addProblem({ ...form, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), solved: false });
    setForm({ name: '', tag: 'Array', difficulty: 'Medium', link: '', time: '', notes: '' });
    setShowForm(false);
  };

  const filtered = problems.filter(p => {
    const matchFilter = filter === 'All' || p.tag === filter || p.difficulty === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = { total: problems.length, solved: problems.filter(p => p.solved).length, easy: problems.filter(p => p.difficulty === 'Easy').length, medium: problems.filter(p => p.difficulty === 'Medium').length, hard: problems.filter(p => p.difficulty === 'Hard').length };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#00f5d4', letterSpacing: '0.15em', marginBottom: 8 }}>// PROBLEM TRACKER</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Problems Solved</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 22px', background: '#00f5d4', color: '#050810', border: 'none', borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          + Log Problem
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[{ label: 'Total', val: stats.total, color: '#00f5d4' }, { label: 'Solved', val: stats.solved, color: '#34d399' }, { label: 'Easy', val: stats.easy, color: '#34d399' }, { label: 'Medium', val: stats.medium, color: '#fbbf24' }, { label: 'Hard', val: stats.hard, color: '#f87171' }].map(({ label, val, color }) => (
          <div key={label} style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ background: '#111827', border: '1px solid rgba(0,245,212,0.25)', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#00f5d4', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: '1rem' }}>// LOG NEW PROBLEM</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input placeholder="Problem name / number *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            <select value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} style={inputStyle}>{TAGS.map(t => <option key={t}>{t}</option>)}</select>
            <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} style={inputStyle}>{DIFF.map(d => <option key={d}>{d}</option>)}</select>
            <input placeholder="Time taken (e.g. 25 min)" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={inputStyle} />
          </div>
          <input placeholder="LeetCode/Problem link (optional)" value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} style={{ ...inputStyle, width: '100%', marginBottom: '0.75rem' }} />
          <textarea placeholder="Notes / approach / mistakes..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, width: '100%', minHeight: 60, resize: 'vertical', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{ padding: '8px 20px', background: '#00f5d4', color: '#050810', border: 'none', borderRadius: 8, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Add Problem</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#64748b', border: '1px solid #1e2d45', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="🔍 Search problems..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, flex: '1', minWidth: 180 }} />
        {['All', ...DIFF, 'Array', 'Graph', 'DP', 'Tree'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', borderRadius: 100, border: `1px solid ${filter === f ? '#00f5d4' : '#1e2d45'}`, background: filter === f ? 'rgba(0,245,212,0.1)' : 'transparent', color: filter === f ? '#00f5d4' : '#64748b', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', transition: 'all 0.2s' }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
          {problems.length === 0 ? '// No problems logged yet. Start solving! 💪' : '// No problems match your filter.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map(p => <ProblemRow key={p.id} problem={p} onToggle={() => updateProblem(p.id, { solved: !p.solved })} onDelete={() => deleteProblem(p.id)} />)}
        </div>
      )}
    </div>
  );
}

function ProblemRow({ problem, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const diffColor = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171' }[problem.difficulty];
  return (
    <div style={{ background: '#111827', border: `1px solid ${problem.solved ? 'rgba(52,211,153,0.25)' : '#1e2d45'}`, borderRadius: 10, padding: '0.85rem 1rem', opacity: problem.solved ? 0.7 : 1, transition: 'all 0.25s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={onToggle} style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${problem.solved ? '#34d399' : '#1e2d45'}`, background: problem.solved ? 'rgba(52,211,153,0.15)' : 'transparent', color: '#34d399', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0, transition: 'all 0.2s' }}>{problem.solved ? '✓' : ''}</button>
        <span style={{ fontWeight: 600, fontSize: '0.88rem', flex: 1, textDecoration: problem.solved ? 'line-through' : 'none', color: problem.solved ? '#64748b' : '#e2e8f0' }}>
          {problem.link ? <a href={problem.link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'inherit' }}>{problem.name}</a> : problem.name}
        </span>
        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 100, background: `${diffColor}18`, color: diffColor, fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${diffColor}40` }}>{problem.difficulty}</span>
        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', border: '1px solid #1e2d45' }}>{problem.tag}</span>
        {problem.time && <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>⏱ {problem.time}</span>}
        <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{problem.date}</span>
        {problem.notes && <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.7rem' }}>📝</button>}
        <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.5 }} onMouseEnter={e => e.target.style.color = '#f87171'} onMouseLeave={e => e.target.style.color = '#64748b'}>✕</button>
      </div>
      {expanded && problem.notes && <div style={{ marginTop: 8, paddingLeft: 32, fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6, borderLeft: '2px solid rgba(251,191,36,0.3)', paddingBottom: 2 }}>{problem.notes}</div>}
    </div>
  );
}

const inputStyle = { padding: '8px 12px', background: '#0c1020', border: '1px solid #1e2d45', borderRadius: 8, color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', outline: 'none' };
