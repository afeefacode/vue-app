import { Model as ApiResourcesModel } from '@afeefa/api-resources-client'
import { mdiAlphaMCircle } from '@mdi/js'
export class Model extends ApiResourcesModel {
  static resourceName = null
  static routeName = null
  static routeIdKey = 'id'

  static getLink (action) {
    return (new this()).getLink(action)
  }

  static getAction (routeDefinition, action) {
    if (this.resourceName) {
      const api = routeDefinition.config.api
      return api.getAction(this.resourceName, action)
    }
    return null
  }

  static icon = {
    icon: mdiAlphaMCircle,
    color: 'blue lighten-2'
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
