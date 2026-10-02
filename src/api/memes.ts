import type { CategoryId, Meme } from '../types'

// Where the meme-api backend lives.
//
// Unset (the normal local-dev case) → stay on a relative '/api' path and let
// Vite's proxy forward it, so the browser only ever makes a same-origin request.
// Set   → call the deployed backend directly, which is what a real deployment
// needs once the two apps live on different origins.
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

// Measured against the deployed API: a warm request lands around 14-45s, but a
// cold one (fresh function instance, first request of a period) was measured at
// 72s. The old 120s budget sat close enough to that that users on a cold API
// would be shown "That took too long" for requests that were about to succeed —
// a failure that looks like a bug in the app and isn't. 150s clears the
// observed worst case with room to spare, and costs nothing: the request still
// fails fast if the server genuinely gives up at its own 90s budget.
const CLIENT_TIMEOUT_MS = 150_000

export async function generateMemes(category: CategoryId): Promise<Meme[]> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}/api/memes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new Error('That took too long. Please try again.')
    }
    // fetch() rejects for two very different reasons here and we can't tell
    // them apart from JS: the API is down/refused the connection, or it answered
    // but CORS blocked us from reading it. The hint covers both.
    throw new Error("Couldn't reach the meme API. Check it is running and allows this origin.")
  }

  if (!response.ok) {
    // The server sends { error } with a human-readable reason — read it instead
    // of replacing it with a generic message, so the UI can say what's wrong.
    throw new Error(await readError(response))
  }

  const { memes } = await response.json()
  if (!Array.isArray(memes) || memes.length === 0) {
    throw new Error('The generator returned no memes. Please try again.')
  }
  return memes as Meme[]
}

async function readError(response: Response): Promise<string> {
  const fallback = `Couldn't generate memes (HTTP ${response.status}).`
  try {
    const body = await response.json()
    return typeof body?.error === 'string' && body.error ? body.error : fallback
  } catch {
    return fallback
  }
}