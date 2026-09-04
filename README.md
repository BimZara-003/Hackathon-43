# Mithuru Mawatha (Friendly Road) 🛣️🇱🇰

> A practical digital community hazard and safety reporting platform for Sri Lanka, featuring smart AI triage and women's safety layer.

## Overview

In Sri Lankan towns and cities, potholes, broken streetlights, damaged drains, and poorly lit road sections often go unreported for months. **Mithuru Mawatha** bridges the gap by allowing citizens to report both physical road hazards and safety-risk areas, track their status, and benefit from AI-assisted report classification.

## Project Structure

```text
├── backend/            # Node.js + Express API backend
│   ├── config/         # App configuration
│   ├── controllers/    # Request handlers & logic
│   ├── models/         # Report data store & pre-seeded Sri Lankan reports
│   ├── routes/         # Express API routes
│   ├── services/       # Isolated AI Triage Service (aiService.js)
│   ├── test/           # Native test suite (reportApi.test.js)
│   ├── API.md          # Complete API documentation
│   └── README.md       # Backend setup & deployment guide
└── frontend/           # React frontend app
```

## Quick Start (Backend)

```bash
cd backend
npm install
npm run dev
```

To run tests:
```bash
npm test
```

See [backend/README.md](./backend/README.md) and [backend/API.md](./backend/API.md) for full endpoint and setup documentation.