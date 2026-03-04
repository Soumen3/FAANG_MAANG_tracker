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
        <title>FAANG Roadmap Tracker</title>
        <meta name="description" content="Track your FAANG/MAANG interview preparation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,212,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,245,212,0.04) 0%,transparent 70%)', top: -150, left: -150, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(247,37,133,0.04) 0%,transparent 70%)', bottom: 0, right: -100, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'relative', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(5,8,16,0.97)' : 'rgba(5,8,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30,45,69,0.6)',
        transition: 'background 0.3s',
      }}>
        {/* Main nav row */}
        <div style={{ padding: isMobile ? '0 0.75rem' : '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', overflow: 'hidden' }}>
          {/* Logo */}
          <div style={{ fontWeight: 800, fontSize: isMobile ? '0.88rem' : '1rem', letterSpacing: '-0.02em', flexShrink: 0, minWidth: 0 }}>
            <span style={{ background: 'linear-gradient(135deg,#00f5d4,#4361ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CRACK it</span>
            <span style={{ color: '#64748b', fontWeight: 400 }}> tracker</span>
          </div>

          {/* Desktop Tabs */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
                  padding: '6px 14px', border: 'none', cursor: 'pointer',
                  background: activeTab === tab.id ? 'rgba(0,245,212,0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#00f5d4' : '#64748b',
                  fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.82rem',
                  display: 'flex', alignItems: 'center', gap: 5,
                  borderBottom: activeTab === tab.id ? '2px solid #00f5d4' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0', transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                  <span>{tab.icon}</span><span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Desktop Right side */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: saveIndicator.color, transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: 5 }}>
                {saveStatus === 'saving' && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', animation: 'pulse 0.8s ease infinite', display: 'inline-block' }} />
                )}
                {saveIndicator.label}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }} title="Data stored in data/userdata.json">
                <span>📄</span> userdata.json
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#64748b' }}>
                <span style={{ color: '#00f5d4', fontWeight: 700 }}>{stats.done}</span>/{stats.total} done
              </div>
              {formattedTime && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#374151' }}>
                  {formattedTime}
                </div>
              )}
              <button onClick={() => setShowReset(true)} style={{
                padding: '5px 12px', background: 'transparent',
                border: '1px solid #1e2d45', borderRadius: 8,
                color: '#64748b', fontSize: '0.72rem',
                fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d45'; e.currentTarget.style.color = '#64748b'; }}>
                Reset
              </button>
            </div>
          )}

          {/* Mobile: save indicator + hamburger */}
          {isMobile && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: saveIndicator.color, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                {saveStatus === 'saving'
                  ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', animation: 'pulse 0.8s ease infinite', display: 'inline-block' }} />
                  : <span>{saveIndicator.label}</span>
                }
              </div>
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
                style={{
                  background: 'transparent', border: '1px solid #1e2d45',
                  borderRadius: 8, cursor: 'pointer', padding: '7px 10px',
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

        {/* Mobile dropdown menu */}
        {isMobile && menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(30,45,69,0.6)',
            background: 'rgba(5,8,16,0.98)',
            padding: '0.75rem 1.25rem 1rem',
          }}>
            {/* Tab buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: '0.75rem' }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
                  padding: '10px 12px', border: `1px solid ${activeTab === tab.id ? '#00f5d4' : '#1e2d45'}`,
                  borderRadius: 10, cursor: 'pointer',
                  background: activeTab === tab.id ? 'rgba(0,245,212,0.1)' : 'rgba(255,255,255,0.02)',
                  color: activeTab === tab.id ? '#00f5d4' : '#94a3b8',
                  fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.82rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  transition: 'all 0.2s',
                }}>
                  <span>{tab.icon}</span><span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Stats + actions row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid #1e2d45' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#64748b' }}>
                <span style={{ color: '#00f5d4', fontWeight: 700 }}>{stats.done}</span>/{stats.total} done
                {formattedTime && (
                  <span style={{ marginLeft: 8, color: '#374151' }}>· {formattedTime}</span>
                )}
              </div>
              <button onClick={() => { setShowReset(true); setMenuOpen(false); }} style={{
                padding: '5px 14px', background: 'transparent',
                border: '1px solid #1e2d45', borderRadius: 8,
                color: '#64748b', fontSize: '0.72rem',
                fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
              }}>Reset</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── RESET MODAL ────────────────────────────────────────────────────── */}
      {showReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div style={{ background: '#111827', border: '1px solid #f87171', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '100%', textAlign: 'center' }}>
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
                style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #1e2d45', borderRadius: 8, color: '#64748b', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 60, position: 'relative', zIndex: 1 }}>

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
                THE COMPLETE FAANG/MAANG PREP TRACKER
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: '1rem' }}>
                <span style={{ display: 'block', color: '#e2e8f0' }}>CRACK</span>
                <span style={{ display: 'block', background: 'linear-gradient(135deg,#00f5d4 0%,#4361ee 50%,#f72585 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FAANG/MAANG</span>
              </h1>
              <p style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', lineHeight: 1.8, fontWeight: 300 }}>
                Every change auto-saves to <code style={{ color: '#00f5d4' }}>data/userdata.json</code> inside the project.
                Open from anywhere on the same server — data is always up to date.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                {[['Meta','#1877f2'],['Amazon','#ff9900'],['Apple','#a2aaad'],['Netflix','#e50914'],['Google','#4285f4'],['Microsoft','#00a4ef']].map(([name, color]) => (
                  <span key={name} style={{ padding: '4px 14px', borderRadius: 100, border: `1px solid ${color}50`, background: `${color}10`, color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em' }}>{name}</span>
                ))}
              </div>
            </div>

            {/* Dashboard */}
            <Dashboard stats={stats} sections={SECTIONS} getSectionStats={getSectionStats} />

            {/* Filter bar */}
            <div style={{ background: '#0c1020', borderBottom: '1px solid #1e2d45', padding: '0.75rem 2rem', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', position: 'sticky', top: 60, zIndex: 40 }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginRight: 4 }}>FILTER:</span>
              {STATUS_FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilterStatus(f.id)} style={{
                  padding: '4px 12px', borderRadius: 100,
                  border: `1px solid ${filterStatus === f.id ? '#00f5d4' : '#1e2d45'}`,
                  background: filterStatus === f.id ? 'rgba(0,245,212,0.1)' : 'transparent',
                  color: filterStatus === f.id ? '#00f5d4' : '#64748b',
                  fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {f.label}
                  {f.id !== 'all' && (
                    <span style={{ marginLeft: 5, opacity: 0.7 }}>({
                      f.id === 'not_started' ? stats.notStarted :
                      f.id === 'in_progress' ? stats.inProgress :
                      f.id === 'done'        ? stats.done :
                      f.id === 'review'      ? stats.review : stats.skipped
                    })</span>
                  )}
                </button>
              ))}
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

        <footer style={{ borderTop: '1px solid #1e2d45', padding: '1.5rem 2rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#64748b' }}>
          Built for engineers who refuse to settle.
          <span style={{ color: '#00f5d4' }}> // Data lives in data/userdata.json</span>
        </footer>
      </div>
    </>
  );
}
