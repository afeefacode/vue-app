import { translationService } from '../../services/TranslationService'

class TranslationPlugin {
  setTranslations (translations) {
    translationService
      .setTranslations(translations)
  }

  install (Vue) {
    Vue.mixin({
      created () {
        this.$t = (...args) => {
          return translationService.translate(...args)
        }
      }
    })
  }
}

export const translationPlugin = new TranslationPlugin()
