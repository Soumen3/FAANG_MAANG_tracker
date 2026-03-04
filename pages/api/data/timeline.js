import { readData, writeData } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();
  try {
    const { index, checked } = req.body;
    const data = readData();
    data.timelineChecked[index] = checked;
    writeData(data);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
