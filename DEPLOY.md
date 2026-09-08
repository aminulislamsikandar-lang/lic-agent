# LIC Agent — Render Deployment

## Service
This repository is a full-stack React/Vite + Express application. Deploy it as a single Render Web Service; the Express server serves the Vite `dist` build in production.

## Render settings
- Runtime: Node
- Branch: `main`
- Build: `npm install && npm run build`
- Start: `npm start`
- Health check: `/api/health/ready`

`render.yaml` contains the same service definition.

## Required environment variables
Set these in Render:

- `NODE_ENV=production`
- `JWT_SECRET=<long random secret>`
- `GEMINI_API_KEY=<Gemini API key>`

Never commit real secrets to GitHub.

## Data persistence warning
The current application persists its CRM data to `data/insurecare.db.json` on the local filesystem. Render Web Services use ephemeral filesystems by default, so runtime changes can be lost after a restart or redeploy.

For a real production deployment, migrate the persistence layer to Render Postgres (recommended) or attach a paid persistent disk and configure the application data directory accordingly. Do not treat the repository's seed JSON file as a production backup.

## Local verification
Run:

```bash
npm install
npm run lint
npm run build
NODE_ENV=production JWT_SECRET="replace-me" npm start
```

Then verify:

- `GET /api/health/live` returns HTTP 200.
- `GET /api/health/ready` returns HTTP 200 when the data store is readable.
- `/` serves the React application.

## Important production security
The repository currently contains seeded demo user accounts. Before exposing the CRM publicly, replace the seeded credentials with a proper production account bootstrap/reset mechanism and rotate all secrets.
