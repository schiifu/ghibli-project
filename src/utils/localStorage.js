export const getFavorites = () => {
  try {
    const raw = localStorage.getItem('favorites')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
export const saveFavorites = (movies) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(movies))
  } catch {}
}
