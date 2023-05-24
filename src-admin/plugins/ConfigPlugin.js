import { adminConfig } from '../config/AdminConfig'

class ConfigPlugin {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$config', {
      get () {
        return adminConfig.config
      }
    })
  }
}

export const configPlugin = new ConfigPlugin()
