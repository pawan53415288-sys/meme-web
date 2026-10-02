import { useState } from 'react'
import type { Meme } from '../types'
import MemeCard from './MemeCard'
import MemeModal from './MemeModal'

interface MemeGalleryProps {
  memes: Meme[]
}

function MemeGallery({ memes }: MemeGalleryProps) {
  const [selected, setSelected] = useState<Meme | null>(null)

  return (
    <section className="gallery" aria-label="Generated memes">
      {memes.map((meme) => (
        <MemeCard key={meme.id} meme={meme} onOpen={setSelected} />
      ))}
      {selected && <MemeModal meme={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

export default MemeGallery