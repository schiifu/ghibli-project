import { Link } from 'react-router-dom'

const fallbackPoster = 'https://via.placeholder.com/600x800?text=Ghibli+Movie'

export default function MovieCard({ movie, isFavorite, toggleFavorite }) {
  const poster = movie.image || movie.movie_banner || fallbackPoster

  return (
    <div className="card">
      <img className="poster" src={poster} alt={`Poster de ${movie.title}`} />
      <div className="hr"></div>
      <div className="flex spread">
        <div>
          <div style={{ fontWeight: 700 }}>{movie.title}</div>
          <div className="small">{movie.release_date}</div>
        </div>
        <div className="flex">
          <Link className="btn primary" to={`/movie/${movie.id}`}>Detalhes</Link>
          <button
            className={`btn ${isFavorite ? 'danger' : ''}`}
            onClick={() => toggleFavorite(movie)}
            aria-label={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            title={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  )
}