import { Model as ApiResourcesModel, apiResources } from '@afeefa/api-resources-client'
import { mdiAlphaMCircle } from '@mdi/js'

export class Model extends ApiResourcesModel {
  static resourceType = null
  static routeName = null
  static routeIdKey = 'id'

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
