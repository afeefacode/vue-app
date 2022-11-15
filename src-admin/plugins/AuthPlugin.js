import { appConfig } from '../config/AppConfig'

class AuthPlugin {
  install (Vue) {
    const authService = appConfig.authService
    const $auth = {
      account: authService.getCurrentAccount(),

      hasRight: name => authService.currentAccountHasRight(name),

      hasRole: name => authService.currentAccountHasRole(name),

      roles: () => authService.getCurrentAccountRoles(),

      logout: () => authService.forwardToLogoutEndpoint()
    }

    Vue.prototype.$auth = $auth
    Vue.$auth = $auth
  }
}

export const authPlugin = new AuthPlugin()
