import { authService } from '@k-vue/auth/AuthService'

class HasRightsPlugin {
  install (Vue) {
    Vue.mixin({
      created () {
        this.$hasRight = name => {
          return authService.currentAccountHasRight(name)
        }
      }
    })
  }
}

export const hasRightsPlugin = new HasRightsPlugin()
