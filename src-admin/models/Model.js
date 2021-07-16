import { Model as ApiResourcesModel } from '@afeefa/api-resources-client'
import { mdiAlphaMCircle } from '@mdi/js'
export class Model extends ApiResourcesModel {
  static resourceType = null
  static routeName = null
  static routeIdKey = 'id'

  static getLink (action) {
    return (new this()).getLink(action)
  }

  static getAction (routeDefinition, action) {
    if (this.resourceType) {
      const api = routeDefinition.config.api
      return api.getAction(this.resourceType, action)
    }
    console.warn('You can\'t get an action of a model without resourceType:', this.type)
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

  getAction (routeDefinition, action) {
    return this.constructor.getAction(routeDefinition, action)
  }

  getIcon () {
    return this.constructor.icon
  }

  getTitle () {
    return null
  }
}
