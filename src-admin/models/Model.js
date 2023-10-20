import { translationService } from '@a-admin/services/TranslationService'
import { Model as ApiResourcesModel } from '@afeefa/api-resources-client'
import { mdiAlphaMCircle } from '@mdi/js'

import { ModelAdminConfig } from './ModelAdminConfig'

export { ModelAdminConfig }

export class Model extends ApiResourcesModel {
  static routeName = null
  static routeIdKey = 'id'

  static config = null

  static getLink (action) {
    return (new this()).getLink(action)
  }

  static get adminConfig () {
    return new ModelAdminConfig()
      .setIcon({
        icon: mdiAlphaMCircle
      })
  }

  static icon = {
    icon: mdiAlphaMCircle,
    color: 'blue lighten-2'
  }

  static translate (realm, objectType, objectId, key, lang) {
    return translationService.translate(realm, objectType, objectId, key, lang)
  }

  getLink (action = 'detail') {
    return {
      name: `${this.constructor.routeName}.${action}`,
      params: {
        [this.constructor.routeIdKey]: this.id
      }
    }
  }

  getIcon () {
    return this.constructor.icon
  }

  getTitle () {
    return null
  }
}
