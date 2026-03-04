import { readData, writeData } from '../../../lib/db';

export default function handler(req, res) {
  try {
    const data = readData();

    if (req.method === 'POST') {
      const interview = { ...req.body, id: Date.now() };
      data.interviews = [interview, ...data.interviews];
      writeData(data);
      return res.status(200).json({ ok: true, interview });
    }

    if (req.method === 'PATCH') {
      const { id, ...changes } = req.body;
      data.interviews = data.interviews.map(i =>
        i.id === Number(id) ? { ...i, ...changes } : i
      );
      writeData(data);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      data.interviews = data.interviews.filter(i => i.id !== Number(id));
      writeData(data);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
