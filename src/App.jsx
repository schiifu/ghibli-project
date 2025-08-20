import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SearchPage from './pages/SearchPage'
import DetailsPage from './pages/DetailsPage'
import { getFavorites, saveFavorites } from './utils/localStorage'

export default function App() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === movie.id)
      const updated = exists ? prev.filter(f => f.id !== movie.id) : [...prev, movie]
      saveFavorites(updated); return updated
    })
  }

  return (
    <Router>
      <div className="container">
        <nav className="nav">
          <Link to="/" className="btn">Busca</Link>
          <Link to="/favorites" className="btn">Favoritos <span className="badge" style={{ marginLeft: 6 }}>{favorites.length}</span></Link>
        </nav>
        <Routes>
          <Route path="/" element={<SearchPage favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/movie/:id" element={<DetailsPage favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/favorites" element={<SearchPage favorites={favorites} toggleFavorite={toggleFavorite} showFavorites />} />
        </Routes>
      </div>
    </Router>
  )
}