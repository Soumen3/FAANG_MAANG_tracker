# 🚀 MAMAA Roadmap Tracker — Next.js

Built with **Next.js + JavaScript**. No external database. No cloud service. All your data lives in `data/userdata.json` inside the project folder — read and written directly by Next.js API routes.

---

## 🏗️ Project Structure

```
mamaa-nextjs/
├── pages/
│   ├── index.js              ← Main app (React UI)
│   ├── _app.js               ← Global styles
│   ├── _document.js          ← HTML head / fonts
│   └── api/
│       └── data/
│           ├── index.js      ← GET all data | POST reset
│           ├── status.js     ← PATCH topic status
│           ├── note.js       ← PATCH topic note
│           ├── rating.js     ← PATCH confidence rating
│           ├── subtopic.js   ← PATCH subtopic checkbox
│           ├── timeline.js   ← PATCH timeline week
│           ├── problems.js   ← POST/PATCH/DELETE problems
│           └── interviews.js ← POST/PATCH/DELETE interviews
├── components/               ← All React UI components
├── hooks/
│   └── useProgress.js        ← State + API calls
├── lib/
│   ├── db.js                 ← fs.readFileSync / writeFileSync
│   └── roadmap.js            ← All topic/subtopic content
├── data/
│   └── userdata.json         ← ✅ YOUR DATA LIVES HERE
└── styles/
    └── globals.css
```

---

## ⚡ How It Works

```
Browser click → /api/data/status (Next.js API route) → lib/db.js → data/userdata.json
```

1. User clicks "Mark as Done" on a topic
2. React sends `PATCH /api/data/status`
3. Next.js API route calls `lib/db.js → writeData()`
4. `writeData()` uses Node.js `fs.writeFileSync()` to update `data/userdata.json`
5. Nav shows ✓ Saved

On page load, `getServerSideProps` reads the JSON file **on the server** before sending HTML — so the page arrives fully populated, zero loading flash.

---

## 🏃 Quick Start

```bash
# 1. Install
npm install

# 2. Run dev server
npm run dev

# 3. Open http://localhost:3000
```

That's it. Data saves to `data/userdata.json` automatically.

---

## 🌐 Deploying

### Railway (Recommended — persistent filesystem ✅)
```bash
# Push to GitHub, then connect repo on railway.app
# Set start command: npm start
# Set build command: npm run build
```

### Render (Free tier — persistent filesystem ✅)
```bash
# Connect GitHub repo on render.com
# Build command: npm install && npm run build
# Start command: npm start
```

### Your own VPS / server ✅
```bash
npm install
npm run build
npm start          # runs on port 3000

# Or with PM2:
pm2 start npm --name "mamaa-tracker" -- start
```

### ⚠️ Vercel / Netlify — file writes DON'T persist
These platforms use serverless/edge functions with read-only filesystems.
Use Railway or Render instead.

---

## 📁 The Data File

`data/userdata.json` is plain JSON — you can open it anytime:

```json
{
  "statuses": {
    "arrays": "done",
    "graphs": "in_progress"
  },
  "notes": {
    "dp": "Struggled with bitmask DP — revisit Striver video"
  },
  "ratings": { "arrays": 5 },
  "subtopicStatuses": {
    "arrays::Two Pointer Technique": "done"
  },
  "timelineChecked": { "0": true, "1": true },
  "problems": [
    { "id": 1706789012, "name": "Two Sum", "difficulty": "Easy", "solved": true }
  ],
  "interviews": [
    { "id": 1706789013, "company": "Google", "round": "Technical Round 1", "outcome": "Cleared" }
  ],
  "meta": { "lastUpdated": "2026-03-04T10:30:00.000Z", "version": "1.0.0" }
}
```

**Backup:** just copy the file. **Restore:** paste it back.

---

## 🔌 API Reference

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/data` | — | Load all data |
| POST | `/api/data` | `{ action: 'reset' }` | Reset everything |
| PATCH | `/api/data/status` | `{ topicId, status }` | Update topic status |
| PATCH | `/api/data/note` | `{ topicId, note }` | Update topic note |
| PATCH | `/api/data/rating` | `{ topicId, rating }` | Update confidence rating |
| PATCH | `/api/data/subtopic` | `{ key, status }` | Toggle subtopic |
| PATCH | `/api/data/timeline` | `{ index, checked }` | Check/uncheck week |
| POST | `/api/data/problems` | problem object | Add a problem |
| PATCH | `/api/data/problems` | `{ id, ...changes }` | Update a problem |
| DELETE | `/api/data/problems` | `{ id }` | Delete a problem |
| POST | `/api/data/interviews` | interview object | Add interview |
| PATCH | `/api/data/interviews` | `{ id, ...changes }` | Update interview |
| DELETE | `/api/data/interviews` | `{ id }` | Delete interview |
