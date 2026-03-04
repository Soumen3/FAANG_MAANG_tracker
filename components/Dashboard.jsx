import { STATUS_CONFIG } from '../lib/roadmap';

const STAT_META = [
  {
    key: 'done',
    label: 'Completed',
    symbol: '✓',
    gradient: 'linear-gradient(135deg,#00f5d4 0%,#00b894 100%)',
    glow: 'rgba(0,245,212,0.18)',
    border: 'rgba(0,245,212,0.25)',
    bg: 'rgba(0,245,212,0.06)',
    tag: 'DONE',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    symbol: '▶',
    gradient: 'linear-gradient(135deg,#4361ee 0%,#7209b7 100%)',
    glow: 'rgba(67,97,238,0.18)',
    border: 'rgba(67,97,238,0.3)',
    bg: 'rgba(67,97,238,0.06)',
    tag: 'ACTIVE',
  },
  {
    key: 'review',
    label: 'In Review',
    symbol: '⟳',
    gradient: 'linear-gradient(135deg,#f72585 0%,#b5179e 100%)',
    glow: 'rgba(247,37,133,0.18)',
    border: 'rgba(247,37,133,0.3)',
    bg: 'rgba(247,37,133,0.06)',
    tag: 'REVIEW',
  },
  {
    key: 'not_started',
    label: 'Remaining',
    symbol: '○',
    gradient: 'linear-gradient(135deg,#64748b 0%,#475569 100%)',
    glow: 'rgba(100,116,139,0.12)',
    border: 'rgba(100,116,139,0.2)',
    bg: 'rgba(100,116,139,0.04)',
    tag: 'TODO',
  },
];

