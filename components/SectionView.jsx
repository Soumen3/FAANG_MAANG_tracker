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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: sec.accent, border: `1px solid ${sec.accent}50`, padding: '4px 10px', borderRadius: 4, letterSpacing: '0.12em' }}>{sec.num}</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{sec.icon}</span> {sec.title}
            </div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #1e2d45, transparent)' }} />
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
