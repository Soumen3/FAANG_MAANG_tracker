import { readData, writeData } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();
  try {
    const { topicId, status } = req.body;
    if (!topicId) return res.status(400).json({ error: 'topicId required' });
    const data = readData();
    data.statuses[topicId] = status;
    writeData(data);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
