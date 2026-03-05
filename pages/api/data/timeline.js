import { readData, writeData } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();
  try {
    const { index, checked } = req.body;
    const data = await readData();
    data.timelineChecked[index] = checked;
    await writeData(data);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
