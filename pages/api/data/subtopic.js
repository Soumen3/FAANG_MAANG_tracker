import { readData, writeData } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();
  try {
    const { key, status } = req.body;
    if (!key) return res.status(400).json({ error: 'key required' });
    const data = readData();
    data.subtopicStatuses[key] = status;
    writeData(data);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
