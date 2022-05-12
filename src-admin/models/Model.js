import { translationService } from '@a-admin/services/TranslationService'
import { Model as ApiResourcesModel, apiResources } from '@afeefa/api-resources-client'
import { mdiAlphaMCircle } from '@mdi/js'

import { ModelAdminConfig } from './ModelAdminConfig'

export { ModelAdminConfig }

export class Model extends ApiResourcesModel {
  static resourceType = null
  static routeName = null
  static routeIdKey = 'id'

  static config = null

  static getLink (action) {
    return (new this()).getLink(action)
  }

  static getAction (action) {
    if (this.resourceType) {
      return apiResources.getAction({
        resource: this.resourceType,
        action
      })
    }
    console.warn('You can\'t get an action out of a model without resourceType:', this.type)
    return null
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

  getAction (action) {
    return this.constructor.getAction(action)
  }

  getIcon () {
    return this.constructor.icon
  }

  getTitle () {
    return null
  }
}
