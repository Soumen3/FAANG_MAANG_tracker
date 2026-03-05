import { readData, writeData } from '../../../lib/db';

const EMPTY = {
  statuses: {}, notes: {}, ratings: {}, subtopicStatuses: {},
  timelineChecked: {}, problems: [], interviews: [],
  meta: { lastUpdated: null, version: '1.0.0' },
};

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await readData());
    }
    if (req.method === 'POST' && req.body?.action === 'reset') {
      const fresh = { ...EMPTY, meta: { lastUpdated: new Date().toISOString(), version: '1.0.0' } };
      await writeData(fresh);
      return res.status(200).json(fresh);
    }
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end('Method Not Allowed');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
