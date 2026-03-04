import { TIMELINE } from '../lib/roadmap';

export default function TimelineView({ timelineChecked, setTimelineChecked }) {
  const toggle = (i) => setTimelineChecked(i, !timelineChecked[i]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#00f5d4', letterSpacing: '0.15em', marginBottom: 8 }}>// 24-WEEK BATTLE PLAN</div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Study Timeline</h2>
        <p style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', marginTop: 8 }}>
          {Object.values(timelineChecked).filter(Boolean).length} / {TIMELINE.length} weeks completed
        </p>
      </div>

      <div style={{ position: 'relative', paddingLeft: '2.2rem' }}>
        <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #00f5d4, #4361ee, #f72585, transparent)' }} />

        {TIMELINE.map((item, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: '2rem', opacity: timelineChecked[i] ? 0.55 : 1, transition: 'opacity 0.3s' }}>
            <div
              onClick={() => toggle(i)}
              style={{ position: 'absolute', left: -2.05 * 16, top: 8, width: 14, height: 14, borderRadius: '50%', background: timelineChecked[i] ? '#34d399' : item.color, border: '3px solid #050810', boxShadow: `0 0 12px ${timelineChecked[i] ? '#34d399' : item.color}`, transition: 'all 0.3s', cursor: 'pointer', zIndex: 1 }}
            />
            <div style={{ background: '#111827', border: `1px solid ${timelineChecked[i] ? 'rgba(52,211,153,0.3)' : '#1e2d45'}`, borderRadius: 12, padding: '1.25rem 1.5rem', borderLeft: `3px solid ${timelineChecked[i] ? '#34d399' : item.color}`, transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: item.color, letterSpacing: '0.1em', marginBottom: 4 }}>{item.week}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, textDecoration: timelineChecked[i] ? 'line-through' : 'none', color: timelineChecked[i] ? '#64748b' : '#e2e8f0' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
                <button onClick={() => toggle(i)}
                  style={{ marginLeft: '1rem', width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: timelineChecked[i] ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${timelineChecked[i] ? 'rgba(52,211,153,0.4)' : '#1e2d45'}`, color: timelineChecked[i] ? '#34d399' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                  {timelineChecked[i] ? '✓' : '○'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
