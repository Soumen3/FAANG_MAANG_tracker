import TopicCard from './TopicCard';

export default function SectionView({ sections, statuses, notes, ratings, subtopicStatuses, setStatus, setNote, setRating, setSubtopicStatus, filterStatus }) {
  const filteredSections = sections.map(sec => ({
    ...sec,
    topics: filterStatus === 'all'
      ? sec.topics
      : sec.topics.filter(t => {
          const s = statuses[t.id] || 'not_started';
          return s === filterStatus;
        }),
  })).filter(sec => sec.topics.length > 0);

  if (filteredSections.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
        // No topics match this filter.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem' }}>
      {filteredSections.map(sec => (
        <div key={sec.id} id={sec.id} style={{ marginBottom: '4rem' }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
            {/* index badge */}
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.62rem', fontWeight: 700,
              color: sec.accent,
              background: `${sec.accent}12`,
              border: `1px solid ${sec.accent}40`,
              padding: '3px 10px', borderRadius: 4,
              letterSpacing: '0.14em', flexShrink: 0,
            }}>{sec.num}</span>

            {/* icon */}
            <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>{sec.icon}</span>

            {/* title — clash display / wide caps */}
            <h2 style={{
              margin: 0,
              fontFamily: '"Syne", "Clash Display", ui-sans-serif, sans-serif',
              fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: `linear-gradient(90deg, #e2e8f0 0%, ${sec.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}>{sec.title}</h2>

            {/* divider */}
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${sec.accent}50, transparent)`, minWidth: 20 }} />
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {sec.topics.map((topic, i) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                status={statuses[topic.id]}
                note={notes[topic.id]}
                rating={ratings[topic.id]}
                subtopicStatuses={subtopicStatuses}
                onStatusChange={(s) => setStatus(topic.id, s)}
                onNoteChange={(n) => setNote(topic.id, n)}
                onRatingChange={(r) => setRating(topic.id, r)}
                onSubtopicToggle={(key, s) => setSubtopicStatus(key, s)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
