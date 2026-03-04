import { useState, useEffect } from 'react';
import Head from 'next/head';
import { SECTIONS } from '../lib/roadmap';
import { useProgress } from '../hooks/useProgress';
import { readData } from '../lib/db';
import Dashboard from '../components/Dashboard';
import SectionView from '../components/SectionView';
import TimelineView from '../components/TimelineView';
import ProblemLog from '../components/ProblemLog';
import InterviewTracker from '../components/InterviewTracker';

const TABS = [
  { id: 'roadmap',    label: 'Roadmap',    icon: '🗺️' },
  { id: 'timeline',   label: 'Timeline',   icon: '📅' },
  { id: 'problems',   label: 'Problems',   icon: '⚡' },
  { id: 'interviews', label: 'Interviews', icon: '🏢' },
];

const STATUS_FILTERS = [
  { id: 'all',         label: 'All' },
  { id: 'not_started', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done',        label: 'Done' },
  { id: 'review',      label: 'Review' },
  { id: 'skipped',     label: 'Skipped' },
];

const BRANDS = [
  { name: 'Meta',      color: '#1877F2', logo: '/brands/META.svg'  },
  { name: 'Alphabet',  color: '#4285F4', logo: '/brands/GOOG.svg'  },
  { name: 'Microsoft', color: '#00A4EF', logo: '/brands/MSFT.svg'  },
  { name: 'Amazon',    color: '#FF9900', logo: '/brands/AMZN.svg'  },
  { name: 'Apple',     color: '#A2AAAD', logo: '/brands/AAPL.svg'  },
];

// ── getServerSideProps: read the JSON file on the server before page loads ───
// This means the page arrives pre-filled — no loading spinner needed
export async function getServerSideProps() {
  const initialData = readData();
  return { props: { initialData } };
}

export default function Home({ initialData }) {
  const [activeTab,    setActiveTab]    = useState('roadmap');
  const [filterStatus, setFilterStatus] = useState('all');
  const [scrolled,     setScrolled]     = useState(false);
  const [showReset,    setShowReset]    = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);

  const {
    statuses, notes, ratings, subtopicStatuses, timelineChecked,
    problems, interviews, meta, saveStatus,
    setStatus, setNote, setRating, setSubtopicStatus, setTimelineChecked,
    addProblem, updateProblem, deleteProblem,
    addInterview, updateInterview, deleteInterview,
    resetAll, getStats, getSectionStats,
  } = useProgress(SECTIONS, initialData);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Client-side only time string — avoids server/client toLocaleTimeString mismatch
  const [formattedTime, setFormattedTime] = useState('');
  useEffect(() => {
    if (meta?.lastUpdated) {
      setFormattedTime(new Date(meta.lastUpdated).toLocaleTimeString());
    }
  }, [meta?.lastUpdated]);

  // Close mobile menu when tab changes
  const handleTabChange = (id) => { setActiveTab(id); setMenuOpen(false); };

  const stats = getStats();

  const saveIndicator = {
    saving: { label: '● Saving…', color: '#fbbf24' },
    saved:  { label: '✓ Saved',   color: '#34d399' },
    error:  { label: '✕ Error',   color: '#f87171' },
  }[saveStatus];

  return (
    <>
      <Head>
        <title>MAMAA Roadmap Tracker</title>
        <meta name="description" content="Track your MAMAA interview preparation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,212,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,245,212,0.04) 0%,transparent 70%)', top: -150, left: -150, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(247,37,133,0.04) 0%,transparent 70%)', bottom: 0, right: -100, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(2,4,8,0.97)' : 'rgba(3,5,12,0.82)',
        backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${scrolled ? '#16243a' : 'rgba(22,36,58,0.5)'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        {/* Main nav row */}
        <div style={{
          padding: isMobile ? '0 1rem' : '0 2rem',
          height: isMobile ? 56 : 64,
          maxWidth: 1300, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1.5rem',
          overflow: 'hidden',
        }}>

          {/* ── Logo ── */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg,#00f5d4 0%,#4361ee 100%)',
              fontSize: '0.75rem', fontWeight: 900, color: '#020408',
              fontFamily: 'Syne, sans-serif', flexShrink: 0,
            }}>M</span>
            <div style={{ lineHeight: 1 }}>
              <div style={{
                fontWeight: 900, fontSize: isMobile ? '0.9rem' : '1.05rem',
                letterSpacing: '0.06em',
                background: 'linear-gradient(90deg,#00f5d4,#4361ee)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                fontFamily: 'Syne, sans-serif',
              }}>MAMAA</div>
              {!isMobile && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#374151', letterSpacing: '0.14em', marginTop: 1 }}>
                  TRACKER_v2
                </div>
              )}
            </div>
          </div>

          {/* ── vertical divider ── */}
          {!isMobile && <span style={{ width: 1, height: 28, background: '#16243a', flexShrink: 0 }} />}

          {/* ── Desktop Tabs ── */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {TABS.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
                    padding: '6px 16px', cursor: 'pointer',
                    background: active ? 'rgba(0,245,212,0.08)' : 'transparent',
                    color: active ? '#00f5d4' : '#475569',
                    fontFamily: 'Syne, sans-serif', fontWeight: active ? 700 : 500,
                    fontSize: '0.8rem', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: 7,
                    border: `1px solid ${active ? 'rgba(0,245,212,0.25)' : 'transparent'}`,
                    borderRadius: 8, transition: 'all 0.18s', whiteSpace: 'nowrap',
                    boxShadow: active ? '0 0 12px rgba(0,245,212,0.1)' : 'none',
                  }}>
                    <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── spacer ── */}
          <div style={{ flex: 1 }} />

          {/* ── Desktop Right side ── */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>

              {/* save status badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem',
                color: saveIndicator.color,
                background: `${saveIndicator.color}12`,
                border: `1px solid ${saveIndicator.color}25`,
                borderRadius: 20, padding: '3px 10px',
                transition: 'all 0.3s',
              }}>
                {saveStatus === 'saving'
                  ? <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fbbf24', animation: 'pulse 0.8s ease infinite', display: 'inline-block' }} />
                  : <span style={{ fontSize: '0.7rem' }}>{saveStatus === 'saved' ? '✓' : '✕'}</span>
                }
                {saveIndicator.label.replace('● ', '').replace('✓ ', '').replace('✕ ', '')}
              </div>

              {/* vertical divider */}
              <span style={{ width: 1, height: 20, background: '#16243a' }} />

              {/* progress counter */}
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
                color: '#475569', display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 10px',
                border: '1px solid #16243a', borderRadius: 20,
                background: 'rgba(255,255,255,0.02)',
              }}>
                <span style={{ color: '#00f5d4', fontWeight: 700 }}>{stats.done}</span>
                <span style={{ color: '#374151' }}>/</span>
                <span>{stats.total}</span>
              </div>

              {/* file hint */}
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem',
                color: '#2a3a52', display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 6,
              }} title="Data stored in data/userdata.json">
                <span>📄</span> userdata.json
              </div>

              {formattedTime && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#2a3a52' }}>
                  {formattedTime}
                </div>
              )}

              {/* vertical divider */}
              <span style={{ width: 1, height: 20, background: '#16243a' }} />

              {/* Reset button */}
              <button onClick={() => setShowReset(true)} style={{
                padding: '5px 14px',
                background: 'transparent',
                border: '1px solid #16243a',
                borderRadius: 8,
                color: '#475569', fontSize: '0.7rem',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer', transition: 'all 0.18s',
                letterSpacing: '0.06em',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#16243a'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}>
                RESET
              </button>
            </div>
          )}

          {/* ── Mobile: save dot + hamburger ── */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: saveIndicator.color,
                boxShadow: `0 0 6px ${saveIndicator.color}80`,
                animation: saveStatus === 'saving' ? 'pulse 0.8s ease infinite' : 'none',
              }} />
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
                style={{
                  background: menuOpen ? 'rgba(0,245,212,0.06)' : 'transparent',
                  border: `1px solid ${menuOpen ? 'rgba(0,245,212,0.3)' : '#16243a'}`,
                  borderRadius: 8, cursor: 'pointer', padding: '8px 10px',
                  color: menuOpen ? '#00f5d4' : '#64748b',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ display: 'block', width: 18, height: 2, background: 'currentColor', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
                <span style={{ display: 'block', width: 18, height: 2, background: 'currentColor', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'all 0.25s' }} />
                <span style={{ display: 'block', width: 18, height: 2, background: 'currentColor', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile dropdown menu ── */}
        {isMobile && menuOpen && (
          <div style={{
            borderTop: '1px solid #16243a',
            background: 'rgba(2,4,8,0.99)',
            padding: '1rem',
          }}>
            {/* Tab buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: '0.875rem' }}>
              {TABS.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
                    padding: '10px 12px',
                    border: `1px solid ${active ? 'rgba(0,245,212,0.3)' : '#16243a'}`,
                    borderRadius: 10, cursor: 'pointer',
                    background: active ? 'rgba(0,245,212,0.08)' : 'rgba(255,255,255,0.02)',
                    color: active ? '#00f5d4' : '#64748b',
                    fontFamily: 'Syne, sans-serif', fontWeight: active ? 700 : 500,
                    fontSize: '0.8rem', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'all 0.18s',
                    boxShadow: active ? '0 0 10px rgba(0,245,212,0.1)' : 'none',
                  }}>
                    <span>{tab.icon}</span><span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Stats + actions row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #16243a', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
                  padding: '3px 10px', border: '1px solid #16243a', borderRadius: 20,
                  background: 'rgba(255,255,255,0.02)', color: '#475569',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ color: '#00f5d4', fontWeight: 700 }}>{stats.done}</span>/{stats.total}
                </div>
                {formattedTime && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#2a3a52' }}>{formattedTime}</span>
                )}
              </div>
              <button onClick={() => { setShowReset(true); setMenuOpen(false); }} style={{
                padding: '5px 14px', background: 'transparent',
                border: '1px solid #16243a', borderRadius: 8,
                color: '#475569', fontSize: '0.68rem', letterSpacing: '0.06em',
                fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
              }}>RESET</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── RESET MODAL ────────────────────────────────────────────────────── */}
      {showReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div style={{ background: '#07091a', border: '1px solid #f87171', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Reset All Progress?</div>
            <div style={{ color: '#64748b', fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              This will clear all data in <code style={{ color: '#00f5d4' }}>data/userdata.json</code>. Cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={async () => { await resetAll(); setShowReset(false); }}
                style={{ padding: '9px 20px', background: '#f87171', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer' }}>
                Yes, Reset
              </button>
              <button onClick={() => setShowReset(false)}
                style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #16243a', borderRadius: 8, color: '#64748b', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── ROADMAP TAB ── */}
        {activeTab === 'roadmap' && (
          <>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '3rem 2rem 1.5rem', margin: '0 auto' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#00f5d4',
                letterSpacing: '0.15em', marginBottom: '1rem',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: '1px solid rgba(0,245,212,0.2)', padding: '5px 14px',
                borderRadius: 100, background: 'rgba(0,245,212,0.05)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f5d4', display: 'inline-block', animation: 'pulse 1.5s ease infinite' }} />
                THE COMPLETE MAMAA PREP TRACKER
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: '1rem' }}>
                <span style={{ display: 'block', color: '#e2e8f0' }}>CRACK</span>
                <span style={{ display: 'block', background: 'linear-gradient(135deg,#00f5d4 0%,#4361ee 50%,#f72585 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MAMAA</span>
              </h1>
              <p style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', lineHeight: 1.8, fontWeight: 300 }}>
                Every change auto-saves to <code style={{ color: '#00f5d4' }}>data/userdata.json</code> inside the project.
                Open from anywhere on the same server — data is always up to date.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                {BRANDS.map(({ name, color, logo }) => (
                  <span key={name} style={{
                    padding: '5px 14px', borderRadius: 100,
                    border: `1px solid ${color}60`, background: `${color}15`, color,
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt={name}
                      width={14} height={14}
                      style={{ display: 'block', flexShrink: 0 }}
                    />
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Dashboard */}
            <Dashboard stats={stats} sections={SECTIONS} getSectionStats={getSectionStats} />

            {/* Filter bar */}
            <div style={{
              background: 'linear-gradient(180deg, #060a14 0%, #04070f 100%)',
              borderBottom: '1px solid #16243a',
              padding: '0.75rem 2rem',
            }}>
              <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {/* label */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.6rem', color: '#374151',
                  letterSpacing: '0.14em', flexShrink: 0,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: 1, background: '#00f5d4', display: 'inline-block', opacity: 0.7 }} />
                  FILTER_BY
                </div>

                {/* divider */}
                <span style={{ width: 1, height: 16, background: '#16243a', flexShrink: 0 }} />

                {/* filter buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {STATUS_FILTERS.map(f => {
                    const active = filterStatus === f.id;
                    return (
                      <button key={f.id} onClick={() => setFilterStatus(f.id)} style={{
                        padding: '4px 12px',
                        borderRadius: 100,
                        border: `1px solid ${active ? '#00f5d4' : '#16243a'}`,
                        background: active ? 'rgba(0,245,212,0.08)' : 'rgba(255,255,255,0.02)',
                        color: active ? '#00f5d4' : '#475569',
                        fontSize: '0.68rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: active ? 700 : 400,
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        boxShadow: active ? '0 0 8px rgba(0,245,212,0.15)' : 'none',
                      }}>
                        {active && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00f5d4', flexShrink: 0, display: 'inline-block' }} />}
                        {f.label}
                        {f.id !== 'all' && (
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.58rem',
                            color: active ? '#00f5d4' : '#374151',
                            background: active ? 'rgba(0,245,212,0.12)' : '#16243a',
                            borderRadius: 4, padding: '0 5px',
                          }}>
                            {f.id === 'not_started' ? stats.notStarted :
                             f.id === 'in_progress' ? stats.inProgress :
                             f.id === 'done'        ? stats.done :
                             f.id === 'review'      ? stats.review : stats.skipped}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* right: total count */}
                <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#374151', flexShrink: 0 }}>
                  <span style={{ color: '#00f5d4' }}>{stats.total}</span> topics
                </div>
              </div>
            </div>

            <SectionView
              sections={SECTIONS}
              statuses={statuses} notes={notes} ratings={ratings}
              subtopicStatuses={subtopicStatuses}
              setStatus={setStatus} setNote={setNote}
              setRating={setRating} setSubtopicStatus={setSubtopicStatus}
              filterStatus={filterStatus}
            />
          </>
        )}

        {activeTab === 'timeline' && (
          <TimelineView timelineChecked={timelineChecked} setTimelineChecked={setTimelineChecked} />
        )}

        {activeTab === 'problems' && (
          <ProblemLog
            problems={problems}
            addProblem={addProblem}
            updateProblem={updateProblem}
            deleteProblem={deleteProblem}
          />
        )}

        {activeTab === 'interviews' && (
          <InterviewTracker
            interviews={interviews}
            addInterview={addInterview}
            updateInterview={updateInterview}
            deleteInterview={deleteInterview}
          />
        )}

        <footer style={{ borderTop: '1px solid #16243a', padding: '1.5rem 2rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#64748b' }}>
          Built for engineers who refuse to settle.
          <span style={{ color: '#00f5d4' }}> // Data lives in data/userdata.json</span>
        </footer>
      </div>
    </>
  );
}
