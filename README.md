# XPogo Hackathon Monorepo

This repository is a minimal monorepo scaffold for a microservice-style hackathon.
It contains two packages:

- `frontend` — Next.js app (port 3000)
- `backend` — Express.js API (port 3001)
- `shared` — small shared utilities package

Quick start

1. Install dependencies (run from repo root):

```bash
npm install
```

2. Start both dev servers (from repo root):

```bash
npm run dev
```

Or run each workspace separately:

```bash
npm run dev:frontend
npm run dev:backend
```

Frontend will be at http://localhost:3000 and calls the backend at http://localhost:3001/health

Notes & assumptions
- This scaffold uses npm workspaces. Ensure you have npm v7+.
- You need to run `npm install` to fetch dependencies before running dev servers.

Next steps (optional): add Dockerfiles, CI, or a reverse-proxy to route frontend requests to backend.
