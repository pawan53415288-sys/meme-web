export type CategoryId = 'bollywood' | 'cartoon' | 'viral-songs' | 'sports'

export interface Category {
  id: CategoryId
  label: string
  emoji: string
  blurb: string
}

export interface Meme {
  id: string
  imageUrl: string
  caption: string
}