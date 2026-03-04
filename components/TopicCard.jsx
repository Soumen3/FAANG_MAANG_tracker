import { useState } from 'react';
import { DIFFICULTY, STATUS_CONFIG, STATUS } from '../lib/roadmap';

const statusOrder = ['not_started', 'in_progress', 'done', 'review', 'skipped'];

export default function TopicCard({ topic, status, note, rating, subtopicStatuses, onStatusChange, onNoteChange, onRatingChange, onSubtopicToggle }) {
  const [expanded, setExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [localNote, setLocalNote] = useState(note || '');
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const diff = DIFFICULTY[topic.difficulty];
  const currentStatus = STATUS_CONFIG[status || 'not_started'];
  const accent = topic.accent;

  const doneSubtopics = topic.subtopics.filter(s => subtopicStatuses[`${topic.id}::${s}`] === 'done').length;
  const subtopicPct = Math.round((doneSubtopics / topic.subtopics.length) * 100);

  const cycleStatus = () => {
    const idx = statusOrder.indexOf(status || 'not_started');
    onStatusChange((statusOrder[(idx + 1) % statusOrder.length]));
  };

  const saveNote = () => {
    onNoteChange(localNote);
    setShowNotes(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        background: '#111827',
        border: `1px solid ${hovered ? `rgba(${hexToRgb(accent)}, 0.55)` : status && status !== 'not_started' ? currentStatus.border : '#1e2d45'}`,
        borderRadius: 16,
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered
          ? `0 0 0 1px rgba(${hexToRgb(accent)}, 0.12) inset`
          : status === 'done' ? `0 0 30px rgba(52,211,153,0.08)` : 'none',
        cursor: 'default',
      }}>

      {/* Cursor spotlight overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        borderRadius: 16,
        background: hovered
          ? `radial-gradient(circle 180px at ${mousePos.x}% ${mousePos.y}%, rgba(${hexToRgb(accent)}, 0.1) 0%, transparent 80%)`
          : 'transparent',
        transition: hovered ? 'background 0.08s linear' : 'background 0.4s ease',
      }} />
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 1,
        background: `linear-gradient(90deg, transparent, ${accent}, ${shiftColor(accent)}, transparent)`,
        backgroundSize: '200% 100%',
        opacity: hovered ? 1 : (status && status !== 'not_started' ? 0.6 : 0),
        transition: 'opacity 0.35s',
        animation: hovered ? 'shimmer 1.6s linear infinite' : 'none',
      }} />

      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.3rem',
            background: `rgba(${hexToRgb(accent)}, 0.1)`,
            border: `1px solid rgba(${hexToRgb(accent)}, 0.25)`,
            flexShrink: 0,
            transition: 'all 0.3s',
          }}>{topic.icon}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 3, lineHeight: 1.3 }}>{topic.title}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 100, background: diff.bg, color: diff.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>{diff.label}</span>
              {topic.weeks && <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>Week {topic.weeks}</span>}
              {topic.leetcodeCount > 0 && <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>~{topic.leetcodeCount} problems</span>}
            </div>
          </div>
        </div>
        <StatusButton status={status} currentStatus={currentStatus} onClick={cycleStatus} />
      </div>

      {/* Description */}
      <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.65, fontFamily: 'JetBrains Mono, monospace', fontWeight: 300, marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
        {topic.desc}
      </div>

      {/* Subtopic progress */}
      <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>Subtopics checked</span>
          <span style={{ fontSize: '0.7rem', color: accent, fontFamily: 'JetBrains Mono, monospace' }}>{doneSubtopics}/{topic.subtopics.length}</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${subtopicPct}%`, background: `linear-gradient(90deg, ${accent}, ${shiftColor(accent)})`, borderRadius: 100, transition: 'width 0.5s cubic-bezier(0.23,1,0.32,1)' }} />
        </div>
      </div>

      {/* Rating stars */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginRight: 4 }}>Confidence:</span>
        {[1,2,3,4,5].map(star => (
          <button key={star} onClick={() => onRatingChange(rating === star ? 0 : star)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9rem', color: star <= (rating || 0) ? '#fbbf24' : '#1e2d45', transition: 'color 0.2s, transform 0.1s', transform: 'scale(1)' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.3)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >★</button>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <ActionBtn icon="▾" label={expanded ? 'Hide Topics' : 'Subtopics'} accent={accent} onClick={() => setExpanded(!expanded)} active={expanded} />
        <ActionBtn icon="📝" label={note ? 'Edit Note' : 'Add Note'} accent="#fbbf24" onClick={() => setShowNotes(!showNotes)} active={!!note} />
        {topic.resources?.length > 0 && <ActionBtn icon="📚" label="Resources" accent="#7209b7" onClick={() => setExpanded(true)} />}
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10 }}>
          <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>// YOUR NOTES</div>
          <textarea
            value={localNote}
            onChange={e => setLocalNote(e.target.value)}
            placeholder="Add your notes, mistakes, key insights..."
            style={{ width: '100%', minHeight: 80, background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', resize: 'vertical', lineHeight: 1.6 }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={saveNote} style={{ padding: '5px 14px', background: '#fbbf24', color: '#050810', border: 'none', borderRadius: 6, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Save</button>
            <button onClick={() => { setLocalNote(note || ''); setShowNotes(false); }} style={{ padding: '5px 14px', background: 'transparent', color: '#64748b', border: '1px solid #1e2d45', borderRadius: 6, fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
      {note && !showNotes && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(251,191,36,0.04)', borderLeft: '2px solid rgba(251,191,36,0.3)', borderRadius: '0 6px 6px 0' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{note.length > 120 ? note.slice(0, 120) + '…' : note}</div>
        </div>
      )}

      {/* Subtopics expanded */}
      {expanded && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10, letterSpacing: '0.1em' }}>// SUBTOPICS — click to check off</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6 }}>
            {topic.subtopics.map(sub => {
              const key = `${topic.id}::${sub}`;
              const done = subtopicStatuses[key] === 'done';
              return (
                <button key={sub} onClick={() => onSubtopicToggle(key, done ? 'not_started' : 'done')}
                  style={{
                    padding: '6px 10px', borderRadius: 7, textAlign: 'left', cursor: 'pointer',
                    background: done ? `rgba(${hexToRgb(accent)}, 0.12)` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${done ? `rgba(${hexToRgb(accent)}, 0.35)` : '#1e2d45'}`,
                    color: done ? accent : '#64748b',
                    fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <span style={{ fontSize: '0.65rem' }}>{done ? '✓' : '○'}</span>
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Resources */}
          {topic.resources?.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e2d45' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8, letterSpacing: '0.1em' }}>// RESOURCES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {topic.resources.map(r => (
                  <div key={r} style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: accent }}>→</span> {r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusButton({ status, currentStatus, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} title="Click to cycle status"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '5px 12px', borderRadius: 100,
        border: `1px solid ${hover ? currentStatus.color : currentStatus.border}`,
        background: hover ? currentStatus.color + '22' : currentStatus.bg,
        color: currentStatus.color,
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.25s',
        display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600,
        flexShrink: 0,
      }}>
      <span>{currentStatus.icon}</span>
      {currentStatus.label}
    </button>
  );
}

function ActionBtn({ icon, label, accent, onClick, active }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: '5px 12px', background: active || hover ? `rgba(${hexToRgb(accent)}, 0.1)` : 'transparent',
        border: `1px solid ${active || hover ? `rgba(${hexToRgb(accent)}, 0.35)` : '#1e2d45'}`,
        borderRadius: 8, color: active || hover ? accent : '#64748b',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5,
      }}>
      {icon} {label}
    </button>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function shiftColor(hex) {
  const map = { '#00f5d4': '#4361ee', '#4361ee': '#7209b7', '#f72585': '#7209b7', '#7209b7': '#4361ee', '#fbbf24': '#f72585', '#34d399': '#00f5d4' };
  return map[hex] || '#4361ee';
}
