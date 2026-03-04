import { STATUS_CONFIG } from '../lib/roadmap';

export default function Dashboard({ stats, sections, getSectionStats }) {
  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div style={{ background: '#0c1020', borderBottom: '1px solid #1e2d45', padding: '2rem', top: 60, zIndex: 50 }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* Overall progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Overall Progress</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00f5d4', fontSize: '0.9rem', fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: 'linear-gradient(90deg, #00f5d4, #4361ee, #f72585)',
                borderRadius: 100, transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1)',
              }} />
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'done', label: 'Done', val: stats.done },
              { key: 'in_progress', label: 'In Progress', val: stats.inProgress },
              { key: 'review', label: 'Review', val: stats.review },
              { key: 'not_started', label: 'Remaining', val: stats.notStarted },
            ].map(({ key, label, val }) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: STATUS_CONFIG[key].color }}>{val}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-section bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {sections.map(sec => {
            const s = getSectionStats(sec.topics);
            return (
              <div key={sec.id} style={{ background: '#111827', borderRadius: 10, padding: '0.75rem 1rem', border: '1px solid #1e2d45' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{sec.icon} {sec.title}</span>
                  <span style={{ fontSize: '0.7rem', color: sec.accent, fontFamily: 'JetBrains Mono, monospace' }}>{s.done}/{s.total}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: `linear-gradient(90deg, ${sec.accent}, #4361ee)`, borderRadius: 100, transition: 'width 0.6s cubic-bezier(0.23,1,0.32,1)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
