# meme-web

React + TypeScript + Vite frontend for the **AI Meme Generator**.

This repo contains **only** the browser app. The backend — which holds the
OpenRouter key — is a separate service, [`meme-api`](../meme-api). That split is
the whole point: secrets stay on the server, and each side can be deployed
independently.

> API repo: [`meme-api`](../meme-api) · Original combined repo: [`server1`](https://github.com/pawan53415288-sys/server1)

---

## Local setup

You need the API running too. Two terminals:

```bash
# terminal 1 — the API
cd meme-api
npm install
cp .env.example .env      # add your OpenRouter key
npm run dev               # -> http://localhost:8787

# terminal 2 — this frontend
cd meme-web
npm install
npm run dev               # -> http://localhost:5173
```

`npm run dev` here is just Vite; there is no `concurrently` any more, because the
API no longer lives in this repo.

With `VITE_API_URL` unset, `src/api/memes.ts` calls a relative `/api/memes` and
`vite.config.ts` proxies it to `http://localhost:8787` — so the browser only ever
makes a same-origin request and CORS never comes up locally.

Check the wiring at any time:

```bash
curl http://localhost:8787/api/health
```

### First request is slow

The first generate call takes **30–60s**. The API walks a fallback list of free
OpenRouter models, and the ones that work are slow reasoning models. That is
expected — the client timeout is set to 120s to sit above the server's own 90s
budget.

---

## Configuration

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `VITE_API_URL` | in production | Base URL of the deployed API, **no trailing slash** (e.g. `https://meme-api.vercel.app`). Leave unset locally so Vite's proxy is used. |

Put it in `.env.local`:

```
VITE_API_URL=https://meme-api.vercel.app
```

`VITE_*` values are **inlined into the bundle at build time**. Changing one needs
a rebuild/redeploy — restarting the dev server is not enough. Nothing prefixed
`VITE_` is ever a real secret; those names are public by definition, which is
exactly why the OpenRouter key must never be added here.

---

## Build & deploy

```bash
npm run build     # tsc && vite build -> dist/
npm run preview   # serve dist/ locally to sanity-check the production bundle
```

`dist/` is a static folder — drop it on Vercel, Netlify, Cloudflare Pages, GitHub
Pages or any static host. No server runtime needed.

After deploying, set `VITE_API_URL` on the host and **also set that frontend's
origin on the API** via the API's `ALLOWED_ORIGINS` variable, or the browser
will block the requests.

---

## Project layout

```
src/
  main.tsx            entry point
  App.tsx             layout + render flow
  api/memes.ts        the ONLY file that talks to the backend
  hooks/useMemeGenerator.ts   request state, drops stale responses
  components/         presentational pieces
  data/categories.ts  the category list
  types.ts            shared types
  style.css
  vite-env.d.ts       types for import.meta.env
```

All backend communication is funnelled through `src/api/memes.ts`, so pointing at
a different API is a one-line change.