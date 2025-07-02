class TranslationService {
  lang = null

  translations = {}

  setLang (lang) {
    this.lang = lang
  }

  setTranslations (translations) {
    translations.forEach(t => {
      const key = JSON.stringify([
        t.realm,
        t.object_type,
        t.object_id,
        t.key,
        t.lang
      ])
      this.translations[key] = t.value
    })
  }

  translate (...args) {
    let realm, objectType, objectId, key, lang

    if (args.length === 1) {
      key = args[0]
    }

    const tKey = JSON.stringify([
      realm,
      objectType,
      objectId,
      key,
      lang || this.lang
    ])

    if (!this.translations[tKey]) {
      console.warn(`No translation found for ${tKey}`)
      return `${key}:${lang}`
    }

    return this.translations[tKey]
  }
}

export const translationService = new TranslationService()
