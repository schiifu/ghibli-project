import { useEffect, useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import Error from '../components/Error'

export default function SearchPage({ favorites, toggleFavorite, showFavorites }) {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pageSize = 6

  useEffect(() => {
    if (!showFavorites) {
      fetchMovies()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true); setError('')
      const res = await fetch('https://ghibliapi.vercel.app/films')
      if (!res.ok) throw new Error('Erro ao buscar filmes.')
      const data = await res.json()
      setMovies(data)
    } catch (err) {
      setError(err.message || 'Falha inesperada.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const list = showFavorites ? favorites : movies
    const term = search.trim().toLowerCase()
    const result = term ? list.filter(m => (m.title || '').toLowerCase().includes(term)) : list
    return result
  }, [movies, favorites, search, showFavorites])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const ensurePage = (p) => Math.min(Math.max(1, p), totalPages)

  useEffect(() => {
    setPage(1)
  }, [search, showFavorites])

  const start = (ensurePage(page) - 1) * pageSize
  const paginated = filtered.slice(start, start + pageSize)

  return (
    <div>
      <div className="header">
        <div className="brand">🎬 Studio Ghibli</div>
        <div className="small">Busca de filmes e favoritos</div>
      </div>

      {!showFavorites && (
        <form
          onSubmit={(e) => { e.preventDefault() }}
          className="toolbar"
          role="search"
          aria-label="Buscar filmes"
        >
          <input
            className="input"
            placeholder="Buscar filme por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="btn" onClick={() => setSearch('')}>
            Limpar
          </button>
        </form>
      )}

      {loading && <Loading />}
      {error && <Error message={error} />}

      <div className="grid">
        {paginated.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.some(f => f.id === movie.id)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            className={`page ${page === n ? 'active' : ''}`}
            onClick={() => setPage(n)}
            aria-current={page === n ? 'page' : undefined}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
