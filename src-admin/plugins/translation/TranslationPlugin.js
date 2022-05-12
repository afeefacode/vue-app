import { translationService } from '../../services/TranslationService'

class TranslationPlugin {
  setTranslations (translations) {
    translationService
      .setTranslations(translations)
  }

  install (Vue) {
    Vue.mixin({
      created () {
        this.$t = (realm, objectId, objectType, key, lang) => {
          return translationService.translate(realm, objectId, objectType, key, lang)
        }
      }
    })
  }
}

export const translationPlugin = new TranslationPlugin()
