# Mithuru Mawatha Backend API

The Node.js / Express backend service for **Mithuru Mawatha** (Friendly Road) — a community hazard and safety reporting platform for Sri Lanka.

## Features & Endpoints

- **`POST /reports/analyze`**: Smart AI report triage classifier (suggests urgency, category, and single-sentence summary from free-text descriptions).
- **`GET /stats` & `GET /reports/stats`**: Platform aggregate stats (`totalReports`, `openCount`, `inProgressCount`, `resolvedCount`).
- **`GET /reports`**: List and filter reports (supports `category`, `status`, and `search` query parameters).
- **`POST /reports`**: Submit new hazard and safety reports.
- **`GET /reports/:id`**: Get details of a single report.
- **`PATCH /reports/:id/status`**: Update report status (`Open` → `In Progress` → `Resolved`).
- **`POST /reports/:id/upvote`**: Upvote/confirm a report to raise community priority.
- **`PATCH /reports/:id/verify`**: Admin endpoint to mark a report as verified.
- **`PATCH /reports/:id/priority`**: Admin endpoint to manually override priority (`Low`, `Medium`, `High`).

---

## Environment Variables

Create or update `.env` in the `backend/` directory:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Notes on AI Key configuration:
- `GEMINI_API_KEY`: Set your Google Gemini API key to enable live AI triage via Gemini 1.5 Flash.
- If no key is set or network calls fail, `aiService.js` automatically falls back to an intelligent heuristic classifier, ensuring the app works 100% reliably during hackathon demos without failing!

---

## Local Setup & Development

```bash
# 1. Move to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Run development server (with nodemon auto-reload)
npm run dev

# 4. Run automated test suite
npm test
```

The server will start at `http://localhost:5000`.

---

## Deployment Instructions (Render / Railway)

### Deploying to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `npm start`.
6. Add Environment Variable:
   - `GEMINI_API_KEY` (optional for live AI)
   - Render automatically provides `PORT`.

### Deploying to Railway
1. Create a new service on [Railway](https://railway.app).
2. Connect your Git repository and select the `backend` directory.
3. Railway automatically detects `npm start` from `package.json`.
4. Add `GEMINI_API_KEY` under the Variables tab.

---

## Architecture & Code Overview for Live Demo

- `server.js`: Configures Express app, CORS, routes, error handling, and server startup.
- `models/reportStore.js`: In-memory data store seeded with 8 Sri Lankan road hazard & safety reports.
- `services/aiService.js`: Isolated AI module holding the system prompt, Gemini API fetcher, and graceful fallback classifier.
- `controllers/reportController.js`: Request handlers and input validators.
- `routes/reportRoutes.js`: Express router mapping HTTP endpoints to controller actions.
- `test/reportApi.test.js`: Native Node test suite validating API features.
