import { readData, writeData } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();
  try {
    const { topicId, note } = req.body;
    if (!topicId) return res.status(400).json({ error: 'topicId required' });
    const data = readData();
    data.notes[topicId] = note;
    writeData(data);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
