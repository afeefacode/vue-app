import { adminConfig } from '../config/AdminConfig'

class IconsPlugin {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$icons', {
      get () {
        return adminConfig.app.icons
      }
    })
  }
}

export const iconsPlugin = new IconsPlugin()
