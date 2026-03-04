import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'userdata.json');

const EMPTY = {
  statuses: {},
  notes: {},
  ratings: {},
  subtopicStatuses: {},
  timelineChecked: {},
  problems: [],
  interviews: [],
  meta: { lastUpdated: null, version: '1.0.0' },
};

export function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeData(EMPTY);
      return EMPTY;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

export function writeData(data) {
  const payload = {
    ...data,
    meta: { ...data.meta, lastUpdated: new Date().toISOString() },
  };
  // Write atomically — write to temp file then rename, prevents corruption
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), 'utf8');
  fs.renameSync(tmp, DATA_FILE);
  return payload;
}

export function mergeData(patch) {
  const current = readData();
  return writeData({ ...current, ...patch });
}
