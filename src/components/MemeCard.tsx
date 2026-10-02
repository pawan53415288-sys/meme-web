import type { Meme } from '../types'

interface MemeCardProps {
  meme: Meme
  onOpen: (meme: Meme) => void
}

function MemeCard({ meme, onOpen }: MemeCardProps) {
  return (
    <button
      type="button"
      className="meme-card"
      onClick={() => onOpen(meme)}
      aria-label={`Open meme: ${meme.caption}`}
    >
      <img
        className="meme-card__img"
        src={meme.imageUrl}
        alt={meme.caption}
        loading="lazy"
      />
      <span className="meme-card__caption">{meme.caption}</span>
    </button>
  )
}

export default MemeCard