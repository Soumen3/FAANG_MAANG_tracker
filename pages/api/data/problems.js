import { readData, writeData } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const data = await readData();

    // POST — add new problem
    if (req.method === 'POST') {
      const problem = { ...req.body, id: Date.now() };
      data.problems = [problem, ...data.problems];
      await writeData(data);
      return res.status(200).json({ ok: true, problem });
    }

    // PATCH — update problem (toggle solved, edit fields)
    if (req.method === 'PATCH') {
      const { id, ...changes } = req.body;
      data.problems = data.problems.map(p =>
        p.id === Number(id) ? { ...p, ...changes } : p
      );
      await writeData(data);
      return res.status(200).json({ ok: true });
    }

    // DELETE — remove a problem
    if (req.method === 'DELETE') {
      const { id } = req.body;
      data.problems = data.problems.filter(p => p.id !== Number(id));
      await writeData(data);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
    res.status(405).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