export default function Dashboard({ stats, sections, getSectionStats }) {
  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const statVals = {
    done: stats.done,
    in_progress: stats.inProgress,
    review: stats.review,
    not_started: stats.notStarted,
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #040710 0%, #060a14 100%)',
      borderBottom: '1px solid #16243a',
      padding: '2rem 2rem 1.75rem',
    }}>

      {/* ── inline keyframe styles ── */}
      <style>{`
        @keyframes dashPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes barShine {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(400%); }
          100% { transform: translateX(400%); }
        }
        .db-stat-card:hover { transform: translateY(-3px) !important; }
        .db-section-card:hover { border-color: rgba(255,255,255,0.12) !important; background: rgba(255,255,255,0.03) !important; }
        .db-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        @media (max-width: 900px) { .db-stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .db-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; } }
        .db-section-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.625rem; }
        @media (max-width: 1100px) { .db-section-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 750px)  { .db-section-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .db-section-grid { grid-template-columns: repeat(1, 1fr); } }
      `}</style>

      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        {/* ── HEADER ROW ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: '1.5rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem', color: '#374151',
          letterSpacing: '0.12em',
        }}>
          <span style={{ color: '#00f5d4', animation: 'dashPulse 2s ease infinite' }}>◆</span>
          <span>SYSTEM_DASHBOARD</span>
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#16243a,transparent)' }} />
          <span style={{ color: '#16243a' }}>{stats.done}/{stats.total} topics tracked</span>
        </div>

        {/* ── MAIN PROGRESS BLOCK ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,245,212,0.04) 0%, rgba(67,97,238,0.04) 50%, rgba(247,37,133,0.03) 100%)',
          border: '1px solid rgba(0,245,212,0.12)',
          borderRadius: 16,
          padding: '1.5rem 1.75rem',
          marginBottom: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* corner accents */}
          <span style={{ position:'absolute', top:8, left:8, width:12, height:12, borderTop:'2px solid rgba(0,245,212,0.4)', borderLeft:'2px solid rgba(0,245,212,0.4)', borderRadius:'2px 0 0 0' }} />
          <span style={{ position:'absolute', top:8, right:8, width:12, height:12, borderTop:'2px solid rgba(0,245,212,0.4)', borderRight:'2px solid rgba(0,245,212,0.4)', borderRadius:'0 2px 0 0' }} />
          <span style={{ position:'absolute', bottom:8, left:8, width:12, height:12, borderBottom:'2px solid rgba(0,245,212,0.4)', borderLeft:'2px solid rgba(0,245,212,0.4)', borderRadius:'0 0 0 2px' }} />
          <span style={{ position:'absolute', bottom:8, right:8, width:12, height:12, borderBottom:'2px solid rgba(0,245,212,0.4)', borderRight:'2px solid rgba(0,245,212,0.4)', borderRadius:'0 0 2px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>

            {/* Big % number */}
            <div style={{ flexShrink: 0, lineHeight: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                background: 'linear-gradient(135deg,#00f5d4 0%,#4361ee 60%,#f72585 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Syne, sans-serif',
              }}>{pct}<span style={{ fontSize: '40%', letterSpacing: 0, fontWeight: 700 }}>%</span></div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#374151', letterSpacing: '0.15em', marginTop: 6, whiteSpace: 'nowrap' }}>
                OVERALL COMPLETION
              </div>
            </div>

            {/* Bar + breakdown */}
            <div style={{ flex: 1, minWidth: 200 }}>
              {/* Label row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.1em' }}>
                  PREP_PROGRESS
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#64748b' }}>
                  <span style={{ color: '#00f5d4' }}>{stats.done}</span> / {stats.total}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                height: 14,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 100,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                position: 'relative',
              }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #00f5d4 0%, #4361ee 60%, #f72585 100%)',
                  borderRadius: 100,
                  transition: 'width 1s cubic-bezier(0.23,1,0.32,1)',
                  position: 'relative',
                  boxShadow: '0 0 12px rgba(0,245,212,0.4)',
                  overflow: 'hidden',
                }}>
                  {/* shine sweep */}
                  <span style={{
                    position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                    animation: 'barShine 3s ease-in-out infinite',
                  }} />
                </div>
              </div>

              {/* Mini segment breakdown */}
              <div style={{ display: 'flex', gap: 3, marginTop: 8, width: '100%', alignItems: 'center' }}>
                {STAT_META.map(m => {
                  const v = statVals[m.key];
                  const segPct = stats.total > 0 ? (v / stats.total) * 100 : 0;
                  if (segPct === 0) return null;
                  return (
                    <div key={m.key} title={`${m.label}: ${v}`} style={{
                      height: 4,
                      flexBasis: `${segPct}%`,
                      flexGrow: 0,
                      flexShrink: 0,
                      background: m.gradient,
                      borderRadius: 100,
                      opacity: 0.75,
                    }} />
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                {STAT_META.map(m => (
                  <span key={m.key} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: m.gradient, flexShrink: 0, display: 'inline-block' }} />
                    {m.tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="db-stat-grid" style={{ marginBottom: '1.25rem' }}>
          {STAT_META.map(m => {
            const val = statVals[m.key];
            const segPct = stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;
            return (
              <div key={m.key} className="db-stat-card" style={{
                background: m.bg,
                border: `1px solid ${m.border}`,
                borderRadius: 12,
                padding: '1.1rem 1.25rem 1rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                boxShadow: `0 0 20px ${m.glow}`,
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {/* glow orb */}
                <span style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 80, height: 80, borderRadius: '50%',
                  background: m.glow, filter: 'blur(24px)', pointerEvents: 'none',
                }} />

                {/* top row: tag left, pct right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.52rem',
                    letterSpacing: '0.12em', color: STATUS_CONFIG[m.key]?.color ?? '#64748b',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0, display: 'inline-block' }} />
                    {m.tag}
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#374151', fontWeight: 600 }}>
                    {segPct}%
                  </span>
                </div>

                {/* big number + label */}
                <div>
                  <div style={{
                    fontSize: 'clamp(2rem, 3vw, 2.6rem)', fontWeight: 900, lineHeight: 1,
                    background: m.gradient,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em',
                    marginBottom: 5,
                  }}>
                    {val}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.06em' }}>
                    {m.label}
                  </div>
                </div>

                {/* mini bar */}
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${segPct}%`,
                    background: m.gradient, borderRadius: 100,
                    transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SECTION BARS ── */}
        <div className="db-section-grid">
          {sections.map(sec => {
            const s = getSectionStats(sec.topics);
            return (
              <div key={sec.id} className="db-section-card" style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 10,
                padding: '0.875rem 1rem 0.875rem 1.25rem',
                border: '1px solid #16243a',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                {/* accent line on left */}
                <span style={{
                  position: 'absolute', left: 0, top: '15%', bottom: '15%',
                  width: 2, borderRadius: 100,
                  background: `linear-gradient(180deg, ${sec.accent}00, ${sec.accent}, ${sec.accent}00)`,
                }} />

                {/* top row: icon+title left, badge right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span>{sec.icon}</span>
                    <span>{sec.title}</span>
                  </span>
                  <span style={{
                    fontSize: '0.6rem', color: sec.accent,
                    fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                    background: `${sec.accent}14`, border: `1px solid ${sec.accent}30`,
                    borderRadius: 6, padding: '2px 7px', flexShrink: 0, whiteSpace: 'nowrap',
                  }}>
                    {s.done}/{s.total}
                  </span>
                </div>

                {/* progress bar */}
                <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${s.pct}%`,
                    background: `linear-gradient(90deg, ${sec.accent}, #4361ee)`,
                    borderRadius: 100,
                    transition: 'width 0.7s cubic-bezier(0.23,1,0.32,1)',
                    boxShadow: `0 0 6px ${sec.accent}60`,
                  }} />
                </div>

                {/* pct label */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fontWeight: 700,
                    color: s.pct === 100 ? '#00f5d4' : s.pct > 0 ? sec.accent : '#374151',
                  }}>
                    {s.pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
