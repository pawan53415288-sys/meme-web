import { useRef, useState } from 'react'
import { generateMemes } from '../api/memes'
import type { CategoryId, Meme } from '../types'

export function useMemeGenerator() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Identifies the newest request so a slow one that lands late gets dropped
  // instead of overwriting fresher results.
  const latest = useRef(0)

  async function generate(category: CategoryId) {
    const requestId = ++latest.current
    setLoading(true)
    setError('')
    setActiveCategory(category)
    try {
      const result = await generateMemes(category)
      if (requestId !== latest.current) return
      setMemes(result)
    } catch (err) {
      if (requestId !== latest.current) return
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      if (requestId === latest.current) setLoading(false)
    }
  }

  return { memes, activeCategory, loading, error, generate }
}
