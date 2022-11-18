import { adminConfig } from '../config/AdminConfig'

class AuthPlugin {
  install (Vue) {
    const authService = adminConfig.authService
    const $auth = {
      account: authService.getCurrentAccount(),

      hasRight: name => authService.currentAccountHasRight(name),

      hasRole: name => authService.currentAccountHasRole(name),

      get accountRoles () {
        return authService.getCurrentAccountRoles()
      },

      get roles () {
        return authService.getRoles()
      },

      logout: () => authService.forwardToLogoutEndpoint()
    }

    Vue.prototype.$auth = $auth
    Vue.$auth = $auth
  }
}

export const authPlugin = new AuthPlugin()
