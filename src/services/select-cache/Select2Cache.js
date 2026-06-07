// Globaler, opt-in Cache für ASelect2-Trefferlisten (cacheResults=true).
//
// Zweck: stabile Listen (z.B. Kategorien), die in mehreren Selects/Filtern
// vorkommen, nur einmal laden statt pro Komponente. Singleton im Stil von
// positionService — kein Vue-Plugin, keine Vue.prototype-Erweiterung.
//
// Nur sinnvoll für Listen ohne Suchbegriff (die ASelect2 nur dann cached).
// Zeitbasierte Invalidierung (Default 30 Min), keine aktive Invalidierung.
// inFlight-Dedup verhindert parallele Doppel-Requests auf denselben Key.

const DEFAULT_TTL_MS = 30 * 60 * 1000 // 30 Minuten

// Stabiler Cache-Key aus Resource-Typ, Action und normalisierten Params.
// Dieselbe Funktion nutzen ASelect2-Lookup und ein etwaiges main.js-Prewarming,
// damit beide auf denselben Eintrag zeigen.
export function buildCacheKey (resourceType, actionName, params = {}) {
  return [resourceType, actionName, JSON.stringify(params || {})].join('|')
}

class Select2Cache {
  entries = new Map() // key → { result, loadedAt, inFlight }
  ttlMs = DEFAULT_TTL_MS

  setTtl (ms) {
    this.ttlMs = ms
  }

  getCached (key) {
    const entry = this.entries.get(key)
    if (!entry || !entry.result) {
      return null
    }
    if (this.isExpired(entry)) {
      this.entries.delete(key)
      return null
    }
    return entry.result
  }

  // Liefert den gecachten Wert oder lädt ihn über requestFn (genau einmal,
  // parallele Aufrufer warten auf denselben inFlight-Promise).
  async loadCached (key, requestFn) {
    const cached = this.getCached(key)
    if (cached) {
      return cached
    }

    const existing = this.entries.get(key)
    if (existing && existing.inFlight) {
      return existing.inFlight
    }

    const inFlight = Promise.resolve(requestFn())
      .then(result => {
        this.entries.set(key, { result, loadedAt: this.now(), inFlight: null })
        return result
      })
      .catch(error => {
        this.entries.delete(key) // fehlgeschlagenen Eintrag nicht behalten
        throw error
      })

    this.entries.set(key, { result: null, loadedAt: this.now(), inFlight })
    return inFlight
  }

  invalidate (key) {
    if (key) {
      this.entries.delete(key)
    } else {
      this.entries.clear()
    }
  }

  isExpired (entry) {
    return (this.now() - entry.loadedAt) > this.ttlMs
  }

  now () {
    return Date.now()
  }
}

export const select2Cache = new Select2Cache()
