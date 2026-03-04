import { useState, useEffect, useCallback, useRef } from 'react';

// All API calls go to /api/data/* which reads/writes data/userdata.json
async function api(url, method = 'GET', body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Debounce — delay writes while user is still typing notes
function useDebounce(fn, ms) {
  const t = useRef(null);
  return useCallback((...args) => {
    clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), ms);
  }, [fn, ms]);
}

const EMPTY = {
  statuses: {}, notes: {}, ratings: {}, subtopicStatuses: {},
  timelineChecked: {}, problems: [], interviews: [],
  meta: { lastUpdated: null },
};

export function useProgress(sections, initialData) {
  const [data, setData]         = useState(initialData || EMPTY);
  const [loading, setLoading]   = useState(!initialData);
  const [saveStatus, setSave]   = useState('saved');
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  // ── Load from JSON file on mount ──────────────────────────────────────────
  useEffect(() => {
    if (initialData) return; // already pre-loaded via getServerSideProps
    api('/api/data')
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Optimistic update + background save ───────────────────────────────────
  const optimistic = useCallback((localUpdate, saveCall) => {
    setSave('saving');
    setData(prev => {
      const next = localUpdate(prev);
      dataRef.current = next;
      return next;
    });
    saveCall()
      .then(() => setSave('saved'))
      .catch(() => { setSave('error'); setTimeout(() => setSave('saved'), 3000); });
  }, []);

  // ── Topic status ──────────────────────────────────────────────────────────
  const setStatus = useCallback((topicId, status) => {
    optimistic(
      d => ({ ...d, statuses: { ...d.statuses, [topicId]: status } }),
      () => api('/api/data/status', 'PATCH', { topicId, status })
    );
  }, [optimistic]);

  // ── Note (instant local, debounced save) ─────────────────────────────────
  const _saveNote = useCallback((topicId, note) => {
    setSave('saving');
    api('/api/data/note', 'PATCH', { topicId, note })
      .then(() => setSave('saved'))
      .catch(() => setSave('error'));
  }, []);
  const _debouncedSave = useDebounce(_saveNote, 800);

  const setNote = useCallback((topicId, note) => {
    // Update state immediately so typing feels instant
    setData(d => {
      const next = { ...d, notes: { ...d.notes, [topicId]: note } };
      dataRef.current = next;
      return next;
    });
    _debouncedSave(topicId, note);
  }, [_debouncedSave]);

  // ── Rating ────────────────────────────────────────────────────────────────
  const setRating = useCallback((topicId, rating) => {
    optimistic(
      d => ({ ...d, ratings: { ...d.ratings, [topicId]: rating } }),
      () => api('/api/data/rating', 'PATCH', { topicId, rating })
    );
  }, [optimistic]);

  // ── Subtopic ──────────────────────────────────────────────────────────────
  const setSubtopicStatus = useCallback((key, status) => {
    optimistic(
      d => ({ ...d, subtopicStatuses: { ...d.subtopicStatuses, [key]: status } }),
      () => api('/api/data/subtopic', 'PATCH', { key, status })
    );
  }, [optimistic]);

  // ── Timeline ──────────────────────────────────────────────────────────────
  const setTimelineChecked = useCallback((index, checked) => {
    optimistic(
      d => ({ ...d, timelineChecked: { ...d.timelineChecked, [index]: checked } }),
      () => api('/api/data/timeline', 'PATCH', { index, checked })
    );
  }, [optimistic]);

  // ── Problems ──────────────────────────────────────────────────────────────
  const addProblem = useCallback(async (problem) => {
    setSave('saving');
    try {
      const { problem: saved } = await api('/api/data/problems', 'POST', problem);
      setData(d => ({ ...d, problems: [saved, ...d.problems] }));
      setSave('saved');
    } catch { setSave('error'); }
  }, []);

  const updateProblem = useCallback((id, changes) => {
    optimistic(
      d => ({ ...d, problems: d.problems.map(p => p.id === id ? { ...p, ...changes } : p) }),
      () => api('/api/data/problems', 'PATCH', { id, ...changes })
    );
  }, [optimistic]);

  const deleteProblem = useCallback((id) => {
    optimistic(
      d => ({ ...d, problems: d.problems.filter(p => p.id !== id) }),
      () => api('/api/data/problems', 'DELETE', { id })
    );
  }, [optimistic]);

  // ── Interviews ────────────────────────────────────────────────────────────
  const addInterview = useCallback(async (interview) => {
    setSave('saving');
    try {
      const { interview: saved } = await api('/api/data/interviews', 'POST', interview);
      setData(d => ({ ...d, interviews: [saved, ...d.interviews] }));
      setSave('saved');
    } catch { setSave('error'); }
  }, []);

  const updateInterview = useCallback((id, changes) => {
    optimistic(
      d => ({ ...d, interviews: d.interviews.map(i => i.id === id ? { ...i, ...changes } : i) }),
      () => api('/api/data/interviews', 'PATCH', { id, ...changes })
    );
  }, [optimistic]);

  const deleteInterview = useCallback((id) => {
    optimistic(
      d => ({ ...d, interviews: d.interviews.filter(i => i.id !== id) }),
      () => api('/api/data/interviews', 'DELETE', { id })
    );
  }, [optimistic]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetAll = useCallback(async () => {
    setSave('saving');
    const fresh = await api('/api/data', 'POST', { action: 'reset' });
    setData(fresh);
    setSave('saved');
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const getStats = useCallback(() => {
    let total = 0, done = 0, inProgress = 0, review = 0, skipped = 0;
    sections.forEach(s => s.topics.forEach(t => {
      total++;
      const st = data.statuses[t.id];
      if (st === 'done') done++;
      else if (st === 'in_progress') inProgress++;
      else if (st === 'review') review++;
      else if (st === 'skipped') skipped++;
    }));
    return { total, done, inProgress, review, skipped, notStarted: total - done - inProgress - review - skipped };
  }, [sections, data.statuses]);

  const getSectionStats = useCallback((topics) => {
    let total = topics.length, done = 0;
    topics.forEach(t => { if (data.statuses[t.id] === 'done') done++; });
    return { total, done, pct: Math.round((done / total) * 100) };
  }, [data.statuses]);

  return {
    ...data, data, loading, saveStatus,
    setStatus, setNote, setRating, setSubtopicStatus, setTimelineChecked,
    addProblem, updateProblem, deleteProblem,
    addInterview, updateInterview, deleteInterview,
    resetAll, getStats, getSectionStats,
  };
}
