import Header from './components/Header'
import EmptyState from './components/EmptyState'
import CategoryPicker from './components/CategoryPicker'
import Spinner from './components/Spinner'
import Button from './components/Button'
import MemeGallery from './components/MemeGallery'
import { useMemeGenerator } from './hooks/useMemeGenerator'
import { CATEGORIES } from './data/categories'

function App() {
  const { memes, activeCategory, loading, error, generate } = useMemeGenerator()

  const hasMemes = memes.length > 0
  const activeLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <section className="pitch">
          <h2 className="pitch__title">Instant memes, zero effort</h2>
          <p className="pitch__text">
            Choose a vibe and get five ready-to-share memes in seconds.
          </p>
        </section>
        <CategoryPicker
          activeCategory={activeCategory ?? CATEGORIES[0].id}
          disabled={loading}
          onSelect={generate}
        />
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <Spinner label={`Cooking up ${activeLabel ?? ''} memes…`} />
        )}
        {!loading && hasMemes && (
          <>
            <div className="results-bar">
              <h3 className="results-bar__title">{activeLabel} memes</h3>
              <Button
                variant="ghost"
                onClick={() => generate(activeCategory ?? CATEGORIES[0].id)}
              >
                🔀 Shuffle again
              </Button>
            </div>
            <MemeGallery memes={memes} />
          </>
        )}
        {!loading && !hasMemes && !error && <EmptyState />}
      </main>
      <footer className="app-footer">
         AI via OpenRouter ·
        Images by memegen.link
      </footer>
    </div>
  )
}

export default App