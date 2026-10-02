/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the meme-api backend, no trailing slash. Undefined in local dev. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}