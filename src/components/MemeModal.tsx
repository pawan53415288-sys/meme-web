import { useEffect } from 'react'
import type { Meme } from '../types'

interface MemeModalProps {
  meme: Meme
  onClose: () => void
}

function MemeModal({ meme, onClose }: MemeModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Meme preview"
      onClick={onClose}
    >
      <div className="modal__card" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="modal__close"
          aria-label="Close preview"
          onClick={onClose}
          autoFocus
        >
          ×
        </button>
        <img className="modal__img" src={meme.imageUrl} alt={meme.caption} />
        <p className="modal__caption">{meme.caption}</p>
        <a
          className="btn btn--primary modal__open"
          href={meme.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open image in new tab
        </a>
      </div>
    </div>
  )
}

export default MemeModal