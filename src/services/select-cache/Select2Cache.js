// Globaler, opt-in Cache für ASelect2-Trefferlisten (cacheResults=true).
//
// Zweck: stabile Listen (z.B. Kategorien), die in mehreren Selects/Filtern
// vorkommen, nur einmal laden statt pro Komponente. Singleton im Stil von
// positionService — kein Vue-Plugin, keine Vue.prototype-Erweiterung.
//
// Bei cacheResults=true läuft JEDE Anfrage über den Cache — jede Seite, auch mit
// Suchbegriff (q/page sind Teil des Keys, siehe buildRequestCacheKey).
// Zeitbasierte Invalidierung (Default 30 Min), keine aktive Invalidierung.
// inFlight-Dedup verhindert parallele Doppel-Requests auf denselben Key.

const DEFAULT_TTL_MS = 30 * 60 * 1000 // 30 Minuten

// Stabiler Cache-Key aus Resource-Typ, Action und normalisierten Params.
// Dieselbe Funktion nutzen ASelect2-Lookup und main.js-Prewarming,
// damit beide auf denselben Eintrag zeigen.
// Die Params werden mit SORTIERTEN Schlüsseln serialisiert (rekursiv), damit
// die Schlüssel-Reihenfolge im Objekt den Key nicht verändert — sonst ergäben
// `{title,key}` und `{key,title}` verschiedene Keys (Drift Lookup ↔ Vorwärmung).
export function buildCacheKey (resourceType, actionName, params = {}) {
  return [resourceType, actionName, stableStringify(params || {})].join('|')
}

function stableStringify (value) {
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']'
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort()
    return '{' + keys.map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}'
  }
  return JSON.stringify(value)
}

// Key aus einem ApiRequest + Seiten-Parametern — die EINE Schlüssel-Quelle für
// Lookup (ASelect2.cacheKey) UND Vorwärmung (main.js). Beide MÜSSEN diese
// Funktion nutzen, sonst driften die Keys auseinander und die Vorwärmung trifft
// den Lookup-Eintrag nie. `q`/`page`/`pageSize` müssen den Werten entsprechen,
// die der Lookup bei der ersten Seite ohne Suche verwendet (q:'', page:1).
export function buildRequestCacheKey (request, { q = '', page = 1, pageSize = 30 } = {}) {
  const action = request.getAction()
  return buildCacheKey(
    action.getResource().getType(),
    action.getName(),
    {
      ...request.getParams(),
      fields: request.getFields(),
      q,
      page,
      page_size: pageSize
    }
  )
}

class Select2Cache {
  entries = new Map() // key → { result, loadedAt, inFlight }
  ttlMs = DEFAULT_TTL_MS

  setTtl (ms) {
    this.ttlMs = ms
  }

  // Cache von außen vorwärmen (main.js-Vorladen): ein bereits geladenes Ergebnis
  // unter `key` ablegen, ohne Request. Beim ersten Öffnen einer ASelect2 mit
  // demselben Key ist der Eintrag dann schon da (kein Lade-Request).
  // Läuft für denselben Key schon ein Request (inFlight), NICHT überschreiben —
  // sonst ginge der wartende Promise verloren; der laufende Request gewinnt.
  prime (key, result) {
    const existing = this.entries.get(key)
    if (existing && existing.inFlight) {
      return
    }
    this.entries.set(key, { result, loadedAt: this.now(), inFlight: null })
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
