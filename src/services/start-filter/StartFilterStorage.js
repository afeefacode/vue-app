// Speicherung des persönlichen Startfilters einer Liste im localStorage.
//
// Gespeichert wird die Filterbelegung in Query-Form (wie sie auch in der URL
// stünde), pro Liste über deren storageKey. Genutzt vom ListStartFilterButton
// (speichern/löschen/anwenden) und von ListAction.initFiltersForRoute
// (Anwenden beim Listen-Start).

const KEY_PREFIX = 'start-filters-'

export const StartFilterStorage = {
  load (storageKey) {
    if (!storageKey) {
      return null
    }
    try {
      const storageItem = localStorage.getItem(KEY_PREFIX + storageKey)
      if (storageItem) {
        return JSON.parse(storageItem)
      }
    } catch (error) {
      console.warn('Failed to load start filter from localStorage:', error)
    }
    return null
  },

  save (storageKey, query) {
    if (!storageKey) {
      return
    }
    try {
      localStorage.setItem(KEY_PREFIX + storageKey, JSON.stringify(query))
    } catch (error) {
      console.warn('Failed to save start filter to localStorage:', error)
    }
  },

  clear (storageKey) {
    if (!storageKey) {
      return
    }
    try {
      localStorage.removeItem(KEY_PREFIX + storageKey)
    } catch (error) {
      console.warn('Failed to clear start filter from localStorage:', error)
    }
  },

  has (storageKey) {
    return this.load(storageKey) !== null
  }
}
