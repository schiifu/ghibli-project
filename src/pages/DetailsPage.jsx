import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Loading from '../components/Loading'
import Error from '../components/Error'

export default function DetailsPage({ favorites, toggleFavorite }) {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true); setError('')
        const res = await fetch(`https://ghibliapi.vercel.app/films/${id}`)
        if (!res.ok) throw new Error('Erro ao carregar filme.')
        const data = await res.json()
        setMovie(data)
      } catch (err) {
        setError(err.message || 'Falha inesperada.')
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch('https://ghibliapi.vercel.app/people')
        if (!res.ok) return
        const data = await res.json()
        const filtered = data.filter(p => Array.isArray(p.films) && p.films.some(f => f.includes(id)))
        setPeople(filtered)
      } catch { /* ignore */ }
    }
    fetchPeople()
  }, [id])

  const isFavorite = useMemo(() => favorites.some(f => f.id === movie?.id), [favorites, movie])

  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (!movie) return null

  const poster = movie.image || movie.movie_banner || 'https://via.placeholder.com/1200x600?text=Ghibli'
  const cast = people.map(p => p.name).join(', ') || 'N/D'

  return (
    <div className="card">
      <div className="header">
        <div className="flex">
          <img src={poster} alt={`Imagem de ${movie.title}`} style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 24 }}>{movie.title}</div>
            <div className="small">Ano: {movie.release_date} • Duração: {movie.running_time} min • Nota RT: {movie.rt_score}</div>
          </div>
        </div>
        <button className={`btn ${isFavorite ? 'danger' : 'success'}`} onClick={() => toggleFavorite(movie)}>
          {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        </button>
      </div>
      <p><strong>Diretor:</strong> {movie.director}</p>
      <p><strong>Produtor:</strong> {movie.producer}</p>
      <p><strong>Elenco:</strong> {cast}</p>
      <div className="hr"></div>
      <p><strong>Sinopse:</strong></p>
      <blockquote>{movie.description}</blockquote>
    </div>
  )
}
