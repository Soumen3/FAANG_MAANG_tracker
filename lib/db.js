import { connectDB } from './mongoose';
import TrackerData from './models/TrackerData';

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

export async function readData() {
  await connectDB();
  const doc = await TrackerData.findOne({ userId: 'default' }).lean();
  if (!doc) return { ...EMPTY };
  const { _id, __v, userId, ...data } = doc;
  return { ...EMPTY, ...data };
}

export async function writeData(data) {
  await connectDB();
  const payload = {
    ...data,
    meta: { ...data.meta, lastUpdated: new Date().toISOString() },
  };
  await TrackerData.findOneAndUpdate(
    { userId: 'default' },
    { $set: payload },
    { upsert: true, new: true }
  );
  return payload;
}

export async function mergeData(patch) {
  const current = await readData();
  return writeData({ ...current, ...patch });
}
